# # backend/app/main.py - COMPLETE VERSION WITH SMS CHAT FEATURE

# # ============================================
# # FORCE LOAD ENVIRONMENT VARIABLES FIRST
# # ============================================
# from dotenv import load_dotenv
# import os

# # Load .env file with override to ensure fresh values
# load_dotenv(override=True)

# # ============================================
# # NOW IMPORT FASTAPI AND OTHER MODULES
# # ============================================
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from contextlib import asynccontextmanager
# from pathlib import Path
# from datetime import datetime

# from app.config import settings
# from app.database import connect_to_mongo, close_mongo_connection

# # Milestone 1 imports
# from app.api.v1 import auth, users, admin, demo

# # Milestone 2 imports
# from app.api.v1 import calls, agents, conversations, analytics
# from app.api.v1.voice import router as voice_router

# # Milestone 3 imports
# from app.api.v1 import sms, email, automation, workflows
# from app.api.v1.flows import router as flows_router

# # Appointments import
# from app.api.v1 import appointments

# # ✅ SMS & Email Logs imports
# from app.api.v1 import sms_logs, email_logs

# # ✅ NEW - SMS Chat import
# from app.api.v1 import sms_chat


# import logging

# logger = logging.getLogger(__name__)


# # ============================================
# # LIFESPAN CONTEXT MANAGER
# # ============================================
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """Manage application lifespan"""
#     # Startup
#     logger.info("🚀 Starting CallCenter SaaS API...")
#     logger.info("📊 Connecting to MongoDB...")
#     await connect_to_mongo()
#     logger.info("✅ MongoDB connected successfully!")
    
#     # Create static audio directory for ElevenLabs voice files
#     audio_dir = Path("backend/static/audio")
#     audio_dir.mkdir(parents=True, exist_ok=True)
#     logger.info(f"📁 Audio directory ready: {audio_dir}")
    
#     yield
    
#     # Shutdown
#     logger.info("🛑 Shutting down CallCenter SaaS API...")
#     logger.info("📊 Closing MongoDB connection...")
#     await close_mongo_connection()
#     logger.info("✅ Cleanup completed!")


# # ============================================
# # CREATE FASTAPI APP
# # ============================================
# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     version=settings.VERSION,
#     description="AI-Powered Call Center SaaS Platform with Appointment Booking & SMS Chat",
#     lifespan=lifespan,
#     docs_url="/docs",
#     redoc_url="/redoc"
# )


# # ============================================
# # CORS MIDDLEWARE
# # ============================================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify exact origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ============================================
# # STATIC FILES (For ElevenLabs audio)
# # ============================================
# static_audio_path = Path("backend/static/audio")
# static_audio_path.mkdir(parents=True, exist_ok=True)

# app.mount(
#     "/static",
#     StaticFiles(directory="backend/static"),
#     name="static"
# )


# # ============================================
# # INCLUDE ROUTERS - MILESTONE 1
# # ============================================
# app.include_router(
#     auth.router,
#     prefix="/api/v1/auth",
#     tags=["Authentication"]
# )

# app.include_router(
#     users.router,
#     prefix="/api/v1/users",
#     tags=["Users"]
# )

# app.include_router(
#     admin.router,
#     prefix="/api/v1/admin",
#     tags=["Admin"]
# )

# app.include_router(
#     demo.router,
#     prefix="/api/v1/demo",
#     tags=["Demo Bookings"]
# )


# # ============================================
# # INCLUDE ROUTERS - MILESTONE 2
# # ============================================
# app.include_router(
#     voice_router,
#     prefix="/api/v1/voice",
#     tags=["Voice & AI Agents"]
# )

# app.include_router(
#     calls.router,
#     prefix="/api/v1/calls",
#     tags=["Calls"]
# )

# app.include_router(
#     agents.router,
#     prefix="/api/v1/agents", 
#     tags=["AI Agents"]
# )

# app.include_router(
#     conversations.router, 
#     prefix="/api/v1/conversations", 
#     tags=["Conversations"]
# )

