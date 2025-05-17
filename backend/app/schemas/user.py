from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict

from app.schemas.item import Item

class UserBase(BaseModel):
    """
    Base schema for User
    """
    email: EmailStr = Field(..., description="User email address")
    name: Optional[str] = Field(None, description="User's full name")
    company: Optional[str] = Field(None, description="User's company")

class UserCreate(UserBase):
    """
    Schema for creating a new User
    """
    pass

class UserUpdate(UserBase):
    """
    Schema for updating an existing User
    """
    email: Optional[EmailStr] = Field(None, description="User email address")
    is_active: Optional[bool] = Field(None, description="Whether the user is active")

class User(UserBase):
    """
    Schema for User response
    """
    id: str = Field(..., description="Unique identifier for the user")
    is_active: bool = Field(True, description="Whether the user is active")
    picture: Optional[str] = Field(None, description="URL to user profile picture")
    items: List[Item] = Field(default_factory=list, description="Items owned by the user")

    model_config = ConfigDict(from_attributes=True) 