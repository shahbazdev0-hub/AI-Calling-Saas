# # backend/app/api/v1/calls.py - ✅ COMPLETE WITH ALL ENDPOINTS

# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from fastapi.responses import FileResponse
# from typing import Optional
# from datetime import datetime
# from bson import ObjectId
# from pathlib import Path

# from app.api.deps import get_current_user
# from app.database import get_database
# from motor.motor_asyncio import AsyncIOMotorDatabase

# import logging

# logger = logging.getLogger(__name__)
# router = APIRouter()


# # ============================================
# # ✅ LIST ALL CALLS
# # ============================================

# @router.get("/")
# async def list_calls(
#     skip: int = Query(0, ge=0),
#     limit: int = Query(50, ge=1, le=100),
#     status: Optional[str] = Query(None),
#     from_date: Optional[str] = Query(None),
#     to_date: Optional[str] = Query(None),
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """
#     ✅ List all calls for the current user with filters
#     """
#     try:
#         user_id_str = str(current_user["_id"])
        
#         # Build query
#         query = {"user_id": user_id_str}
        
#         if status:
#             query["status"] = status
        
#         # Date range filter
#         if from_date or to_date:
#             query["created_at"] = {}
#             if from_date:
#                 query["created_at"]["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
#             if to_date:
#                 query["created_at"]["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
        
#         logger.info(f"📞 Listing calls with query: {query}")
        
#         # Get total count
#         total = await db.calls.count_documents(query)
        
#         # Get calls
#         cursor = db.calls.find(query).sort("created_at", -1).skip(skip).limit(limit)
#         calls = await cursor.to_list(length=limit)
        
#         # Format calls - Convert ObjectIds to strings
#         formatted_calls = []
#         for call in calls:
#             formatted_call = {
#                 "id": str(call["_id"]),
#                 "twilio_call_sid": call.get("twilio_call_sid"),
#                 "from_number": call.get("from_number"),
#                 "to_number": call.get("to_number"),
#                 "status": call.get("status"),
#                 "direction": call.get("direction"),
#                 "duration": call.get("duration", 0),
#                 "recording_url": call.get("recording_url"),
#                 "recording_sid": call.get("recording_sid"),
#                 "recording_duration": call.get("recording_duration", 0),
#                 "agent_id": str(call["agent_id"]) if call.get("agent_id") else None,
#                 "user_id": str(call["user_id"]) if call.get("user_id") else None,
#                 "created_at": call.get("created_at").isoformat() if call.get("created_at") else None,
#                 "started_at": call.get("started_at").isoformat() if call.get("started_at") else None,
#                 "ended_at": call.get("ended_at").isoformat() if call.get("ended_at") else None,
#             }
#             formatted_calls.append(formatted_call)
        
#         logger.info(f"✅ Found {len(formatted_calls)} calls")
        
#         return {
#             "calls": formatted_calls,
#             "total": total,
#             "page": skip // limit + 1 if limit > 0 else 1,
#             "page_size": limit
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Error listing calls: {e}", exc_info=True)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to list calls: {str(e)}"
#         )


# # ============================================
# # ✅ GET ALL CALL LOGS
# # ============================================

# @router.get("/logs/all")
# async def get_all_call_logs(
#     skip: int = Query(0, ge=0),
#     limit: int = Query(100, ge=1, le=200),
#     outcome: Optional[str] = Query(None),
#     sentiment: Optional[str] = Query(None),
#     from_date: Optional[str] = Query(None),
#     to_date: Optional[str] = Query(None),
#     search: Optional[str] = Query(None),
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """
#     ✅ Get all call logs with transcripts
#     """
#     try:
#         user_id_str = str(current_user["_id"])
        
#         # Build query for calls first
#         call_query = {"user_id": user_id_str}
        
#         # Date range filter
#         if from_date or to_date:
#             call_query["created_at"] = {}
#             if from_date:
#                 call_query["created_at"]["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
#             if to_date:
#                 call_query["created_at"]["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
        
