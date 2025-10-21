


# # backend/app/api/v1/calls.py - FIXED to include inbound calls and proper filters imp
# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from typing import List, Optional
# from bson import ObjectId
# from datetime import datetime, timedelta
# from pydantic import BaseModel, Field

# from app.api.deps import get_current_user, get_database
# from app.utils.datetime_utils import parse_optional_datetime, validate_date_range, get_current_utc_datetime
# from app.services.twilio import twilio_service
# from app.services.call_handler import CallHandlerService
# from motor.motor_asyncio import AsyncIOMotorDatabase

# router = APIRouter()

# # ============================================
# # PYDANTIC SCHEMAS
# # ============================================

# class CallCreate(BaseModel):
#     phone_number: str = Field(..., min_length=10)
#     agent_id: Optional[str] = None
#     direction: str = "outbound"

# class CallUpdate(BaseModel):
#     status: Optional[str] = None
#     duration: Optional[int] = None
#     outcome: Optional[str] = None

# # ============================================
# # CALL ENDPOINTS
# # ============================================

# @router.get("/")
# async def get_calls(
#     skip: int = 0,
#     limit: int = 50,
#     status: Optional[str] = Query(None, alias="status"),  # ✅ FIXED: Use 'status' not 'status_filter'
#     direction: Optional[str] = Query(None),
#     from_date: Optional[str] = Query(None),
#     to_date: Optional[str] = Query(None),
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get all calls - both inbound and outbound"""
#     try:
#         # ✅ FIXED: Build filter to include both inbound and outbound calls
#         # Outbound calls have user_id, inbound calls don't but should still be visible
#         user_id_str = str(current_user["_id"])
        
#         filter_query = {
#             "$or": [
#                 {"user_id": user_id_str},  # Outbound calls by this user
#                 {"direction": "inbound"}   # All inbound calls (accessible to all users)
#             ]
#         }
        
#         # ✅ FIXED: Apply filters properly
#         if status:
#             filter_query["status"] = status
#         if direction:
#             filter_query["direction"] = direction
        
#         # ✅ FIXED: Handle date filtering
#         date_filter = {}
#         if from_date:
#             try:
#                 from_datetime = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
#                 date_filter["$gte"] = from_datetime
#             except ValueError:
#                 pass  # Ignore invalid dates
        
#         if to_date:
#             try:
#                 to_datetime = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
#                 date_filter["$lte"] = to_datetime
#             except ValueError:
#                 pass  # Ignore invalid dates
        
#         if date_filter:
#             filter_query["created_at"] = date_filter
        
#         print(f"📊 Call filter query: {filter_query}")
        
#         # Get calls with pagination
#         calls_cursor = db.calls.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
#         calls = await calls_cursor.to_list(length=limit)
        
#         # ✅ FIXED: Properly format call data
#         formatted_calls = []
#         for call in calls:
#             formatted_call = {
#                 "_id": str(call["_id"]),
#                 "call_sid": call.get("call_sid"),
#                 "direction": call.get("direction", "outbound"),
#                 "from_number": call.get("from_number", ""),
#                 "to_number": call.get("to_number", ""),
#                 "phone_number": call.get("phone_number") or call.get("to_number", ""),
#                 "status": call.get("status", "initiated"),
#                 "duration": call.get("duration", 0),
#                 "outcome": call.get("outcome"),
#                 "agent_id": str(call["agent_id"]) if call.get("agent_id") else None,
#                 "user_id": str(call["user_id"]) if call.get("user_id") else None,
#                 "started_at": call.get("started_at"),
#                 "ended_at": call.get("ended_at"),
#                 "created_at": call.get("created_at"),
#                 "updated_at": call.get("updated_at")
#             }
#             formatted_calls.append(formatted_call)
        
#         print(f"📞 Found {len(formatted_calls)} calls")
#         return formatted_calls
        
#     except Exception as e:
#         print(f"❌ Error fetching calls: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Error fetching calls: {str(e)}")

# @router.post("/")
# async def create_call(
#     call_data: CallCreate,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Create and initiate a new call"""
#     try:
#         print(f"🚀 Starting call creation process...")
        
#         # Get user ID
#         user_id = current_user.get("_id")
#         if isinstance(user_id, str):
#             user_id = ObjectId(user_id)
        
#         print(f"📞 Formatted phone number: {call_data.phone_number}")
        
#         # Get agent if specified
#         agent = None
#         if call_data.agent_id:
#             agent = await db.voice_agents.find_one({"_id": ObjectId(call_data.agent_id)})
#             print(f"🤖 Using voice agent: {agent.get('name', 'Unknown') if agent else 'None'}")
        