# app.include_router(
#     analytics.router, 
#     prefix="/api/v1/analytics", 
#     tags=["Analytics"]
# )


# # ============================================
# # INCLUDE ROUTERS - MILESTONE 3
# # ============================================
# app.include_router(
#     sms.router, 
#     prefix="/api/v1/sms", 
#     tags=["SMS"]
# )

# app.include_router(
#     email.router, 
#     prefix="/api/v1/email", 
#     tags=["Email"]
# )

# app.include_router(
#     automation.router, 
#     prefix="/api/v1/automation", 
#     tags=["Automation"]
# )

# app.include_router(
#     workflows.router, 
#     prefix="/api/v1/workflows", 
#     tags=["Workflows"]
# )

# app.include_router(
#     flows_router, 
#     prefix="/api/v1/flows", 
#     tags=["AI Campaign Flows"]
# )


# # ============================================
# # INCLUDE ROUTERS - APPOINTMENTS
# # ============================================
# app.include_router(
#     appointments.router,
#     prefix="/api/v1/appointments",
#     tags=["Appointments"]
# )


# # ============================================
# # ✅ SMS & EMAIL LOGS ROUTERS
# # ============================================
# app.include_router(
#     sms_logs.router,
#     prefix="/api/v1/sms-logs",
#     tags=["SMS Logs"]
# )

# app.include_router(
#     email_logs.router,
#     prefix="/api/v1/email-logs",
#     tags=["Email Logs"]
# )


# # ============================================
# # ✅ NEW - SMS CHAT ROUTER
# # ============================================
# app.include_router(
#     sms_chat.router,
#     prefix="/api/v1/sms-logs",
#     tags=["SMS Chat"]
# )


# # ============================================
# # ROOT & HEALTH CHECK ENDPOINTS
# # ============================================

# @app.get("/", tags=["Root"])
# async def root():
#     """Root endpoint"""
#     return {
#         "message": f"Welcome to {settings.PROJECT_NAME} API",
#         "version": settings.VERSION,
#         "environment": settings.ENVIRONMENT,
#         "docs": "/docs",
#         "redoc": "/redoc",
#         "health": "/health",
#         "features": {
#             "milestone_1": "✅ Authentication & User Management",
#             "milestone_2": "✅ Voice AI & Call Center",
#             "milestone_3": "✅ SMS, Email & Automation",
#             "appointments": "✅ Appointment Booking with Google Calendar",
#             "communication_logs": "✅ SMS & Email Logs with Reply Functionality",
#             "sms_chat": "✅ NEW - AI-Powered SMS Chat Interface"
#         }
#     }


# @app.get("/health", tags=["Health"])
# async def health_check():
#     """Health check endpoint with service status"""
#     from app.services.twilio import twilio_service
#     from app.services.ai_agent import ai_agent_service
#     from app.services.google_calendar import google_calendar_service
    
#     elevenlabs_configured = bool(os.getenv("ELEVENLABS_API_KEY"))
    
#     return {
#         "status": "healthy",
#         "version": settings.VERSION,
#         "environment": settings.ENVIRONMENT,
#         "timestamp": datetime.utcnow().isoformat(),
#         "services": {
#             "database": "connected",
#             "twilio": "configured" if twilio_service.is_configured() else "not_configured",
#             "openai": "configured" if ai_agent_service.is_configured() else "not_configured",
#             "elevenlabs": "configured" if elevenlabs_configured else "not_configured",
#             "google_calendar": "configured" if google_calendar_service.is_configured() else "not_configured"
#         },
#         "features": {
#             "authentication": True,
#             "voice_calls": True,
#             "ai_agents": True,
#             "campaign_builder": True,
#             "workflows": True,
#             "sms": True,
#             "email": True,
#             "automation": True,
#             "appointments": True,
#             "sms_logs": True,
#             "email_logs": True,
#             "sms_chat": True  # ✅ NEW
#         }
#     }


# # ============================================
# # STARTUP EVENT
# # ============================================

