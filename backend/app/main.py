from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.middleware import setup_middleware
from app.core.exceptions import setup_exception_handlers

def create_application() -> FastAPI:
    """
    Application factory pattern for creating the FastAPI application
    """
    application = FastAPI(
        title=settings.APP_NAME,
        description="A FastAPI template with CRUD operations and strong typing",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json"
    )

    # Setup middleware
    setup_middleware(application)
    
    # Setup exception handlers
    setup_exception_handlers(application)
    
    # Include API router
    application.include_router(api_router, prefix=settings.API_PREFIX)
    
    return application

app = create_application()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
