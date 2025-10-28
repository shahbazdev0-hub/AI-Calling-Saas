# # services/elevenlabs.py without campaign builder 
# import os
# import requests
# import aiohttp
# from typing import Optional, Dict


# class ElevenLabsService:
#     def __init__(self):
#         self.api_key = os.getenv("ELEVENLABS_API_KEY")
#         self.voice_id = os.getenv("ELEVENLABS_VOICE_ID")
#         self.model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_monolingual_v1")
#         self.base_url = "https://api.elevenlabs.io/v1"
#         self.headers = {
#             "Accept": "audio/mpeg",
#             "Content-Type": "application/json",
#             "xi-api-key": self.api_key
#         }

#     async def text_to_speech(
#         self,
#         text: str,
#         voice_id: Optional[str] = None,
#         stability: float = 0.5,
#         similarity_boost: float = 0.75
#     ) -> Dict:
#         """Convert text to speech using ElevenLabs"""
#         try:
#             url = f"{self.base_url}/text-to-speech/{voice_id or self.voice_id}"
            
#             data = {
#                 "text": text,
#                 "model_id": self.model_id,
#                 "voice_settings": {
#                     "stability": stability,
#                     "similarity_boost": similarity_boost
#                 }
#             }
            
#             async with aiohttp.ClientSession() as session:
#                 async with session.post(url, json=data, headers=self.headers) as response:
#                     if response.status == 200:
#                         audio_content = await response.read()
#                         return {
#                             "success": True,
#                             "audio": audio_content,
#                             "content_type": "audio/mpeg"
#                         }
#                     else:
#                         error_text = await response.text()
#                         return {
#                             "success": False,
#                             "error": f"ElevenLabs API error: {error_text}"
#                         }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def get_available_voices(self) -> Dict:
#         """Get list of available voices from ElevenLabs"""
#         try:
#             url = f"{self.base_url}/voices"
#             headers = {
#                 "Accept": "application/json",
#                 "xi-api-key": self.api_key
#             }
            
#             async with aiohttp.ClientSession() as session:
#                 async with session.get(url, headers=headers) as response:
#                     if response.status == 200:
#                         data = await response.json()
#                         return {
#                             "success": True,
#                             "voices": data.get("voices", [])
#                         }
#                     else:
#                         return {
#                             "success": False,
#                             "error": "Failed to fetch voices"
#                         }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def get_voice_settings(self, voice_id: str) -> Dict:
#         """Get voice settings for a specific voice"""
#         try:
#             url = f"{self.base_url}/voices/{voice_id}/settings"
#             headers = {
#                 "Accept": "application/json",
#                 "xi-api-key": self.api_key
#             }
            
#             async with aiohttp.ClientSession() as session:
#                 async with session.get(url, headers=headers) as response:
#                     if response.status == 200:
#                         data = await response.json()
#                         return {
#                             "success": True,
#                             "settings": data
#                         }
#                     else:
#                         return {
#                             "success": False,
#                             "error": "Failed to fetch voice settings"
#                         }
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     def get_audio_stream_url(self, voice_id: str, text: str) -> str:
#         """Get streaming URL for real-time audio"""
#         return f"{self.base_url}/text-to-speech/{voice_id}/stream"


# # Create singleton instance
# elevenlabs_service = ElevenLabsService() 



# backend/app/services/elevenlabs.py  implemented campaign builder

