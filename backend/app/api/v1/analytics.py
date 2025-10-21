# backend/app/api/v1/analytics.py - NEW FILE

from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database import get_database
from app.api.deps import get_current_admin_user
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/admin/overview")
async def get_admin_analytics_overview(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get comprehensive analytics for ALL users (Admin only)
    Returns aggregated data across all users
    """
    try:
        logger.info(f"Admin {current_user['email']} requesting analytics overview")
        
        # Build date filter
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
        
        query_filter = {}
        if date_filter:
            query_filter["created_at"] = date_filter
        
        # Get all calls
        all_calls = await db.calls.find(query_filter).to_list(length=10000)
        
        # Get all call logs
        all_call_logs = await db.call_logs.find(query_filter).to_list(length=10000)
        
        # Get all users
        all_users = await db.users.find().to_list(length=10000)
        
        # Calculate overview statistics
        total_calls = len(all_calls)
        completed_calls = len([c for c in all_calls if c.get('status') == 'completed'])
        in_progress_calls = len([c for c in all_calls if c.get('status') == 'in-progress'])
        failed_calls = len([c for c in all_calls if c.get('status') in ['failed', 'no-answer', 'busy']])
        
        # Calculate total duration
        total_duration = sum(call.get('duration', 0) for call in all_calls)
        avg_duration = total_duration / total_calls if total_calls > 0 else 0
        
        # Outcome analysis from call logs
        outcomes = defaultdict(int)
        sentiments = defaultdict(int)
        
        for log in all_call_logs:
            outcome = log.get('outcome', 'unknown')
            outcomes[outcome] += 1
            
            sentiment = log.get('sentiment', 'neutral')
            sentiments[sentiment] += 1
        
        # Calculate success rate
        successful_calls = outcomes.get('successful', 0) + outcomes.get('converted', 0)
        success_rate = (successful_calls / len(all_call_logs) * 100) if all_call_logs else 0
        
        # User activity analysis
        users_with_calls = set(str(call.get('user_id')) for call in all_calls if call.get('user_id'))
        active_users = len(users_with_calls)
        total_users = len(all_users)
        
        # Call trends by date
        call_trends = defaultdict(int)
        for call in all_calls:
            date_str = call.get('created_at', datetime.utcnow()).strftime('%Y-%m-%d')
            call_trends[date_str] += 1
        
        trends_data = [
            {"date": date, "calls": count} 
            for date, count in sorted(call_trends.items())
        ]
        
        # Outcome distribution
        outcome_data = [
            {"name": outcome.replace('_', ' ').title(), "value": count}
            for outcome, count in outcomes.items()
        ]
        
        # Sentiment distribution
        sentiment_data = [
            {"name": sentiment.capitalize(), "value": count}
            for sentiment, count in sentiments.items()
        ]
        
        # Top users by calls
        user_call_counts = defaultdict(int)
        user_details = {}
        
        for call in all_calls:
            user_id = str(call.get('user_id', ''))
            if user_id:
                user_call_counts[user_id] += 1
        
        # Get user details
        for user in all_users:
            user_id = str(user.get('_id'))
            user_details[user_id] = {
                'name': user.get('full_name', 'Unknown'),
                'email': user.get('email', ''),
                'company': user.get('company', '')
            }
        
        top_users = [
            {
                "user_id": user_id,
                "name": user_details.get(user_id, {}).get('name', 'Unknown'),
                "email": user_details.get(user_id, {}).get('email', ''),
                "company": user_details.get(user_id, {}).get('company', ''),
                "call_count": count
            }
            for user_id, count in sorted(
                user_call_counts.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:10]
        ]
        
        # Hourly distribution
        hourly_distribution = defaultdict(int)
        for call in all_calls:
            hour = call.get('created_at', datetime.utcnow()).hour
            hourly_distribution[hour] += 1
        
        hourly_data = [
            {"hour": f"{hour:02d}:00", "calls": count}
            for hour, count in sorted(hourly_distribution.items())
        ]
        
        return {
            "overview": {
                "total_calls": total_calls,
                "completed_calls": completed_calls,
                "in_progress_calls": in_progress_calls,
                "failed_calls": failed_calls,
                "total_duration_seconds": total_duration,
                "avg_duration_seconds": round(avg_duration, 2),
                "success_rate": round(success_rate, 2),
                "total_users": total_users,
                "active_users": active_users,
                "conversion_rate": round((outcomes.get('converted', 0) / len(all_call_logs) * 100) if all_call_logs else 0, 2)
            },
            "call_trends": trends_data,
            "outcome_distribution": outcome_data,
            "sentiment_distribution": sentiment_data,
            "top_users": top_users,
            "hourly_distribution": hourly_data,
            "outcomes_summary": dict(outcomes),
            "sentiments_summary": dict(sentiments)
        }
        
    except Exception as e:
        logger.error(f"Error fetching admin analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analytics: {str(e)}"
        )


@router.get("/admin/user-analytics/{user_id}")
async def get_user_analytics(
    user_id: str,
    current_user: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get detailed analytics for a specific user (Admin only)
    """
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Get user details
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's calls
        user_calls = await db.calls.find({"user_id": user_id}).to_list(length=10000)
        
        # Get user's call logs
        call_ids = [str(call['_id']) for call in user_calls]
        user_call_logs = await db.call_logs.find(
            {"call_id": {"$in": call_ids}}
        ).to_list(length=10000)
        
        # Calculate statistics
        total_calls = len(user_calls)
        completed = len([c for c in user_calls if c.get('status') == 'completed'])
        total_duration = sum(c.get('duration', 0) for c in user_calls)
        
        outcomes = defaultdict(int)
        for log in user_call_logs:
            outcomes[log.get('outcome', 'unknown')] += 1
        
        return {
            "user": {
                "id": str(user['_id']),
                "name": user.get('full_name'),
                "email": user.get('email'),
                "company": user.get('company')
            },
            "statistics": {
                "total_calls": total_calls,
                "completed_calls": completed,
                "total_duration": total_duration,
                "avg_duration": total_duration / total_calls if total_calls > 0 else 0,
                "outcomes": dict(outcomes)
            },
            "recent_calls": [
                {
                    "_id": str(call['_id']),
                    "to_number": call.get('to_number'),
                    "status": call.get('status'),
                    "duration": call.get('duration'),
                    "created_at": call.get('created_at')
                }
                for call in sorted(user_calls, key=lambda x: x.get('created_at', datetime.min), reverse=True)[:10]
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user analytics: {str(e)}"
        )


@router.get("/admin/call-details")
async def get_all_calls_with_logs(
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = Query(None),
    outcome_filter: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get all calls with their logs and conversation details (Admin only)
    """
    try:
        # Build filter
        filter_query = {}
        
        if status_filter:
            filter_query["status"] = status_filter
        
        date_filter = {}
        if from_date:
            date_filter["$gte"] = datetime.fromisoformat(from_date.replace('Z', '+00:00'))
        if to_date:
            date_filter["$lte"] = datetime.fromisoformat(to_date.replace('Z', '+00:00'))
        if date_filter:
            filter_query["created_at"] = date_filter
        
        # Get calls with pagination
        calls = await db.calls.find(filter_query).skip(skip).limit(limit).sort("created_at", -1).to_list(length=limit)
        total_count = await db.calls.count_documents(filter_query)
        
        # Get call logs and user details
        enriched_calls = []
        for call in calls:
            call_id = str(call['_id'])
            
            # Get call log
            call_log = await db.call_logs.find_one({"call_id": ObjectId(call_id)})
            
            # Get user details
            user_id = call.get('user_id')
            user = None
            if user_id and ObjectId.is_valid(user_id):
                user = await db.users.find_one({"_id": ObjectId(user_id)})
            
            enriched_call = {
                "_id": call_id,
                "call_sid": call.get('call_sid'),
                "from_number": call.get('from_number'),
                "to_number": call.get('to_number'),
                "status": call.get('status'),
                "duration": call.get('duration', 0),
                "created_at": call.get('created_at'),
                "ended_at": call.get('ended_at'),
                "user": {
                    "id": str(user['_id']) if user else None,
                    "name": user.get('full_name') if user else 'Unknown',
                    "email": user.get('email') if user else '',
                    "company": user.get('company') if user else ''
                } if user else None,
                "log": {
                    "summary": call_log.get('summary', '') if call_log else '',
                    "outcome": call_log.get('outcome', '') if call_log else '',
                    "sentiment": call_log.get('sentiment', '') if call_log else '',
                    "keywords": call_log.get('keywords', []) if call_log else [],
                    "transcript": call_log.get('transcript', '') if call_log else ''
                } if call_log else None
            }
            
            enriched_calls.append(enriched_call)
        
        return {
            "calls": enriched_calls,
            "total": total_count,
            "page": skip // limit + 1,
            "pages": (total_count + limit - 1) // limit
        }
        
    except Exception as e:
        logger.error(f"Error fetching call details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch call details: {str(e)}"
        )