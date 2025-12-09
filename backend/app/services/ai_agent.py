#backend/app/services/ai_agent.py with email inbound orginal file without bulk calling 
import os
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from openai import AsyncOpenAI
from bson import ObjectId

from app.database import get_database
from app.services.workflow_engine import workflow_engine

logger = logging.getLogger(__name__)


class AIAgentService:
    """
    AI Agent Service - Handles conversation processing
    
    🎯 PRIORITY ORDER:
    1. If workflow configured → Use Campaign Builder (with hybrid mode)
    2. If no workflow → Use OpenAI only
    """
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", 150))
        
        if api_key:
            self.client = AsyncOpenAI(api_key=api_key)
            logger.info(f"✅ OpenAI client initialized with model: {self.model}")
        else:
            self.client = None
            logger.warning("⚠️ OpenAI API key not configured")
    
    def is_configured(self) -> bool:
        """Check if AI Agent Service is properly configured"""
        return self.client is not None
    
    async def get_greeting(self, agent_id: Optional[str] = None) -> str:
        """Get greeting message"""
        try:
            if agent_id:
                db = await get_database()
                agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
                
                if agent:
                    # Check if agent has workflow
                    if agent.get("workflow_id"):
                        try:
                            workflow = await workflow_engine.get_workflow(str(agent["workflow_id"]))
                            if workflow:
                                # Get greeting from start node
                                start_node = await workflow_engine.find_start_node(workflow)
                                if start_node:
                                    node_message = start_node.get("data", {}).get("message", "")
                                    if node_message:
                                        logger.info(f"✅ Using campaign greeting from workflow")
                                        return node_message
                        except Exception as e:
                            logger.error(f"⚠️ Error getting workflow greeting: {e}")
                    
                    # Use agent's custom greeting
                    if agent.get("greeting_message"):
                        greeting = agent["greeting_message"]
                        if "?" not in greeting:
                            greeting = f"{greeting} What can I assist you with today?"
                        return greeting
            
            # Default greeting
            return "Hello and thank you for calling! How can I help you today?"
            
        except Exception as e:
            logger.error(f"❌ Error getting greeting: {e}")
            return "Hello! How can I help you today?"

    async def get_greeting_message(self, agent: Optional[Dict[str, Any]] = None) -> str:
        """
        Get greeting message for agent
        This method is called from voice.py to get the initial greeting
        """
        try:
            logger.info(f"🎯 Getting greeting message for agent")
            
            # If agent has a workflow, try to get greeting from workflow
            if agent and agent.get("workflow_id"):
                try:
                    workflow = await workflow_engine.get_workflow(str(agent["workflow_id"]))
                    
                    if workflow:
                        start_node = await workflow_engine.find_start_node(workflow)
                        if start_node:
                            greeting = start_node.get("data", {}).get("message", "")
                            if greeting and greeting.strip():
                                logger.info(f"✅ Using workflow greeting: {greeting[:50]}...")
                                return greeting
                except Exception as e:
                    logger.error(f"⚠️ Error getting workflow greeting: {e}")
            
            # Use agent's custom greeting if available
            if agent and agent.get("greeting_message"):
                greeting = agent["greeting_message"]
                if greeting.strip():
                    logger.info(f"✅ Using agent greeting: {greeting[:50]}...")
                    return greeting
            
            # Use agent's system prompt as fallback
            if agent and agent.get("system_prompt"):
                system_prompt = agent["system_prompt"]
                # Extract a friendly greeting from system prompt
                if "hello" in system_prompt.lower() or "hi" in system_prompt.lower():
                    lines = system_prompt.split('\n')
                    for line in lines:
                        if any(word in line.lower() for word in ['hello', 'hi', 'welcome', 'greeting']):
                            if len(line.strip()) > 10:  # Ensure it's substantial
                                logger.info(f"✅ Using system prompt greeting: {line[:50]}...")
                                return line.strip()
            
            # Default greeting
            default_greeting = "Hello! Thank you for calling. How can I assist you today?"
            logger.info(f"✅ Using default greeting")
            return default_greeting
            
        except Exception as e:
            logger.error(f"❌ Error in get_greeting_message: {e}")
            return "Hello! How can I help you today?"
    
    async def process_message(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        🎯 MAIN METHOD: Process user message
        
        IMPLEMENTS YOUR EXACT LOGIC:
        IF agent has workflow_id AND workflow exists:
            result = PROCESS_WITH_CAMPAIGN(user_input)
            IF result.found_in_campaign:
                RETURN campaign_response
            ELSE:
                RETURN openai_response
        ELSE:
            RETURN openai_response
        """
        try:
            logger.info(f"🎤 Processing message for call: {call_id}")
            logger.info(f"📝 User input: {user_input}")
            
            # ✅ CHECK IF AGENT HAS WORKFLOW CONFIGURED
            if agent_config and agent_config.get("workflow_id"):
                workflow_id = str(agent_config["workflow_id"])
                logger.info(f"🎯 Agent has workflow: {workflow_id}")
                logger.info(f"✅ Using Campaign Builder with Hybrid Mode")
                
                # Process with workflow (includes hybrid mode)
                result = await workflow_engine.process_conversation_turn(
                    workflow_id=workflow_id,
                    user_input=user_input,
                    call_id=call_id,
                    agent_config=agent_config
                )
                
                if result.get("success"):
                    response = result.get("response", "")
                    
                    # ✅ FIXED: Don't override with OpenAI if we have a campaign response
                    if result.get("found_in_campaign"):
                        logger.info(f"✅ Campaign response used: {response[:50]}...")
                        return response
                    else:
                        # Only use OpenAI if no campaign match found
                        logger.info(f"🤖 No campaign match, using OpenAI: {response[:50]}...")
                        return response
                else:
                    # Workflow failed, use OpenAI fallback
                    logger.warning(f"⚠️ Workflow execution failed: {result.get('error')}")
                    return await self._process_with_openai(user_input, call_id, agent_config)
            else:
                # No workflow configured - use OpenAI only
                logger.info(f"🤖 No workflow configured, using OpenAI only")
                return await self._process_with_openai(user_input, call_id, agent_config)
                
        except Exception as e:
            logger.error(f"❌ Error processing message: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm having trouble understanding. Could you please repeat that?"
    
    async def _process_with_openai(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        🤖 Process using OpenAI when no workflow is configured
        """
        try:
            if not self.client:
                logger.error("❌ OpenAI client not initialized")
                return "I apologize, but I'm having technical difficulties. Please try again later."
            
            logger.info(f"🤖 Processing with OpenAI for call: {call_id}")
            
            # Get conversation history
            db = await get_database()
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            # Build conversation context
            messages = []
            
            # System prompt
            system_prompt = """You are a helpful AI assistant for a call center.
Be professional, friendly, and concise in your responses (keep responses under 50 words).
Help customers with their questions and needs."""
            
            if agent_config and agent_config.get("system_prompt"):
                system_prompt = agent_config["system_prompt"]
            
            messages.append({"role": "system", "content": system_prompt})
            
            # Add conversation history
            if conversation and conversation.get("messages"):
                for msg in conversation["messages"][-8:]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current input
            messages.append({"role": "user", "content": user_input})
            
            # Call OpenAI
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=0.7,
                timeout=10.0
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Save to conversation
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
            
            logger.info(f"✅ OpenAI response: {ai_response[:100]}...")
            return ai_response
            
        except Exception as e:
            logger.error(f"❌ Error in OpenAI processing: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I encountered an error. Could you please repeat that?"


# Create singleton instance
ai_agent_service = AIAgentService()