from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "postgresql://javier:95959494@localhost/vinyl_db"

# 1. Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 2. Create a sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Create the Base class
Base = declarative_base()