from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.item import Item
from app.repositories.base import BaseRepository
from app.schemas.item import ItemCreate, ItemUpdate

class ItemRepository(BaseRepository[Item]):
    """
    Repository for Item model
    """
    def __init__(self):
        super().__init__(Item)

    def get_by_owner(self, db: Session, owner_id: str, skip: int = 0, limit: int = 100) -> List[Item]:
        """
        Get all items owned by a specific user
        """
        return db.query(self.model).filter(
            self.model.owner_id == owner_id,
            self.model.deleted_at.is_(None)
        ).offset(skip).limit(limit).all()

    def create_with_owner(self, db: Session, obj_in: ItemCreate, owner_id: str) -> Item:
        """
        Create a new item with owner
        """
        db_obj = self.model(**obj_in.model_dump(), owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, id: str, obj_in: ItemUpdate) -> Optional[Item]:
        """
        Update an item
        """
        db_obj = self.get(db, id)
        if db_obj:
            update_data = obj_in.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
        return db_obj 