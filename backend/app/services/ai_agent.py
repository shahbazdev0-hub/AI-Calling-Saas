# backend/app/services/ai_agent.py - COMPLETE VERSION WITH IMPROVED GREETINGS

import os
import json
import logging
import re
from typing import Optional, Dict, Any, List
from datetime import datetime
from openai import AsyncOpenAI
from bson import ObjectId

from app.database import get_database
from app.services.workflow_engine import workflow_engine

logger = logging.getLogger(__name__)


class AIAgentService:
    """AI Agent Service for handling conversational AI"""
    
    def __init__(self):
        """Initialize AI Agent Service - ⚡ OPTIMIZED"""
        self.api_key = os.getenv("OPENAI_API_KEY")
        # ⚡ OPTIMIZED: Read from .env (should be gpt-3.5-turbo)
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        # ⚡ OPTIMIZED: Read from .env (should be 150)
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "150"))
        
        if not self.api_key:
            logger.warning("⚠️ OpenAI API key not found")
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=self.api_key)
            logger.info(f"✅ OpenAI client initialized with model: {self.model}")
    
    def is_configured(self) -> bool:
        """Check if service is properly configured"""
        return self.client is not None
    
    async def get_greeting(self, agent_id: Optional[str] = None) -> str:
        """
        ✅ IMPROVED: Get greeting message with enhanced wording
        Always includes a clear follow-up question to prompt customer response
        """
        try:
            if agent_id:
                db = await get_database()
                agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
                
                if agent and agent.get("greeting_message"):
                    greeting = agent["greeting_message"]
                    logger.info(f"✅ Using custom greeting from agent {agent_id}")
                    
                    # ✅ IMPROVED: Ensure greeting ALWAYS ends with an engaging question
                    # Check if greeting already has a question mark
                    if "?" not in greeting:
                        # Add a warm, professional follow-up question
                        greeting = f"{greeting} What can I assist you with today?"
                    
                    return greeting
            
            # ✅ IMPROVED: Enhanced default greeting with better wording
            return "Hello and thank you for calling! I'm here to help you. What can I assist you with today?"
            
        except Exception as e:
            logger.error(f"Error getting greeting: {e}")
            # ✅ IMPROVED: Fallback greeting is also enhanced
            return "Hello and thank you for calling! I'm here to help you. What can I assist you with today?"
    
    async def process_user_input(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """Process user input and generate AI response"""
        try:
            logger.info(f"🤖 Processing user input for call {call_id}: '{user_input}'")
            
            # Check if agent has workflow configured
            if agent_config and agent_config.get("workflow_id"):
                use_workflow = await workflow_engine.should_use_workflow(agent_config)
                
                if use_workflow:
                    logger.info(f"📄 Using workflow for agent response")
                    return await self._process_with_workflow(
                        user_input=user_input,
                        call_id=call_id,
                        agent_config=agent_config
                    )
            
            # Fallback: Use standard AI processing
            logger.info(f"📄 Using standard AI processing (no workflow)")
            return await self._process_with_ai(
                user_input=user_input,
                call_id=call_id,
                agent_config=agent_config
            )
            
        except Exception as e:
            logger.error(f"❌ Error processing user input: {e}")
            return "I apologize, but I'm having trouble understanding. Could you please repeat that?"
    
    async def _process_with_workflow(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """Process user input using workflow engine"""
        try:
            logger.info(f"🔄 Processing with workflow engine for call {call_id}")
            
            # Execute workflow
            result = await workflow_engine.process_conversation_turn(
                workflow_id=str(agent_config["workflow_id"]),
                user_input=user_input,
                call_id=call_id,
                agent_config=agent_config
            )
            
            if result.get("success"):
                response = result.get("response", "")
                
                # Save workflow conversation to database
                db = await get_database()
                conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
                
                if conversation:
                    # Prepare metadata
                    metadata = {
                        "workflow_id": str(agent_config["workflow_id"]),
                        "node_id": result.get("node_id"),
                        "is_end": result.get("is_end", False)
                    }
                    
                    await db.conversations.update_one(
                        {"_id": conversation["_id"]},
                        {
                            "$push": {
                                "messages": {
                                    "$each": [
                                        {
                                            "role": "user",
                                            "content": user_input,
                                            "timestamp": datetime.utcnow(),
                                            "metadata": metadata
                                        },
                                        {
                                            "role": "assistant",
                                            "content": response,
                                            "timestamp": datetime.utcnow(),
                                            "metadata": metadata
                                        }
                                    ]
                                }
                            },
                            "$set": {"updated_at": datetime.utcnow()}
                        }
                    )
                    logger.info(f"💾 Workflow conversation saved for call {call_id}")
                
                logger.info(f"✅ Workflow response generated: {response[:50]}...")
                return response
            else:
                # Workflow failed, use AI fallback
                logger.warning(f"⚠️ Workflow execution failed: {result.get('error')}")
                return await self._process_with_ai(user_input, call_id, agent_config)
                
        except Exception as e:
            logger.error(f"❌ Error in workflow processing: {e}")
            import traceback
            traceback.print_exc()
            return await self._process_with_ai(user_input, call_id, agent_config)
    
    async def _process_with_ai(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """⚡ OPTIMIZED: Process user input using OpenAI (GPT-3.5-Turbo by default)"""
        try:
            if not self.client:
                logger.error("OpenAI client not initialized")
                return "I apologize, but I'm having technical difficulties. Please try again later."
            
            # Get conversation history
            db = await get_database()
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            # Build conversation context
            messages = []
            
            # Get system prompt from agent config
            system_prompt = None
            
            if agent_config and agent_config.get("_id"):
                # Fetch fresh agent data from database
                try:
                    fresh_agent = await db.voice_agents.find_one({"_id": agent_config["_id"]})
                    if fresh_agent and fresh_agent.get("system_prompt"):
                        system_prompt = fresh_agent["system_prompt"]
                        logger.info(f"✅ Using system prompt from agent")
                except Exception as e:
                    logger.error(f"❌ Error fetching fresh agent: {e}")
            
            # Fallback to default
            if not system_prompt:
                system_prompt = """You are a helpful AI assistant for a call center. 
Be professional, friendly, and concise in your responses (keep responses under 50 words). 
Help customers with their questions and needs. 

IMPORTANT CONVERSATION ENDING RULES:
1. After helping the customer, ALWAYS ask "Is there anything else I can help you with?" or similar
2. If customer says "no", "that's all", "nothing else", or similar - thank them and say goodbye
3. If customer asks another question or says "yes" - continue helping them
4. Always be polite and professional"""
            
            messages.append({
                "role": "system",
                "content": system_prompt
            })
            
            # Add conversation history (limit to last 10 messages)
            if conversation and conversation.get("messages"):
                for msg in conversation["messages"][-10:]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current user input
            messages.append({
                "role": "user",
                "content": user_input
            })
            
            logger.info(f"📨 Sending {len(messages)} messages to OpenAI ({self.model})")
            
            # ⚡ OPTIMIZED: Use GPT-3.5-Turbo with timeout
            response = await self.client.chat.completions.create(
                model=self.model,  # Will use gpt-3.5-turbo from .env
                messages=messages,
                max_tokens=self.max_tokens,  # Will use 150 from .env
                temperature=0.7,
                timeout=5.0  # ⚡ ADDED: Force fast response
            )
            
            ai_response = response.choices[0].message.content
            
            logger.info(f"✅ AI Response generated with {self.model}")
            
            # SAVE MESSAGES TO CONVERSATION
            if conversation:
                await db.conversations.update_one(
                    {"_id": conversation["_id"]},
                    {"$push": {
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
                logger.info(f"💾 OpenAI conversation saved for call {call_id}")
            
            return ai_response
            
        except Exception as e:
            logger.error(f"❌ Error in OpenAI processing: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm having trouble processing your request. Could you please try again?"
    
    async def should_end_conversation(self, ai_response: str, user_input: str = "") -> bool:
        """Determine if the conversation should end"""
        try:
            # Check user input for ending phrases
            user_ending_phrases = [
                "no", "nope", "nothing", "that's all", "that's it",
                "no thanks", "no thank you", "nothing else",
                "i'm good", "all good", "all set", "goodbye", "bye"
            ]
            
            user_lower = user_input.lower().strip()
            
            # If user input is very short and matches ending phrase
            if len(user_lower.split()) <= 4:
                for phrase in user_ending_phrases:
                    if phrase in user_lower:
                        logger.info(f"👋 User wants to end: '{user_input}'")
                        return True
            
            # Check AI response for goodbye phrases
            ending_phrases = [
                "goodbye",
                "have a great day",
                "thank you for calling",
                "talk to you later",
                "bye",
                "have a nice day",
                "have a wonderful day"
            ]
            
            response_lower = ai_response.lower()
            
            for phrase in ending_phrases:
                if phrase in response_lower:
                    logger.info(f"👋 Ending conversation - detected phrase: '{phrase}'")
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking if conversation should end: {e}")
            return False


# Create singleton instance
ai_agent_service = AIAgentService()



# backend/app/services/ai_agent.py - COMPLETE FIXED VERSION without script 

import os
import logging
from typing import Dict, List, Optional, Any
from openai import AsyncOpenAI
from datetime import datetime
from bson import ObjectId

from app.database import get_database

logger = logging.getLogger(__name__)


class AIAgentService:
    """
    AI Agent Service - Handles conversation processing
    🎯 PRIORITY: Use Campaign Builder workflow if configured, otherwise use OpenAI
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
    
    async def process_message(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        🎯 MAIN METHOD: Process user message
        PRIORITY ORDER:
        1. If workflow configured -> Use Campaign Builder script (STRICT)
        2. If no workflow -> Use OpenAI fallback
        """
        try:
            logger.info(f"🎤 Processing message for call: {call_id}")
            logger.info(f"📝 User input: {user_input}")
            
            # 🎯 CHECK IF AGENT HAS WORKFLOW CONFIGURED
            if agent_config and agent_config.get("workflow_id"):
                workflow_id = str(agent_config["workflow_id"])
                logger.info(f"📄 Agent has workflow configured: {workflow_id}")
                logger.info(f"✅ Using Campaign Builder script (STRICT MODE)")
                
                return await self._process_with_workflow(
                    user_input=user_input,
                    call_id=call_id,
                    agent_config=agent_config
                )
            else:
                # No workflow configured - use OpenAI fallback
                logger.info(f"🤖 No workflow configured, using AI fallback")
                return await self._process_with_ai(
                    user_input=user_input,
                    call_id=call_id,
                    agent_config=agent_config
                )
                
        except Exception as e:
            logger.error(f"❌ Error processing message: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I encountered an error. Could you please repeat that?"
    
    async def _process_with_workflow(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        🎯 Process using Campaign Builder workflow
        This ensures the voice agent follows the EXACT script from your workflow nodes
        """
        try:
            logger.info(f"📄 Processing with workflow engine for call {call_id}")
            
            # Import workflow engine (avoid circular imports)
            from app.services.workflow_engine import workflow_engine
            
            # Execute workflow step
            result = await workflow_engine.process_conversation_turn(
                workflow_id=str(agent_config["workflow_id"]),
                user_input=user_input,
                call_id=call_id,
                agent_config=agent_config
            )
            
            if result.get("success"):
                response = result.get("response", "")
                
                # Save workflow conversation to database
                db = await get_database()
                conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
                
                if conversation:
                    # Prepare metadata
                    metadata = {
                        "workflow_id": str(agent_config["workflow_id"]),
                        "node_id": result.get("node_id"),
                        "node_type": result.get("node_type"),
                        "is_end": result.get("is_end", False)
                    }
                    
                    # Save messages to conversation history
                    await db.conversations.update_one(
                        {"_id": conversation["_id"]},
                        {
                            "$push": {
                                "messages": {
                                    "$each": [
                                        {
                                            "role": "user",
                                            "content": user_input,
                                            "timestamp": datetime.utcnow(),
                                            "metadata": metadata
                                        },
                                        {
                                            "role": "assistant",
                                            "content": response,
                                            "timestamp": datetime.utcnow(),
                                            "metadata": metadata
                                        }
                                    ]
                                }
                            },
                            "$set": {"updated_at": datetime.utcnow()}
                        }
                    )
                    logger.info(f"💾 Workflow conversation saved for call {call_id}")
                
                logger.info(f"✅ Workflow response: {response[:100]}...")
                return response
            else:
                # Workflow failed, use AI fallback
                logger.warning(f"⚠️ Workflow execution failed: {result.get('error')}")
                return await self._process_with_ai(user_input, call_id, agent_config)
                
        except Exception as e:
            logger.error(f"❌ Error in workflow processing: {e}")
            import traceback
            traceback.print_exc()
            # Fallback to AI if workflow fails
            return await self._process_with_ai(user_input, call_id, agent_config)
    
    async def _process_with_ai(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        🤖 Process using OpenAI when no workflow is configured
        This is the fallback method
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
            
            # Get system prompt from agent config
            system_prompt = None
            
            if agent_config and agent_config.get("_id"):
                try:
                    fresh_agent = await db.voice_agents.find_one({"_id": agent_config["_id"]})
                    if fresh_agent and fresh_agent.get("system_prompt"):
                        system_prompt = fresh_agent["system_prompt"]
                        logger.info(f"✅ Using system prompt from agent")
                except Exception as e:
                    logger.error(f"❌ Error fetching agent: {e}")
            
            # Fallback system prompt
            if not system_prompt:
                system_prompt = """You are a helpful AI assistant for a call center. 
Be professional, friendly, and concise in your responses (keep responses under 50 words). 
Help customers with their questions and needs."""
            
            messages.append({"role": "system", "content": system_prompt})
            
            # Add conversation history
            if conversation and conversation.get("messages"):
                for msg in conversation["messages"][-10:]:  # Last 10 messages
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current user input
            messages.append({"role": "user", "content": user_input})
            
            # Call OpenAI
            logger.info(f"🤖 Calling OpenAI with {len(messages)} messages")
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Save conversation to database
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
            
            logger.info(f"✅ AI response: {ai_response[:100]}...")
            return ai_response
            
        except Exception as e:
            logger.error(f"❌ Error in AI processing: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm having trouble processing that. Could you please repeat?"
    
    async def get_greeting(self, agent_id: Optional[str] = None) -> str:
        """
        Get greeting message for voice agent
        🎯 If workflow configured, get greeting from workflow's first node
        Otherwise, use agent's greeting_message
        """
        try:
            if not agent_id:
                return "Hello! How can I help you today?"
            
            db = await get_database()
            agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
            
            if not agent:
                return "Hello! How can I help you today?"
            
            # 🎯 CHECK IF AGENT HAS WORKFLOW CONFIGURED
            if agent.get("workflow_id"):
                workflow_id = str(agent["workflow_id"])
                logger.info(f"📄 Agent has workflow, fetching greeting from workflow: {workflow_id}")
                
                # Import workflow engine (avoid circular imports)
                from app.services.workflow_engine import workflow_engine
                
                # Get workflow
                workflow = await workflow_engine.get_workflow(workflow_id)
                
                if workflow:
                    # Find start node (Begin/Welcome node)
                    start_node = await workflow_engine.find_start_node(workflow)
                    
                    if start_node:
                        # Get greeting message from start node
                        greeting = await workflow_engine._get_node_response(start_node)
                        logger.info(f"✅ Using workflow greeting: {greeting[:50]}...")
                        return greeting
            
            # Fallback to agent's greeting_message
            greeting = agent.get("greeting_message", "Hello! How can I help you today?")
            logger.info(f"✅ Using agent greeting: {greeting}")
            return greeting
            
        except Exception as e:
            logger.error(f"❌ Error getting greeting: {e}")
            return "Hello! How can I help you today?"
    
    # 🔧 FIXED: UNCOMMENTED should_end_conversation method
    async def should_end_conversation(self, ai_response: str, user_input: str = "") -> bool:
        """
        Determine if the conversation should end
        
        Checks both user input and AI response for ending phrases
        """
        try:
            # Check user input for ending phrases
            user_ending_phrases = [
                "no", "nope", "nothing", "that's all", "that's it",
                "no thanks", "no thank you", "nothing else",
                "i'm good", "all good", "all set", "goodbye", "bye"
            ]
            
            user_lower = user_input.lower().strip()
            
            # If user input is very short and matches ending phrase
            if len(user_lower.split()) <= 4:
                for phrase in user_ending_phrases:
                    if phrase in user_lower:
                        logger.info(f"👋 User wants to end: '{user_input}'")
                        return True
            
            # Check AI response for goodbye phrases
            ending_phrases = [
                "goodbye",
                "have a great day",
                "thank you for calling",
                "talk to you later",
                "bye",
                "have a nice day",
                "have a wonderful day"
            ]
            
            response_lower = ai_response.lower()
            
            for phrase in ending_phrases:
                if phrase in response_lower:
                    logger.info(f"👋 Ending conversation - detected phrase: '{phrase}'")
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking if conversation should end: {e}")
            return False
    
    async def detect_intent(self, user_input: str) -> Dict[str, Any]:
        """Detect user intent from input"""
        try:
            user_lower = user_input.lower()
            
            # Common intents
            intents = {
                "appointment": ["appointment", "book", "schedule", "reservation", "meeting"],
                "pricing": ["price", "cost", "how much", "pricing", "fee"],
                "support": ["help", "support", "problem", "issue", "question"],
                "goodbye": ["bye", "goodbye", "thank you", "thanks", "that's all"],
                "greeting": ["hello", "hi", "hey", "good morning", "good afternoon"]
            }
            
            detected_intents = []
            confidence = 0.0
            
            for intent, keywords in intents.items():
                if any(keyword in user_lower for keyword in keywords):
                    detected_intents.append(intent)
                    confidence = 0.8
            
            primary_intent = detected_intents[0] if detected_intents else "general_inquiry"
            
            return {
                "intent": primary_intent,
                "confidence": confidence,
                "all_intents": detected_intents
            }
            
        except Exception as e:
            logger.error(f"❌ Error detecting intent: {e}")
            return {
                "intent": "general_inquiry",
                "confidence": 0.5,
                "all_intents": []
            }


# Create singleton instance
ai_agent_service = AIAgentService()




