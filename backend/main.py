from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.middleware.sessions import SessionMiddleware

from routers import items, users, auth0_login
from auth0 import get_current_user_from_auth0
from config import settings
from typing import Annotated
from errors import ErrorResponse

app = FastAPI(
    title=settings.APP_NAME,
    description="A FastAPI template with CRUD operations and strong typing",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware for Auth0
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    max_age=1800,  # 30 minutes session lifetime
)

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler for validation errors"""
    errors = {}
    for error in exc.errors():
        location = error.get("loc", [])
        if len(location) > 1:
            field = location[1]
            if field not in errors:
                errors[field] = []
            errors[field].append(error.get("msg"))
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            detail="Validation Error",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_type="validation_error",
            errors=errors
        ).model_dump(),
    )

# Include routers with API prefix
app.include_router(items.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(auth0_login.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI template API"}

@app.get(f"{settings.API_PREFIX}/auth0-protected")
async def auth0_protected_route(current_user: Annotated[dict, Depends(get_current_user_from_auth0)]):
    return {"message": "This is a protected route using Auth0", "user": current_user}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True) 