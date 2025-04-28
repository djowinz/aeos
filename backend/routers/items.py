from fastapi import APIRouter, HTTPException, status, Depends, Query, Path
from typing import List, Annotated
import uuid

from schemas import Item, ItemBase, ItemCreate
from errors import ItemNotFoundError, ItemValidator
from auth import get_current_user

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={
        404: {"description": "Not found"},
        422: {"description": "Validation error"}
    },
)

# Mock database
ITEMS_DB = {}

@router.post("", status_code=status.HTTP_201_CREATED, response_model=Item)
async def create_item(
    item: ItemCreate,
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Create a new item."""
    # Additional validation (example)
    try:
        ItemValidator.validate_price(item.price)
        ItemValidator.validate_tax(item.tax)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    item_id = str(uuid.uuid4())
    item_dict = item.model_dump()
    item_dict.update({"id": item_id})
    ITEMS_DB[item_id] = item_dict
    return item_dict

@router.get("", response_model=List[Item])
async def read_items(
    skip: Annotated[int, Query(ge=0, description="Number of items to skip")] = 0,
    limit: Annotated[int, Query(ge=1, le=100, description="Max number of items to return")] = 100
):
    """Retrieve all items."""
    return list(ITEMS_DB.values())[skip : skip + limit]

@router.get("/{item_id}", response_model=Item)
async def read_item(
    item_id: Annotated[str, Path(description="The ID of the item to retrieve")]
):
    """Retrieve a specific item by id."""
    if item_id not in ITEMS_DB:
        raise ItemNotFoundError(item_id)
    return ITEMS_DB[item_id]

@router.put("/{item_id}", response_model=Item)
async def update_item(
    item_id: Annotated[str, Path(description="The ID of the item to update")],
    item: ItemCreate,
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Update an existing item."""
    if item_id not in ITEMS_DB:
        raise ItemNotFoundError(item_id)
    
    # Additional validation
    try:
        ItemValidator.validate_price(item.price)
        ItemValidator.validate_tax(item.tax)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    item_dict = item.model_dump()
    item_dict.update({"id": item_id})
    ITEMS_DB[item_id] = item_dict
    return item_dict

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: Annotated[str, Path(description="The ID of the item to delete")],
    current_user: Annotated[dict, Depends(get_current_user)] = None
):
    """Delete an item."""
    if item_id not in ITEMS_DB:
        raise ItemNotFoundError(item_id)
    
    del ITEMS_DB[item_id]
    return None 