#         # Get calls
#         calls_cursor = db.calls.find(call_query).sort("created_at", -1).skip(skip).limit(limit)
#         calls = await calls_cursor.to_list(length=limit)
        
#         # Format call logs
#         call_logs = []
#         for call in calls:
#             call_id = call["_id"]
            
#             # Get transcripts for this call
#             transcripts_cursor = db.call_transcripts.find({"call_id": call_id}).sort("timestamp", 1)
#             transcripts = await transcripts_cursor.to_list(length=None)
            
#             # Format transcripts
#             formatted_transcripts = []
#             for t in transcripts:
#                 formatted_transcripts.append({
#                     "speaker": t.get("speaker"),
#                     "text": t.get("text", ""),
#                     "timestamp": t.get("timestamp").isoformat() if t.get("timestamp") else None,
#                     "confidence": t.get("confidence")
#                 })
            
#             # Build call log
#             log = {
#                 "id": str(call_id),
#                 "call_sid": call.get("twilio_call_sid"),
#                 "from_number": call.get("from_number"),
#                 "to_number": call.get("to_number"),
#                 "status": call.get("status"),
#                 "direction": call.get("direction"),
#                 "duration": call.get("duration", 0),
#                 "recording_url": call.get("recording_url"),
#                 "recording_duration": call.get("recording_duration", 0),
#                 "transcripts": formatted_transcripts,
#                 "summary": "",  # You can add AI summary logic here
#                 "outcome": "completed" if call.get("status") == "completed" else "pending",
#                 "sentiment": "neutral",  # You can add sentiment analysis here
#                 "created_at": call.get("created_at").isoformat() if call.get("created_at") else None,
#                 "ended_at": call.get("ended_at").isoformat() if call.get("ended_at") else None,
#             }
            
#             # Apply filters
#             if outcome and log["outcome"] != outcome:
#                 continue
#             if sentiment and log["sentiment"] != sentiment:
#                 continue
#             if search:
#                 search_lower = search.lower()
#                 searchable_text = f"{log['from_number']} {log['to_number']} {' '.join([t['text'] for t in formatted_transcripts])}"
#                 if search_lower not in searchable_text.lower():
#                     continue
            
#             call_logs.append(log)
        
#         total = await db.calls.count_documents(call_query)
        
#         logger.info(f"✅ Retrieved {len(call_logs)} call logs")
        
#         return {
#             "logs": call_logs,
#             "total": total,
#             "page": skip // limit + 1 if limit > 0 else 1,
#             "page_size": limit
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Error getting call logs: {e}", exc_info=True)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to get call logs: {str(e)}"
#         )


# # ============================================
# # GET SINGLE CALL LOG
# # ============================================

# @router.get("/{call_id}/log")
# async def get_call_log(
#     call_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get detailed log for a specific call"""
#     try:
#         if not ObjectId.is_valid(call_id):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid call ID"
#             )
        
#         user_id_str = str(current_user["_id"])
        
#         # Get call
#         call = await db.calls.find_one({
#             "_id": ObjectId(call_id),
#             "user_id": user_id_str
#         })
        
#         if not call:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Call not found"
#             )
        
#         # Get transcripts
#         transcripts_cursor = db.call_transcripts.find({"call_id": ObjectId(call_id)}).sort("timestamp", 1)
#         transcripts = await transcripts_cursor.to_list(length=None)
        
#         formatted_transcripts = []
#         for t in transcripts:
#             formatted_transcripts.append({
#                 "speaker": t.get("speaker"),
#                 "text": t.get("text", ""),
#                 "timestamp": t.get("timestamp").isoformat() if t.get("timestamp") else None,
#                 "confidence": t.get("confidence")
#             })
        
#         return {
#             "call_id": str(call["_id"]),
#             "call_sid": call.get("twilio_call_sid"),
#             "from_number": call.get("from_number"),
#             "to_number": call.get("to_number"),
#             "status": call.get("status"),
#             "duration": call.get("duration", 0),
#             "transcripts": formatted_transcripts,
#             "recording_url": call.get("recording_url"),
#             "created_at": call.get("created_at").isoformat() if call.get("created_at") else None,
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error getting call log: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error getting call log: {str(e)}"
#         )


