from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth.auth0 import get_current_active_user
from app.repositories.item import ItemRepository
from app.schemas.item import Item, ItemCreate, ItemUpdate
from app.schemas.error import NotFoundError

router = APIRouter()
item_repository = ItemRepository()

@router.get("/", response_model=List[Item])
async def read_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Get all items for the current user
    """
    items = item_repository.get_by_owner(db, current_user["sub"], skip, limit)
    return items

@router.post("/", response_model=Item, status_code=status.HTTP_201_CREATED)
async def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Create a new item for the current user
    """
    return item_repository.create_with_owner(db, item, current_user["sub"])

@router.get("/{item_id}", response_model=Item)
async def read_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Get a specific item by ID
    """
    item = item_repository.get(db, item_id)
    if not item or item.owner_id != current_user["sub"]:
        raise NotFoundError(f"Item {item_id} not found")
    return item

@router.put("/{item_id}", response_model=Item)
async def update_item(
    item_id: str,
    item: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Update a specific item
    """
    db_item = item_repository.get(db, item_id)
    if not db_item or db_item.owner_id != current_user["sub"]:
        raise NotFoundError(f"Item {item_id} not found")
    return item_repository.update(db, item_id, item)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Delete a specific item
    """
    db_item = item_repository.get(db, item_id)
    if not db_item or db_item.owner_id != current_user["sub"]:
        raise NotFoundError(f"Item {item_id} not found")
    item_repository.delete(db, item_id) 