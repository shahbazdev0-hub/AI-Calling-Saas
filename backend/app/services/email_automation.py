# backend/app/services/email_automation.py

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from bson import ObjectId
import asyncio
from jinja2 import Template

from app.config import settings
from app.database import get_database
from app.services.email import email_service


class EmailAutomationService:
    """Email Automation Service"""
    
    def __init__(self):
        self.db = None
    
    async def get_db(self):
        """Get database connection"""
        if not self.db:
            self.db = await get_database()
        return self.db
    
    async def create_campaign(
        self,
        user_id: str,
        name: str,
        subject: str,
        content: str,
        recipients: List[str],
        scheduled_at: Optional[datetime] = None,
        send_immediately: bool = False,
        template_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create email campaign
        
        Args:
            user_id: User ID
            name: Campaign name
            subject: Email subject
            content: Email content (HTML)
            recipients: List of recipient emails
            scheduled_at: When to send (optional)
            send_immediately: Send now (default: False)
            template_id: Email template ID (optional)
            
        Returns:
            Dict with campaign details
        """
        db = await self.get_db()
        
        campaign_data = {
            "user_id": user_id,
            "name": name,
            "subject": subject,
            "content": content,
            "template_id": template_id,
            "recipients": recipients,
            "recipient_count": len(recipients),
            "status": "scheduled" if scheduled_at else ("sending" if send_immediately else "draft"),
            "scheduled_at": scheduled_at,
            "send_immediately": send_immediately,
            "sent_count": 0,
            "delivered_count": 0,
            "opened_count": 0,
            "clicked_count": 0,
            "failed_count": 0,
            "send_rate_limit": settings.CAMPAIGN_SEND_RATE_LIMIT,
            "batch_size": settings.EMAIL_BATCH_SIZE,
            "metadata": {},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.email_campaigns.insert_one(campaign_data)
        campaign_data["_id"] = str(result.inserted_id)
        
        # If send immediately, trigger sending
        if send_immediately:
            # Import here to avoid circular import
            from app.tasks.email_tasks import send_campaign_task
            send_campaign_task.delay(str(result.inserted_id))
        
        return campaign_data
    
    async def get_campaigns(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get email campaigns for user"""
        db = await self.get_db()
        
        query = {"user_id": user_id}
        if status:
            query["status"] = status
        
        total = await db.email_campaigns.count_documents(query)
        
        cursor = db.email_campaigns.find(query).sort("created_at", -1).skip(skip).limit(limit)
        campaigns = await cursor.to_list(length=limit)
        
        for campaign in campaigns:
            campaign["_id"] = str(campaign["_id"])
        
        return {
            "campaigns": campaigns,
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit
        }
    
    async def get_campaign(self, campaign_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get campaign by ID"""
        db = await self.get_db()
        
        campaign = await db.email_campaigns.find_one({
            "_id": ObjectId(campaign_id),
            "user_id": user_id
        })
        
        if campaign:
            campaign["_id"] = str(campaign["_id"])
        
        return campaign
    
    async def update_campaign(
        self,
        campaign_id: str,
        user_id: str,
        update_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update campaign"""
        db = await self.get_db()
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.email_campaigns.update_one(
            {"_id": ObjectId(campaign_id), "user_id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await self.get_campaign(campaign_id, user_id)
        
        return None
    
    async def delete_campaign(self, campaign_id: str, user_id: str) -> bool:
        """Delete campaign"""
        db = await self.get_db()
        
        result = await db.email_campaigns.delete_one({
            "_id": ObjectId(campaign_id),
            "user_id": user_id
        })
        
        return result.deleted_count > 0
    
    async def send_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """
        Send campaign emails
        This is called by Celery task
        """
        db = await self.get_db()
        
        campaign = await db.email_campaigns.find_one({"_id": ObjectId(campaign_id)})
        if not campaign:
            return {"success": False, "error": "Campaign not found"}
        
        # Update status
        await db.email_campaigns.update_one(
            {"_id": ObjectId(campaign_id)},
            {
                "$set": {
                    "status": "sending",
                    "started_at": datetime.utcnow()
                }
            }
        )
        
        results = {
            "total": len(campaign["recipients"]),
            "sent": 0,
            "failed": 0
        }
        
        # Send emails in batches
        batch_size = campaign.get("batch_size", settings.EMAIL_BATCH_SIZE)
        recipients = campaign["recipients"]
        
        for i in range(0, len(recipients), batch_size):
            batch = recipients[i:i + batch_size]
            
            for recipient in batch:
                try:
                    await email_service.send_email(
                        to_email=recipient,
                        subject=campaign["subject"],
                        html_content=campaign["content"]
                    )
                    results["sent"] += 1
                    
                    # Update sent count
                    await db.email_campaigns.update_one(
                        {"_id": ObjectId(campaign_id)},
                        {"$inc": {"sent_count": 1}}
                    )
                    
                except Exception as e:
                    results["failed"] += 1
                    
                    # Update failed count
                    await db.email_campaigns.update_one(
                        {"_id": ObjectId(campaign_id)},
                        {"$inc": {"failed_count": 1}}
                    )
            
            # Rate limiting delay between batches
            await asyncio.sleep(1)
        
        # Update final status
        await db.email_campaigns.update_one(
            {"_id": ObjectId(campaign_id)},
            {
                "$set": {
                    "status": "sent",
                    "completed_at": datetime.utcnow()
                }
            }
        )
        
        return results
    
    async def create_template(
        self,
        user_id: str,
        name: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        variables: List[str] = []
    ) -> Dict[str, Any]:
        """Create email template"""
        db = await self.get_db()
        
        template_data = {
            "user_id": user_id,
            "name": name,
            "subject": subject,
            "html_content": html_content,
            "text_content": text_content,
            "variables": variables,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.email_templates.insert_one(template_data)
        template_data["_id"] = str(result.inserted_id)
        
        return template_data
    
    async def get_templates(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> Dict[str, Any]:
        """Get email templates"""
        db = await self.get_db()
        
        total = await db.email_templates.count_documents({"user_id": user_id})
        
        cursor = db.email_templates.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        templates = await cursor.to_list(length=limit)
        
        for template in templates:
            template["_id"] = str(template["_id"])
        
        return {
            "templates": templates,
            "total": total
        }
    
    async def render_template(
        self,
        template_id: str,
        variables: Dict[str, Any]
    ) -> str:
        """Render email template with variables"""
        db = await self.get_db()
        
        template = await db.email_templates.find_one({"_id": ObjectId(template_id)})
        if not template:
            raise ValueError("Template not found")
        
        jinja_template = Template(template["html_content"])
        return jinja_template.render(**variables)


# Create singleton instance
email_automation_service = EmailAutomationService()