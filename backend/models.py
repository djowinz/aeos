from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float)
    tax = Column(Float, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="owner")


# Example of relationships between models
# Uncomment when implementing user-item relationship
# 
# class Item(Base):
#     __tablename__ = "items"
# 
#     id = Column(String, primary_key=True, index=True)
#     name = Column(String, index=True)
#     description = Column(String, nullable=True)
#     price = Column(Float)
#     tax = Column(Float, nullable=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))
# 
#     owner = relationship("User", back_populates="items") 