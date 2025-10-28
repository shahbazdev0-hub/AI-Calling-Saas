# # backend/app/main.py - COMPLETE VERSION WITH Campaign builder without google calender

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

# from app.config import settings
# from app.database import connect_to_mongo, close_mongo_connection

# # Milestone 1 imports
# from app.api.v1 import auth, users, admin, demo

# # Milestone 2 imports
# from app.api.v1 import calls, agents, conversations, analytics
# from app.api.v1.voice import router as voice_router

# # Milestone 3 imports
# from app.api.v1 import sms, email, automation, workflows
# from app.api.v1.flows import router as flows_router  # NEW: AI Campaign Flows

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
#     description="AI-Powered Call Center SaaS Platform with Voice AI & Campaign Builder",
#     lifespan=lifespan,
#     docs_url="/docs",
#     redoc_url="/redoc"
# )


# # ============================================
# # CORS MIDDLEWARE
# # ============================================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.BACKEND_CORS_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ============================================
# # MOUNT STATIC FILES (FOR ELEVENLABS AUDIO)
# # ============================================
# static_path = Path("backend/static")
# static_path.mkdir(parents=True, exist_ok=True)

# app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
# logger.info("✅ Static files mounted at /static")


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
#     tags=["Demo Booking"]
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
#         "health": "/health"
#     }


# @app.get("/health", tags=["Health"])
# async def health_check():
#     """Health check endpoint with service status"""
#     from app.services.twilio import twilio_service
#     from app.services.ai_agent import ai_agent_service
    
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
#             "elevenlabs": "configured" if elevenlabs_configured else "not_configured"
#         },
#         "features": {
#             "authentication": True,
#             "voice_calls": True,
#             "ai_agents": True,
#             "campaign_builder": True,
#             "workflows": True,
#             "sms": True,
#             "email": True,
#             "automation": True
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
    
#     logger.info("=" * 80)
#     logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION}")
#     logger.info(f"📝 Environment: {settings.ENVIRONMENT}")
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
#     logger.info("   ✅ NEW FEATURE: AI Campaign Builder Integration")
#     logger.info("   ✅ NEW FEATURE: ElevenLabs Voice in Live Calls")
#     logger.info("=" * 80)
#     logger.info("🔌 SERVICE STATUS:")
    
#     # Twilio Status
#     if twilio_service.is_configured():
#         logger.info(f"   ✅ Twilio: Configured")
#         logger.info(f"      Phone: {os.getenv('TWILIO_PHONE_NUMBER')}")
#     else:
#         logger.info(f"   ⚠️ Twilio: Not Configured")
    
#     # OpenAI Status
#     if ai_agent_service.is_configured():
#         logger.info(f"   ✅ OpenAI: Configured")
#         logger.info(f"      Model: {os.getenv('OPENAI_MODEL', 'gpt-4')}")
#     else:
#         logger.info(f"   ⚠️ OpenAI: Not Configured")
    
#     # ElevenLabs Status
#     if os.getenv('ELEVENLABS_API_KEY'):
#         logger.info(f"   ✅ ElevenLabs: Configured")
#         logger.info(f"      Voice ID: {os.getenv('ELEVENLABS_VOICE_ID', 'default')}")
#     else:
#         logger.info(f"   ⚠️ ElevenLabs: Not Configured")
    
#     # SMS Status
#     if sms_service.is_configured():
#         logger.info(f"   ✅ SMS: Configured")
#     else:
#         logger.info(f"   ⚠️ SMS: Not Configured")
    
#     # MongoDB
#     logger.info(f"   ✅ MongoDB: Connected")
#     logger.info(f"      Database: {os.getenv('DATABASE_NAME', 'callcenter_saas')}")
    
#     logger.info("=" * 80)
#     logger.info("🎯 READY TO ACCEPT REQUESTS")
#     logger.info("=" * 80)


# # ============================================
# # ERROR HANDLERS
# # ============================================

# @app.exception_handler(404)
# async def not_found_handler(request, exc):
#     """Custom 404 handler"""
#     return {
#         "error": "Not Found",
#         "message": f"The requested endpoint {request.url.path} does not exist",
#         "status_code": 404
#     }


# @app.exception_handler(500)
# async def internal_error_handler(request, exc):
#     """Custom 500 handler"""
#     logger.error(f"Internal server error: {exc}")
#     return {
#         "error": "Internal Server Error",
#         "message": "An unexpected error occurred. Please try again later.",
#         "status_code": 500
#     }


# # ============================================
# # RUN APPLICATION
# # ============================================

# if __name__ == "__main__":
#     import uvicorn
#     from datetime import datetime
    
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info"
#     )


# backend/app/main.py - COMPLETE VERSION WITH APPOINTMENTS

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

# ✅ NEW - Appointments import
from app.api.v1 import appointments

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
    description="AI-Powered Call Center SaaS Platform with Appointment Booking",
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
# INCLUDE ROUTERS - ✅ NEW APPOINTMENTS
# ============================================
app.include_router(
    appointments.router,
    prefix="/api/v1/appointments",
    tags=["Appointments"]
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
            "appointments": "✅ NEW - Appointment Booking with Google Calendar"
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
            "google_calendar": "configured" if google_calendar_service.is_configured() else "not_configured"  # ✅ NEW
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
            "appointments": True  # ✅ NEW
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
    logger.info("=" * 80)
    logger.info("📦 IMPLEMENTED MILESTONES:")
    logger.info("   ✅ MILESTONE 1: Authentication & User Management")
    logger.info("   ✅ MILESTONE 2: Voice AI & Call Center")
    logger.info("   ✅ MILESTONE 3: SMS, Email & Automation")
    logger.info("   ✅ NEW FEATURE: AI Campaign Builder Integration")
    logger.info("   ✅ NEW FEATURE: ElevenLabs Voice in Live Calls")
    logger.info("   ✅ NEW FEATURE: Appointment Booking with Google Calendar")  # ✅ NEW
    logger.info("=" * 80)
    
    logger.info("🔌 Service Status:")
    logger.info(f"   Twilio: {'✅ Configured' if twilio_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   OpenAI: {'✅ Configured' if ai_agent_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   SMS: {'✅ Configured' if sms_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   ElevenLabs: {'✅ Configured' if os.getenv('ELEVENLABS_API_KEY') else '⚠️ Not Configured'}")
    logger.info(f"   Google Calendar: {'✅ Configured' if google_calendar_service.is_configured() else '⚠️ Not Configured'}")  # ✅ NEW
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