# # ============================================
# # GET CALL STATISTICS
# # ============================================

# @router.get("/stats/summary")
# async def get_call_stats(
#     from_date: Optional[str] = None,
#     to_date: Optional[str] = None,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get call statistics summary"""
#     try:
#         user_id_str = str(current_user["_id"])
        
#         # Build date filter
#         filter_query = {"user_id": user_id_str}
        
#         if from_date or to_date:
#             date_filter = {}
#             if from_date:
#                 date_filter["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
#             if to_date:
#                 date_filter["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
#             filter_query["created_at"] = date_filter
        
#         # Get all calls
#         calls = await db.calls.find(filter_query).to_list(length=None)
        
#         # Calculate stats
#         total_calls = len(calls)
#         completed_calls = len([c for c in calls if c.get("status") == "completed"])
#         in_progress_calls = len([c for c in calls if c.get("status") == "in-progress"])
#         failed_calls = len([c for c in calls if c.get("status") in ["failed", "no-answer", "busy"]])
        
#         # Calculate total duration
#         total_duration = sum([c.get("duration", 0) for c in calls])
#         avg_duration = total_duration / total_calls if total_calls > 0 else 0
        
#         # Inbound vs Outbound
#         inbound_calls = len([c for c in calls if c.get("direction") == "inbound"])
#         outbound_calls = len([c for c in calls if c.get("direction") == "outbound"])
        
#         return {
#             "success": True,
#             "stats": {
#                 "total_calls": total_calls,
#                 "completed_calls": completed_calls,
#                 "in_progress_calls": in_progress_calls,
#                 "failed_calls": failed_calls,
#                 "total_duration": total_duration,
#                 "avg_duration": round(avg_duration, 2),
#                 "inbound_calls": inbound_calls,
#                 "outbound_calls": outbound_calls
#             }
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Error getting call stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error getting call stats: {str(e)}"
#         )


# # ============================================
# # RECORDING ENDPOINTS
# # ============================================

# @router.get("/{call_id}/recording")
# async def get_call_recording(
#     call_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get call recording URL"""
#     try:
#         if not ObjectId.is_valid(call_id):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid call ID"
#             )
        
#         user_id_str = str(current_user["_id"])
        
#         call = await db.calls.find_one({
#             "_id": ObjectId(call_id),
#             "user_id": user_id_str
#         })
        
#         if not call:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Call not found"
#             )
        
#         recording_url = call.get("recording_url")
        
#         if not recording_url:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Recording not available for this call"
#             )
        
#         return {
#             "success": True,
#             "recording_url": recording_url,
#             "recording_sid": call.get("recording_sid"),
#             "recording_duration": call.get("recording_duration", 0),
#             "downloaded": call.get("recording_downloaded", False)
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error fetching recording: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error fetching recording: {str(e)}"
#         )



# backend/app/api/v1/calls.py - ✅ COMPLETE WITH ALL ENDPOINTS

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse
from typing import Optional
from datetime import datetime
from bson import ObjectId
from pathlib import Path

from app.api.deps import get_current_user
from app.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

import logging

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================
# ✅ LIST ALL CALLS
# ============================================

