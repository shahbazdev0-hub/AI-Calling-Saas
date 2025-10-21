# # config.py till then milestone 2
# from pydantic_settings import BaseSettings
# from typing import List, Optional


# class Settings(BaseSettings):
#     # ============================================
#     # PROJECT INFO
#     # ============================================
#     PROJECT_NAME: str = "CallCenter SaaS API"
#     VERSION: str = "1.0.0"
#     API_V1_STR: str = "/api/v1"
    
#     # ============================================
#     # DATABASE
#     # ============================================
#     MONGODB_URL: str
#     DATABASE_NAME: str = "callcenter_saas"
    
#     # ============================================
#     # SECURITY
#     # ============================================
#     SECRET_KEY: str
#     JWT_SECRET_KEY: str
#     JWT_ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
#     # ============================================
#     # CORS
#     # ============================================
#     BACKEND_CORS_ORIGINS: List[str] = [
#         "http://localhost:5173",
#         "http://localhost:5173",
#         "http://localhost:8000",
#     ]
    
#     # ============================================
#     # EMAIL
#     # ============================================
#     EMAIL_HOST: str
#     EMAIL_PORT: int
#     EMAIL_USER: str
#     EMAIL_PASSWORD: str
#     EMAIL_FROM: str
#     EMAIL_FROM_NAME: str
    
#     # ============================================
#     # FRONTEND
#     # ============================================
#     FRONTEND_URL: str = "http://localhost:5173"
#     ENVIRONMENT: str = "development"
    
#     # ============================================
#     # MILESTONE 2 - TWILIO CONFIGURATION
#     # ============================================
#     TWILIO_ACCOUNT_SID: Optional[str] = None
#     TWILIO_AUTH_TOKEN: Optional[str] = None
#     TWILIO_PHONE_NUMBER: Optional[str] = None
#     TWILIO_WEBHOOK_URL: Optional[str] = None
    
#     # ============================================
#     # MILESTONE 2 - OPENAI CONFIGURATION
#     # ============================================
#     OPENAI_API_KEY: Optional[str] = None
#     OPENAI_MODEL: str = "gpt-4"
#     OPENAI_MAX_TOKENS: int = 500
    
#     # ============================================
#     # MILESTONE 2 - ELEVENLABS CONFIGURATION
#     # ============================================
#     ELEVENLABS_API_KEY: Optional[str] = None
#     ELEVENLABS_VOICE_ID: Optional[str] = None
#     ELEVENLABS_MODEL_ID: str = "eleven_monolingual_v1"
    
#     # ============================================
#     # MILESTONE 2 - WEBSOCKET CONFIGURATION
#     # ============================================
#     WEBSOCKET_HOST: str = "0.0.0.0"
#     WEBSOCKET_PORT: int = 8001

#     class Config:
#         env_file = ".env"
#         case_sensitive = False  # Allow both uppercase and lowercase env vars
#         extra = "ignore"  # Ignore extra fields in .env


# settings = Settings()


# # # backend/app/config.py - MILESTONE 3 UPDATED
# # from pydantic_settings import BaseSettings
# # from typing import List, Optional


# # class Settings(BaseSettings):
# #     # ============================================
# #     # PROJECT INFO
# #     # ============================================
# #     PROJECT_NAME: str = "CallCenter SaaS API"
# #     VERSION: str = "1.0.0"
# #     API_V1_STR: str = "/api/v1"
    
# #     # ============================================
# #     # DATABASE
# #     # ============================================
# #     MONGODB_URL: str
# #     DATABASE_NAME: str = "callcenter_saas"
    
# #     # ============================================
# #     # SECURITY
# #     # ============================================
# #     SECRET_KEY: str
# #     JWT_SECRET_KEY: str
# #     JWT_ALGORITHM: str = "HS256"
# #     ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
# #     # ============================================
# #     # CORS
# #     # ============================================
# #     BACKEND_CORS_ORIGINS: List[str] = [
# #         "http://localhost:5173",
# #         "http://localhost:3000",
# #         "http://localhost:8000",
# #     ]
    
# #     # ============================================
# #     # EMAIL
# #     # ============================================
# #     EMAIL_HOST: str
# #     EMAIL_PORT: int
# #     EMAIL_USER: str
# #     EMAIL_PASSWORD: str
# #     EMAIL_FROM: str
# #     EMAIL_FROM_NAME: str
    
