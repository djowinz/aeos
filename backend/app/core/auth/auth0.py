from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError
import httpx
from urllib.parse import urlencode

from app.core.config import settings
from app.core.schemas.error import AuthenticationError, AuthorizationError

security = HTTPBearer()

class Auth0Handler:
    """
    Auth0 authentication handler
    """
    def __init__(self):
        self.domain = settings.AUTH0_DOMAIN
        self.client_id = settings.AUTH0_CLIENT_ID
        self.client_secret = settings.AUTH0_CLIENT_SECRET
        self.audience = settings.AUTH0_AUDIENCE
        self.algorithms = settings.AUTH0_ALGORITHMS

    def get_token_auth_header(self, credentials: HTTPAuthorizationCredentials) -> str:
        """
        Get the token from the Authorization header
        """
        if not credentials:
            raise AuthenticationError("No authorization header")
        
        parts = credentials.credentials.split()
        if parts[0].lower() != "bearer":
            raise AuthenticationError("Authorization header must start with Bearer")
        elif len(parts) == 1:
            raise AuthenticationError("Token not found")
        elif len(parts) > 2:
            raise AuthenticationError("Authorization header must be Bearer token")
        
        return parts[1]

    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify the JWT token
        """
        try:
            jwks_url = f"https://{self.domain}/.well-known/jwks.json"
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            
            for key in self.get_jwks(jwks_url):
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
                    break

            if rsa_key:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=self.algorithms,
                    audience=self.audience,
                    issuer=f"https://{self.domain}/"
                )
                return payload
            
            raise AuthenticationError("Unable to find appropriate key")
            
        except PyJWTError as e:
            raise AuthenticationError(str(e))

    def get_jwks(self, jwks_url: str) -> list:
        """
        Get JWKS from Auth0
        """
        response = httpx.get(jwks_url)
        return response.json()["keys"]

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new user in Auth0
        """
        # Get management API token
        token = await self.get_management_token()
        
        # Create user
        url = f"https://{self.domain}/api/v2/users"
        headers = {"Authorization": f"Bearer {token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=user_data, headers=headers)
            if response.status_code != 201:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json()
                )
            return response.json()

    async def get_management_token(self) -> str:
        """
        Get Auth0 Management API token
        """
        url = f"https://{self.domain}/oauth/token"
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "audience": f"https://{self.domain}/api/v2/",
            "grant_type": "client_credentials"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to get management token"
                )
            return response.json()["access_token"]

    async def authorize_redirect(self, request: Request, redirect_uri: str) -> Any:
        """
        Redirect to Auth0 authorization page
        """
        url = f"https://{self.domain}/authorize"
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "scope": "openid profile email",
            "audience": self.audience,
            "state": request.session.get("state", "")
        }
        return f"{url}?{urlencode(params)}"

    async def authorize_access_token(self, request: Request) -> Dict[str, Any]:
        """
        Exchange authorization code for access token
        """
        code = request.query_params.get("code")
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Authorization code not found"
            )
            
        url = f"https://{self.domain}/oauth/token"
        payload = {
            "grant_type": "authorization_code",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "redirect_uri": settings.AUTH0_CALLBACK_URL
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to get access token"
                )
            return response.json()

    async def parse_id_token(self, request: Request, token: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse and verify ID token
        """
        id_token = token.get("id_token")
        if not id_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ID token not found"
            )
            
        try:
            return self.verify_token(id_token)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid ID token: {str(e)}"
            )

auth0_handler = Auth0Handler()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    Get current user from Auth0 token
    """
    token = auth0_handler.get_token_auth_header(credentials)
    return auth0_handler.verify_token(token)

async def get_current_active_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get current active user
    """
    if not current_user.get("sub"):
        raise AuthenticationError("Invalid token")
    return current_user 