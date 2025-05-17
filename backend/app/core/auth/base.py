from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.schemas.error import AuthenticationError, AuthorizationError

security = HTTPBearer()

class BaseAuthHandler:
    """
    Base authentication handler
    """
    def verify_permissions(self, user: Dict[str, Any], required_permissions: list) -> bool:
        """
        Verify if user has required permissions
        """
        if not user.get("permissions"):
            return False
        
        return all(perm in user["permissions"] for perm in required_permissions)

    def verify_roles(self, user: Dict[str, Any], required_roles: list) -> bool:
        """
        Verify if user has required roles
        """
        if not user.get("roles"):
            return False
        
        return all(role in user["roles"] for role in required_roles)

def require_permissions(required_permissions: list):
    """
    Decorator to require specific permissions
    """
    def decorator(user: Dict[str, Any] = Depends(get_current_user)):
        if not auth0_handler.verify_permissions(user, required_permissions):
            raise AuthorizationError("Insufficient permissions")
        return user
    return decorator

def require_roles(required_roles: list):
    """
    Decorator to require specific roles
    """
    def decorator(user: Dict[str, Any] = Depends(get_current_user)):
        if not auth0_handler.verify_roles(user, required_roles):
            raise AuthorizationError("Insufficient roles")
        return user
    return decorator 