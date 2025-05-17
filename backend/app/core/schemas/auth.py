from typing import Optional
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    """
    Login request schema
    """
    username: str
    password: str

class SignupRequest(BaseModel):
    """
    Signup request schema
    """
    email: EmailStr
    password: str
    name: Optional[str] = None

class Auth0Token(BaseModel):
    """
    Auth0 token response schema
    """
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str] = None
    id_token: Optional[str] = None
    scope: Optional[str] = None

class Auth0User(BaseModel):
    """
    Auth0 user profile schema
    """
    sub: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    email_verified: Optional[bool] = None
    picture: Optional[str] = None
    updated_at: Optional[str] = None 