from fastapi import HTTPException, status
from pydantic import BaseModel, validator, Field
from typing import Optional, List, Dict, Any


class ErrorResponse(BaseModel):
    """Standardized error response model"""
    detail: str = Field(..., description="Error description")
    status_code: int = Field(..., description="HTTP status code")
    error_type: str = Field(..., description="Type of error")
    errors: Optional[Dict[str, List[str]]] = Field(None, description="Validation errors by field")


class UserNotFoundError(HTTPException):
    """Raised when a user is not found"""
    def __init__(self, user_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )


class ItemNotFoundError(HTTPException):
    """Raised when an item is not found"""
    def __init__(self, item_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found"
        )


class ValidationError(HTTPException):
    """Raised when validation fails"""
    def __init__(self, errors: Dict[str, List[str]]):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Validation error",
            headers={"X-Error-Type": "validation_error"}
        )
        self.errors = errors


class ItemValidator:
    """Validators for item data"""
    
    @staticmethod
    def validate_price(price: float) -> float:
        """Validate that price is positive"""
        if price <= 0:
            raise ValueError("Price must be greater than zero")
        return price
    
    @staticmethod
    def validate_tax(tax: Optional[float]) -> Optional[float]:
        """Validate that tax is non-negative"""
        if tax is not None and tax < 0:
            raise ValueError("Tax must be non-negative")
        return tax


class UserValidator:
    """Validators for user data"""
    
    @staticmethod
    def validate_email(email: str) -> str:
        """Basic email validation"""
        if not "@" in email:
            raise ValueError("Email must contain @")
        return email
    
    @staticmethod
    def validate_password(password: str) -> str:
        """Basic password validation"""
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return password 