import os
import aiohttp
import aiofiles
import uuid
from typing import Optional, Dict
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class ElevenLabsService:
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.voice_id = os.getenv("ELEVENLABS_VOICE_ID")
        self.model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_monolingual_v1")
        self.base_url = "https://api.elevenlabs.io/v1"
        
        # Create audio storage directory
        self.audio_dir = Path("backend/static/audio")
        self.audio_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"âœ… ElevenLabs service initialized. Audio dir: {self.audio_dir}")

    async def text_to_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        stability: float = 0.5,
        similarity_boost: float = 0.75,
        save_to_file: bool = False
    ) -> Dict:
        """
        Convert text to speech using ElevenLabs
        
        Args:
            text: Text to convert
            voice_id: ElevenLabs voice ID
            stability: Voice stability (0-1)
            similarity_boost: Similarity boost (0-1)
            save_to_file: Whether to save audio to file and return URL
            
        Returns:
            Dict with success status and audio data/URL
        """
        try:
            url = f"{self.base_url}/text-to-speech/{voice_id or self.voice_id}"
            
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
            
            logger.info(f"ðŸŽ™ï¸ Generating speech with ElevenLabs voice: {voice_id or self.voice_id}")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=data, headers=headers) as response:
                    if response.status == 200:
                        audio_content = await response.read()
                        
                        if save_to_file:
                            # Generate unique filename
                            filename = f"{uuid.uuid4()}.mp3"
                            filepath = self.audio_dir / filename
                            
                            # Save audio file
                            async with aiofiles.open(filepath, 'wb') as f:
                                await f.write(audio_content)
                            
                            # Get public URL (adjust based on your deployment)
                            audio_url = f"/static/audio/{filename}"
                            
                            logger.info(f"âœ… Audio saved to: {filepath}")
                            
                            return {
                                "success": True,
                                "audio_url": audio_url,
                                "audio_path": str(filepath),
                                "content_type": "audio/mpeg"
                            }
                        else:
                            return {
                                "success": True,
                                "audio": audio_content,
                                "content_type": "audio/mpeg"
                            }
                    else:
                        error_text = await response.text()
                        logger.error(f"âŒ ElevenLabs API error: {error_text}")
                        return {
                            "success": False,
                            "error": f"ElevenLabs API error: {error_text}"
                        }
        except Exception as e:
            logger.error(f"âŒ Error in text_to_speech: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def text_to_speech_for_call(
        self,
        text: str,
        voice_id: str,
        stability: float = 0.5,
        similarity_boost: float = 0.75
    ) -> Optional[str]:
        """
        Generate speech specifically for Twilio calls (saves to file and returns URL)
        
        Args:
            text: Text to convert
            voice_id: ElevenLabs voice ID
            stability: Voice stability
            similarity_boost: Similarity boost
            
        Returns:
            Public URL of audio file or None if failed
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
                logger.error(f"âŒ Failed to generate speech: {result.get('error')}")
                return None
                
        except Exception as e:
            logger.error(f"âŒ Error in text_to_speech_for_call: {e}")
            return None

    async def get_available_voices(self) -> Dict:
        """Get list of available voices from ElevenLabs"""
        try:
            url = f"{self.base_url}/voices"
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        voices = data.get("voices", [])
                        
                        logger.info(f"âœ… Retrieved {len(voices)} voices from ElevenLabs")
                        
                        return {
                            "success": True,
                            "voices": voices
                        }
                    else:
                        error_text = await response.text()
                        logger.error(f"âŒ Failed to fetch voices: {error_text}")
                        return {
                            "success": False,
                            "error": "Failed to fetch voices"
                        }
        except Exception as e:
            logger.error(f"âŒ Error fetching voices: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def test_voice(
        self,
        text: str,
        voice_id: str
    ) -> Dict:
        """Test a voice with sample text"""
        return await self.text_to_speech(
            text=text,
            voice_id=voice_id,
            save_to_file=True
        )

    async def get_voice_settings(self, voice_id: str) -> Dict:
        """Get voice settings for a specific voice"""
        try:
            url = f"{self.base_url}/voices/{voice_id}/settings"
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "success": True,
                            "settings": data
                        }
                    else:
                        return {
                            "success": False,
                            "error": "Failed to fetch voice settings"
                        }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def cleanup_old_audio_files(self, max_age_hours: int = 24):
        """
        Clean up old audio files (optional - run periodically)
        
        Args:
            max_age_hours: Delete files older than this many hours
        """
        try:
            import time
            current_time = time.time()
            deleted_count = 0
            
            for audio_file in self.audio_dir.glob("*.mp3"):
                file_age = current_time - audio_file.stat().st_mtime
                if file_age > (max_age_hours * 3600):
                    audio_file.unlink()
                    deleted_count += 1
            
            if deleted_count > 0:
                logger.info(f"ðŸ—‘ï¸ Cleaned up {deleted_count} old audio files")
                
        except Exception as e:
            logger.error(f"âŒ Error cleaning up audio files: {e}")


# Create singleton instance
elevenlabs_service = ElevenLabsService()