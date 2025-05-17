from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
from datetime import datetime

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """
    Base repository class with common CRUD operations
    """
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: int) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: dict) -> ModelType:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, id: int, obj_in: dict) -> Optional[ModelType]:
        db_obj = self.get(db, id)
        if db_obj:
            for key, value in obj_in.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: int) -> bool:
        db_obj = self.get(db, id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
            return True
        return False

    def soft_delete(self, db: Session, id: int) -> bool:
        db_obj = self.get(db, id)
        if db_obj:
            db_obj.deleted_at = datetime.utcnow()
            db.commit()
            return True
        return False 