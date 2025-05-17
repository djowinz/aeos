from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.user import User
from app.repositories.base import BaseRepository
from app.schemas.user import UserCreate, UserUpdate

class UserRepository(BaseRepository[User]):
    """
    Repository for User model
    """
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """
        Get user by email
        """
        return db.query(self.model).filter(
            self.model.email == email,
            self.model.deleted_at.is_(None)
        ).first()

    def get_by_auth0_id(self, db: Session, auth0_id: str) -> Optional[User]:
        """
        Get user by Auth0 ID
        """
        return db.query(self.model).filter(
            self.model.id == auth0_id,
            self.model.deleted_at.is_(None)
        ).first()

    def create_from_auth0(self, db: Session, auth0_user: dict) -> User:
        """
        Create a new user from Auth0 data
        """
        db_obj = self.model(
            id=auth0_user["sub"],
            email=auth0_user.get("email"),
            name=auth0_user.get("name"),
            picture=auth0_user.get("picture")
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, id: str, obj_in: UserUpdate) -> Optional[User]:
        """
        Update a user
        """
        db_obj = self.get(db, id)
        if db_obj:
            update_data = obj_in.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
        return db_obj 