# backend/app/services/communication_handler.py - MULTI-CHANNEL COMMUNICATION

import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import asyncio

from .twilio import twilio_service
from .call_handler import CallHandlerService
from .sms import sms_service
from .email import email_service

logger = logging.getLogger(__name__)


class CommunicationHandler:
    """
    Multi-Channel Communication Handler
    
    Executes communication based on agent's enabled channels:
    - Calls (if enable_calls = True)
    - Emails (if enable_emails = True)
    - SMS (if enable_sms = True)
    """
    
    def __init__(self):
        self.twilio = twilio_service
        self.sms = sms_service
        self.email = email_service
    
    
    # ============================================
    # BULK CAMPAIGN EXECUTION
    # ============================================
    
    async def execute_bulk_campaign(
        self,
        agent_id: str,
        user_id: str,
        db: AsyncIOMotorDatabase,
        delay_between_calls: int = 30,
        max_concurrent: int = 1
    ) -> Dict[str, Any]:
        """
        Execute bulk calling/messaging campaign
        
        Process:
        1. Get agent configuration
        2. Validate agent is in bulk mode
        3. Get all contacts
        4. For each contact, execute enabled channels
        5. Track results
        
        Args:
            agent_id: Agent to use
            user_id: User ID
            db: Database connection
            delay_between_calls: Seconds between actions
            max_concurrent: Max concurrent operations
        """
        try:
            logger.info(f"🚀 Starting bulk campaign for agent {agent_id}")
            
            # Step 1: Get agent configuration
            agent = await db.voice_agents.find_one({
                "_id": ObjectId(agent_id),
                "user_id": user_id
            })
            
            if not agent:
                return {
                    "success": False,
                    "error": "Agent not found"
                }
            
            # Step 2: Validate bulk mode
            if agent.get('calling_mode') != 'bulk':
                return {
                    "success": False,
                    "error": "Agent is not configured for bulk calling. Please set calling_mode to 'bulk'."
                }
            
            # Step 3: Get contacts
            contacts = agent.get('contacts', [])
            
            if not contacts:
                return {
                    "success": False,
                    "error": "No contacts found for this agent"
                }
            
            logger.info(f"📞 Processing {len(contacts)} contacts")
            
            # Step 4: Update agent status
            await db.voice_agents.update_one(
                {"_id": ObjectId(agent_id)},
                {
                    "$set": {
                        "campaign_status": "running",
                        "last_campaign_run": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Step 5: Process contacts
            results = []
            
            for idx, contact in enumerate(contacts):
                logger.info(f"📇 Processing contact {idx + 1}/{len(contacts)}: {contact.get('name')}")
                
                contact_result = await self._process_single_contact(
                    contact=contact,
                    agent=agent,
                    user_id=user_id,
                    db=db
                )
                
                results.append(contact_result)
                
                # Delay between contacts (except last one)
                if idx < len(contacts) - 1 and delay_between_calls > 0:
                    logger.info(f"⏳ Waiting {delay_between_calls} seconds before next contact...")
                    await asyncio.sleep(delay_between_calls)
            
            # Step 6: Update agent status
            await db.voice_agents.update_one(
                {"_id": ObjectId(agent_id)},
                {
                    "$set": {
                        "campaign_status": "completed",
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Step 7: Calculate summary
            successful = sum(1 for r in results if r.get('success', False))
            failed = len(results) - successful
            
            logger.info(f"✅ Campaign completed: {successful} successful, {failed} failed")
            
            return {
                "success": True,
                "message": f"Campaign completed successfully",
                "total_contacts": len(contacts),
                "successful": successful,
                "failed": failed,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"❌ Error executing bulk campaign: {e}", exc_info=True)
            
            # Update agent status to failed
            try:
                await db.voice_agents.update_one(
                    {"_id": ObjectId(agent_id)},
                    {
                        "$set": {
                            "campaign_status": "failed",
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
            except:
                pass
            
            return {
                "success": False,
                "error": str(e)
            }
    
    
    # ============================================SINGLE CONTACT PROCESSING# ============================================

async def _process_single_contact(
    self,
    contact: Dict[str, str],
    agent: Dict[str, Any],
    user_id: str,
    db: AsyncIOMotorDatabase
) -> Dict[str, Any]:
    """
    Process a single contact with all enabled channels
    
    Returns result with actions taken
    """
    contact_name = contact.get('name', 'Unknown')
    contact_phone = contact.get('phone')
    contact_email = contact.get('email')
    
    result = {
        "contact_name": contact_name,
        "contact_phone": contact_phone,
        "contact_email": contact_email,
        "success": False,
        "actions": []
    }
    
    try:
        # Channel 1: Voice Call
        if agent.get('enable_calls', False) and contact_phone:
            logger.info(f"📞 Making call to {contact_name}")
            
            call_result = await self._make_call(
                to_number=contact_phone,
                agent=agent,
                user_id=user_id,
                db=db
            )
            
            result["actions"].append({
                "type": "call",
                "status": "success" if call_result.get('success') else "failed",
                "call_id": call_result.get('call_id'),
                "error": call_result.get('error')
            })
        
        # Channel 2: Email
        if agent.get('enable_emails', False) and contact_email:
            logger.info(f"📧 Sending email to {contact_name}")
            
            email_result = await self._send_email(
                to_email=contact_email,
                contact_name=contact_name,
                agent=agent,
                user_id=user_id
            )
            
            result["actions"].append({
                "type": "email",
                "status": "success" if email_result.get('success') else "failed",
                "error": email_result.get('error')
            })
        
        # Channel 3: SMS
        if agent.get('enable_sms', False) and contact_phone:
            logger.info(f"📱 Sending SMS to {contact_name}")
            
            sms_result = await self._send_sms(
                to_number=contact_phone,
                agent=agent,
                user_id=user_id,
                db=db
            )
            
            result["actions"].append({
                "type": "sms",
                "status": "success" if sms_result.get('success') else "failed",
                "message_sid": sms_result.get('message_sid'),
                "error": sms_result.get('error')
            })
        
        # Mark as successful if at least one action succeeded
        result["success"] = any(
            action.get('status') == 'success'
            for action in result["actions"]
        )
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Error processing contact {contact_name}: {e}")
        result["error"] = str(e)
        return result


# ============================================
# INDIVIDUAL CHANNEL METHODS
# ============================================

async def _make_call(
    self,
    to_number: str,
    agent: Dict[str, Any],
    user_id: str,
    db: AsyncIOMotorDatabase
) -> Dict[str, Any]:
    """Make voice call using Twilio"""
    try:
        # Initialize call handler
        from .call_handler import get_call_handler
        call_handler = get_call_handler(db)
        
        # Initiate call
        result = await call_handler.initiate_call(
            user_id=user_id,
            to_number=to_number,
            agent_id=str(agent['_id'])
        )
        
        if result.get('success'):
            logger.info(f"✅ Call initiated to {to_number}")
            return {
                "success": True,
                "call_id": result.get('call_id'),
                "call_sid": result.get('call_sid')
            }
        else:
            logger.error(f"❌ Call failed to {to_number}: {result.get('error')}")
            return {
                "success": False,
                "error": result.get('error', 'Unknown error')
            }
            
    except Exception as e:
        logger.error(f"❌ Error making call: {e}")
        return {
            "success": False,
            "error": str(e)
        }


async def _send_email(
    self,
    to_email: str,
    contact_name: str,
    agent: Dict[str, Any],
    user_id: str
) -> Dict[str, Any]:
    """Send email"""
    try:
        # Get email content from agent's AI script
        agent_name = agent.get('name', 'Our Team')
        ai_script = agent.get('ai_script', '')
        
        # Extract first paragraph as email content
        email_content = ai_script.split('\n\n')[0] if ai_script else "Hello! We wanted to reach out to you."
        
        # Send email
        result = await self.email.send_email(
            to_email=to_email,
            subject=f"Message from {agent_name}",
            body=f"""Hello {contact_name},
{email_content}
If you have any questions, please don't hesitate to reach out.
Best regards,
{agent_name}
""".strip()
)
        if result.get('success'):
            logger.info(f"✅ Email sent to {to_email}")
            return {"success": True}
        else:
            logger.error(f"❌ Email failed to {to_email}")
            return {
                "success": False,
                "error": "Failed to send email"
            }
            
    except Exception as e:
        logger.error(f"❌ Error sending email: {e}")
        return {
            "success": False,
            "error": str(e)
        }


async def _send_sms(
    self,
    to_number: str,
    agent: Dict[str, Any],
    user_id: str,
    db: AsyncIOMotorDatabase
) -> Dict[str, Any]:
    """Send SMS"""
    try:
        # Get SMS content from agent's AI script (first 160 chars)
        ai_script = agent.get('ai_script', '')
        sms_content = ai_script[:160] if ai_script else "Hello! We wanted to reach out to you."
        
        # Send SMS
        result = await self.sms.send_sms(
            to_number=to_number,
            message=sms_content,
            user_id=user_id
        )
        
        if result.get('success'):
            logger.info(f"✅ SMS sent to {to_number}")
            return {
                "success": True,
                "message_sid": result.get('message_sid')
            }
        else:
            logger.error(f"❌ SMS failed to {to_number}")
            return {
                "success": False,
                "error": result.get('error', 'Failed to send SMS')
            }
            
    except Exception as e:
        logger.error(f"❌ Error sending SMS: {e}")
        return {
            "success": False,
            "error": str(e)
        }
        # Create singleton instance
communication_handler = CommunicationHandler()