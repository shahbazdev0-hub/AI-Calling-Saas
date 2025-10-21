# backend/app/schemas/__init__.py
"""
Pydantic Schemas Package

Contains all request/response schemas for API validation.
"""

from .user import UserCreate, UserUpdate, UserResponse
from .auth import Token, TokenData, UserLogin, PasswordReset, PasswordResetConfirm, EmailVerification
from .demo import DemoBookingCreate, DemoBookingResponse

__all__ = [
    "UserCreate",
    "UserUpdate", 
    "UserResponse",
    "Token",
    "TokenData",
    "UserLogin",
    "PasswordReset",
    "PasswordResetConfirm",
    "EmailVerification",
    "DemoBookingCreate",
    "DemoBookingResponse",
]