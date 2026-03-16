from pydantic import BaseModel

class AlbumLog(BaseModel):
    title: str
    artist: str
    rating: int
    review: str

