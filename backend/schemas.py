from pydantic import BaseModel
from typing import Literal
from enum import Enum

class UserCreate(BaseModel):
    username:str
    email:str
    password:str

class UserResponse(BaseModel):
    id:int
    username:str
    email:str

    class Config:
        from_attributes=True


class BookCreate(BaseModel):
    title:str
    author:str
    genre:str
    description:str

class BookResponse(BaseModel):
    id:int
    title:str
    author:str
    genre:str
    description:str

    class Config:
        from_attributes=True

class RatingCreate(BaseModel):
    book_id:int
    score:int

class RatingResponse(BaseModel):
    id:int
    book_id:int
    score:int

    class Config:
        from_attributes=True

class ImportBook(BaseModel):
    title:str
    author:str
    openlibrary_id:str
    genre: str

class ShelfType(str, Enum):
    want_to_read = "want_to_read"
    currently_reading = "currently_reading"
    read = "read"

class ShelfCreate(BaseModel):
    book_id:int
    shelf_type:ShelfType

class ShelfResponse(BaseModel):
    id:int
    user_id:int
    book_id:int
    shelf_type:str

    class Config:
        from_attributes=True


