# backend/app/services/elevenlabs.py - ✅ COMPLETE & FIXED

import os
import logging
import aiohttp
import aiofiles
from typing import Optional, Dict, List
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)


class ElevenLabsService:
    """
    ElevenLabs Text-to-Speech Service
    Supports dynamic voice_id per agent
    """
    
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.default_voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
        self.model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_turbo_v2_5")
        self.base_url = "https://api.elevenlabs.io/v1"
        
        # Create audio directory
        self.audio_dir = Path("static/audio/generated")
        self.audio_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info("🎵 ElevenLabs Service initialized")
        logger.info(f"   API Key: {'✅ Configured' if self.api_key else '❌ Not configured'}")
        logger.info(f"   Default Voice ID: {self.default_voice_id}")
        logger.info(f"   Model: {self.model_id}")

    def is_configured(self) -> bool:
        """Check if ElevenLabs is properly configured"""
        return bool(self.api_key)

    async def text_to_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        stability: float = 0.5,
        similarity_boost: float = 0.75,
        save_to_file: bool = False
    ) -> Dict:
        """
        Convert text to speech using ElevenLabs API
        
        Args:
            text: Text to convert
            voice_id: ElevenLabs voice ID (uses default if None)
            stability: Voice stability (0.0 - 1.0)
            similarity_boost: Voice similarity boost (0.0 - 1.0)
            save_to_file: Whether to save audio to file
            
        Returns:
            Dict with audio content or file path
        """
        try:
            if not self.is_configured():
                return {
                    "success": False,
                    "error": "ElevenLabs API key not configured"
                }
            
            # Use default voice if not provided
            voice_id = voice_id or self.default_voice_id
            
            url = f"{self.base_url}/text-to-speech/{voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            
            data = {
                "text": text,
                "model_id": self.model_id,
                "voice_settings": {
                    "stability": stability,
                    "similarity_boost": similarity_boost
                }
            }
            
            logger.info(f"🎤 Generating speech for: {text[:50]}...")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=data, headers=headers) as response:
                    if response.status == 200:
                        audio_content = await response.read()
                        
                        if save_to_file:
                            # Save to file
                            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
                            filename = f"speech_{timestamp}.mp3"
                            file_path = self.audio_dir / filename
                            
                            async with aiofiles.open(file_path, 'wb') as f:
                                await f.write(audio_content)
                            
                            logger.info(f"✅ Audio saved: {filename}")
                            
                            return {
                                "success": True,
                                "audio_url": f"/static/audio/generated/{filename}",
                                "file_path": str(file_path)
                            }
                        else:
                            return {
                                "success": True,
                                "audio": audio_content,
                                "content_type": "audio/mpeg"
                            }
                    else:
                        error_text = await response.text()
                        logger.error(f"❌ ElevenLabs API error: {error_text}")
                        return {
                            "success": False,
                            "error": f"ElevenLabs API error: {error_text}"
                        }
                        
        except Exception as e:
            logger.error(f"❌ Error in text_to_speech: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e)
            }

    async def get_available_voices(self) -> List[Dict]:
        """
        Get list of available voices from ElevenLabs API
        
        Returns:
            List of voice dictionaries with id, name, category
        """
        try:
            if not self.is_configured():
                logger.error("❌ ElevenLabs API key not configured")
                return []
            
            url = f"{self.base_url}/voices"
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            logger.info("🔍 Fetching available voices from ElevenLabs...")
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        voices = data.get("voices", [])
                        
                        # Format voices for frontend
                        formatted_voices = []
                        for voice in voices:
                            formatted_voices.append({
                                "voice_id": voice.get("voice_id"),
                                "name": voice.get("name"),
                                "category": voice.get("category", "premade"),
                                "description": voice.get("description", ""),
                                "labels": voice.get("labels", {}),
                                "preview_url": voice.get("preview_url")
                            })
                        
                        logger.info(f"✅ Retrieved {len(formatted_voices)} voices from ElevenLabs")
                        
                        return formatted_voices
                    else:
                        error_text = await response.text()
                        logger.error(f"❌ Failed to fetch voices: HTTP {response.status} - {error_text}")
                        return []
                        
        except Exception as e:
            logger.error(f"❌ Error fetching voices: {e}", exc_info=True)
            return []

    async def get_voice_settings(self, voice_id: str) -> Dict:
        """
        Get settings for a specific voice
        
        Args:
            voice_id: ElevenLabs voice ID
            
        Returns:
            Dict with voice settings
        """
        try:
            if not self.is_configured():
                return {
                    "success": False,
                    "error": "ElevenLabs API key not configured"
                }
            
            url = f"{self.base_url}/voices/{voice_id}/settings"
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        settings = await response.json()
                        return {
                            "success": True,
                            "settings": settings
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "success": False,
                            "error": f"Failed to get voice settings: {error_text}"
                        }
                        
        except Exception as e:
            logger.error(f"❌ Error getting voice settings: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def text_to_speech_for_call(
        self,
        text: str,
        voice_id: Optional[str] = None,
        stability: float = 0.5,
        similarity_boost: float = 0.75
    ) -> Optional[str]:
        """
        Generate speech for Twilio calls
        
        Args:
            text: Text to convert
            voice_id: Voice ID to use
            stability: Voice stability
            similarity_boost: Similarity boost
            
        Returns:
            Audio file URL or None
        """
        try:
            result = await self.text_to_speech(
                text=text,
                voice_id=voice_id,
                stability=stability,
                similarity_boost=similarity_boost,
                save_to_file=True
            )
            
            if result.get("success"):
                return result.get("audio_url")
            else:
                logger.error(f"❌ Failed to generate speech: {result.get('error')}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error in text_to_speech_for_call: {e}")
            return None


# ============================================
# SINGLETON INSTANCE
# ============================================

elevenlabs_service = ElevenLabsService()