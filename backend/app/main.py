# # backend/app/main.py - COMPLETE UPDATED VERSION WITH DEBUG milestone 2

# # ============================================
# # FORCE LOAD ENVIRONMENT VARIABLES FIRST
# # ============================================
# from dotenv import load_dotenv
# import os

# # ✅ Load .env file with override to ensure fresh values
# load_dotenv(override=True)

# # ✅ DEBUG: Print loaded environment variables
# print("=" * 80)
# print("🔍 ENVIRONMENT VARIABLES LOADED:")
# print("=" * 80)
# print(f"📊 Database: {os.getenv('DATABASE_NAME')}")
# print(f"🌐 Frontend URL: {os.getenv('FRONTEND_URL')}")
# print(f"🔐 Environment: {os.getenv('ENVIRONMENT')}")
# print()
# print("📞 TWILIO CREDENTIALS:")
# print(f"   Account SID: {os.getenv('TWILIO_ACCOUNT_SID')}")
# print(f"   Auth Token: {os.getenv('TWILIO_AUTH_TOKEN')[:10]}..." if os.getenv('TWILIO_AUTH_TOKEN') else "   Auth Token: NOT SET")
# print(f"   Phone Number: {os.getenv('TWILIO_PHONE_NUMBER')}")
# print(f"   Webhook URL: {os.getenv('TWILIO_WEBHOOK_URL')}")
# print()
# print("🤖 OPENAI:")
# print(f"   API Key: {os.getenv('OPENAI_API_KEY')[:20]}..." if os.getenv('OPENAI_API_KEY') else "   API Key: NOT SET")
# print(f"   Model: {os.getenv('OPENAI_MODEL')}")
# print()
# print("🎙️ ELEVENLABS:")
# print(f"   API Key: {os.getenv('ELEVENLABS_API_KEY')[:20]}..." if os.getenv('ELEVENLABS_API_KEY') else "   API Key: NOT SET")
# print(f"   Voice ID: {os.getenv('ELEVENLABS_VOICE_ID')}")
# print("=" * 80)
# print()

# # ============================================
# # NOW IMPORT FASTAPI AND OTHER MODULES
# # ============================================
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from contextlib import asynccontextmanager

# from app.config import settings
# from app.database import connect_to_mongo, close_mongo_connection

# # ✅ Milestone 1 imports
# from app.api.v1 import auth, users, admin, demo, contact

# # ✅ Milestone 2 imports
# from app.api.v1 import calls, agents, conversations
# from app.api.v1.voice import router as voice_router

# # ============================================
# # LIFESPAN CONTEXT MANAGER
# # ============================================
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """Manage application lifespan"""
#     # Startup
#     print("🚀 Starting CallCenter SaaS API...")
#     print("📊 Connecting to MongoDB...")
#     await connect_to_mongo()
#     print("✅ MongoDB connected successfully!")
    
#     yield
    
#     # Shutdown
#     print("🛑 Shutting down CallCenter SaaS API...")
#     print("📊 Closing MongoDB connection...")
#     await close_mongo_connection()
#     print("✅ Cleanup completed!")

# # ============================================
# # CREATE FASTAPI APPLICATION
# # ============================================
# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     version=settings.VERSION,
#     description="AI-Powered Call Center SaaS Platform",
#     docs_url="/docs",
#     redoc_url="/redoc",
#     lifespan=lifespan
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
# # MILESTONE 1 ROUTES - AUTHENTICATION & ADMIN
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

# app.include_router(
#     contact.router, 
#     prefix="/api/v1/contact", 
#     tags=["Contact"]
# )

# # ============================================
# # MILESTONE 2 ROUTES - VOICE AI & CALLS
# # ============================================
# app.include_router(
#     calls.router, 
#     prefix="/api/v1/calls", 
#     tags=["Calls"]
# )

# app.include_router(
#     voice_router,  # ✅ Now using the correctly imported router
#     prefix="/api/v1/voice", 
#     tags=["Voice & Webhooks"]
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

# # ============================================
# # ROOT ENDPOINTS
# # ============================================
# @app.get("/")
# async def root():
#     """API Root - Welcome message"""
#     return {
#         "message": "CallCenter SaaS API",
#         "version": settings.VERSION,
#         "status": "running",
#         "docs": "/docs",
#         "redoc": "/redoc",
#         "health": "/health"
#     }

