from fastapi import FastAPI
from app.schemas import AlbumLog

app = FastAPI()

@app.get("/")
async def root():
    return{"message": "Hello World!"}

@app.post("/logs")
async def create_log(log: AlbumLog):
    return log