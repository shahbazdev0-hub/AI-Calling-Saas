# # backend/app/database.py - COMPLETE VERSION milestone without google calender or bbok an appointment 

# from motor.motor_asyncio import AsyncIOMotorClient
# from typing import Optional
# import logging

# from app.config import settings

# logger = logging.getLogger(__name__)


# class Database:
#     """Database connection manager"""
    
#     client: Optional[AsyncIOMotorClient] = None
#     database = None
    
#     # Collection references
#     users = None
#     demo_bookings = None
#     subscriptions = None
#     contacts = None
    
#     # Milestone 2 collections
#     calls = None
#     call_logs = None
#     voice_agents = None
#     conversations = None
    
#     # Milestone 3 collections
#     sms_messages = None
#     email_campaigns = None
#     email_templates = None
#     automations = None
#     automation_logs = None
#     workflows = None
#     workflow_executions = None


# # Create database instance
# database = Database()


# async def connect_to_mongo():
#     """Connect to MongoDB"""
#     try:
#         logger.info("🔌 Connecting to MongoDB...")
        
#         # Create MongoDB client
#         database.client = AsyncIOMotorClient(
#             settings.MONGODB_URL,
#             maxPoolSize=10,
#             minPoolSize=1,
#             serverSelectionTimeoutMS=5000
#         )
        
#         # Get database
#         database.database = database.client[settings.DATABASE_NAME]
        
#         # Ping database to verify connection
#         await database.client.admin.command('ping')
        
#         # Initialize collection references - Milestone 1
#         database.users = database.database.users
#         database.demo_bookings = database.database.demo_bookings
#         database.subscriptions = database.database.subscriptions
#         database.contacts = database.database.contacts
        
#         # Initialize collection references - Milestone 2
#         database.calls = database.database.calls
#         database.call_logs = database.database.call_logs
#         database.voice_agents = database.database.voice_agents
#         database.conversations = database.database.conversations
        
#         # Initialize collection references - Milestone 3
#         database.sms_messages = database.database.sms_messages
#         database.email_campaigns = database.database.email_campaigns
#         database.email_templates = database.database.email_templates
#         database.automations = database.database.automations
#         database.automation_logs = database.database.automation_logs
#         database.workflows = database.database.workflows
#         database.workflow_executions = database.database.workflow_executions
        
#         # Create indexes
#         await create_indexes()
        
#         logger.info(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
#         logger.info(f"📊 Database: {settings.DATABASE_NAME}")
        
#     except Exception as e:
#         logger.error(f"❌ Failed to connect to MongoDB: {e}")
#         raise


# async def close_mongo_connection():
#     """Close MongoDB connection"""
#     try:
#         if database.client:
#             database.client.close()
#             logger.info("✅ Disconnected from MongoDB")
#     except Exception as e:
#         logger.error(f"❌ Error disconnecting from MongoDB: {e}")


# async def create_indexes():
#     """Create database indexes for better performance"""
#     try:
#         logger.info("📇 Creating database indexes...")
        
#         # ============================================
#         # MILESTONE 1 INDEXES
#         # ============================================
        
#         # Users collection indexes
#         await database.users.create_index("email", unique=True)
#         await database.users.create_index("created_at")
#         await database.users.create_index([("email", 1), ("is_active", 1)])
        
#         # Demo bookings indexes
#         await database.demo_bookings.create_index("email")
#         await database.demo_bookings.create_index("created_at")
#         await database.demo_bookings.create_index("scheduled_date")
        
#         # Subscriptions indexes
#         await database.subscriptions.create_index("user_id")
#         await database.subscriptions.create_index("status")
#         await database.subscriptions.create_index([("user_id", 1), ("status", 1)])
        
#         # Contacts indexes
#         await database.contacts.create_index("email")
#         await database.contacts.create_index("created_at")
        
#         # ============================================
#         # MILESTONE 2 INDEXES
#         # ============================================
        