@router.get("/")
async def list_calls(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    ✅ List all calls for the current user with filters
    """
    try:
        user_id_str = str(current_user["_id"])
        
        # Build query
        query = {"user_id": user_id_str}
        
        if status:
            query["status"] = status
        
        # Date range filter
        if from_date or to_date:
            query["created_at"] = {}
            if from_date:
                query["created_at"]["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
            if to_date:
                query["created_at"]["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
        
        logger.info(f"📞 Listing calls with query: {query}")
        
        # Get total count
        total = await db.calls.count_documents(query)
        
        # Get calls
        cursor = db.calls.find(query).sort("created_at", -1).skip(skip).limit(limit)
        calls = await cursor.to_list(length=limit)
        
        # Format calls - Convert ObjectIds to strings
        formatted_calls = []
        for call in calls:
            formatted_call = {
                "id": str(call["_id"]),
                "twilio_call_sid": call.get("twilio_call_sid"),
                "from_number": call.get("from_number"),
                "to_number": call.get("to_number"),
                "status": call.get("status"),
                "direction": call.get("direction"),
                "duration": call.get("duration", 0),
                "recording_url": call.get("recording_url"),
                "recording_sid": call.get("recording_sid"),
                "recording_duration": call.get("recording_duration", 0),
                "agent_id": str(call["agent_id"]) if call.get("agent_id") else None,
                "user_id": str(call["user_id"]) if call.get("user_id") else None,
                "created_at": call.get("created_at").isoformat() if call.get("created_at") else None,
                "started_at": call.get("started_at").isoformat() if call.get("started_at") else None,
                "ended_at": call.get("ended_at").isoformat() if call.get("ended_at") else None,
            }
            formatted_calls.append(formatted_call)
        
        logger.info(f"✅ Found {len(formatted_calls)} calls")
        
        return {
            "calls": formatted_calls,
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "page_size": limit
        }
        
    except Exception as e:
        logger.error(f"❌ Error listing calls: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list calls: {str(e)}"
        )


# ============================================
# ✅ GET ALL CALL LOGS (OPTIMIZED - NO TIMEOUT)
# ============================================

@router.get("/logs/all")
async def get_all_call_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    outcome: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    ✅ OPTIMIZED: Get all call logs WITHOUT loading all transcripts (prevents timeout)
    """
    try:
        user_id_str = str(current_user["_id"])
        
        # Build query for calls
        call_query = {"user_id": user_id_str}
        
        # Date range filter
        if from_date or to_date:
            call_query["created_at"] = {}
            if from_date:
                call_query["created_at"]["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
            if to_date:
                call_query["created_at"]["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
        
        logger.info(f"📞 Getting call logs with query: {call_query}")
        
        # ✅ OPTIMIZATION: Get calls WITHOUT transcripts first
        calls_cursor = db.calls.find(call_query).sort("created_at", -1).skip(skip).limit(limit)
        calls = await calls_cursor.to_list(length=limit)
        
        # ✅ OPTIMIZATION: Only get transcript COUNT, not full transcripts
        call_logs = []
        for call in calls:
            call_id = call["_id"]
            
            # Count transcripts instead of loading them all
            transcript_count = await db.call_transcripts.count_documents({"call_id": call_id})
            
            # Build call log with minimal data
            log = {
                "id": str(call_id),
                "_id": str(call_id),  # Add both for compatibility
                "call_sid": call.get("twilio_call_sid"),
                "from_number": call.get("from_number", ""),
                "to_number": call.get("to_number", ""),
                "status": call.get("status", ""),
                "direction": call.get("direction", "outbound"),
                "duration": call.get("duration", 0),
                "recording_url": call.get("recording_url", ""),
                "recording_duration": call.get("recording_duration", 0),
                "transcript_count": transcript_count,
                "transcript": f"{transcript_count} messages",  # Summary instead of full transcript
                "summary": f"Call with {call.get('to_number', 'unknown')} - {call.get('duration', 0)}s",
                "outcome": "completed" if call.get("status") == "completed" else "pending",
                "sentiment": "neutral",
                "created_at": call.get("created_at").isoformat() if call.get("created_at") else None,
                "ended_at": call.get("ended_at").isoformat() if call.get("ended_at") else None,
            }
            
            # Apply filters
            if outcome and log["outcome"] != outcome:
                continue
            if sentiment and log["sentiment"] != sentiment:
                continue
            
            call_logs.append(log)
        
        total = await db.calls.count_documents(call_query)
        
        logger.info(f"✅ Retrieved {len(call_logs)} call logs (optimized)")
        
        # ✅ FIX: Return in format expected by frontend
        return {
            "logs": call_logs,  # Frontend expects response.data.logs
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "page_size": limit
        }
        
    except Exception as e:
        logger.error(f"❌ Error getting call logs: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get call logs: {str(e)}"
        )


# ============================================
# GET SINGLE CALL LOG
# ============================================

@router.get("/{call_id}/log")
async def get_call_log(
    call_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get detailed log for a specific call"""
    try:
        if not ObjectId.is_valid(call_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid call ID"
            )
        
        user_id_str = str(current_user["_id"])
        
        # Get call
        call = await db.calls.find_one({
            "_id": ObjectId(call_id),
            "user_id": user_id_str
        })
        
        if not call:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Call not found"
            )
        
        # Get transcripts
        transcripts_cursor = db.call_transcripts.find({"call_id": ObjectId(call_id)}).sort("timestamp", 1)
        transcripts = await transcripts_cursor.to_list(length=None)
        
        formatted_transcripts = []
        for t in transcripts:
            formatted_transcripts.append({
                "speaker": t.get("speaker"),
                "text": t.get("text", ""),
                "timestamp": t.get("timestamp").isoformat() if t.get("timestamp") else None,
                "confidence": t.get("confidence")
            })
        
        return {
            "call_id": str(call["_id"]),
            "call_sid": call.get("twilio_call_sid"),
            "from_number": call.get("from_number"),
            "to_number": call.get("to_number"),
            "status": call.get("status"),
            "duration": call.get("duration", 0),
            "transcripts": formatted_transcripts,
            "recording_url": call.get("recording_url"),
            "created_at": call.get("created_at").isoformat() if call.get("created_at") else None,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting call log: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting call log: {str(e)}"
        )


# ============================================
# GET CALL STATISTICS
# ============================================

@router.get("/stats/summary")
async def get_call_stats(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get call statistics summary"""
    try:
        user_id_str = str(current_user["_id"])
        
        # Build date filter
        filter_query = {"user_id": user_id_str}
        
        if from_date or to_date:
            date_filter = {}
            if from_date:
                date_filter["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
            if to_date:
                date_filter["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
            filter_query["created_at"] = date_filter
        
        # Get all calls
        calls = await db.calls.find(filter_query).to_list(length=None)
        
        # Calculate stats
        total_calls = len(calls)
        completed_calls = len([c for c in calls if c.get("status") == "completed"])
        in_progress_calls = len([c for c in calls if c.get("status") == "in-progress"])
        failed_calls = len([c for c in calls if c.get("status") in ["failed", "no-answer", "busy"]])
        
        # Calculate total duration
        total_duration = sum([c.get("duration", 0) for c in calls])
        avg_duration = total_duration / total_calls if total_calls > 0 else 0
        
        # Inbound vs Outbound
        inbound_calls = len([c for c in calls if c.get("direction") == "inbound"])
        outbound_calls = len([c for c in calls if c.get("direction") == "outbound"])
        
        return {
            "success": True,
            "stats": {
                "total_calls": total_calls,
                "completed_calls": completed_calls,
                "in_progress_calls": in_progress_calls,
                "failed_calls": failed_calls,
                "total_duration": total_duration,
                "avg_duration": round(avg_duration, 2),
                "inbound_calls": inbound_calls,
                "outbound_calls": outbound_calls
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Error getting call stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting call stats: {str(e)}"
        )


# ============================================
# RECORDING ENDPOINTS
# ============================================

@router.get("/{call_id}/recording")
async def get_call_recording(
    call_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get call recording URL"""
    try:
        if not ObjectId.is_valid(call_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid call ID"
            )
        
        user_id_str = str(current_user["_id"])
        
        call = await db.calls.find_one({
            "_id": ObjectId(call_id),
            "user_id": user_id_str
        })
        
        if not call:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Call not found"
            )
        
        recording_url = call.get("recording_url")
        
        if not recording_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recording not available for this call"
            )
        
        return {
            "success": True,
            "recording_url": recording_url,
            "recording_sid": call.get("recording_sid"),
            "recording_duration": call.get("recording_duration", 0),
            "downloaded": call.get("recording_downloaded", False)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching recording: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recording: {str(e)}"
        )