# @app.get("/health")
# async def health_check():
#     """Health check endpoint"""
#     return {
#         "status": "healthy",
#         "version": settings.VERSION,
#         "environment": settings.ENVIRONMENT,
#         "database": settings.DATABASE_NAME
#     }

# @app.get("/api/v1")
# async def api_info():
#     """API v1 information"""
#     return {
#         "version": "1.0.0",
#         "endpoints": {
#             "auth": "/api/v1/auth",
#             "users": "/api/v1/users",
#             "admin": "/api/v1/admin",
#             "demo": "/api/v1/demo",
#             "contact": "/api/v1/contact",
#             "calls": "/api/v1/calls",
#             "voice": "/api/v1/voice",
#             "agents": "/api/v1/agents",
#             "conversations": "/api/v1/conversations"
#         }
#     }

# # ============================================
# # STARTUP MESSAGE
# # ============================================
# print()
# print("=" * 80)
# print("✅ CallCenter SaaS API Started Successfully!")
# print("=" * 80)
# print(f"📖 API Documentation: http://localhost:8000/docs")
# print(f"📖 ReDoc Documentation: http://localhost:8000/redoc")
# print(f"💚 Health Check: http://localhost:8000/health")
# print(f"🔗 API Base URL: http://localhost:8000/api/v1")
# print("=" * 80)
# print()


# # backend/app/main.py  for milestone 2 - COMPLETE FILE

# # ============================================
# # FORCE LOAD ENVIRONMENT VARIABLES FIRST
# # ============================================
# from dotenv import load_dotenv
# import os

# # Load .env file with override to ensure fresh values
# load_dotenv(override=True)

# # DEBUG: Print loaded environment variables
# print("=" * 80)
# print("🔍 ENVIRONMENT VARIABLES LOADED:")
# print("=" * 80)
# print(f"📊 Database: {os.getenv('DATABASE_NAME')}")
# print(f"🌐 Frontend URL: {os.getenv('FRONTEND_URL')}")
# print(f"🔧 Environment: {os.getenv('ENVIRONMENT')}")
# print()
# print("📞 TWILIO CREDENTIALS:")
# print(f"   Account SID: {os.getenv('TWILIO_ACCOUNT_SID')}")
# print(f"   Auth Token: {os.getenv('TWILIO_AUTH_TOKEN')[:10]}..." if os.getenv('TWILIO_AUTH_TOKEN') else "   Auth Token: NOT SET")
# print(f"   Phone Number: {os.getenv('TWILIO_PHONE_NUMBER')}")
# print(f"   Webhook URL: {os.getenv('TWILIO_WEBHOOK_URL')}")
# print()
# print("🤖 OPENAI:")
# print(f"   API Key: {os.getenv('OPENAI_API_KEY')[:20]}..." if os.getenv('OPENAI_API_KEY') else "   API Key: NOT SET")
# print(f"   Model: {os.getenv('OPENAI_MODEL')}")
# print()
# print("🎙️ ELEVENLABS:")
# print(f"   API Key: {os.getenv('ELEVENLABS_API_KEY')[:20]}..." if os.getenv('ELEVENLABS_API_KEY') else "   API Key: NOT SET")
# print(f"   Voice ID: {os.getenv('ELEVENLABS_VOICE_ID')}")
# print("=" * 80)
# print()

# # ============================================
# # NOW IMPORT FASTAPI AND OTHER MODULES
# # ============================================
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from contextlib import asynccontextmanager

# from app.config import settings
# from app.database import connect_to_mongo, close_mongo_connection

# # Milestone 1 imports
# from app.api.v1 import auth, users, admin, demo, contact

# # Milestone 2 imports
# from app.api.v1 import calls, agents, conversations, analytics
# from app.api.v1.voice import router as voice_router

# # ============================================
# # LIFESPAN CONTEXT MANAGER
# # ============================================
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """Manage application lifespan"""
#     # Startup
#     print("🚀 Starting CallCenter SaaS API...")
#     print("📊 Connecting to MongoDB...")
#     await connect_to_mongo()
#     print("✅ MongoDB connected successfully!")
    
#     yield
    
#     # Shutdown
#     print("🛑 Shutting down CallCenter SaaS API...")
#     print("📊 Closing MongoDB connection...")
#     await close_mongo_connection()
#     print("✅ Cleanup completed!")

# # ============================================
# # CREATE FASTAPI APPLICATION
# # ============================================
# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     version=settings.VERSION,
#     description="AI-Powered Call Center SaaS Platform",
#     docs_url="/docs",
#     redoc_url="/redoc",
#     lifespan=lifespan
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
# # MILESTONE 1 ROUTES - AUTHENTICATION & ADMIN
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