# @app.on_event("startup")
# async def startup_message():
#     """Display startup message with service status"""
#     from app.services.twilio import twilio_service
#     from app.services.ai_agent import ai_agent_service
#     from app.services.sms import sms_service
#     from app.services.google_calendar import google_calendar_service
    
#     logger.info("=" * 80)
#     logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION}")
#     logger.info(f"🔒 Environment: {settings.ENVIRONMENT}")
#     logger.info("=" * 80)
#     logger.info(f"🌐 API Documentation: http://localhost:8000/docs")
#     logger.info(f"📖 ReDoc: http://localhost:8000/redoc")
#     logger.info(f"💚 Health Check: http://localhost:8000/health")
#     logger.info(f"🎵 Static Audio: http://localhost:8000/static/audio/")
#     logger.info(f"🔗 API Base URL: http://localhost:8000/api/v1")
#     logger.info("=" * 80)
#     logger.info("📦 IMPLEMENTED MILESTONES:")
#     logger.info("   ✅ MILESTONE 1: Authentication & User Management")
#     logger.info("   ✅ MILESTONE 2: Voice AI & Call Center")
#     logger.info("   ✅ MILESTONE 3: SMS, Email & Automation")
#     logger.info("   ✅ FEATURE: AI Campaign Builder Integration")
#     logger.info("   ✅ FEATURE: ElevenLabs Voice in Live Calls")
#     logger.info("   ✅ FEATURE: Appointment Booking with Google Calendar")
#     logger.info("   ✅ FEATURE: SMS & Email Logs with Reply Functionality")
#     logger.info("   ✅ NEW FEATURE: AI-Powered SMS Chat Interface")  # ✅ NEW
#     logger.info("=" * 80)
    
#     logger.info("🔌 Service Status:")
#     logger.info(f"   Twilio: {'✅ Configured' if twilio_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info(f"   OpenAI: {'✅ Configured' if ai_agent_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info(f"   SMS: {'✅ Configured' if sms_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info(f"   ElevenLabs: {'✅ Configured' if os.getenv('ELEVENLABS_API_KEY') else '⚠️ Not Configured'}")
#     logger.info(f"   Google Calendar: {'✅ Configured' if google_calendar_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info("=" * 80)


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "app.main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info"
#     )



# # backend/app/main.py - COMPLETE VERSION WITH CRM & PUBLIC API

# # ============================================
# # FORCE LOAD ENVIRONMENT VARIABLES FIRST
# # ============================================
# from dotenv import load_dotenv
# import os

# # Load .env file with override to ensure fresh values
# load_dotenv(override=True)

# # ============================================
# # NOW IMPORT FASTAPI AND OTHER MODULES
# # ============================================
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from contextlib import asynccontextmanager
# from pathlib import Path
# from datetime import datetime

# from app.config import settings
# from app.database import connect_to_mongo, close_mongo_connection

# # Milestone 1 imports
# from app.api.v1 import auth, users, admin, demo

# # Milestone 2 imports
# from app.api.v1 import calls, agents, conversations, analytics
# from app.api.v1.voice import router as voice_router

# # Milestone 3 imports
# from app.api.v1 import sms, email, automation, workflows
# from app.api.v1.flows import router as flows_router

# # Appointments import
# from app.api.v1 import appointments

# # ✅ SMS & Email Logs imports
# from app.api.v1 import sms_logs, email_logs

# # ✅ SMS Chat import
# from app.api.v1 import sms_chat

# # ✅ NEW - CRM & API Keys imports
# from app.api.v1 import customers, api_keys
# from app.api.public.v1 import customers as public_customers


# import logging

# logger = logging.getLogger(__name__)


# # ============================================
# # LIFESPAN CONTEXT MANAGER
# # ============================================
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """Manage application lifespan"""
#     # Startup
#     logger.info("🚀 Starting CallCenter SaaS API...")
#     logger.info("📊 Connecting to MongoDB...")
#     await connect_to_mongo()
#     logger.info("✅ MongoDB connected successfully!")
    
