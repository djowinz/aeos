import json
from typing import Dict, List, Optional
from urllib.request import urlopen

import httpx
from authlib.integrations.starlette_client import OAuth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from starlette.requests import Request

from config import settings

# Set up OAuth for Auth0
oauth = OAuth()
oauth.register(
    "auth0",
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
)

# Set up the Auth0 JWT verifier
auth0_scheme = HTTPBearer()


class Auth0JWTBearer:
    def __init__(self, domain=settings.AUTH0_DOMAIN, audience=settings.AUTH0_AUDIENCE):
        self.domain = domain
        self.audience = audience
        self.algorithms = ["RS256"]
        self.jwks_uri = f"https://{domain}/.well-known/jwks.json"
        self.jwks = None

    async def __call__(self, credentials: HTTPAuthorizationCredentials = Depends(auth0_scheme)):
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        token = credentials.credentials
        
        try:
            # Get the JWKS from Auth0
            if not self.jwks:
                jsonurl = urlopen(self.jwks_uri)
                self.jwks = json.loads(jsonurl.read())
                
            # Decode the JWT token
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            
            for key in self.jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
                    break
                    
            if not rsa_key:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Unable to find appropriate key",
                    headers={"WWW-Authenticate": "Bearer"},
                )
                
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=self.algorithms,
                audience=self.audience,
                issuer=f"https://{self.domain}/",
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTClaimsError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid claims. Please check the audience and issuer.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to parse authentication token.",
                headers={"WWW-Authenticate": "Bearer"},
            )


# Helper to get current user from Auth0 token
auth0_jwt = Auth0JWTBearer()


async def get_current_user_from_auth0(token: Dict = Depends(auth0_jwt)) -> Dict:
    """Get user information from Auth0 token payload"""
    return {
        "sub": token.get("sub", ""),
        "email": token.get("email", ""),
        "name": token.get("name", ""),
        "picture": token.get("picture", ""),
    }


# Management API helpers using httpx
class Auth0Management:
    def __init__(self):
        self.domain = settings.AUTH0_DOMAIN
        self.mgmt_token = None
        self.token_expires_at = 0
        
    async def get_management_api_token(self) -> str:
        """Get Auth0 Management API token using httpx"""
        import time
        
        current_time = int(time.time())
        if self.mgmt_token and current_time < self.token_expires_at:
            return self.mgmt_token
            
        try:
            token_url = f"https://{self.domain}/oauth/token"
            payload = {
                "grant_type": "client_credentials",
                "client_id": settings.AUTH0_MGMT_CLIENT_ID,
                "client_secret": settings.AUTH0_MGMT_CLIENT_SECRET,
                "audience": settings.AUTH0_MGMT_API_AUDIENCE
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(token_url, json=payload)
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Failed to get Auth0 Management API token: {response.text}"
                    )
                    
                data = response.json()
                self.mgmt_token = data.get("access_token")
                expires_in = data.get("expires_in", 86400)  # Default to 24 hours
                self.token_expires_at = current_time + expires_in - 60  # 1 minute buffer
                
                return self.mgmt_token
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get Auth0 Management API token: {str(e)}"
            )

    async def create_user(self, user_data: Dict) -> Dict:
        """Create a new user in Auth0 using Management API"""
        try:
            token = await self.get_management_api_token()
            users_url = f"https://{self.domain}/api/v2/users"
            
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(users_url, json=user_data, headers=headers)
                
                if response.status_code == 409:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="User already exists"
                    )
                elif response.status_code != 201:
                    data = response.json()
                    error_msg = data.get("message", "Unknown error")
                    error_desc = data.get("description", "")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"{error_msg}: {error_desc}"
                    )
                    
                return response.json()
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}"
            )


# Create a singleton instance
auth0_management = Auth0Management() 