# #     # ============================================
# #     # FRONTEND
# #     # ============================================
# #     FRONTEND_URL: str = "http://localhost:5173"
# #     ENVIRONMENT: str = "development"
    
# #     # ============================================
# #     # MILESTONE 2 - TWILIO CONFIGURATION
# #     # ============================================
# #     TWILIO_ACCOUNT_SID: Optional[str] = None
# #     TWILIO_AUTH_TOKEN: Optional[str] = None
# #     TWILIO_PHONE_NUMBER: Optional[str] = None
# #     TWILIO_WEBHOOK_URL: Optional[str] = None
    
# #     # ============================================
# #     # MILESTONE 2 - OPENAI CONFIGURATION
# #     # ============================================
# #     OPENAI_API_KEY: Optional[str] = None
# #     OPENAI_MODEL: str = "gpt-3.5-turbo"
# #     OPENAI_MAX_TOKENS: int = 500
    
# #     # ============================================
# #     # MILESTONE 2 - ELEVENLABS CONFIGURATION
# #     # ============================================
# #     ELEVENLABS_API_KEY: Optional[str] = None
# #     ELEVENLABS_VOICE_ID: Optional[str] = None
# #     ELEVENLABS_MODEL_ID: str = "eleven_monolingual_v1"
    
# #     # ============================================
# #     # MILESTONE 2 - WEBSOCKET CONFIGURATION
# #     # ============================================
# #     WEBSOCKET_HOST: str = "0.0.0.0"
# #     WEBSOCKET_PORT: int = 8001
    
# #     # ============================================
# #     # MILESTONE 3 - SMS CONFIGURATION
# #     # ============================================
# #     TWILIO_SMS_ENABLED: bool = True
# #     SMS_WEBHOOK_URL: Optional[str] = None
    
# #     # ============================================
# #     # MILESTONE 3 - N8N CONFIGURATION
# #     # ============================================
# #     N8N_API_URL: str = "http://localhost:5678/api/v1"
# #     N8N_API_KEY: Optional[str] = None
# #     N8N_ENABLED: bool = False
    
# #     # ============================================
# #     # MILESTONE 3 - CELERY CONFIGURATION
# #     # ============================================
# #     CELERY_BROKER_URL: str = "redis://localhost:6379/0"
# #     CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
# #     CELERY_TASK_SERIALIZER: str = "json"
# #     CELERY_RESULT_SERIALIZER: str = "json"
# #     CELERY_ACCEPT_CONTENT: List[str] = ["json"]
# #     CELERY_TIMEZONE: str = "UTC"
# #     CELERY_ENABLE_UTC: bool = True
    
# #     # ============================================
# #     # MILESTONE 3 - EMAIL AUTOMATION
# #     # ============================================
# #     EMAIL_AUTOMATION_ENABLED: bool = True
# #     MAX_EMAILS_PER_HOUR: int = 100
# #     MAX_EMAILS_PER_DAY: int = 1000
# #     EMAIL_BATCH_SIZE: int = 50
    
# #     # ============================================
# #     # MILESTONE 3 - SMS AUTOMATION
# #     # ============================================
# #     MAX_SMS_PER_HOUR: int = 100
# #     MAX_SMS_PER_DAY: int = 500
# #     SMS_BATCH_SIZE: int = 25
    
# #     # ============================================
# #     # MILESTONE 3 - AUTOMATION LIMITS
# #     # ============================================
# #     MAX_AUTOMATIONS_PER_USER: int = 50
# #     MAX_WORKFLOWS_PER_USER: int = 25
# #     MAX_AUTOMATION_ACTIONS: int = 20
# #     AUTOMATION_EXECUTION_TIMEOUT: int = 300  # seconds
    
# #     # ============================================
# #     # MILESTONE 3 - WORKFLOW SETTINGS
# #     # ============================================
# #     WORKFLOW_MAX_NODES: int = 50
# #     WORKFLOW_EXECUTION_TIMEOUT: int = 600  # seconds
# #     WORKFLOW_MAX_RETRIES: int = 3
    