#         # Initialize call handler
#         call_handler = CallHandlerService(db)
        
#         # ✅ FIXED: Changed 'phone_number' to 'to_number' to match the service signature
#         result = await call_handler.initiate_call(
#             to_number=call_data.phone_number,  # Changed from phone_number to to_number
#             user_id=str(user_id),
#             agent_id=call_data.agent_id
#         )
        
#         if result["success"]:
#             print(f"✅ Call record retrieved from database")
#             # Get the created call from database
#             call_record = await db.calls.find_one({"_id": ObjectId(result["call_id"])})
            
#             # Format response
#             formatted_call = {
#                 "_id": str(call_record["_id"]),
#                 "call_sid": call_record.get("call_sid"),
#                 "direction": call_record.get("direction", "outbound"),
#                 "phone_number": call_record.get("phone_number"),
#                 "status": call_record.get("status"),
#                 "agent_id": str(call_record["agent_id"]) if call_record.get("agent_id") else None,
#                 "user_id": str(call_record["user_id"]) if call_record.get("user_id") else None,
#                 "created_at": call_record.get("created_at")
#             }
            
#             return formatted_call
#         else:
#             raise HTTPException(status_code=400, detail=result.get("error", "Failed to create call"))
            
#     except Exception as e:
#         print(f"❌ Error creating call: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Error creating call: {str(e)}")

# @router.get("/{call_id}")
# async def get_call(
#     call_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get a specific call by ID"""
#     try:
#         if not ObjectId.is_valid(call_id):
#             raise HTTPException(status_code=400, detail="Invalid call ID")
        
#         call = await db.calls.find_one({"_id": ObjectId(call_id)})
        
#         if not call:
#             raise HTTPException(status_code=404, detail="Call not found")
        
#         # Format call data
#         formatted_call = {
#             "_id": str(call["_id"]),
#             "call_sid": call.get("call_sid"),
#             "direction": call.get("direction", "outbound"),
#             "from_number": call.get("from_number", ""),
#             "to_number": call.get("to_number", ""),
#             "phone_number": call.get("phone_number") or call.get("to_number", ""),
#             "status": call.get("status", "initiated"),
#             "duration": call.get("duration", 0),
#             "outcome": call.get("outcome"),
#             "agent_id": str(call["agent_id"]) if call.get("agent_id") else None,
#             "user_id": str(call["user_id"]) if call.get("user_id") else None,
#             "started_at": call.get("started_at"),
#             "ended_at": call.get("ended_at"),
#             "created_at": call.get("created_at"),
#             "updated_at": call.get("updated_at")
#         }
        
