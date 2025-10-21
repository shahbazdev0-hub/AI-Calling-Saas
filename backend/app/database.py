# # backend/app/database.py milestone 2
# import motor.motor_asyncio
# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# from app.config import settings
# import logging

# logger = logging.getLogger(__name__)


# class Database:
#     client: AsyncIOMotorClient = None
#     database: AsyncIOMotorDatabase = None
    
#     # ✅ FIXED - Use "is not None" instead of truthiness check
#     @property
#     def users(self):
#         """Users collection"""
#         return self.database.users if self.database is not None else None
    
#     @property
#     def demo_bookings(self):
#         """Demo bookings collection"""
#         return self.database.demo_bookings if self.database is not None else None
    
#     @property
#     def calls(self):
#         """Calls collection"""
#         return self.database.calls if self.database is not None else None
    
#     @property
#     def voice_agents(self):
#         """Voice agents collection"""
#         return self.database.voice_agents if self.database is not None else None
    
#     @property
#     def conversations(self):
#         """Conversations collection"""
#         return self.database.conversations if self.database is not None else None
    
#     @property
#     def messages(self):
#         """Messages collection"""
#         return self.database.messages if self.database is not None else None
    
#     @property
#     def call_logs(self):
#         """Call logs collection"""
#         return self.database.call_logs if self.database is not None else None
    
#     @property
#     def customers(self):
#         """Customers collection"""
#         return self.database.customers if self.database is not None else None


# db = Database()


# async def connect_to_mongo():
#     """Create database connection"""
#     try:
#         print(f"🔌 Connecting to MongoDB...")
#         print(f"📍 Database URL: {settings.MONGODB_URL}")
#         print(f"🗄️ Database Name: {settings.DATABASE_NAME}")
       
#         db.client = AsyncIOMotorClient(settings.MONGODB_URL)
#         db.database = db.client[settings.DATABASE_NAME]
       
#         # Test the connection
#         await db.client.admin.command('ping')
#         print("✅ Successfully connected to MongoDB!")
       
#         # Create indexes for better performance
#         await create_indexes()
       
#     except Exception as e:
#         print(f"❌ Failed to connect to MongoDB: {e}")
#         raise e


# async def close_mongo_connection():
#     """Close database connection"""
#     try:
#         if db.client is not None:  # ✅ FIXED
#             db.client.close()
#             print("✅ Disconnected from MongoDB")
#     except Exception as e:
#         print(f"❌ Error disconnecting from MongoDB: {e}")


# async def get_database() -> AsyncIOMotorDatabase:
#     """Get database instance for dependency injection"""
#     if db.database is None:
#         await connect_to_mongo()
#     return db.database


# async def get_collection(collection_name: str):
#     """Get a specific collection"""
#     if db.database is None:
#         await connect_to_mongo()
#     return db.database[collection_name]


# async def create_indexes():
#     """Create database indexes for better performance"""
#     try:
#         # Users collection indexes
#         await db.database.users.create_index("email", unique=True)
#         await db.database.users.create_index("verification_token")
#         await db.database.users.create_index("reset_token")
       
#         # Demo bookings collection indexes
#         await db.database.demo_bookings.create_index("email")
#         await db.database.demo_bookings.create_index("status")
#         await db.database.demo_bookings.create_index("created_at")
       
#         # NEW - Milestone 2 indexes
#         # Calls collection indexes
#         await db.database.calls.create_index([("user_id", 1), ("created_at", -1)])
#         await db.database.calls.create_index("call_sid", unique=True, sparse=True)
#         await db.database.calls.create_index("status")
       
#         # Voice agents collection indexes
#         await db.database.voice_agents.create_index([("user_id", 1), ("created_at", -1)])
#         await db.database.voice_agents.create_index("is_active")
       
#         # Conversations collection indexes
#         await db.database.conversations.create_index([("user_id", 1), ("created_at", -1)])
#         await db.database.conversations.create_index("call_id")
#         await db.database.conversations.create_index("agent_id")
#         await db.database.conversations.create_index("status")
       
#         # Messages collection indexes
#         await db.database.messages.create_index([("conversation_id", 1), ("timestamp", 1)])
       
#         # Call logs collection indexes
#         await db.database.call_logs.create_index([("user_id", 1), ("created_at", -1)])
#         await db.database.call_logs.create_index("call_id")
       
#         print("✅ Database indexes created successfully")
       