# app.include_router(
#     contact.router, 
#     prefix="/api/v1/contact", 
#     tags=["Contact"]
# )

# # ============================================
# # MILESTONE 2 ROUTES - VOICE AI & CALLS
# # ============================================
# app.include_router(
#     calls.router, 
#     prefix="/api/v1/calls", 
#     tags=["Calls"]
# )

# app.include_router(
#     voice_router,
#     prefix="/api/v1/voice", 
#     tags=["Voice & Webhooks"]
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

# # ============================================
# # ANALYTICS ROUTES
# # ============================================
# app.include_router(
#     analytics.router,
#     prefix="/api/v1/analytics",
#     tags=["Analytics"]
# )

# # ============================================
# # ROOT ENDPOINTS
# # ============================================
# @app.get("/")
# async def root():
#     """API Root - Welcome message"""
#     return {
#         "message": "CallCenter SaaS API",
#         "version": settings.VERSION,
#         "status": "running",
#         "docs": "/docs",
#         "redoc": "/redoc",
#         "health": "/health"
#     }

# @app.get("/health")
# async def health_check():
#     """Health check endpoint"""
#     return {
#         "status": "healthy",
#         "version": settings.VERSION,
#         "environment": settings.ENVIRONMENT,
#         "database": settings.DATABASE_NAME
#     }

# @app.get("/api/v1")
# async def api_info():
#     """API v1 information"""
#     return {
#         "version": "1.0.0",
#         "endpoints": {
#             "auth": "/api/v1/auth",
#             "users": "/api/v1/users",
#             "admin": "/api/v1/admin",
#             "demo": "/api/v1/demo",
#             "contact": "/api/v1/contact",
#             "calls": "/api/v1/calls",
#             "voice": "/api/v1/voice",
#             "agents": "/api/v1/agents",
#             "conversations": "/api/v1/conversations",
#             "analytics": "/api/v1/analytics"
#         }
#     }

# # ============================================
# # STARTUP MESSAGE
# # ============================================
# print()
# print("=" * 80)
# print("✅ CallCenter SaaS API Started Successfully!")
# print("=" * 80)
# print(f"📖 API Documentation: http://localhost:8000/docs")
# print(f"📖 ReDoc Documentation: http://localhost:8000/redoc")
# print(f"💚 Health Check: http://localhost:8000/health")
# print(f"🔗 API Base URL: http://localhost:8000/api/v1")
# print(f"📊 Analytics: http://localhost:8000/api/v1/analytics")
# print("=" * 80)
# print()

# backend/app/main.py - MILESTONE 3 COMPLETE VERSION

# ============================================
# LOAD ENVIRONMENT VARIABLES FIRST
# ============================================
from dotenv import load_dotenv
import os

# Load .env file before any other imports
load_dotenv()

# Now import everything else
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection

