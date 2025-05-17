from typing import Dict, Any, Optional
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    """
    Base error response schema
    """
    detail: str
    code: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class AuthenticationError(ErrorResponse):
    """
    Authentication error response schema
    """
    code: str = "AUTHENTICATION_ERROR"

class AuthorizationError(ErrorResponse):
    """
    Authorization error response schema
    """
    code: str = "AUTHORIZATION_ERROR"

class ValidationError(ErrorResponse):
    """
    Validation error response schema
    """
    code: str = "VALIDATION_ERROR"

class NotFoundError(ErrorResponse):
    """
    Not found error response schema
    """
    code: str = "NOT_FOUND_ERROR"

class ConflictError(ErrorResponse):
    """
    Conflict error response schema
    """
    code: str = "CONFLICT_ERROR"

class InternalServerError(ErrorResponse):
    """
    Internal server error response schema
    """
    code: str = "INTERNAL_SERVER_ERROR" 