#     # Create static audio directory for ElevenLabs voice files
#     audio_dir = Path("backend/static/audio")
#     audio_dir.mkdir(parents=True, exist_ok=True)
#     logger.info(f"📁 Audio directory ready: {audio_dir}")
    
#     yield
    
#     # Shutdown
#     logger.info("🛑 Shutting down CallCenter SaaS API...")
#     logger.info("📊 Closing MongoDB connection...")
#     await close_mongo_connection()
#     logger.info("✅ Cleanup completed!")


# # ============================================
# # CREATE FASTAPI APP
# # ============================================
# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     version=settings.VERSION,
#     description="AI-Powered Call Center SaaS Platform with CRM & Public API",
#     lifespan=lifespan,
#     docs_url="/docs",
#     redoc_url="/redoc"
# )


# # ============================================
# # CORS MIDDLEWARE
# # ============================================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, specify exact origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ============================================
# # STATIC FILES (For ElevenLabs audio)
# # ============================================
# static_audio_path = Path("backend/static/audio")
# static_audio_path.mkdir(parents=True, exist_ok=True)

# app.mount(
#     "/static",
#     StaticFiles(directory="backend/static"),
#     name="static"
# )


# # ============================================
# # INCLUDE ROUTERS - MILESTONE 1
# # ============================================
# app.include_router(
#     auth.router,
#     prefix="/api/v1/auth",
#     tags=["Authentication"]
# )

# app.include_router(
#     users.router,
#     prefix="/api/v1/users",
#     tags=["Users"]
# )

# app.include_router(
#     admin.router,
#     prefix="/api/v1/admin",
#     tags=["Admin"]
# )

# app.include_router(
#     demo.router,
#     prefix="/api/v1/demo",
#     tags=["Demo Bookings"]
# )


# # ============================================
# # INCLUDE ROUTERS - MILESTONE 2
# # ============================================
# app.include_router(
#     voice_router,
#     prefix="/api/v1/voice",
#     tags=["Voice & AI Agents"]
# )

# app.include_router(
#     calls.router,
#     prefix="/api/v1/calls",
#     tags=["Calls"]
# )

# app.include_router(
#     agents.router,
#     prefix="/api/v1/agents", 
#     tags=["AI Agents"]
# )

# app.include_router(
#     conversations.router, 
#     prefix="/api/v1/conversations", 
#     tags=["Conversations"]
# )

# app.include_router(
#     analytics.router, 
#     prefix="/api/v1/analytics", 
#     tags=["Analytics"]
# )


# # ============================================
# # INCLUDE ROUTERS - MILESTONE 3
# # ============================================
# app.include_router(
#     sms.router, 
#     prefix="/api/v1/sms", 
#     tags=["SMS"]
# )

# app.include_router(
#     email.router, 
#     prefix="/api/v1/email", 
#     tags=["Email"]
# )

# app.include_router(
#     automation.router, 
#     prefix="/api/v1/automation", 
#     tags=["Automation"]
# )

# app.include_router(
#     workflows.router, 
#     prefix="/api/v1/workflows", 
#     tags=["Workflows"]
# )

# app.include_router(
#     flows_router, 
#     prefix="/api/v1/flows", 
#     tags=["AI Campaign Flows"]
# )


# # ============================================
# # INCLUDE ROUTERS - APPOINTMENTS
# # ============================================
# app.include_router(
#     appointments.router,
#     prefix="/api/v1/appointments",
#     tags=["Appointments"]
# )


# # ============================================
# # ✅ SMS & EMAIL LOGS ROUTERS
# # ============================================
# app.include_router(
#     sms_logs.router,
#     prefix="/api/v1/sms-logs",
#     tags=["SMS Logs"]
# )

# app.include_router(
#     email_logs.router,
#     prefix="/api/v1/email-logs",
#     tags=["Email Logs"]
# )