#         return formatted_call
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Error fetching call {call_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching call: {str(e)}")

# # ✅ NEW: Get call logs endpoint
# @router.get("/{call_id}/log")
# async def get_call_log(
#     call_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get call log for a specific call"""
#     try:
#         if not ObjectId.is_valid(call_id):
#             raise HTTPException(status_code=400, detail="Invalid call ID")
        
#         # Get call log
#         call_log = await db.call_logs.find_one({"call_id": ObjectId(call_id)})
        
#         if not call_log:
#             raise HTTPException(status_code=404, detail="Call log not found")
        
#         # Format call log data
#         formatted_log = {
#             "_id": str(call_log["_id"]),
#             "call_id": str(call_log["call_id"]),
#             "call_sid": call_log.get("call_sid"),
#             "summary": call_log.get("summary", ""),
#             "outcome": call_log.get("outcome", "unknown"),
#             "sentiment": call_log.get("sentiment", "neutral"),
#             "keywords": call_log.get("keywords", []),
#             "transcript": call_log.get("transcript", ""),
#             "recording_duration": call_log.get("recording_duration", 0),
#             "created_at": call_log.get("created_at"),
#             "updated_at": call_log.get("updated_at")
#         }
        
#         return formatted_log
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Error fetching call log {call_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching call log: {str(e)}")

# # ✅ NEW: Get all call logs endpoint
# @router.get("/logs/all")
# async def get_all_call_logs(
#     skip: int = 0,
#     limit: int = 50,
#     outcome: Optional[str] = Query(None),
#     sentiment: Optional[str] = Query(None),
#     from_date: Optional[str] = Query(None),
#     to_date: Optional[str] = Query(None),
#     search: Optional[str] = Query(None),
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get all call logs with filtering"""
#     try:
#         # Build filter query
#         filter_query = {}
        
#         if outcome:
#             filter_query["outcome"] = outcome
#         if sentiment:
#             filter_query["sentiment"] = sentiment
        
#         # Search in summary, transcript, or keywords
#         if search:
#             filter_query["$or"] = [
#                 {"summary": {"$regex": search, "$options": "i"}},
#                 {"transcript": {"$regex": search, "$options": "i"}},
#                 {"keywords": {"$in": [{"$regex": search, "$options": "i"}]}}
#             ]
        
#         # Date filtering
#         date_filter = {}
#         if from_date:
#             try:
#                 from_datetime = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
#                 date_filter["$gte"] = from_datetime
#             except ValueError:
#                 pass
        
#         if to_date:
#             try:
#                 to_datetime = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
#                 date_filter["$lte"] = to_datetime
#             except ValueError:
#                 pass
        
#         if date_filter:
#             filter_query["created_at"] = date_filter
        
#         # Get call logs
#         logs_cursor = db.call_logs.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
#         logs = await logs_cursor.to_list(length=limit)
        
#         # Format logs
#         formatted_logs = []
#         for log in logs:
#             formatted_log = {
#                 "_id": str(log["_id"]),
#                 "call_id": str(log["call_id"]),
#                 "call_sid": log.get("call_sid"),
#                 "summary": log.get("summary", ""),
#                 "outcome": log.get("outcome", "unknown"),
#                 "sentiment": log.get("sentiment", "neutral"),
#                 "keywords": log.get("keywords", []),
#                 "transcript": log.get("transcript", ""),
#                 "recording_duration": log.get("recording_duration", 0),
#                 "created_at": log.get("created_at"),
#                 "updated_at": log.get("updated_at")
#             }
#             formatted_logs.append(formatted_log)
        
#         return formatted_logs
        
#     except Exception as e:
#         print(f"❌ Error fetching call logs: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching call logs: {str(e)}")

# @router.patch("/{call_id}")
# async def update_call(
#     call_id: str,
#     call_update: CallUpdate,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Update a call"""
#     try:
#         if not ObjectId.is_valid(call_id):
#             raise HTTPException(status_code=400, detail="Invalid call ID")
        
#         update_data = {k: v for k, v in call_update.dict().items() if v is not None}
#         if not update_data:
#             raise HTTPException(status_code=400, detail="No data provided for update")
        
#         update_data["updated_at"] = datetime.utcnow()
        
#         result = await db.calls.update_one(
#             {"_id": ObjectId(call_id)},
#             {"$set": update_data}
#         )
        
#         if result.modified_count == 0:
#             raise HTTPException(status_code=404, detail="Call not found or no changes made")
        
#         # Get updated call
#         updated_call = await db.calls.find_one({"_id": ObjectId(call_id)})
        
#         # Format response
#         formatted_call = {
#             "_id": str(updated_call["_id"]),
#             "call_sid": updated_call.get("call_sid"),
#             "direction": updated_call.get("direction", "outbound"),
#             "phone_number": updated_call.get("phone_number"),
#             "status": updated_call.get("status"),
#             "duration": updated_call.get("duration"),
#             "outcome": updated_call.get("outcome"),
#             "updated_at": updated_call.get("updated_at")
#         }
        
#         return formatted_call
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Error updating call {call_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Error updating call: {str(e)}")

# @router.delete("/{call_id}")
# async def delete_call(
#     call_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Delete a call"""
#     try:
#         if not ObjectId.is_valid(call_id):
#             raise HTTPException(status_code=400, detail="Invalid call ID")
        
#         result = await db.calls.delete_one({"_id": ObjectId(call_id)})
        
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Call not found")
        
#         return {"message": "Call deleted successfully"}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Error deleting call {call_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Error deleting call: {str(e)}")

# # ✅ NEW: Get call statistics
# @router.get("/stats/summary")
# async def get_call_stats(
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get call statistics summary"""
#     try:
#         user_id_str = str(current_user["_id"])
        
#         # Get all calls (both inbound and outbound)
#         filter_query = {
#             "$or": [
#                 {"user_id": user_id_str},
#                 {"direction": "inbound"}
#             ]
#         }
        
#         total_calls = await db.calls.count_documents(filter_query)
#         completed_calls = await db.calls.count_documents({**filter_query, "status": "completed"})
#         failed_calls = await db.calls.count_documents({**filter_query, "status": "failed"})
        
#         # Calculate success rate
#         success_rate = (completed_calls / total_calls * 100) if total_calls > 0 else 0
        
#         stats = {
#             "total_calls": total_calls,
#             "completed_calls": completed_calls,
#             "failed_calls": failed_calls,
#             "success_rate": round(success_rate, 1),
#             "inbound_calls": await db.calls.count_documents({**filter_query, "direction": "inbound"}),
#             "outbound_calls": await db.calls.count_documents({**filter_query, "direction": "outbound"})
#         }
        
#         return stats
        
#     except Exception as e:
#         print(f"❌ Error fetching call stats: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching call stats: {str(e)}")





# backend/app/api/v1/calls.py - COMPLETE SECURE VERSION
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

from app.api.deps import get_current_user, get_database
from app.utils.datetime_utils import parse_optional_datetime, validate_date_range, get_current_utc_datetime
from app.services.twilio import twilio_service
from app.services.call_handler import CallHandlerService
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

# ============================================
# PYDANTIC SCHEMAS
# ============================================

class CallCreate(BaseModel):
    phone_number: str = Field(..., min_length=10)
    agent_id: Optional[str] = None
    direction: str = "outbound"

class CallUpdate(BaseModel):
    status: Optional[str] = None
    duration: Optional[int] = None
    outcome: Optional[str] = None

# ============================================
# CALL ENDPOINTS
# ============================================

@router.get("/")
async def get_calls(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = Query(None, alias="status"),
    direction: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    🔒 SECURE: Get calls for CURRENT USER ONLY
    Users can only see their own calls (both inbound and outbound)
    """
    try:
        user_id_str = str(current_user["_id"])
        
        print(f"\n{'='*80}")
        print(f"🔒 FETCHING CALLS FOR USER: {user_id_str}")
        print(f"   User Email: {current_user.get('email', 'Unknown')}")
        print(f"{'='*80}\n")
        
        # ✅ CRITICAL SECURITY FIX: ONLY show calls belonging to THIS user
        filter_query = {"user_id": user_id_str}
        
        # Apply additional filters
        if status:
            filter_query["status"] = status
        if direction:
            filter_query["direction"] = direction
        
        # Handle date filtering
        date_filter = {}
        if from_date:
            try:
                from_datetime = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
                date_filter["$gte"] = from_datetime
            except ValueError:
                pass
        
        if to_date:
            try:
                to_datetime = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
                date_filter["$lte"] = to_datetime
            except ValueError:
                pass
        
        if date_filter:
            filter_query["created_at"] = date_filter
        
        print(f"📊 Query filter: {filter_query}")
        
        # Get calls with pagination
        calls_cursor = db.calls.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
        calls = await calls_cursor.to_list(length=limit)
        
        # Format call data
        formatted_calls = []
        for call in calls:
            formatted_call = {
                "_id": str(call["_id"]),
                "call_sid": call.get("call_sid"),
                "direction": call.get("direction", "outbound"),
                "from_number": call.get("from_number", ""),
                "to_number": call.get("to_number", ""),
                "phone_number": call.get("phone_number") or call.get("to_number", ""),
                "status": call.get("status", "initiated"),
                "duration": call.get("duration", 0),
                "outcome": call.get("outcome"),
                "agent_id": str(call["agent_id"]) if call.get("agent_id") else None,
                "user_id": str(call["user_id"]),
                "started_at": call.get("started_at"),
                "ended_at": call.get("ended_at"),
                "created_at": call.get("created_at"),
                "updated_at": call.get("updated_at")
            }
            formatted_calls.append(formatted_call)
        
        print(f"✅ Found {len(formatted_calls)} calls for user {user_id_str}\n")
        return formatted_calls
        
    except Exception as e:
        print(f"❌ Error fetching calls: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching calls: {str(e)}")

@router.post("/")
async def create_call(
    call_data: CallCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create and initiate a new call"""
    try:
        print(f"🚀 Starting call creation process...")
        
        # Get user ID
        user_id = current_user.get("_id")
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        print(f"📞 Phone: {call_data.phone_number}, User: {str(user_id)}")
        
        # Get agent if specified
        agent = None
        if call_data.agent_id:
            agent = await db.voice_agents.find_one({"_id": ObjectId(call_data.agent_id)})
            print(f"🤖 Using agent: {agent.get('name', 'Unknown') if agent else 'None'}")
        
        # Initialize call handler
        call_handler = CallHandlerService(db)
        
        # Initiate call
        result = await call_handler.initiate_call(
            to_number=call_data.phone_number,
            user_id=str(user_id),
            agent_id=call_data.agent_id
        )
        
        if result["success"]:
            print(f"✅ Call created successfully")
            call_record = await db.calls.find_one({"_id": ObjectId(result["call_id"])})
            
            formatted_call = {
                "_id": str(call_record["_id"]),
                "call_sid": call_record.get("call_sid"),
                "direction": call_record.get("direction", "outbound"),
                "phone_number": call_record.get("phone_number"),
                "status": call_record.get("status"),
                "agent_id": str(call_record["agent_id"]) if call_record.get("agent_id") else None,
                "user_id": str(call_record["user_id"]),
                "created_at": call_record.get("created_at")
            }
            
            return formatted_call
        else:
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to create call"))
            
    except Exception as e:
        print(f"❌ Error creating call: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error creating call: {str(e)}")

@router.get("/{call_id}")
async def get_call(
    call_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """🔒 SECURE: Get a specific call (only if it belongs to current user)"""
    try:
        if not ObjectId.is_valid(call_id):
            raise HTTPException(status_code=400, detail="Invalid call ID")
        
        user_id_str = str(current_user["_id"])
        
        # ✅ SECURITY: Only return call if it belongs to this user
        call = await db.calls.find_one({
            "_id": ObjectId(call_id),
            "user_id": user_id_str  # ✅ CRITICAL: Must match user_id
        })
        
        if not call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        formatted_call = {
            "_id": str(call["_id"]),
            "call_sid": call.get("call_sid"),
            "direction": call.get("direction", "outbound"),
            "from_number": call.get("from_number", ""),
            "to_number": call.get("to_number", ""),
            "phone_number": call.get("phone_number") or call.get("to_number", ""),
            "status": call.get("status", "initiated"),
            "duration": call.get("duration", 0),
            "outcome": call.get("outcome"),
            "agent_id": str(call["agent_id"]) if call.get("agent_id") else None,
            "user_id": str(call["user_id"]),
            "started_at": call.get("started_at"),
            "ended_at": call.get("ended_at"),
            "created_at": call.get("created_at"),
            "updated_at": call.get("updated_at")
        }
        
        return formatted_call
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching call {call_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching call: {str(e)}")

@router.patch("/{call_id}")
async def update_call(
    call_id: str,
    update_data: CallUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """🔒 SECURE: Update a call (only if it belongs to current user)"""
    try:
        if not ObjectId.is_valid(call_id):
            raise HTTPException(status_code=400, detail="Invalid call ID")
        
        user_id_str = str(current_user["_id"])
        
        # ✅ SECURITY: Only update if call belongs to this user
        call = await db.calls.find_one({
            "_id": ObjectId(call_id),
            "user_id": user_id_str
        })
        
        if not call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        # Update call
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await db.calls.update_one(
            {"_id": ObjectId(call_id)},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Call not found")
        
        return {"message": "Call updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating call {call_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating call: {str(e)}")

@router.delete("/{call_id}")
async def delete_call(
    call_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """🔒 SECURE: Delete a call (only if it belongs to current user)"""
    try:
        if not ObjectId.is_valid(call_id):
            raise HTTPException(status_code=400, detail="Invalid call ID")
        
        user_id_str = str(current_user["_id"])
        
        # ✅ SECURITY: Only delete if call belongs to this user
        result = await db.calls.delete_one({
            "_id": ObjectId(call_id),
            "user_id": user_id_str
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Call not found")
        
        return {"message": "Call deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting call {call_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting call: {str(e)}")

@router.get("/stats/summary")
async def get_call_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """🔒 SECURE: Get call statistics for CURRENT USER ONLY"""
    try:
        user_id_str = str(current_user["_id"])
        
        # ✅ SECURITY: Only count THIS user's calls
        filter_query = {"user_id": user_id_str}
        
        total_calls = await db.calls.count_documents(filter_query)
        completed_calls = await db.calls.count_documents({**filter_query, "status": "completed"})
        failed_calls = await db.calls.count_documents({**filter_query, "status": "failed"})
        
        # Calculate success rate
        success_rate = (completed_calls / total_calls * 100) if total_calls > 0 else 0
        
        stats = {
            "total_calls": total_calls,
            "completed_calls": completed_calls,
            "failed_calls": failed_calls,
            "success_rate": round(success_rate, 1),
            "inbound_calls": await db.calls.count_documents({**filter_query, "direction": "inbound"}),
            "outbound_calls": await db.calls.count_documents({**filter_query, "direction": "outbound"})
        }
        
        print(f"📊 Stats for user {user_id_str}: {stats}")
        return stats
        
    except Exception as e:
        print(f"❌ Error fetching call stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching call stats: {str(e)}")

@router.get("/{call_id}/log")
async def get_call_log(
    call_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """🔒 SECURE: Get call log (only if call belongs to current user)"""
    try:
        if not ObjectId.is_valid(call_id):
            raise HTTPException(status_code=400, detail="Invalid call ID")
        
        user_id_str = str(current_user["_id"])
        
        # ✅ SECURITY: First verify the call belongs to this user
        call = await db.calls.find_one({
            "_id": ObjectId(call_id),
            "user_id": user_id_str
        })
        
        if not call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        # Now get the call log
        call_log = await db.call_logs.find_one({"call_id": ObjectId(call_id)})
        
        if not call_log:
            raise HTTPException(status_code=404, detail="Call log not found")
        
        formatted_log = {
            "_id": str(call_log["_id"]),
            "call_id": str(call_log["call_id"]),
            "call_sid": call_log.get("call_sid"),
            "summary": call_log.get("summary", ""),
            "outcome": call_log.get("outcome", "unknown"),
            "sentiment": call_log.get("sentiment", "neutral"),
            "keywords": call_log.get("keywords", []),
            "transcript": call_log.get("transcript", ""),
            "recording_duration": call_log.get("recording_duration", 0),
            "created_at": call_log.get("created_at"),
            "updated_at": call_log.get("updated_at")
        }
        
        return formatted_log
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching call log {call_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching call log: {str(e)}")

# ============================================
# CALL LOGS ENDPOINTS - SECURE VERSION
# ============================================

@router.get("/logs/all")
async def get_all_call_logs(
    skip: int = 0,
    limit: int = 50,
    outcome: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    🔒 SECURE: Get call logs for CURRENT USER ONLY
    """
    try:
        user_id_str = str(current_user["_id"])
        
        print(f"\n{'='*80}")
        print(f"🔒 FETCHING CALL LOGS FOR USER: {user_id_str}")
        print(f"   User Email: {current_user.get('email', 'Unknown')}")
        print(f"{'='*80}\n")
        
        # ✅ STEP 1: Get all call IDs for this user
        user_calls = await db.calls.find(
            {"user_id": user_id_str},
            {"_id": 1}
        ).to_list(length=None)
        
        user_call_ids = [call["_id"] for call in user_calls]
        
        if not user_call_ids:
            print("ℹ️ No calls found for this user")
            return []
        
        print(f"📞 Found {len(user_call_ids)} calls for user")
        
        # ✅ STEP 2: Build filter query for call logs
        # SECURITY: Only get logs for calls that belong to this user
        filter_query = {"call_id": {"$in": user_call_ids}}
        
        if outcome:
            filter_query["outcome"] = outcome
        if sentiment:
            filter_query["sentiment"] = sentiment
        
        # Search in summary, transcript, or keywords
        if search:
            filter_query["$or"] = [
                {"summary": {"$regex": search, "$options": "i"}},
                {"transcript": {"$regex": search, "$options": "i"}},
                {"keywords": {"$in": [search]}}
            ]
        
        # Date filtering
        date_filter = {}
        if from_date:
            try:
                from_datetime = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
                date_filter["$gte"] = from_datetime
            except ValueError:
                pass
        
        if to_date:
            try:
                to_datetime = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
                date_filter["$lte"] = to_datetime
            except ValueError:
                pass
        
        if date_filter:
            filter_query["created_at"] = date_filter
        
        print(f"🔍 Call logs filter: {filter_query}")
        
        # Get call logs
        logs_cursor = db.call_logs.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
        logs = await logs_cursor.to_list(length=limit)
        
        # Format logs
        formatted_logs = []
        for log in logs:
            formatted_log = {
                "_id": str(log["_id"]),
                "call_id": str(log["call_id"]),
                "call_sid": log.get("call_sid"),
                "summary": log.get("summary", ""),
                "outcome": log.get("outcome", "unknown"),
                "sentiment": log.get("sentiment", "neutral"),
                "keywords": log.get("keywords", []),
                "transcript": log.get("transcript", ""),
                "recording_duration": log.get("recording_duration", 0),
                "created_at": log.get("created_at"),
                "updated_at": log.get("updated_at")
            }
            formatted_logs.append(formatted_log)
        
        print(f"✅ Found {len(formatted_logs)} call logs for user {user_id_str}\n")
        return formatted_logs
        
    except Exception as e:
        print(f"❌ Error fetching call logs: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching call logs: {str(e)}")