# Import API routers
from app.api.v1 import auth, users, admin, demo, contact
from app.api.v1 import calls, voice, agents, conversations, analytics
from app.api.v1 import sms, email, automation, workflows

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================
# LIFESPAN EVENT HANDLER
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for startup and shutdown
    """
    # Startup
    logger.info("🚀 Starting CallCenter SaaS API...")
    try:
        await connect_to_mongo()
        logger.info("✅ Connected to MongoDB")
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down CallCenter SaaS API...")
    try:
        await close_mongo_connection()
        logger.info("✅ Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"❌ Error disconnecting from MongoDB: {e}")


# ============================================
# CREATE FASTAPI APP
# ============================================

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CallCenter SaaS API - AI-Powered Call Center Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)


# ============================================
# MIDDLEWARE
# ============================================

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.ENVIRONMENT == "development" else "An error occurred"
        }
    )


# ============================================
# API ROUTES - MILESTONE 1
# ============================================

# Authentication routes
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["Authentication"]
)

# User routes
app.include_router(
    users.router,
    prefix=f"{settings.API_V1_STR}/users",
    tags=["Users"]
)

# Admin routes
app.include_router(
    admin.router,
    prefix=f"{settings.API_V1_STR}/admin",
    tags=["Admin"]
)

# Demo booking routes
app.include_router(
    demo.router,
    prefix=f"{settings.API_V1_STR}/demo",
    tags=["Demo"]
)

# Contact routes
app.include_router(
    contact.router,
    prefix=f"{settings.API_V1_STR}/contact",
    tags=["Contact"]
)


# ============================================
# API ROUTES - MILESTONE 2
# ============================================

# Call routes
app.include_router(
    calls.router,
    prefix=f"{settings.API_V1_STR}/calls",
    tags=["Calls"]
)

# Voice routes (including Twilio webhooks)
app.include_router(
    voice.router,
    prefix=f"{settings.API_V1_STR}/voice",
    tags=["Voice"]
)

# Agent routes
app.include_router(
    agents.router,
    prefix=f"{settings.API_V1_STR}/agents",
    tags=["Agents"]
)

# Conversation routes
app.include_router(
    conversations.router,
    prefix=f"{settings.API_V1_STR}/conversations",
    tags=["Conversations"]
)

# Analytics routes
app.include_router(
    analytics.router,
    prefix=f"{settings.API_V1_STR}/analytics",
    tags=["Analytics"]
)


# ============================================
# API ROUTES - MILESTONE 3
# ============================================

# SMS routes
app.include_router(
    sms.router,
    prefix=f"{settings.API_V1_STR}/sms",
    tags=["SMS - Milestone 3"]
)

# Email routes
app.include_router(
    email.router,
    prefix=f"{settings.API_V1_STR}/email",
    tags=["Email - Milestone 3"]
)

# Automation routes
app.include_router(
    automation.router,
    prefix=f"{settings.API_V1_STR}/automation",
    tags=["Automation - Milestone 3"]
)

# Workflow routes
app.include_router(
    workflows.router,
    prefix=f"{settings.API_V1_STR}/workflows",
    tags=["Workflows - Milestone 3"]
)


# ============================================
# HEALTH CHECK ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CallCenter SaaS API",
        "version": settings.VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "milestones": {
            "milestone_1": "✅ Complete - Authentication, Users, Admin, Demo",
            "milestone_2": "✅ Complete - Voice AI, Calls, Agents, Analytics",
            "milestone_3": "✅ Complete - SMS, Email, Automation, Workflows"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB connection
        from app.database import database
        if database.client:
            # Ping database
            await database.client.admin.command('ping')
            db_status = "connected"
        else:
            db_status = "disconnected"
        
        return {
            "status": "healthy",
            "database": db_status,
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION
        }
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )


@app.get("/api/v1/status")
async def api_status():
    """API status endpoint with detailed information"""
    # Check service configurations
    from app.services.twilio import twilio_service
    from app.services.ai_agent import ai_agent_service
    from app.services.sms import sms_service
    
    return {
        "api_version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "features": {
            "authentication": True,
            "user_management": True,
            "admin_panel": True,
            "demo_booking": True,
            "voice_calls": twilio_service.is_configured(),
            "ai_agents": ai_agent_service.is_configured(),
            "call_analytics": True,
            "sms_messaging": sms_service.is_configured(),
            "email_campaigns": True,
            "automation": True,
            "workflows": True
        },
        "integrations": {
            "twilio": twilio_service.is_configured(),
            "openai": ai_agent_service.is_configured(),
            "elevenlabs": bool(os.getenv("ELEVENLABS_API_KEY")),
            "mongodb": True,
            "redis": True,
            "celery": True
        }
    }


# ============================================
# STARTUP MESSAGE
# ============================================

@app.on_event("startup")
async def startup_message():
    """Display startup message"""
    logger.info("=" * 60)
    logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"📝 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🌐 API Docs: http://localhost:8000/docs")
    logger.info(f"📊 Health Check: http://localhost:8000/health")
    logger.info("=" * 60)
    logger.info("✅ MILESTONE 1: Authentication & User Management")
    logger.info("✅ MILESTONE 2: Voice AI & Call Center")
    logger.info("✅ MILESTONE 3: SMS, Email & Automation")
    logger.info("=" * 60)
    
    # Check service status
    from app.services.twilio import twilio_service
    from app.services.ai_agent import ai_agent_service
    from app.services.sms import sms_service
    
    logger.info("🔌 Service Status:")
    logger.info(f"   Twilio: {'✅ Configured' if twilio_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   OpenAI: {'✅ Configured' if ai_agent_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   SMS: {'✅ Configured' if sms_service.is_configured() else '⚠️ Not Configured'}")
    logger.info(f"   ElevenLabs: {'✅ Configured' if os.getenv('ELEVENLABS_API_KEY') else '⚠️ Not Configured'}")
    logger.info("=" * 60)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )