from typing import List, Optional, Annotated, Dict, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the item")
    description: Optional[str] = Field(None, description="Optional description of the item")
    price: float = Field(..., gt=0, description="Price of the item (must be greater than 0)")
    tax: Optional[float] = Field(None, ge=0, description="Optional tax amount (must be non-negative)")


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: str = Field(..., description="Unique identifier for the item")

    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User email address")


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")


class User(UserBase):
    id: int = Field(..., description="Unique identifier for the user")
    is_active: bool = Field(True, description="Whether the user is active")
    items: List[Item] = Field(default_factory=list, description="Items owned by the user")

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(..., description="Token type")


class TokenData(BaseModel):
    username: Optional[str] = Field(None, description="Username extracted from token")


# Auth0 specific schemas
class Auth0User(BaseModel):
    sub: str = Field(..., description="Auth0 subject identifier")
    email: Optional[str] = Field(None, description="User email address")
    name: Optional[str] = Field(None, description="User full name")
    picture: Optional[str] = Field(None, description="URL to user profile picture")
    
    model_config = ConfigDict(from_attributes=True)


class Auth0Token(BaseModel):
    access_token: str = Field(..., description="Auth0 access token")
    id_token: str = Field(..., description="Auth0 ID token")
    token_type: str = Field(..., description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    
    
class LoginRequest(BaseModel):
    username: str = Field(..., description="Username or email for login")
    password: str = Field(..., description="Password for login")


class SignupRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")
    company: str = Field(..., description="User's company")
    name: Optional[str] = Field(None, description="User's full name")
    
    
class Auth0Error(BaseModel):
    error: str = Field(..., description="Error type")
    error_description: str = Field(..., description="Error description") 