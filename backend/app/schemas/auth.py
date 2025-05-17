from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict

class Auth0User(BaseModel):
    """
    Schema for Auth0 user information
    """
    sub: str = Field(..., description="Auth0 subject identifier")
    email: Optional[str] = Field(None, description="User email address")
    name: Optional[str] = Field(None, description="User full name")
    picture: Optional[str] = Field(None, description="URL to user profile picture")
    
    model_config = ConfigDict(from_attributes=True)

class Auth0Token(BaseModel):
    """
    Schema for Auth0 token response
    """
    access_token: str = Field(..., description="Auth0 access token")
    id_token: str = Field(..., description="Auth0 ID token")
    token_type: str = Field(..., description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")

class LoginRequest(BaseModel):
    """
    Schema for login request
    """
    username: str = Field(..., description="Username or email for login")
    password: str = Field(..., description="Password for login")

class SignupRequest(BaseModel):
    """
    Schema for signup request
    """
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")
    company: str = Field(..., description="User's company")
    name: Optional[str] = Field(None, description="User's full name")

class Auth0Error(BaseModel):
    """
    Schema for Auth0 error response
    """
    error: str = Field(..., description="Error type")
    error_description: str = Field(..., description="Error description") 