#     except Exception as e:
#         print(f"⚠️ Warning: Could not create some indexes: {e}")
# backend/app/database.py - COMPLETE VERSION milestone 3

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
        
        # Ping database to verify connection
        await database.client.admin.command('ping')
        
        # Initialize collection references - Milestone 1
        database.users = database.database.users
        database.demo_bookings = database.database.demo_bookings
        database.subscriptions = database.database.subscriptions
        database.contacts = database.database.contacts
        
        # Initialize collection references - Milestone 2
        database.calls = database.database.calls
        database.call_logs = database.database.call_logs
        database.voice_agents = database.database.voice_agents
        database.conversations = database.database.conversations
        
        # Initialize collection references - Milestone 3
        database.sms_messages = database.database.sms_messages
        database.email_campaigns = database.database.email_campaigns
        database.email_templates = database.database.email_templates
        database.automations = database.database.automations
        database.automation_logs = database.database.automation_logs
        database.workflows = database.database.workflows
        database.workflow_executions = database.database.workflow_executions
        
        # Create indexes
        await create_indexes()
        
        logger.info(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        logger.info(f"📊 Database: {settings.DATABASE_NAME}")
        
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection"""
    try:
        if database.client:
            database.client.close()
            logger.info("✅ Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"❌ Error disconnecting from MongoDB: {e}")


async def create_indexes():
    """Create database indexes for better performance"""
    try:
        logger.info("📇 Creating database indexes...")
        
        # ============================================
        # MILESTONE 1 INDEXES
        # ============================================
        
        # Users collection indexes
        await database.users.create_index("email", unique=True)
        await database.users.create_index("created_at")
        await database.users.create_index([("email", 1), ("is_active", 1)])
        
        # Demo bookings indexes
        await database.demo_bookings.create_index("email")
        await database.demo_bookings.create_index("created_at")
        await database.demo_bookings.create_index("scheduled_date")
        
        # Subscriptions indexes
        await database.subscriptions.create_index("user_id")
        await database.subscriptions.create_index("status")
        await database.subscriptions.create_index([("user_id", 1), ("status", 1)])
        
        # Contacts indexes
        await database.contacts.create_index("email")
        await database.contacts.create_index("created_at")
        
        # ============================================
        # MILESTONE 2 INDEXES
        # ============================================
        
        # Calls collection indexes
        await database.calls.create_index("user_id")
        await database.calls.create_index("status")
        await database.calls.create_index("created_at")
        await database.calls.create_index([("user_id", 1), ("status", 1)])
        await database.calls.create_index([("user_id", 1), ("created_at", -1)])
        
        # Call logs indexes
        await database.call_logs.create_index("call_id")
        await database.call_logs.create_index("user_id")
        await database.call_logs.create_index("created_at")
        await database.call_logs.create_index([("call_id", 1), ("created_at", 1)])
        
        # Voice agents indexes
        await database.voice_agents.create_index("user_id")
        await database.voice_agents.create_index("name")
        await database.voice_agents.create_index([("user_id", 1), ("is_active", 1)])
        
        # Conversations indexes
        await database.conversations.create_index("call_id")
        await database.conversations.create_index("user_id")
        await database.conversations.create_index("created_at")
        await database.conversations.create_index([("user_id", 1), ("created_at", -1)])
        
        # ============================================
        # MILESTONE 3 INDEXES
        # ============================================
        
        # SMS messages indexes
        await database.sms_messages.create_index("user_id")
        await database.sms_messages.create_index("to_number")
        await database.sms_messages.create_index("status")
        await database.sms_messages.create_index("created_at")
        await database.sms_messages.create_index([("user_id", 1), ("status", 1)])
        await database.sms_messages.create_index([("user_id", 1), ("created_at", -1)])
        await database.sms_messages.create_index("twilio_sid")
        await database.sms_messages.create_index("campaign_id")
        
        # Email campaigns indexes
        await database.email_campaigns.create_index("user_id")
        await database.email_campaigns.create_index("status")
        await database.email_campaigns.create_index("created_at")
        await database.email_campaigns.create_index("scheduled_at")
        await database.email_campaigns.create_index([("user_id", 1), ("status", 1)])
        await database.email_campaigns.create_index([("user_id", 1), ("created_at", -1)])
        
        # Email templates indexes
        await database.email_templates.create_index("user_id")
        await database.email_templates.create_index("name")
        await database.email_templates.create_index([("user_id", 1), ("name", 1)])
        
        # Automations indexes
        await database.automations.create_index("user_id")
        await database.automations.create_index("trigger_type")
        await database.automations.create_index("is_active")
        await database.automations.create_index([("user_id", 1), ("is_active", 1)])
        await database.automations.create_index([("trigger_type", 1), ("is_active", 1)])
        await database.automations.create_index("created_at")
        
        # Automation logs indexes
        await database.automation_logs.create_index("automation_id")
        await database.automation_logs.create_index("user_id")
        await database.automation_logs.create_index("status")
        await database.automation_logs.create_index("started_at")
        await database.automation_logs.create_index([("automation_id", 1), ("started_at", -1)])
        await database.automation_logs.create_index([("user_id", 1), ("started_at", -1)])
        
        # Workflows indexes
        await database.workflows.create_index("user_id")
        await database.workflows.create_index("is_active")
        await database.workflows.create_index("created_at")
        await database.workflows.create_index([("user_id", 1), ("is_active", 1)])
        
        # Workflow executions indexes
        await database.workflow_executions.create_index("workflow_id")
        await database.workflow_executions.create_index("user_id")
        await database.workflow_executions.create_index("status")
        await database.workflow_executions.create_index("started_at")
        await database.workflow_executions.create_index([("workflow_id", 1), ("started_at", -1)])
        
        logger.info("✅ Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"❌ Error creating indexes: {e}")
        # Don't raise exception, indexes are optional


async def get_database():
    """Get database instance"""
    return database.database


async def get_collection(collection_name: str):
    """Get specific collection"""
    return database.database[collection_name]


# Export database instance
__all__ = [
    "database",
    "connect_to_mongo",
    "close_mongo_connection",
    "get_database",
    "get_collection"
]