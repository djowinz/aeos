from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.schemas.error import ErrorResponse

def setup_exception_handlers(app: FastAPI) -> None:
    """
    Setup all exception handlers for the application
    """
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