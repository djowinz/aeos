from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Body
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.config import Config
import httpx
from typing import Dict, Optional
from urllib.parse import urlencode
from pydantic import BaseModel

from auth0 import oauth, get_current_user_from_auth0, auth0_management
from config import settings
from schemas import Auth0Token, LoginRequest, Auth0Error, Auth0User, SignupRequest

router = APIRouter(
    prefix="/auth",
    tags=["auth0"],
)


@router.post("/login", response_model=Dict, responses={400: {"model": Auth0Error}})
async def auth0_login(login_data: LoginRequest):
    """
    Embedded login flow for Auth0
    This endpoint exchanges username/password for Auth0 tokens directly
    """
    try:
        # Auth0 password grant request
        token_url = f"https://{settings.AUTH0_DOMAIN}/oauth/token"
        payload = {
            "grant_type": "password",
            "username": login_data.username,
            "password": login_data.password,
            "client_id": settings.AUTH0_CLIENT_ID,
            "client_secret": settings.AUTH0_CLIENT_SECRET,
            "audience": settings.AUTH0_AUDIENCE,
            "scope": "openid profile email offline_access",
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, json=payload)
            data = response.json()
            
            if response.status_code != 200:
                return JSONResponse(
                    status_code=response.status_code,
                    content=data,
                )
                
            return data
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}",
        )


@router.post("/signup", status_code=status.HTTP_201_CREATED, responses={400: {"model": Auth0Error}, 409: {"description": "User already exists"}})
async def auth0_signup(signup_data: SignupRequest):
    """
    Create a new user in Auth0 using the Management API
    """
    try:
        # Prepare user data for Auth0
        user_data = {
            "email": signup_data.email,
            "password": signup_data.password,
            "connection": "Username-Password-Authentication",
            "email_verified": False,
        }
        
        # Add optional fields if provided
        if signup_data.name:
            user_data["name"] = signup_data.name
        
        # Create user in Auth0
        result = await auth0_management.create_user(user_data)
        
        # Return user data without sensitive information
        return {
            "user_id": result.get("user_id", ""),
            "email": result.get("email", ""),
            "name": result.get("name", ""),
            "created_at": result.get("created_at", ""),
            "email_verified": result.get("email_verified", False)
        }
        
    except HTTPException:
        # Pass through HTTP exceptions from the auth0_management class
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}",
        )


@router.get("/user", response_model=Auth0User)
async def get_user(user: Dict = Depends(get_current_user_from_auth0)):
    """
    Get the current user profile from the Auth0 token
    This endpoint requires a valid Auth0 access token in the Authorization header
    """
    return user


# Optional - Standard OAuth2 flows if you need them alongside embedded login
@router.get("/login-oauth")
async def auth0_login_oauth(request: Request):
    """
    Redirect to Auth0 login page
    """
    redirect_uri = settings.AUTH0_CALLBACK_URL
    return await oauth.auth0.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def auth0_callback(request: Request):
    """
    Auth0 callback handler
    """
    try:
        token = await oauth.auth0.authorize_access_token(request)
        user_info = await oauth.auth0.parse_id_token(request, token)
        
        # Store tokens in session
        request.session["user"] = user_info
        request.session["tokens"] = token
        
        # Redirect to frontend or return tokens
        return {"token": token, "user": user_info}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )


@router.get("/logout")
async def auth0_logout(request: Request):
    """
    Log out from Auth0
    """
    request.session.pop("user", None)
    request.session.pop("tokens", None)
    
    # Redirect to Auth0 logout endpoint
    logout_url = f"https://{settings.AUTH0_DOMAIN}/v2/logout"
    params = {
        "client_id": settings.AUTH0_CLIENT_ID,
        "returnTo": request.url_for("root")
    }
    return RedirectResponse(url=f"{logout_url}?{urlencode(params)}")


# Refresh token endpoint
@router.post("/refresh", response_model=Auth0Token)
async def refresh_token(refresh_token: str):
    """
    Refresh an Auth0 access token using a refresh token
    """
    token_url = f"https://{settings.AUTH0_DOMAIN}/oauth/token"
    payload = {
        "grant_type": "refresh_token",
        "client_id": settings.AUTH0_CLIENT_ID,
        "client_secret": settings.AUTH0_CLIENT_SECRET,
        "refresh_token": refresh_token,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, json=payload)
        data = response.json()
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=data.get("error_description", "Failed to refresh token"),
            )
            
        return data 


# Define a model for the social callback request
class SocialCallbackRequest(BaseModel):
    code: str
    state: str

@router.post("/social-callback", response_model=Dict, responses={400: {"model": Auth0Error}})
async def auth0_social_callback(request_data: SocialCallbackRequest):
    """
    Handle the social login callback from Auth0
    This endpoint exchanges the authorization code for Auth0 tokens
    """
    try:
        # Log the received data for debugging
        code = request_data.code
        state = request_data.state
        print(f"Received from frontend - code: {code[:10]}..., state: {state}")
        print(f"Full request data: {request_data}")
        
        # Auth0 authorization code exchange request
        token_url = f"https://{settings.AUTH0_DOMAIN}/oauth/token"
        payload = {
            "grant_type": "authorization_code",
            "client_id": settings.AUTH0_CLIENT_ID,
            "client_secret": settings.AUTH0_CLIENT_SECRET,
            "code": request_data.code,
            "redirect_uri": settings.FRONTEND_CALLBACK_URL,
            "audience": settings.AUTH0_AUDIENCE,
            "scope": "openid profile email offline_access",
        }
        
        print(f"Sending to Auth0: {token_url}")
        print(f"Payload: {payload}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, json=payload)
            data = response.json()
            
            print(f"Auth0 token exchange response status: {response.status_code}")
            print(f"Auth0 response data: {data}")
            
            if response.status_code != 200:
                return JSONResponse(
                    status_code=response.status_code,
                    content=data,
                )
            
            # Convert Auth0 tokens to our application token format
            result = {
                "access_token": data.get("access_token"),
                "token_type": "bearer",
                "expires_in": data.get("expires_in", 86400),
            }
            
            print(f"Returning to frontend: {result}")
            return result
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}",
        ) 