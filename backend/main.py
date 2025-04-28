from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from routers import items, users, auth
from auth import get_current_user
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

# Include routers
app.include_router(items.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI template API"}

@app.get("/protected")
async def protected_route(current_user: Annotated[dict, Depends(get_current_user)]):
    return {"message": "This is a protected route", "user": current_user}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 