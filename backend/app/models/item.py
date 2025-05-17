from sqlalchemy import Column, Float, String, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base

class Item(Base):
    """
    Item model for storing item information
    """
    __tablename__ = "items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float)
    tax = Column(Float, nullable=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=True)

    owner = relationship("User", back_populates="items") 