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