# # ============================================
# # ✅ SMS CHAT ROUTER
# # ============================================
# app.include_router(
#     sms_chat.router,
#     prefix="/api/v1/sms-logs",
#     tags=["SMS Chat"]
# )


# # ============================================
# # ✅ NEW - CUSTOMERS (CRM) ROUTER
# # ============================================
# app.include_router(
#     customers.router,
#     prefix="/api/v1/customers",
#     tags=["Customers"]
# )


# # ============================================
# # ✅ NEW - API KEYS ROUTER
# # ============================================
# app.include_router(
#     api_keys.router,
#     prefix="/api/v1/api-keys",
#     tags=["API Keys"]
# )


# # ============================================
# # ✅ NEW - PUBLIC API ROUTER
# # ============================================
# app.include_router(
#     public_customers.router,
#     prefix="/api/public/v1",
#     tags=["Public API"]
# )


# # ============================================
# # ROOT & HEALTH CHECK ENDPOINTS
# # ============================================

# @app.get("/", tags=["Root"])
# async def root():
#     """Root endpoint"""
#     return {
#         "message": f"Welcome to {settings.PROJECT_NAME} API",
#         "version": settings.VERSION,
#         "environment": settings.ENVIRONMENT,
#         "docs": "/docs",
#         "redoc": "/redoc",
#         "health": "/health",
#         "features": {
#             "milestone_1": "✅ Authentication & User Management",
#             "milestone_2": "✅ Voice AI & Call Center",
#             "milestone_3": "✅ SMS, Email & Automation",
#             "milestone_4": "✅ CRM & Customer Management",  # ✅ NEW
#             "appointments": "✅ Appointment Booking with Google Calendar",
#             "communication_logs": "✅ SMS & Email Logs with Reply Functionality",
#             "sms_chat": "✅ AI-Powered SMS Chat Interface",
#             "public_api": "✅ Public API with API Key Authentication"  # ✅ NEW
#         }
#     }


# @app.get("/health", tags=["Health"])
# async def health_check():
#     """Health check endpoint with service status"""
#     from app.services.twilio import twilio_service
#     from app.services.ai_agent import ai_agent_service
#     from app.services.google_calendar import google_calendar_service
    
#     elevenlabs_configured = bool(os.getenv("ELEVENLABS_API_KEY"))
    
#     return {
#         "status": "healthy",
#         "version": settings.VERSION,
#         "environment": settings.ENVIRONMENT,
#         "timestamp": datetime.utcnow().isoformat(),
#         "services": {
#             "database": "connected",
#             "twilio": "configured" if twilio_service.is_configured() else "not_configured",
#             "openai": "configured" if ai_agent_service.is_configured() else "not_configured",
#             "elevenlabs": "configured" if elevenlabs_configured else "not_configured",
#             "google_calendar": "configured" if google_calendar_service.is_configured() else "not_configured"
#         },
#         "features": {
#             "authentication": True,
#             "voice_calls": True,
#             "ai_agents": True,
#             "campaign_builder": True,
#             "workflows": True,
#             "sms": True,
#             "email": True,
#             "automation": True,
#             "appointments": True,
#             "sms_logs": True,
#             "email_logs": True,
#             "sms_chat": True,
#             "customers": True,  # ✅ NEW
#             "api_keys": True,  # ✅ NEW
#             "public_api": True  # ✅ NEW
#         }
#     }


# # ============================================
# # STARTUP EVENT
# # ============================================

# @app.on_event("startup")
# async def startup_message():
#     """Display startup message with service status"""
#     from app.services.twilio import twilio_service
#     from app.services.ai_agent import ai_agent_service
#     from app.services.sms import sms_service
#     from app.services.google_calendar import google_calendar_service
    
