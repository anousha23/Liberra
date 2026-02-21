from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

print("User model loaded")

class Book(Base):
    __tablename__="books"
    id=Column(Integer, primary_key=True, index=True)
    title=Column(String, index=True)
    author=Column(String)
    genre=Column(String)
    description=Column(Text)
    external_id=Column(String, unqiue=True, nullable=True)

class Rating(Base):
    __tablename__="ratings"

    id=Column(Integer, primary_key=True, index=True)
    score=Column(Integer)

    user_id=Column(Integer, ForeignKey("users.id"))
    book_id=Column(Integer, ForeignKey("books.id"))
    user=relationship("User")
    book=relationship("Book")

class Shelf(Base):
    __tablename__="shelves"

    id=Column(Integer, primary_key=True, index=True)
    user_id=Column(Integer, ForeignKey("users.id"))
    book_id=Column(Integer, ForeignKey("books.id"))
    shelf_type=Column(String)

    user=relationship("User")
    book=relationship("Book")