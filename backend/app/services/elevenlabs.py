# services/elevenlabs.py
import os
import requests
import aiohttp
from typing import Optional, Dict


class ElevenLabsService:
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.voice_id = os.getenv("ELEVENLABS_VOICE_ID")
        self.model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_monolingual_v1")
        self.base_url = "https://api.elevenlabs.io/v1"
        self.headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }

    async def text_to_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        stability: float = 0.5,
        similarity_boost: float = 0.75
    ) -> Dict:
        """Convert text to speech using ElevenLabs"""
        try:
            url = f"{self.base_url}/text-to-speech/{voice_id or self.voice_id}"
            
            data = {
                "text": text,
                "model_id": self.model_id,
                "voice_settings": {
                    "stability": stability,
                    "similarity_boost": similarity_boost
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=data, headers=self.headers) as response:
                    if response.status == 200:
                        audio_content = await response.read()
                        return {
                            "success": True,
                            "audio": audio_content,
                            "content_type": "audio/mpeg"
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "success": False,
                            "error": f"ElevenLabs API error: {error_text}"
                        }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

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
                        return {
                            "success": True,
                            "voices": data.get("voices", [])
                        }
                    else:
                        return {
                            "success": False,
                            "error": "Failed to fetch voices"
                        }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

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

    def get_audio_stream_url(self, voice_id: str, text: str) -> str:
        """Get streaming URL for real-time audio"""
        return f"{self.base_url}/text-to-speech/{voice_id}/stream"


# Create singleton instance
elevenlabs_service = ElevenLabsService()