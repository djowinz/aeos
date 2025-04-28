from fastapi import APIRouter, HTTPException, status, Depends, Query, Path
from typing import List, Annotated
import uuid

from schemas import User, UserBase, UserCreate
from auth import get_password_hash, get_current_user, verify_password
from errors import UserNotFoundError, ValidationError, UserValidator

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={
        404: {"description": "Not found"},
        422: {"description": "Validation error"},
        400: {"description": "Bad request"}
    },
)

# Mock database
USERS_DB = {}

@router.post("", status_code=status.HTTP_201_CREATED, response_model=User)
async def create_user(user: UserCreate):
    """Create a new user."""
    # Check if user with email already exists
    for existing_user in USERS_DB.values():
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # Additional validation
    try:
        UserValidator.validate_email(user.email)
        UserValidator.validate_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    user_id = len(USERS_DB) + 1
    hashed_password = get_password_hash(user.password)
    
    user_dict = user.model_dump(exclude={"password"})
    user_dict.update({
        "id": user_id,
        "is_active": True,
        "hashed_password": hashed_password,
        "items": []
    })
    
    USERS_DB[user_id] = user_dict
    
    # Return without hashed_password
    return {k: v for k, v in user_dict.items() if k != "hashed_password"}

@router.get("", response_model=List[User])
async def read_users(
    skip: Annotated[int, Query(ge=0, description="Number of users to skip")] = 0,
    limit: Annotated[int, Query(ge=1, le=100, description="Max number of users to return")] = 100,
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Retrieve all users."""
    users = []
    for user in list(USERS_DB.values())[skip: skip + limit]:
        # Don't return hashed_password
        users.append({k: v for k, v in user.items() if k != "hashed_password"})
    return users

@router.get("/{user_id}", response_model=User)
async def read_user(
    user_id: Annotated[int, Path(gt=0, description="The ID of the user to retrieve")],
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Retrieve a specific user by id."""
    if user_id not in USERS_DB:
        raise UserNotFoundError(user_id)
    
    user = USERS_DB[user_id]
    # Don't return hashed_password
    return {k: v for k, v in user.items() if k != "hashed_password"}

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: Annotated[int, Path(gt=0, description="The ID of the user to update")],
    user: UserBase,
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Update an existing user."""
    if user_id not in USERS_DB:
        raise UserNotFoundError(user_id)
    
    # Check for email uniqueness
    for uid, existing_user in USERS_DB.items():
        if existing_user["email"] == user.email and uid != user_id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # Additional validation
    try:
        UserValidator.validate_email(user.email)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    current_user_data = USERS_DB[user_id]
    update_data = user.model_dump()
    
    updated_user = {**current_user_data, **update_data}
    USERS_DB[user_id] = updated_user
    
    # Don't return hashed_password
    return {k: v for k, v in updated_user.items() if k != "hashed_password"}

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: Annotated[int, Path(gt=0, description="The ID of the user to delete")],
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Delete a user."""
    if user_id not in USERS_DB:
        raise UserNotFoundError(user_id)
    
    del USERS_DB[user_id]
    return None 