#     logger.info("=" * 80)
#     logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION}")
#     logger.info(f"🔒 Environment: {settings.ENVIRONMENT}")
#     logger.info("=" * 80)
#     logger.info(f"🌐 API Documentation: http://localhost:8000/docs")
#     logger.info(f"📖 ReDoc: http://localhost:8000/redoc")
#     logger.info(f"💚 Health Check: http://localhost:8000/health")
#     logger.info(f"🎵 Static Audio: http://localhost:8000/static/audio/")
#     logger.info(f"🔗 API Base URL: http://localhost:8000/api/v1")
#     logger.info(f"🌍 Public API URL: http://localhost:8000/api/public/v1")  # ✅ NEW
#     logger.info("=" * 80)
#     logger.info("📦 IMPLEMENTED MILESTONES:")
#     logger.info("   ✅ MILESTONE 1: Authentication & User Management")
#     logger.info("   ✅ MILESTONE 2: Voice AI & Call Center")
#     logger.info("   ✅ MILESTONE 3: SMS, Email & Automation")
#     logger.info("   ✅ MILESTONE 4: CRM & Customer Management")  # ✅ NEW
#     logger.info("   ✅ FEATURE: AI Campaign Builder Integration")
#     logger.info("   ✅ FEATURE: ElevenLabs Voice in Live Calls")
#     logger.info("   ✅ FEATURE: Appointment Booking with Google Calendar")
#     logger.info("   ✅ FEATURE: SMS & Email Logs with Reply Functionality")
#     logger.info("   ✅ FEATURE: AI-Powered SMS Chat Interface")
#     logger.info("   ✅ FEATURE: Public API with API Key Authentication")  # ✅ NEW
#     logger.info("=" * 80)
    
#     logger.info("🔌 Service Status:")
#     logger.info(f"   Twilio: {'✅ Configured' if twilio_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info(f"   OpenAI: {'✅ Configured' if ai_agent_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info(f"   SMS: {'✅ Configured' if sms_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info(f"   ElevenLabs: {'✅ Configured' if os.getenv('ELEVENLABS_API_KEY') else '⚠️ Not Configured'}")
#     logger.info(f"   Google Calendar: {'✅ Configured' if google_calendar_service.is_configured() else '⚠️ Not Configured'}")
#     logger.info("=" * 80)


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "app.main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info"
#     )


# backend/app/main.py - COMPLETE VERSION WITH CRM & PUBLIC API with email inbound functionality 

# ============================================
# FORCE LOAD ENVIRONMENT VARIABLES FIRST
# ============================================
from dotenv import load_dotenv
import os

# Load .env file with override to ensure fresh values
load_dotenv(override=True)

# ============================================
# NOW IMPORT FASTAPI AND OTHER MODULES
# ============================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from datetime import datetime

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection

# Milestone 1 imports
from app.api.v1 import auth, users, admin, demo

# Milestone 2 imports
from app.api.v1 import calls, agents, conversations, analytics
from app.api.v1.voice import router as voice_router

# Milestone 3 imports
from app.api.v1 import sms, email, automation, workflows
from app.api.v1.flows import router as flows_router

# Appointments import
from app.api.v1 import appointments

# ✅ SMS & Email Logs imports
from app.api.v1 import sms_logs, email_logs

# ✅ SMS Chat import
from app.api.v1 import sms_chat

# ✅ NEW - CRM & API Keys imports
from app.api.v1 import customers, api_keys
from app.api.public.v1 import customers as public_customers

# ✅ NEW - Email Webhook import
from app.api.v1 import email_webhook


import logging

logger = logging.getLogger(__name__)


# ============================================
# LIFESPAN CONTEXT MANAGER
# ============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    # Startup
    logger.info("🚀 Starting CallCenter SaaS API...")
    logger.info("📊 Connecting to MongoDB...")
    await connect_to_mongo()
    logger.info("✅ MongoDB connected successfully!")
    
    # Create static audio directory for ElevenLabs voice files
    audio_dir = Path("backend/static/audio")
    audio_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"📁 Audio directory ready: {audio_dir}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down CallCenter SaaS API...")
    logger.info("📊 Closing MongoDB connection...")
    await close_mongo_connection()
    logger.info("✅ Cleanup completed!")


# ============================================
# CREATE FASTAPI APP
# ============================================
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Call Center SaaS Platform with CRM & Public API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)