#         # Calls collection indexes
#         await database.calls.create_index("user_id")
#         await database.calls.create_index("status")
#         await database.calls.create_index("created_at")
#         await database.calls.create_index([("user_id", 1), ("status", 1)])
#         await database.calls.create_index([("user_id", 1), ("created_at", -1)])
        
#         # Call logs indexes
#         await database.call_logs.create_index("call_id")
#         await database.call_logs.create_index("user_id")
#         await database.call_logs.create_index("created_at")
#         await database.call_logs.create_index([("call_id", 1), ("created_at", 1)])
        
#         # Voice agents indexes
#         await database.voice_agents.create_index("user_id")
#         await database.voice_agents.create_index("name")
#         await database.voice_agents.create_index([("user_id", 1), ("is_active", 1)])
        
#         # Conversations indexes
#         await database.conversations.create_index("call_id")
#         await database.conversations.create_index("user_id")
#         await database.conversations.create_index("created_at")
#         await database.conversations.create_index([("user_id", 1), ("created_at", -1)])
        
#         # ============================================
#         # MILESTONE 3 INDEXES
#         # ============================================
        
#         # SMS messages indexes
#         await database.sms_messages.create_index("user_id")
#         await database.sms_messages.create_index("to_number")
#         await database.sms_messages.create_index("status")
#         await database.sms_messages.create_index("created_at")
#         await database.sms_messages.create_index([("user_id", 1), ("status", 1)])
#         await database.sms_messages.create_index([("user_id", 1), ("created_at", -1)])
#         await database.sms_messages.create_index("twilio_sid")
#         await database.sms_messages.create_index("campaign_id")
        
#         # Email campaigns indexes
#         await database.email_campaigns.create_index("user_id")
#         await database.email_campaigns.create_index("status")
#         await database.email_campaigns.create_index("created_at")
#         await database.email_campaigns.create_index("scheduled_at")
#         await database.email_campaigns.create_index([("user_id", 1), ("status", 1)])
#         await database.email_campaigns.create_index([("user_id", 1), ("created_at", -1)])
        
#         # Email templates indexes
#         await database.email_templates.create_index("user_id")
#         await database.email_templates.create_index("name")
#         await database.email_templates.create_index([("user_id", 1), ("name", 1)])
        
#         # Automations indexes
#         await database.automations.create_index("user_id")
#         await database.automations.create_index("trigger_type")
#         await database.automations.create_index("is_active")
#         await database.automations.create_index([("user_id", 1), ("is_active", 1)])
#         await database.automations.create_index([("trigger_type", 1), ("is_active", 1)])
#         await database.automations.create_index("created_at")
        
#         # Automation logs indexes
#         await database.automation_logs.create_index("automation_id")
#         await database.automation_logs.create_index("user_id")
#         await database.automation_logs.create_index("status")
#         await database.automation_logs.create_index("started_at")
#         await database.automation_logs.create_index([("automation_id", 1), ("started_at", -1)])
#         await database.automation_logs.create_index([("user_id", 1), ("started_at", -1)])
        
#         # Workflows indexes
#         await database.workflows.create_index("user_id")
#         await database.workflows.create_index("is_active")
#         await database.workflows.create_index("created_at")
#         await database.workflows.create_index([("user_id", 1), ("is_active", 1)])
        
#         # Workflow executions indexes
#         await database.workflow_executions.create_index("workflow_id")
#         await database.workflow_executions.create_index("user_id")
#         await database.workflow_executions.create_index("status")
#         await database.workflow_executions.create_index("started_at")
#         await database.workflow_executions.create_index([("workflow_id", 1), ("started_at", -1)])
        
#         logger.info("✅ Database indexes created successfully")
        
#     except Exception as e:
#         logger.error(f"❌ Error creating indexes: {e}")
#         # Don't raise exception, indexes are optional


