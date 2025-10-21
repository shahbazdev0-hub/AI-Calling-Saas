
# # services/openai.py
# import os
# import openai
# from typing import List, Dict, Optional
# import json


# class OpenAIService:
#     def __init__(self):
#         self.api_key = os.getenv("OPENAI_API_KEY")
#         self.model = os.getenv("OPENAI_MODEL", "gpt-4")
#         self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "500"))
#         openai.api_key = self.api_key

#     async def generate_response(
#         self,
#         messages: List[Dict[str, str]],
#         system_prompt: Optional[str] = None,
#         temperature: float = 0.7,
#         max_tokens: Optional[int] = None
#     ) -> Dict:
#         """Generate AI response using OpenAI"""
#         try:
#             conversation_messages = []
            
#             if system_prompt:
#                 conversation_messages.append({
#                     "role": "system",
#                     "content": system_prompt
#                 })
            
#             conversation_messages.extend(messages)
            
#             response = await openai.ChatCompletion.acreate(
#                 model=self.model,
#                 messages=conversation_messages,
#                 temperature=temperature,
#                 max_tokens=max_tokens or self.max_tokens
#             )
            
#             return {
#                 "success": True,
#                 "response": response.choices[0].message.content,
#                 "usage": {
#                     "prompt_tokens": response.usage.prompt_tokens,
#                     "completion_tokens": response.usage.completion_tokens,
#                     "total_tokens": response.usage.total_tokens
#                 }
#             }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def analyze_sentiment(self, text: str) -> Dict:
#         """Analyze sentiment of conversation"""
#         try:
#             prompt = f"""Analyze the sentiment of the following text and provide:
# 1. Overall sentiment (positive, neutral, or negative)
# 2. Confidence score (0-1)
# 3. Key emotions detected

# Text: {text}

# Respond in JSON format."""

#             response = await openai.ChatCompletion.acreate(
#                 model=self.model,
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You are a sentiment analysis expert. Always respond in valid JSON format."
#                     },
#                     {
#                         "role": "user",
#                         "content": prompt
#                     }
#                 ],
#                 temperature=0.3,
#                 max_tokens=200
#             )
            
#             result = json.loads(response.choices[0].message.content)
#             return {
#                 "success": True,
#                 "sentiment": result
#             }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def generate_summary(self, transcript: str) -> Dict:
#         """Generate call summary from transcript"""
#         try:
#             prompt = f"""Summarize the following call transcript in 2-3 sentences, highlighting:
# 1. Main purpose of the call
# 2. Key discussion points
# 3. Outcome or next steps

# Transcript: {transcript}"""

#             response = await openai.ChatCompletion.acreate(
#                 model=self.model,
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You are an expert at summarizing phone conversations concisely."
#                     },
#                     {
#                         "role": "user",
#                         "content": prompt
#                     }
#                 ],
#                 temperature=0.5,
#                 max_tokens=200
#             )
            
#             return {
#                 "success": True,
#                 "summary": response.choices[0].message.content
#             }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def extract_keywords(self, text: str) -> Dict:
#         """Extract key topics and keywords from text"""
#         try:
#             prompt = f"""Extract the 5-7 most important keywords or topics from this text.
# Return only a JSON array of strings.

# Text: {text}"""

#             response = await openai.ChatCompletion.acreate(
#                 model=self.model,
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You are a keyword extraction expert. Always respond with a valid JSON array."
#                     },
#                     {
#                         "role": "user",
#                         "content": prompt
#                     }
#                 ],
#                 temperature=0.3,
#                 max_tokens=100
#             )
            
#             keywords = json.loads(response.choices[0].message.content)
#             return {
#                 "success": True,
#                 "keywords": keywords
#             }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def determine_call_outcome(self, transcript: str) -> Dict:
#         """Determine the outcome of a call"""
#         try:
#             prompt = f"""Based on this call transcript, determine the outcome:
# - successful: Call achieved its objective
# - needs_followup: Requires additional action
# - no_answer: No meaningful conversation
# - unsuccessful: Did not achieve objective

