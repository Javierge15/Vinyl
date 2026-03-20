# app/schemas.py
from pydantic import BaseModel
from typing import Optional

class AlbumLog(BaseModel):
    title: str
    artist: str
    rating: int
    review: str
    cover_url: Optional[str] = None # Aceptamos la URL opcional

class AlbumResponse(AlbumLog):
    id: int
    
    class Config:
        from_attributes = True