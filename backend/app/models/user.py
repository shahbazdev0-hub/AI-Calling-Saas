# # backend/app/models/user.py
# from pydantic import BaseModel, Field, EmailStr, ConfigDict
# from typing import Optional, List, Annotated
# from datetime import datetime
# from bson import ObjectId
# from pydantic_core import core_schema

# class PyObjectId(ObjectId):
#     @classmethod
#     def __get_pydantic_core_schema__(
#         cls, source_type, handler
#     ) -> core_schema.CoreSchema:
#         return core_schema.json_or_python_schema(
#             json_schema=core_schema.str_schema(),
#             python_schema=core_schema.union_schema([
#                 core_schema.is_instance_schema(ObjectId),
#                 core_schema.chain_schema([
#                     core_schema.str_schema(),
#                     core_schema.no_info_plain_validator_function(cls.validate),
#                 ])
#             ]),
#             serialization=core_schema.plain_serializer_function_ser_schema(
#                 lambda x: str(x)
#             ),
#         )

#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError("Invalid objectid")
#         return ObjectId(v)

# class User(BaseModel):
#     model_config = ConfigDict(
#         populate_by_name=True,
#         arbitrary_types_allowed=True,
#         json_encoders={ObjectId: str}
#     )
    
#     id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
#     email: EmailStr
#     full_name: str
#     company: Optional[str] = None
#     phone: Optional[str] = None
#     is_active: bool = True
#     is_verified: bool = False
#     is_admin: bool = False
#     subscription_plan: str = "free"  # free, basic, pro, enterprise
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: datetime = Field(default_factory=datetime.utcnow)
#     last_login: Optional[datetime] = None

# class UserInDB(User):
#     hashed_password: str
#     verification_token: Optional[str] = None
#     reset_token: Optional[str] = None
#     reset_token_expires: Optional[datetime] = None

# class UserResponse(BaseModel):
#     id: str
#     email: EmailStr
#     full_name: str
#     company: Optional[str] = None
#     phone: Optional[str] = None
#     is_active: bool
#     is_verified: bool
#     is_admin: bool
#     subscription_plan: str
#     created_at: datetime
#     last_login: Optional[datetime] = None



# backend/app/models/user.py
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List, Annotated, Dict, Any
from datetime import datetime
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type, handler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

# ✅ NEW - Notification preferences model
class NotificationPreferences(BaseModel):
    """User notification preferences"""
    email_campaigns: bool = True
    sms_alerts: bool = False
    call_summaries: bool = True
    weekly_reports: bool = True
    security_alerts: bool = True

class User(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    full_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    is_admin: bool = False
    subscription_plan: str = "free"  # free, basic, pro, enterprise
    
    # ✅ NEW - Add notification preferences with default values
    notification_preferences: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {
            "email_campaigns": True,
            "sms_alerts": False,
            "call_summaries": True,
            "weekly_reports": True,
            "security_alerts": True
        }
    )
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserInDB(User):
    """User model with sensitive fields for database storage"""
    hashed_password: str
    verification_token: Optional[str] = None
    verification_token_expires: Optional[datetime] = None
    reset_token: Optional[str] = None
    reset_token_expires: Optional[datetime] = None

class UserResponse(BaseModel):
    """User response model for API responses"""
    id: str
    email: EmailStr
    full_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    is_verified: bool
    is_admin: bool
    subscription_plan: str
    
    # ✅ NEW - Include notification preferences in API responses
    notification_preferences: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {
            "email_campaigns": True,
            "sms_alerts": False,
            "call_summaries": True,
            "weekly_reports": True,
            "security_alerts": True
        }
    )
    
    created_at: datetime
    last_login: Optional[datetime] = None

# ✅ ENHANCED - Add notification preferences to existing response
class UserInDBResponse(UserResponse):
    """Extended user response with hashed password (for internal use)"""
    hashed_password: str