from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth.auth0 import get_current_active_user
from app.repositories.user import UserRepository
from app.schemas.user import User, UserUpdate
from app.schemas.error import NotFoundError

router = APIRouter()
user_repository = UserRepository()

@router.get("/me", response_model=User)
async def read_user_me(
    current_user: dict = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current user
    """
    user = user_repository.get_by_auth0_id(db, current_user["sub"])
    if not user:
        user = user_repository.create_from_auth0(db, current_user)
    return user

@router.put("/me", response_model=User)
async def update_user_me(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user
    """
    user = user_repository.get_by_auth0_id(db, current_user["sub"])
    if not user:
        user = user_repository.create_from_auth0(db, current_user)
    return user_repository.update(db, user.id, user_update)

@router.get("/{user_id}", response_model=User)
async def read_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Get a specific user by ID
    """
    user = user_repository.get(db, user_id)
    if not user:
        raise NotFoundError(f"User {user_id} not found")
    return user 