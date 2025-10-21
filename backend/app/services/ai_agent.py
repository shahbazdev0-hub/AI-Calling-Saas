# backend/app/services/ai_agent.py - COMPLETE FIXED VERSION

import os
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
from openai import AsyncOpenAI
from bson import ObjectId

from app.database import get_database

logger = logging.getLogger(__name__)


class AIAgentService:
    """AI Agent Service for handling conversational AI"""
    
    def __init__(self):
        """Initialize AI Agent Service"""
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "500"))
        
        if not self.api_key:
            logger.warning("⚠️ OpenAI API key not found")
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=self.api_key)
            logger.info("✅ OpenAI client initialized")
    
    async def get_greeting(self, agent_id: Optional[str] = None) -> str:
        """
        Get greeting message for agent
        
        Args:
            agent_id: Voice agent ID (optional)
            
        Returns:
            Greeting message string
        """
        try:
            # If agent_id provided, get custom greeting from database
            if agent_id:
                db = await get_database()
                
                agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
                
                if agent and agent.get("greeting_message"):
                    logger.info(f"✅ Using custom greeting from agent {agent_id}")
                    return agent["greeting_message"]
            
            # Default greeting
            return "Hello! Thank you for calling. How can I help you today?"
            
        except Exception as e:
            logger.error(f"Error getting greeting: {e}")
            return "Hello! Thank you for calling. How can I help you today?"
    
    async def process_user_input(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Process user input and generate AI response
        
        Args:
            user_input: User's speech input
            call_id: Call ID
            agent_config: Agent configuration (optional)
            
        Returns:
            AI-generated response
        """
        try:
            logger.info(f"🤖 Processing user input for call {call_id}: '{user_input}'")
            
            if not self.client:
                logger.error("OpenAI client not initialized")
                return "I apologize, but I'm having technical difficulties. Please try again later."
            
            # Get conversation history
            db = await get_database()
            
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            # Build conversation context
            messages = []
            
            # 🔥 CRITICAL FIX: Always fetch latest system prompt from database
            system_prompt = None
            
            if agent_config and agent_config.get("_id"):
                # Fetch fresh agent data from database every time
                try:
                    fresh_agent = await db.voice_agents.find_one({"_id": agent_config["_id"]})
                    if fresh_agent and fresh_agent.get("system_prompt"):
                        system_prompt = fresh_agent["system_prompt"]
                        logger.info(f"✅ Using fresh system prompt from database (agent: {fresh_agent.get('name')}, length: {len(system_prompt)} chars)")
                except Exception as e:
                    logger.error(f"❌ Error fetching fresh agent: {e}")
            
            # Fallback to default only if no agent found
            if not system_prompt:
                system_prompt = """You are a helpful AI assistant for a call center. 
Be professional, friendly, and concise in your responses (keep responses under 50 words). 
Help customers with their questions and needs. 
If asked what you can do, explain that you can help answer questions, provide information, and assist with inquiries."""
            
            # Add system message
            messages.append({
                "role": "system",
                "content": system_prompt
            })
            
            # Add conversation history if available
            if conversation and conversation.get("messages"):
                for msg in conversation.get("messages", []):
                    messages.append({
                        "role": msg.get("role"),
                        "content": msg.get("content")
                    })
            
            # Add current user input
            messages.append({
                "role": "user",
                "content": user_input
            })
            
            logger.info(f"📨 Sending {len(messages)} messages to OpenAI")
            
            # Get AI response
            ai_response = await self.get_completion(messages)
            
            logger.info(f"🎯 Generated AI response: '{ai_response}'")
            
            # Save messages to conversation
            if conversation:
                await db.conversations.update_one(
                    {"_id": conversation["_id"]},
                    {
                        "$push": {
                            "messages": {
                                "$each": [
                                    {
                                        "role": "user",
                                        "content": user_input,
                                        "timestamp": datetime.utcnow()
                                    },
                                    {
                                        "role": "assistant",
                                        "content": ai_response,
                                        "timestamp": datetime.utcnow()
                                    }
                                ]
                            }
                        },
                        "$set": {"updated_at": datetime.utcnow()}
                    }
                )
                logger.info(f"💾 Conversation updated for call {call_id}")
            
            return ai_response
            
        except Exception as e:
            logger.error(f"❌ Error processing user input: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm having trouble processing your request. Could you please try again?"
    
    async def get_completion(self, messages: List[Dict[str, str]]) -> str:
        """
        Get completion from OpenAI
        
        Args:
            messages: List of message dictionaries
            
        Returns:
            AI response string
        """
        try:
            if not self.client:
                return "AI service not configured"
            
            logger.info(f"📄 Calling OpenAI API with model: {self.model}")
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            logger.info(f"✅ OpenAI API response received: {len(ai_response)} characters")
            
            return ai_response
            
        except Exception as e:
            logger.error(f"❌ Error getting completion from OpenAI: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm experiencing technical difficulties. Please try again."
    
    async def should_end_conversation(self, ai_response: str) -> bool:
        """
        Determine if the conversation should end based on AI response
        
        Args:
            ai_response: The AI's response text
            
        Returns:
            True if conversation should end, False otherwise
        """
        try:
            # Check for common ending phrases
            ending_phrases = [
                "goodbye",
                "have a great day",
                "thank you for calling",
                "is there anything else",
                "that's all for now",
                "talk to you later",
                "bye",
                "have a nice day"
            ]
            
            response_lower = ai_response.lower()
            
            # Check if response contains ending phrases
            for phrase in ending_phrases:
                if phrase in response_lower:
                    logger.info(f"👋 Ending conversation - detected phrase: '{phrase}'")
                    return True
            
            # Don't end by default - keep conversation going
            return False
            
        except Exception as e:
            logger.error(f"Error checking if conversation should end: {e}")
            return False
    
    async def analyze_call(self, call_id: str, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze a completed call conversation
        
        Args:
            call_id: Call ID
            messages: List of conversation messages
            
        Returns:
            Dict with call analysis (summary, sentiment, outcome, keywords)
        """
        try:
            logger.info(f"📊 Analyzing call {call_id} with {len(messages)} messages")
            
            if not self.client or not messages:
                return {
                    "summary": "Call completed",
                    "sentiment": "neutral",
                    "outcome": "completed",
                    "keywords": [],
                    "key_points": []
                }
            
            # Build conversation text
            conversation_text = "\n".join([
                f"{msg.get('role', 'unknown')}: {msg.get('content', '')}"
                for msg in messages
            ])
            
            # Create analysis prompt
            analysis_prompt = f"""Analyze the following customer service call conversation and provide:
1. A brief summary (2-3 sentences)
2. Overall sentiment (positive/neutral/negative)
3. Call outcome (successful/needs_followup/issue_resolved/no_answer)
4. Key topics discussed (list 3-5 keywords)
5. Important points or action items

Conversation:
{conversation_text}

Respond in JSON format:
{{
    "summary": "brief summary here",
    "sentiment": "positive/neutral/negative",
    "outcome": "successful/needs_followup/issue_resolved/no_answer",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "key_points": ["point1", "point2"]
}}"""
            
            messages_for_analysis = [
                {
                    "role": "system",
                    "content": "You are an expert at analyzing customer service calls. Provide concise, accurate analysis in JSON format."
                },
                {
                    "role": "user",
                    "content": analysis_prompt
                }
            ]
            
            # Get analysis from OpenAI
            response = await self.get_completion(messages_for_analysis)
            
            # Try to parse JSON response
            try:
                analysis = json.loads(response)
                logger.info(f"✅ Call analysis completed: {analysis.get('outcome')}")
                return analysis
            except json.JSONDecodeError:
                logger.warning("⚠️ Failed to parse JSON response, using default analysis")
                return {
                    "summary": response[:200] if len(response) > 200 else response,
                    "sentiment": "neutral",
                    "outcome": "completed",
                    "keywords": [],
                    "key_points": []
                }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing call: {e}")
            import traceback
            traceback.print_exc()
            return {
                "summary": "Call completed",
                "sentiment": "neutral",
                "outcome": "completed",
                "keywords": [],
                "key_points": []
            }
    
    async def generate_transcript(self, messages: List[Dict[str, Any]]) -> str:
        """
        Generate a formatted transcript from conversation messages
        
        Args:
            messages: List of conversation messages
            
        Returns:
            Formatted transcript string
        """
        try:
            if not messages:
                return ""
            
            transcript_lines = []
            
            for msg in messages:
                role = msg.get("role", "unknown")
                content = msg.get("content", "")
                timestamp = msg.get("timestamp", datetime.utcnow())
                
                # Format role label
                role_label = "Agent" if role == "assistant" else "Customer" if role == "user" else "System"
                
                # Format timestamp
                time_str = timestamp.strftime("%H:%M:%S") if isinstance(timestamp, datetime) else ""
                
                # Add to transcript
                if time_str:
                    transcript_lines.append(f"[{time_str}] {role_label}: {content}")
                else:
                    transcript_lines.append(f"{role_label}: {content}")
            
            # Join all lines with newlines
            transcript = "\n".join(transcript_lines)
            
            logger.info(f"📝 Generated transcript with {len(transcript_lines)} lines")
            
            return transcript
            
        except Exception as e:
            logger.error(f"❌ Error generating transcript: {e}")
            import traceback
            traceback.print_exc()
            return ""
    
    async def generate_summary(self, messages: List[Dict[str, Any]]) -> str:
        """
        Generate a summary of the conversation
        
        Args:
            messages: List of conversation messages
            
        Returns:
            Summary string
        """
        try:
            if not self.client or not messages:
                return "Call completed with no conversation"
            
            # Build conversation text
            conversation_text = "\n".join([
                f"{msg.get('role', 'unknown')}: {msg.get('content', '')}"
                for msg in messages
            ])
            
            # Create summary prompt
            summary_prompt = f"""Summarize the following customer service call conversation in 2-3 sentences:

{conversation_text}

Provide a concise summary focusing on the main topic discussed and any outcomes or next steps."""
            
            messages_for_summary = [
                {
                    "role": "system",
                    "content": "You are an expert at summarizing customer service calls."
                },
                {
                    "role": "user",
                    "content": summary_prompt
                }
            ]
            
            # Get summary from OpenAI
            summary = await self.get_completion(messages_for_summary)
            
            logger.info(f"✅ Summary generated: {len(summary)} characters")
            
            return summary
            
        except Exception as e:
            logger.error(f"❌ Error generating summary: {e}")
            return "Call completed"
    
    async def extract_booking_details(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extract booking or appointment details from conversation
        
        Args:
            messages: List of conversation messages
            
        Returns:
            Dict with booking details
        """
        try:
            if not self.client or not messages:
                return {
                    "success": False,
                    "booking_details": None
                }
            
            # Build conversation text
            conversation_text = "\n".join([
                f"{msg.get('role', 'unknown')}: {msg.get('content', '')}"
                for msg in messages
            ])
            
            # Create extraction prompt
            extraction_prompt = f"""Analyze this customer service call and extract any booking or appointment details mentioned:

{conversation_text}

If booking details are discussed, respond in JSON format:
{{
    "has_booking": true,
    "service_type": "type of service",
    "date": "mentioned date",
    "time": "mentioned time",
    "customer_name": "customer name",
    "phone": "phone number",
    "email": "email address",
    "notes": "any additional notes"
}}

If no booking details are mentioned, respond:
{{"has_booking": false}}"""
            
            messages_for_extraction = [
                {
                    "role": "system",
                    "content": "You are an expert at extracting structured information from conversations."
                },
                {
                    "role": "user",
                    "content": extraction_prompt
                }
            ]
            
            # Get extraction from OpenAI
            response = await self.get_completion(messages_for_extraction)
            
            # Try to parse JSON response
            try:
                booking_data = json.loads(response)
                
                if booking_data.get("has_booking"):
                    logger.info(f"✅ Booking details extracted")
                    return {
                        "success": True,
                        "booking_details": booking_data
                    }
                else:
                    return {
                        "success": True,
                        "booking_details": None
                    }
                    
            except json.JSONDecodeError:
                logger.warning("⚠️ Failed to parse booking details JSON")
                return {
                    "success": False,
                    "booking_details": None
                }
            
        except Exception as e:
            logger.error(f"❌ Error extracting booking details: {e}")
            return {
                "success": False,
                "booking_details": None
            }
    
    async def generate_response(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Generate a response based on prompt and context
        
        Args:
            prompt: Input prompt
            context: Additional context (optional)
            
        Returns:
            Generated response
        """
        try:
            if not self.client:
                return "AI service not configured"
            
            messages = [
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
            
            return await self.get_completion(messages)
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I apologize, but I'm unable to generate a response at this time."


# Create singleton instance
ai_agent_service = AIAgentService()