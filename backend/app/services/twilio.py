# # backend/app/services/twilio.py without campaign builder workflow 

# import os
# from twilio.rest import Client
# from twilio.twiml.voice_response import VoiceResponse, Gather
# from typing import Optional


# class TwilioService:
#     def __init__(self):
#         """Initialize Twilio service and load credentials"""
#         self._is_configured = False
#         self._reload_credentials()
    
#     def _reload_credentials(self):
#         """Reload Twilio credentials from environment variables"""
#         self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
#         self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
#         self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
#         self.webhook_url = os.getenv("TWILIO_WEBHOOK_URL")
        
#         # Debug print
#         print()
#         print("=" * 60)
#         print("🔑 TWILIO SERVICE - Loading Credentials:")
#         print("=" * 60)
#         print(f"   Account SID: {self.account_sid}")
#         print(f"   Phone Number: {self.phone_number}")
#         print(f"   Webhook URL: {self.webhook_url}")
#         print("=" * 60)
#         print()
        
#         if not self.account_sid or not self.auth_token:
#             self._is_configured = False
#             print("⚠️ Twilio credentials not configured")
#             return
        
#         self.client = Client(self.account_sid, self.auth_token)
#         self._is_configured = True
    
#     def is_configured(self) -> bool:
#         """Check if Twilio is properly configured"""
#         return self._is_configured

#     def make_call(
#         self,
#         to_number: str,
#         from_number: Optional[str] = None,
#         webhook_url: Optional[str] = None
#     ):
#         """Initiate an outbound call via Twilio"""
#         try:
#             self._reload_credentials()
            
#             base_webhook_url = self.webhook_url.replace('/incoming', '') if '/incoming' in self.webhook_url else self.webhook_url
#             outbound_webhook_url = f"{base_webhook_url}/incoming"
            
#             print()
#             print("📞 INITIATING TWILIO CALL:")
#             print(f"   To: {to_number}")
#             print(f"   From: {from_number or self.phone_number}")
#             print(f"   Webhook: {outbound_webhook_url}")
#             print(f"   Status Callback: {base_webhook_url}/status")
#             print()
            
#             call = self.client.calls.create(
#                 to=to_number,
#                 from_=from_number or self.phone_number,
#                 url=outbound_webhook_url,
#                 status_callback=f"{base_webhook_url}/status",
#                 status_callback_event=["initiated", "ringing", "answered", "completed"],
#                 status_callback_method="POST",
#                 record=True
#             )
            
#             print(f"✅ Call initiated successfully!")
#             print(f"   Call SID: {call.sid}")
#             print(f"   Status: {call.status}")
#             print()
            
#             return {
#                 "success": True,
#                 "call_sid": call.sid,
#                 "status": call.status
#             }
            
