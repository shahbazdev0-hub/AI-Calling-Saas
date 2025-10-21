# backend/app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.auth import get_current_user_from_token
from app.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current authenticated user"""
    try:
        user = await get_current_user_from_token(credentials.credentials, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """Get current active user"""
    if not current_user.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_admin_user(current_user: dict = Depends(get_current_active_user)):
    """Get current admin user"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

# ✅ ADDED - Alias for admin.py which expects this function name
async def get_current_admin_user(current_user: dict = Depends(get_current_active_user)):
    """Get current admin user - alias for get_admin_user"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user