from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class ItemBase(BaseModel):
    """
    Base schema for Item
    """
    name: str = Field(..., min_length=1, description="Name of the item")
    description: Optional[str] = Field(None, description="Optional description of the item")
    price: float = Field(..., gt=0, description="Price of the item (must be greater than 0)")
    tax: Optional[float] = Field(None, ge=0, description="Optional tax amount (must be non-negative)")

class ItemCreate(ItemBase):
    """
    Schema for creating a new Item
    """
    pass

class ItemUpdate(ItemBase):
    """
    Schema for updating an existing Item
    """
    name: Optional[str] = Field(None, min_length=1, description="Name of the item")
    price: Optional[float] = Field(None, gt=0, description="Price of the item (must be greater than 0)")

class Item(ItemBase):
    """
    Schema for Item response
    """
    id: str = Field(..., description="Unique identifier for the item")
    owner_id: Optional[str] = Field(None, description="ID of the item owner")

    model_config = ConfigDict(from_attributes=True) 