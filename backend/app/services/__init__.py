# # backend/app/services/__init__.py - UPDATED

# """
# Services Package
# """

# from .email import email_service
# from .auth import auth_service
# from .twilio import twilio_service
# from .ai_agent import ai_agent_service
# from .elevenlabs import elevenlabs_service
# from .call_handler import CallHandlerService, get_call_handler
# from .google_calendar import google_calendar_service
# from .appointment import appointment_service
# from .workflow_engine import workflow_engine  # ✅ NEW

# __all__ = [
#     "email_service",
#     "auth_service", 
#     "twilio_service",
#     "ai_agent_service",
#     "elevenlabs_service",
#     "CallHandlerService",
#     "get_call_handler",
#     "google_calendar_service",
#     "appointment_service",
#     "workflow_engine",  # ✅ NEW
# ]


# backend/app/services/__init__.py - UPDATED

"""
Services Package
"""

from .email import email_service
from .auth import auth_service
from .twilio import twilio_service
from .ai_agent import ai_agent_service
from .elevenlabs import elevenlabs_service
from .call_handler import CallHandlerService, get_call_handler
from .google_calendar import google_calendar_service
from .appointment import appointment_service
from .workflow_engine import workflow_engine
from .customer import customer_service  # ✅ NEW

__all__ = [
    "email_service",
    "auth_service", 
    "twilio_service",
    "ai_agent_service",
    "elevenlabs_service",
    "CallHandlerService",
    "get_call_handler",
    "google_calendar_service",
    "appointment_service",
    "workflow_engine",
    "customer_service",  # ✅ NEW
]