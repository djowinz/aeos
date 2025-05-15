# FastAPI API Template

A FastAPI template with CRUD operations, database integration, strong typing with Pydantic, and authentication.

## Features

- CRUD operations for items and users
- SQLAlchemy database integration
- JWT authentication
- Environment variable configuration
- Strong typing with Pydantic
- Comprehensive validation with custom validators
- Standardized error responses

## Setup

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install the dependencies:

```bash
pip install -r requirements.txt
```

3. (Optional) Create a `.env` file for environment variables:

```
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key
```

## Running the API

Run the API with:

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

FastAPI automatically generates documentation:

- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## Project Structure

```
backend/
│
├── main.py              # Main application entry point
├── database.py          # Database connection
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic models for request/response validation
├── config.py            # Application configuration
├── auth.py              # Authentication utilities
├── errors.py            # Custom errors and validators
│
├── routers/             # API routes
│   ├── __init__.py
│   ├── items.py         # Item routes with CRUD operations
│   ├── users.py         # User routes with CRUD operations
│   └── auth.py          # Authentication routes
│
└── requirements.txt     # Dependencies
```

## CRUD Endpoints

The API includes the following endpoints:

### Items

- `POST /items`: Create a new item
- `GET /items`: List all items
- `GET /items/{item_id}`: Get a specific item
- `PUT /items/{item_id}`: Update an item
- `DELETE /items/{item_id}`: Delete an item

### Users

- `POST /users`: Create a new user
- `GET /users`: List all users
- `GET /users/{user_id}`: Get a specific user
- `PUT /users/{user_id}`: Update a user
- `DELETE /users/{user_id}`: Delete a user

### Authentication

- `POST /token`: Get JWT access token

## Pydantic Type Validation

The API uses Pydantic for strong typing and validation:

- All request and response models are defined using Pydantic models
- Field validations using Field constraints (min_length, gt, ge, etc.)
- Custom validators for advanced validation
- Standardized error responses for validation errors

## Auth0 Setup

This backend supports both standard JWT authentication and Auth0 authentication. To use Auth0, follow these steps:

1. Create an Auth0 account and set up a new application at https://auth0.com/
2. Create a new API in Auth0 to represent your backend
3. Configure your environment variables by adding the following to your `.env` file:

```
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=your-auth0-api-identifier
AUTH0_CALLBACK_URL=http://localhost:8000/auth/callback
```

4. Make sure your Auth0 application has the following settings:
   - Application Type: Regular Web Application
   - Allowed Callback URLs: http://localhost:8000/auth/callback
   - Allowed Logout URLs: http://localhost:8000
   - Allowed Web Origins: http://localhost:8000
   - Grant Types: Authorization Code, Implicit, Refresh Token, Password

5. Enable the Password grant type in your Auth0 API settings for the embedded login flow

### Authentication Endpoints

The backend provides the following Auth0 authentication endpoints:

- `POST /auth/login`: Embedded login flow - send username and password to get tokens
- `GET /auth/user`: Get current user profile (requires Auth0 access token)
- `GET /auth/login-oauth`: Start standard OAuth2 flow (redirects to Auth0)
- `GET /auth/callback`: Auth0 callback handler
- `GET /auth/logout`: Log out from Auth0
- `POST /auth/refresh`: Refresh access token

### Protected Routes

To protect a route with Auth0 authentication, use the `get_current_user_from_auth0` dependency:

```python
from auth0 import get_current_user_from_auth0

@app.get("/protected")
async def protected_route(current_user = Depends(get_current_user_from_auth0)):
    return {"message": "Protected route", "user": current_user}
```

## Development

// ... existing code ... 