# async def get_database():
#     """Get database instance"""
#     return database.database


# async def get_collection(collection_name: str):
#     """Get specific collection"""
#     return database.database[collection_name]


# # Export database instance
# __all__ = [
#     "database",
#     "connect_to_mongo",
#     "close_mongo_connection",
#     "get_database",
#     "get_collection"
# ]


# backend/app/database.py - COMPLETE VERSION WITH APPOINTMENTS 

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class Database:
    """Database connection manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    database = None
    
    # Collection references
    users = None
    demo_bookings = None
    subscriptions = None
    contacts = None
    
    # Milestone 2 collections
    calls = None
    call_logs = None
    voice_agents = None
    conversations = None
    
    # Milestone 3 collections
    sms_messages = None
    email_campaigns = None
    email_templates = None
    automations = None
    automation_logs = None
    workflows = None
    workflow_executions = None
    
    # ✅ NEW - Appointments collection
    appointments = None


# Create database instance
database = Database()


async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        logger.info("🔌 Connecting to MongoDB...")
        
        # Create MongoDB client
        database.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            maxPoolSize=10,
            minPoolSize=1,
            serverSelectionTimeoutMS=5000
        )
        
        # Get database
        database.database = database.client[settings.DATABASE_NAME]
        
        # Set collection references
        database.users = database.database.users
        database.demo_bookings = database.database.demo_bookings
        database.subscriptions = database.database.subscriptions
        database.contacts = database.database.contacts
        
        # Milestone 2 collections
        database.calls = database.database.calls
        database.call_logs = database.database.call_logs
        database.voice_agents = database.database.voice_agents
        database.conversations = database.database.conversations
        
        # Milestone 3 collections
        database.sms_messages = database.database.sms_messages
        database.email_campaigns = database.database.email_campaigns
        database.email_templates = database.database.email_templates
        database.automations = database.database.automations
        database.automation_logs = database.database.automation_logs
        database.workflows = database.database.workflows
        database.workflow_executions = database.database.workflow_executions
        
        # ✅ NEW - Appointments collection
        database.appointments = database.database.appointments
        
        # Test connection
        await database.client.admin.command('ping')
        logger.info("✅ Successfully connected to MongoDB!")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection"""
    try:
        if database.client:
            database.client.close()
            logger.info("✅ MongoDB connection closed")
    except Exception as e:
        logger.error(f"❌ Error closing MongoDB connection: {e}")


async def get_database():
    """Get database instance"""
    if database.database is None:
        await connect_to_mongo()
    return database.database


async def get_collection(collection_name: str):
    """Get specific collection"""
    if database.database is None:
        await connect_to_mongo()
    return database.database[collection_name]