# ============================================
# CORS MIDDLEWARE
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# STATIC FILES (For ElevenLabs audio)
# ============================================
static_audio_path = Path("backend/static/audio")
static_audio_path.mkdir(parents=True, exist_ok=True)

app.mount(
    "/static",
    StaticFiles(directory="backend/static"),
    name="static"
)


# ============================================
# INCLUDE ROUTERS - MILESTONE 1
# ============================================
app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

app.include_router(
    users.router,
    prefix="/api/v1/users",
    tags=["Users"]
)

app.include_router(
    admin.router,
    prefix="/api/v1/admin",
    tags=["Admin"]
)

app.include_router(
    demo.router,
    prefix="/api/v1/demo",
    tags=["Demo Bookings"]
)


# ============================================
# INCLUDE ROUTERS - MILESTONE 2
# ============================================
app.include_router(
    voice_router,
    prefix="/api/v1/voice",
    tags=["Voice & AI Agents"]
)

app.include_router(
    calls.router,
    prefix="/api/v1/calls",
    tags=["Calls"]
)

app.include_router(
    agents.router,
    prefix="/api/v1/agents", 
    tags=["AI Agents"]
)

app.include_router(
    conversations.router, 
    prefix="/api/v1/conversations", 
    tags=["Conversations"]
)

app.include_router(
    analytics.router, 
    prefix="/api/v1/analytics", 
    tags=["Analytics"]
)


# ============================================
# INCLUDE ROUTERS - MILESTONE 3
# ============================================
app.include_router(
    sms.router, 
    prefix="/api/v1/sms", 
    tags=["SMS"]
)

app.include_router(
    email.router, 
    prefix="/api/v1/email", 
    tags=["Email"]
)

app.include_router(
    automation.router, 
    prefix="/api/v1/automation", 
    tags=["Automation"]
)

app.include_router(
    workflows.router, 
    prefix="/api/v1/workflows", 
    tags=["Workflows"]
)

app.include_router(
    flows_router, 
    prefix="/api/v1/flows", 
    tags=["AI Campaign Flows"]
)


# ============================================
# INCLUDE ROUTERS - APPOINTMENTS
# ============================================
app.include_router(
    appointments.router,
    prefix="/api/v1/appointments",
    tags=["Appointments"]
)


# ============================================
# ✅ SMS & EMAIL LOGS ROUTERS
# ============================================
app.include_router(
    sms_logs.router,
    prefix="/api/v1/sms-logs",
    tags=["SMS Logs"]
)

app.include_router(
    email_logs.router,
    prefix="/api/v1/email-logs",
    tags=["Email Logs"]
)


# ============================================
# ✅ SMS CHAT ROUTER
# ============================================
app.include_router(
    sms_chat.router,
    prefix="/api/v1/sms-logs",
    tags=["SMS Chat"]
)


# ============================================
# ✅ NEW - CUSTOMERS (CRM) ROUTER
# ============================================
app.include_router(
    customers.router,
    prefix="/api/v1/customers",
    tags=["Customers"]
)


# ============================================
# ✅ NEW - API KEYS ROUTER
# ============================================
app.include_router(
    api_keys.router,
    prefix="/api/v1/api-keys",
    tags=["API Keys"]
)


# ============================================
# ✅ NEW - PUBLIC API ROUTER
# ============================================
app.include_router(
    public_customers.router,
    prefix="/api/public/v1",
    tags=["Public API"]
)


# ============================================
# ✅ NEW - EMAIL WEBHOOK ROUTER
# ============================================
app.include_router(
    email_webhook.router,
    prefix="/api/v1/email-webhook",
    tags=["Email Webhook"]
)


