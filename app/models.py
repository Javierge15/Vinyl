# 1. Import the column types from SQLAlchemy
from sqlalchemy import Column, Integer, String

# 2. Import the Base registry we just created in database.py
from app.database import Base

# 3. Create the class, inheriting from Base
class Album(Base):
    # 4. Tell SQLAlchemy the actual name of the table in Postgres
    __tablename__ = "albums"

    # 5. Define the columns
    # Every database table needs a Primary Key (a unique ID for each row)
    id = Column(Integer, primary_key=True, index=True)
    
    # Now, add the columns that match our music logger features
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    rating = Column(Integer)
    review = Column(String)