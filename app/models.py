# app/models.py
from sqlalchemy import Column, Integer, String
from app.database import Base

class Album(Base):
    __tablename__ = "albums_v3"  # Cambiamos a v3 para reiniciar

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    review = Column(String, nullable=False)
    cover_url = Column(String, nullable=True) # La columna para la imagen