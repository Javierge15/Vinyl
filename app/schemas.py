from pydantic import BaseModel

class AlbumLog(BaseModel):
    title: str
    artist: str
    rating: int
    review: str

class AlbumResponse(AlbumLog):
    id: int

    model_config = {"from_attributes": True}