# #     # ============================================
# #     # MILESTONE 3 - CAMPAIGN SETTINGS
# #     # ============================================
# #     MAX_CAMPAIGN_RECIPIENTS: int = 10000
# #     CAMPAIGN_SEND_RATE_LIMIT: int = 10  # emails per second
    
# #     class Config:
# #         env_file = ".env"
# #         case_sensitive = False
# #         extra = "ignore"


# # settings = Settings()

# backend/app/config.py - MILESTONE 3 COMPLETE VERSION

from pydantic_settings import BaseSettings
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings(BaseSettings):
    # ============================================
    # PROJECT INFO
    # ============================================
    PROJECT_NAME: str = "CallCenter SaaS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # ============================================
    # DATABASE
    # ============================================
    MONGODB_URL: str
    DATABASE_NAME: str = "callcenter_saas"
    
    # ============================================
    # SECURITY
    # ============================================
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # ============================================
    # CORS
    # ============================================
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    
    # ============================================
    # EMAIL
    # ============================================
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USER: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: str
    EMAIL_FROM_NAME: str
    
    # ============================================
    # FRONTEND
    # ============================================
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    
    # ============================================
    # MILESTONE 2 - TWILIO CONFIGURATION
    # ============================================
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    TWILIO_WEBHOOK_URL: Optional[str] = None
    
    # ============================================
    # MILESTONE 2 - OPENAI CONFIGURATION
    # ============================================
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 500
    
    # ============================================
    # MILESTONE 2 - ELEVENLABS CONFIGURATION
    # ============================================
    ELEVENLABS_API_KEY: Optional[str] = None
    ELEVENLABS_VOICE_ID: Optional[str] = None
    ELEVENLABS_MODEL_ID: str = "eleven_monolingual_v1"
    
    # ============================================
    # MILESTONE 2 - WEBSOCKET CONFIGURATION
    # ============================================
    WEBSOCKET_HOST: str = "0.0.0.0"
    WEBSOCKET_PORT: int = 8001
    
    # ============================================
    # MILESTONE 3 - SMS CONFIGURATION
    # ============================================
    TWILIO_SMS_ENABLED: bool = True
    SMS_WEBHOOK_URL: Optional[str] = None
    
    # ============================================
    # MILESTONE 3 - N8N CONFIGURATION
    # ============================================
    N8N_API_URL: str = "http://localhost:5678/api/v1"
    N8N_API_KEY: Optional[str] = None
    N8N_ENABLED: bool = False
    
    # ============================================
    # MILESTONE 3 - CELERY CONFIGURATION
    # ============================================
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_RESULT_SERIALIZER: str = "json"
    CELERY_ACCEPT_CONTENT: List[str] = ["json"]
    CELERY_TIMEZONE: str = "UTC"
    CELERY_ENABLE_UTC: bool = True
    
    # ============================================
    # MILESTONE 3 - EMAIL AUTOMATION
    # ============================================
    EMAIL_AUTOMATION_ENABLED: bool = True
    MAX_EMAILS_PER_HOUR: int = 100
    MAX_EMAILS_PER_DAY: int = 1000
    EMAIL_BATCH_SIZE: int = 50
    
    # ============================================
    # MILESTONE 3 - SMS AUTOMATION
    # ============================================
    MAX_SMS_PER_HOUR: int = 100
    MAX_SMS_PER_DAY: int = 500
    SMS_BATCH_SIZE: int = 25
    
    # ============================================
    # MILESTONE 3 - AUTOMATION LIMITS
    # ============================================
    MAX_AUTOMATIONS_PER_USER: int = 50
    MAX_WORKFLOWS_PER_USER: int = 25
    MAX_AUTOMATION_ACTIONS: int = 20
    AUTOMATION_EXECUTION_TIMEOUT: int = 300  # seconds
    
    # ============================================
    # MILESTONE 3 - WORKFLOW SETTINGS
    # ============================================
    WORKFLOW_MAX_NODES: int = 50
    WORKFLOW_EXECUTION_TIMEOUT: int = 600  # seconds
    WORKFLOW_MAX_RETRIES: int = 3
    
    # ============================================
    # MILESTONE 3 - CAMPAIGN SETTINGS
    # ============================================
    MAX_CAMPAIGN_RECIPIENTS: int = 10000
    CAMPAIGN_SEND_RATE_LIMIT: int = 10  # emails per second
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