# Transcript: {transcript}

# Respond with just one word: successful, needs_followup, no_answer, or unsuccessful"""

#             response = await openai.ChatCompletion.acreate(
#                 model=self.model,
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You are a call outcome analyzer."
#                     },
#                     {
#                         "role": "user",
#                         "content": prompt
#                     }
#                 ],
#                 temperature=0.2,
#                 max_tokens=10
#             )
            
#             return {
#                 "success": True,
#                 "outcome": response.choices[0].message.content.strip().lower()
#             }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }


# # Create singleton instance
# openai_service = OpenAIService()



# services/openai.py
import os
from openai import AsyncOpenAI
from typing import List, Dict, Optional
import json
import logging

logger = logging.getLogger(__name__)


class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "500"))
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> Dict:
        """Generate AI response using OpenAI"""
        try:
            conversation_messages = []
            
            if system_prompt:
                conversation_messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            conversation_messages.extend(messages)
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=conversation_messages,
                temperature=temperature,
                max_tokens=max_tokens or self.max_tokens
            )
            
            return {
                "success": True,
                "response": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        except Exception as e:
            logger.error(f"OpenAI generate_response error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of conversation"""
        try:
            prompt = f"""Analyze the sentiment of the following text and provide:
1. Overall sentiment (positive, neutral, or negative)
2. Confidence score (0-1)
3. Key emotions detected

Text: {text}

Respond in JSON format."""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a sentiment analysis expert. Always respond in valid JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            result = json.loads(response.choices[0].message.content)
            return {
                "success": True,
                "sentiment": result
            }
        except Exception as e:
            logger.error(f"Sentiment analysis error: {e}")
            return {
                "success": False,
                "error": str(e),
                "sentiment": {"sentiment": "neutral", "confidence": 0.5, "emotions": []}
            }

    async def generate_summary(self, transcript: str) -> Dict:
        """Generate call summary from transcript"""
        try:
            prompt = f"""Summarize the following call transcript in 2-3 sentences, highlighting:
1. Main purpose of the call
2. Key discussion points
3. Outcome or next steps

Transcript: {transcript}"""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at summarizing phone conversations concisely."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=200
            )
            
            return {
                "success": True,
                "summary": response.choices[0].message.content
            }
        except Exception as e:
            logger.error(f"Summary generation error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def extract_keywords(self, text: str) -> Dict:
        """Extract key topics and keywords from text"""
        try:
            prompt = f"""Extract the 5-7 most important keywords or topics from this text.
Return only a JSON array of strings.

Text: {text}"""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a keyword extraction expert. Always respond with a valid JSON array."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=100
            )
            
            keywords = json.loads(response.choices[0].message.content)
            return {
                "success": True,
                "keywords": keywords
            }
        except Exception as e:
            logger.error(f"Keyword extraction error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def determine_call_outcome(self, transcript: str) -> Dict:
        """Determine the outcome of a call"""
        try:
            if not transcript or len(transcript.strip()) < 10:
                return {
                    "success": True,
                    "outcome": "no_answer"
                }
            
            prompt = f"""Based on this call transcript, determine the outcome:
- successful: Call achieved its objective
- needs_followup: Requires additional action
- no_answer: No meaningful conversation
- unsuccessful: Did not achieve objective

Transcript: {transcript}

Respond with just one word: successful, needs_followup, no_answer, or unsuccessful"""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a call outcome analyzer."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
                max_tokens=10
            )
            
            return {
                "success": True,
                "outcome": response.choices[0].message.content.strip().lower()
            }
        except Exception as e:
            logger.error(f"Outcome determination error: {e}")
            return {
                "success": True,
                "outcome": "unknown"
            }


# Create singleton instance
openai_service = OpenAIService()