#         except Exception as e:
#             print(f"❌ TWILIO ERROR: {str(e)}")
#             print()
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     def generate_twiml_response(
#         self,
#         message: str,
#         voice: str = "Polly.Joanna",
#         gather_input: bool = False,
#         gather_timeout: int = 5
#     ) -> str:
#         """Generate TwiML response"""
#         response = VoiceResponse()
        
#         if gather_input:
#             gather = Gather(
#                 input='speech',
#                 timeout=gather_timeout,
#                 action=f"{self.webhook_url}/process-speech",
#                 speechTimeout="auto",
#                 language="en-US"
#             )
#             gather.say(message, voice=voice)
#             response.append(gather)
#         else:
#             response.say(message, voice=voice)
        
#         return str(response)

#     def get_call_details(self, call_sid: str):
#         """Fetch call details from Twilio"""
#         try:
#             call = self.client.calls(call_sid).fetch()
#             return {
#                 "success": True,
#                 "call": {
#                     "sid": call.sid,
#                     "from": call.from_,
#                     "to": call.to,
#                     "status": call.status,
#                     "duration": call.duration,
#                     "price": call.price,
#                 }
#             }
#         except Exception as e:
#             print(f"❌ Error fetching call details: {str(e)}")
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     def hangup_call(self, call_sid: str):
#         """Hangup an active call"""
#         try:
#             call = self.client.calls(call_sid).update(status="completed")
#             return {
#                 "success": True,
#                 "status": call.status
#             }
#         except Exception as e:
#             print(f"❌ Error hanging up call: {str(e)}")
#             return {
#                 "success": False,
#                 "error": str(e)
#             }


# # Create singleton instance
# twilio_service = TwilioService()




# backend/app/services/twilio.py - COMPLETE FIXED VERSION with campaign builder ai 

import os
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from typing import Optional


class TwilioService:
    def __init__(self):
        """Initialize Twilio service and load credentials"""
        self._is_configured = False
        self._reload_credentials()
    
    def _reload_credentials(self):
        """Reload Twilio credentials from environment variables"""
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        self.webhook_url = os.getenv("TWILIO_WEBHOOK_URL")
        
        # Debug print
        print()
        print("=" * 60)
        print("🔑 TWILIO SERVICE - Loading Credentials:")
        print("=" * 60)
        print(f"   Account SID: {self.account_sid}")
        print(f"   Phone Number: {self.phone_number}")
        print(f"   Webhook URL: {self.webhook_url}")
        print("=" * 60)
        print()
        
        if not self.account_sid or not self.auth_token:
            self._is_configured = False
            print("⚠️ Twilio credentials not configured")
            return
        
        self.client = Client(self.account_sid, self.auth_token)
        self._is_configured = True
    
    def is_configured(self) -> bool:
        """Check if Twilio is properly configured"""
        return self._is_configured

    def make_call(
        self,
        to_number: str,
        from_number: Optional[str] = None,
        webhook_url: Optional[str] = None
    ):
        """Initiate an outbound call via Twilio"""
        try:
            self._reload_credentials()
            
            # Extract base URL without /incoming
            base_webhook_url = self.webhook_url.replace('/incoming', '') if '/incoming' in self.webhook_url else self.webhook_url
            outbound_webhook_url = f"{base_webhook_url}/incoming"
            
            # ✅ FIXED: Correct status callback URL to match FastAPI route
            status_callback_url = f"{base_webhook_url}/call-status"
            
            print()
            print("📞 INITIATING TWILIO CALL:")
            print(f"   To: {to_number}")
            print(f"   From: {from_number or self.phone_number}")
            print(f"   Webhook: {outbound_webhook_url}")
            print(f"   Status Callback: {status_callback_url}")
            print()
            
            call = self.client.calls.create(
                to=to_number,
                from_=from_number or self.phone_number,
                url=outbound_webhook_url,
                status_callback=status_callback_url,  # ✅ FIXED
                status_callback_event=["initiated", "ringing", "answered", "completed"],
                status_callback_method="POST",
                record=True
            )
            
            print(f"✅ Call initiated successfully!")
            print(f"   Call SID: {call.sid}")
            print(f"   Status: {call.status}")
            print()
            
            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status
            }
            
        except Exception as e:
            print(f"❌ TWILIO ERROR: {str(e)}")
            print()
            return {
                "success": False,
                "error": str(e)
            }

    def generate_twiml_response(
        self,
        message: str,
        voice: str = "Polly.Joanna",
        gather_input: bool = False,
        gather_timeout: int = 5
    ) -> str:
        """Generate TwiML response"""
        response = VoiceResponse()
        
        if gather_input:
            gather = Gather(
                input='speech',
                timeout=gather_timeout,
                action=f"{self.webhook_url}/process-speech",
                speechTimeout="auto",
                language="en-US"
            )
            gather.say(message, voice=voice)
            response.append(gather)
        else:
            response.say(message, voice=voice)
        
        return str(response)

    def get_call_details(self, call_sid: str):
        """Fetch call details from Twilio"""
        try:
            call = self.client.calls(call_sid).fetch()
            return {
                "success": True,
                "call": {
                    "sid": call.sid,
                    "from": call.from_,
                    "to": call.to,
                    "status": call.status,
                    "duration": call.duration,
                    "price": call.price,
                }
            }
        except Exception as e:
            print(f"❌ Error fetching call details: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def hangup_call(self, call_sid: str):
        """Hangup an active call"""
        try:
            call = self.client.calls(call_sid).update(status="completed")
            return {
                "success": True,
                "status": call.status
            }
        except Exception as e:
            print(f"❌ Error hanging up call: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


# Create singleton instance
twilio_service = TwilioService()