from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import httpx
from typing import Dict, Optional, Any
from urllib.parse import urlencode
from pydantic import BaseModel

from app.core.database import get_db
from app.core.auth.auth0 import auth0_handler, get_current_active_user
from app.core.config import settings
from app.repositories.user import UserRepository
from app.schemas.auth import (
    Auth0Token, LoginRequest, SignupRequest, Auth0Error, Auth0User,
    SocialCallbackRequest
)
from app.core.schemas.error import AuthenticationError

router = APIRouter()
user_repository = UserRepository()

@router.post("/login", response_model=Auth0Token)
async def login(request: LoginRequest, db: Session = Depends(get_db)) -> Any:
    """
    Login with Auth0 using password grant
    """
    try:
        url = f"https://{auth0_handler.domain}/oauth/token"
        payload = {
            "grant_type": "password",
            "username": request.username,
            "password": request.password,
            "client_id": auth0_handler.client_id,
            "client_secret": auth0_handler.client_secret,
            "audience": auth0_handler.audience,
            "scope": "openid profile email"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise AuthenticationError("Invalid credentials")
            return response.json()
    except Exception as e:
        raise AuthenticationError(str(e))

@router.post("/signup", response_model=Auth0Token)
async def signup(request: SignupRequest, db: Session = Depends(get_db)) -> Any:
    """
    Sign up with Auth0
    """
    try:
        # Create user in Auth0
        user_data = {
            "email": request.email,
            "password": request.password,
            "connection": "Username-Password-Authentication",
            "user_metadata": {
                "name": request.name
            }
        }
        
        auth0_user = await auth0_handler.create_user(user_data)
        
        # Get token for the new user
        url = f"https://{auth0_handler.domain}/oauth/token"
        payload = {
            "grant_type": "password",
            "username": request.email,
            "password": request.password,
            "client_id": auth0_handler.client_id,
            "client_secret": auth0_handler.client_secret,
            "audience": auth0_handler.audience,
            "scope": "openid profile email"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise AuthenticationError("Failed to get token for new user")
            return response.json()
    except Exception as e:
        raise AuthenticationError(str(e))

@router.get("/user")
async def get_user(current_user: Dict[str, Any] = Depends(get_current_active_user)) -> Any:
    """
    Get current user profile
    """
    return current_user

@router.get("/login")
async def login_redirect(request: Request) -> Any:
    """
    Redirect to Auth0 login page
    """
    redirect_uri = str(request.url_for("auth0_callback"))
    return await auth0_handler.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def auth0_callback(request: Request) -> Any:
    """
    Handle Auth0 callback
    """
    try:
        token = await auth0_handler.authorize_access_token(request)
        user = await auth0_handler.parse_id_token(request, token)
        
        # Store user info in session
        request.session["user"] = user
        
        return RedirectResponse(url="/")
    except Exception as e:
        raise AuthenticationError(str(e))

@router.get("/logout")
async def logout(request: Request) -> Any:
    """
    Logout from Auth0
    """
    request.session.clear()
    return RedirectResponse(
        url=f"https://{auth0_handler.domain}/v2/logout?"
        f"client_id={auth0_handler.client_id}&"
        f"returnTo={settings.AUTH0_LOGOUT_URL}"
    )

@router.post("/token/refresh")
async def refresh_token(request: Request) -> Any:
    """
    Refresh Auth0 access token
    """
    try:
        refresh_token = request.json().get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refresh token not provided"
            )
            
        url = f"https://{auth0_handler.domain}/oauth/token"
        payload = {
            "grant_type": "refresh_token",
            "client_id": auth0_handler.client_id,
            "client_secret": auth0_handler.client_secret,
            "refresh_token": refresh_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise AuthenticationError("Failed to refresh token")
            return response.json()
    except Exception as e:
        raise AuthenticationError(str(e))

@router.get("/social/callback")
async def social_callback(request: Request) -> Any:
    """
    Handle social login callback
    """
    try:
        token = await auth0_handler.authorize_access_token(request)
        user = await auth0_handler.parse_id_token(request, token)
        
        # Store user info in session
        request.session["user"] = user
        
        return RedirectResponse(url="/")
    except Exception as e:
        raise AuthenticationError(str(e)) 