# ============================================
# ROOT & HEALTH CHECK ENDPOINTS
# ============================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "features": {
            "milestone_1": "✅ Authentication & User Management",
            "milestone_2": "✅ Voice AI & Call Center",
            "milestone_3": "✅ SMS, Email & Automation",
            "milestone_4": "✅ CRM & Customer Management",
            "appointments": "✅ Appointment Booking with Google Calendar",
            "communication_logs": "✅ SMS & Email Logs with Reply Functionality",
            "sms_chat": "✅ AI-Powered SMS Chat Interface",
            "public_api": "✅ Public API with API Key Authentication",
            "email_webhook": "✅ Email Webhook for Reply Handling"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint with service status"""
    from app.services.twilio import twilio_service
    from app.services.ai_agent import ai_agent_service
    from app.services.google_calendar import google_calendar_service
    
    elevenlabs_configured = bool(os.getenv("ELEVENLABS_API_KEY"))
    
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected",
            "twilio": "configured" if twilio_service.is_configured() else "not_configured",
            "openai": "configured" if ai_agent_service.is_configured() else "not_configured",
            "elevenlabs": "configured" if elevenlabs_configured else "not_configured",
            "google_calendar": "configured" if google_calendar_service.is_configured() else "not_configured"
        },
        "features": {
            "authentication": True,
            "voice_calls": True,
            "ai_agents": True,
            "campaign_builder": True,
            "workflows": True,
            "sms": True,
            "email": True,
            "automation": True,
            "appointments": True,
            "sms_logs": True,
            "email_logs": True,
            "sms_chat": True,
            "customers": True,
            "api_keys": True,
            "public_api": True,
            "email_webhook": True
        }
    }


# ============================================
# STARTUP EVENT
# ============================================

@app.on_event("startup")
async def startup_message():
    """Display startup message with service status"""
    from app.services.twilio import twilio_service
    from app.services.ai_agent import ai_agent_service
    from app.services.sms import sms_service
    from app.services.google_calendar import google_calendar_service
    
    logger.info("=" * 80)
    logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"🔒 Environment: {settings.ENVIRONMENT}")
    logger.info("=" * 80)
    logger.info(f"🌐 API Documentation: http://localhost:8000/docs")
    logger.info(f"📖 ReDoc: http://localhost:8000/redoc")
    logger.info(f"💚 Health Check: http://localhost:8000/health")
    logger.info(f"🎵 Static Audio: http://localhost:8000/static/audio/")
    logger.info(f"🔗 API Base URL: http://localhost:8000/api/v1")
    logger.info(f"🌍 Public API URL: http://localhost:8000/api/public/v1")
    logger.info(f"📧 Email Webhook URL: http://localhost:8000/api/v1/email-webhook")
    logger.info("=" * 80)
    logger.info("📦 IMPLEMENTED MILESTONES:")
    logger.info("   ✅ MILESTONE 1: Authentication & User Management")
    logger.info("   ✅ MILESTONE 2: Voice AI & Call Center")
    logger.info("   ✅ MILESTONE 3: SMS, Email & Automation")
    logger.info("   ✅ MILESTONE 4: CRM & Customer Management")
    logger.info("   ✅ FEATURE: AI Campaign Builder Integration")
    logger.info("   ✅ FEATURE: ElevenLabs Voice in Live Calls")
    logger.info("   ✅ FEATURE: Appointment Booking with Google Calendar")
    logger.info("   ✅ FEATURE: SMS & Email Logs with Reply Functionality")
    logger.info("   ✅ FEATURE: AI-Powered SMS Chat Interface")
    logger.info("   ✅ FEATURE: Public API with API Key Authentication")
    logger.info("   ✅ FEATURE: Email Webhook for Reply Handling")
    logger.info("=" * 80)
    
    logger.info("🔌 Service Status:")
    logger.info(f"   Twilio: {'✅ Configured' if twilio_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   OpenAI: {'✅ Configured' if ai_agent_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   SMS: {'✅ Configured' if sms_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   ElevenLabs: {'✅ Configured' if os.getenv('ELEVENLABS_API_KEY') else '⚠️ Not Configured'}")
    logger.info(f"   Google Calendar: {'✅ Configured' if google_calendar_service.is_configured() else '⚠️ Not Configured'}")
    logger.info("=" * 80)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )