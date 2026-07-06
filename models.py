from sqlalchemy import Column, Integer, String, Text
from database import Base

class ProductDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    price = Column(String(100), nullable=False)
    protein = Column(String(50), nullable=True)
    age_category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    stock = Column(Integer, default=0)
    image_url = Column(Text, nullable=True)