async def create_indexes():
    """Create database indexes for better performance"""
    try:
        logger.info("📊 Creating database indexes...")
        
        # Users collection indexes
        await database.users.create_index("email", unique=True)
        await database.users.create_index("verification_token")
        await database.users.create_index("reset_token")
        await database.users.create_index("created_at")
        logger.info("✅ Users indexes created")
        
        # Demo bookings collection indexes
        await database.demo_bookings.create_index("email")
        await database.demo_bookings.create_index("status")
        await database.demo_bookings.create_index("created_at")
        logger.info("✅ Demo bookings indexes created")
        
        # Calls collection indexes
        await database.calls.create_index([("user_id", 1), ("created_at", -1)])
        await database.calls.create_index("call_sid", unique=True, sparse=True)
        await database.calls.create_index("status")
        await database.calls.create_index("direction")
        await database.calls.create_index([("user_id", 1), ("status", 1)])
        logger.info("✅ Calls indexes created")
        
        # Voice agents collection indexes
        await database.voice_agents.create_index([("user_id", 1), ("created_at", -1)])
        await database.voice_agents.create_index("is_active")
        await database.voice_agents.create_index([("user_id", 1), ("is_active", 1)])
        logger.info("✅ Voice agents indexes created")
        
        # Conversations collection indexes
        await database.conversations.create_index([("user_id", 1), ("created_at", -1)])
        await database.conversations.create_index("call_id")
        await database.conversations.create_index("agent_id")
        await database.conversations.create_index([("call_id", 1), ("created_at", -1)])
        logger.info("✅ Conversations indexes created")
        
        # Call logs collection indexes
        await database.call_logs.create_index([("user_id", 1), ("created_at", -1)])
        await database.call_logs.create_index("call_id")
        await database.call_logs.create_index("call_sid")
        logger.info("✅ Call logs indexes created")
        
        # SMS messages collection indexes
        await database.sms_messages.create_index("user_id")
        await database.sms_messages.create_index("status")
        await database.sms_messages.create_index("direction")
        await database.sms_messages.create_index("created_at")
        await database.sms_messages.create_index([("user_id", 1), ("created_at", -1)])
        await database.sms_messages.create_index([("user_id", 1), ("status", 1)])
        await database.sms_messages.create_index("to_number")
        await database.sms_messages.create_index("from_number")
        logger.info("✅ SMS messages indexes created")
        
        # Email campaigns collection indexes
        await database.email_campaigns.create_index("user_id")
        await database.email_campaigns.create_index("status")
        await database.email_campaigns.create_index("created_at")
        await database.email_campaigns.create_index([("user_id", 1), ("status", 1)])
        logger.info("✅ Email campaigns indexes created")
        
        # Automations collection indexes
        await database.automations.create_index("user_id")
        await database.automations.create_index("is_active")
        await database.automations.create_index([("user_id", 1), ("is_active", 1)])
        await database.automations.create_index([("trigger_type", 1), ("is_active", 1)])
        await database.automations.create_index("created_at")
        logger.info("✅ Automations indexes created")
        
        # Automation logs indexes
        await database.automation_logs.create_index("automation_id")
        await database.automation_logs.create_index("user_id")
        await database.automation_logs.create_index("status")
        await database.automation_logs.create_index("started_at")
        await database.automation_logs.create_index([("automation_id", 1), ("started_at", -1)])
        await database.automation_logs.create_index([("user_id", 1), ("started_at", -1)])
        logger.info("✅ Automation logs indexes created")
        
        # Workflows indexes
        await database.workflows.create_index("user_id")
        await database.workflows.create_index("is_active")
        await database.workflows.create_index("created_at")
        await database.workflows.create_index([("user_id", 1), ("is_active", 1)])
        logger.info("✅ Workflows indexes created")
        
        # Workflow executions indexes
        await database.workflow_executions.create_index("workflow_id")
        await database.workflow_executions.create_index("user_id")
        await database.workflow_executions.create_index("status")
        await database.workflow_executions.create_index("started_at")
        await database.workflow_executions.create_index([("workflow_id", 1), ("started_at", -1)])
        logger.info("✅ Workflow executions indexes created")
        
        # ✅ NEW - Appointments collection indexes
        await database.appointments.create_index("user_id")
        await database.appointments.create_index("status")
        await database.appointments.create_index("appointment_date")
        await database.appointments.create_index([("user_id", 1), ("appointment_date", 1)])
        await database.appointments.create_index([("user_id", 1), ("status", 1)])
        await database.appointments.create_index("customer_email")
        await database.appointments.create_index("customer_phone")
        await database.appointments.create_index("google_calendar_event_id")
        await database.appointments.create_index("call_id")
        await database.appointments.create_index("created_at")
        logger.info("✅ Appointments indexes created")
        
        logger.info("✅ All database indexes created successfully")
        
    except Exception as e:
        logger.error(f"❌ Error creating indexes: {e}")
        # Don't raise exception, indexes are optional


# Export database instance
__all__ = [
    "database",
    "connect_to_mongo",
    "close_mongo_connection",
    "get_database",
    "get_collection"
]