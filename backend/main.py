from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, SessionLocal
from models import Base, User, Book, Rating, Shelf
from schemas import UserCreate, UserResponse, BookCreate, BookResponse, RatingCreate, RatingResponse, ShelfCreate, ShelfResponse, ImportBook
from auth import create_access_token, hash_password, verify_password, get_current_user
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return {"error": "Email already registered"}

    hashed_pw=hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm=Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        return {"error": "User not found"}

    if not verify_password(form_data.password, user.password):
        return {"error": "Incorrect password"}

    access_token = create_access_token(
        data={"user_id": user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/search")
def search_books(query:str):
    url=f"https://openlibrary.org/search.json?q={query}"

    response=requests.get(url)

    if response.status_code !=200:
        return{ "error": "Failed to fetch data"}
    
    data=response.json()

    results=[]

    for book in data.get("docs", [])[:10]:
        subjects = book.get("subject", [])

        results.append({
            "title": book.get("title"),
            "author": book.get("author_name", ["Unknown"])[0],
            "first_publish_year":book.get("first_publish_year"),
            "openlibrary_id":book.get("key"),
            "genre":subjects[0] if subjects else "Unknown"
        })
    return results

@app.post("/books", response_model=BookResponse)
def create_book(book:BookCreate, db:Session=Depends(get_db)):
    new_book=Book(
        title=book.title,
        author=book.author,
        genre=book.genre,
        description=book.description
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@app.get("/books", response_model=list[BookResponse])
def get_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()

    result=[]

    for book in books:
        avg_rating=db.query(func.avg(Rating.score)).filter(
            Rating.book_id==book.id
        ).scalar()

        result.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "description": book.description,
            "average_rating": round(avg_rating, 2) if avg_rating else None,
            "openlibrary_id": book.external_id   # 👈 ADD THIS
        })
    return result

@app.post("/rate", response_model=RatingResponse)
def rate_book(
    rating:RatingCreate, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)

):
    book=db.query(Book).filter(Book.id==rating.book_id).first()
    if not book:
        return{"error":"Book not found"}

    existing_rating=db.query(Rating).filter(
        Rating.user_id==user_id,
        Rating.book_id==rating.book_id
    ).first()

    if existing_rating:
        return{"error":"You already rated this book"}
    
    new_rating=Rating(
        score=rating.score,
        user_id=user_id,
        book_id=rating.book_id
    )

    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)

    return new_rating

@app.post("/shelf", response_model=ShelfResponse)
def add_to_shelf(
    shelf: ShelfCreate,
    db: Session = Depends(get_db), 
    user_id: int=Depends(get_current_user)):

    existing = db.query(Shelf).filter(
        Shelf.user_id == user_id,
        Shelf.book_id == shelf.book_id
    ).first()

    if existing:
        existing.shelf_type = shelf.shelf_type
        db.commit()
        db.refresh(existing)
        return existing

    new_entry = Shelf(
        user_id=user_id,
        book_id=shelf.book_id,
        shelf_type=shelf.shelf_type
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry

@app.post("/import-book", response_model=BookResponse)
def import_book(book: ImportBook, db: Session = Depends(get_db)):

    exisiting = db.query(Book).filter(
        Book.external_id==book.openlibrary_id
    ).first()

    if exisiting:
        return exisiting
    
    new_book=Book(
        title=book.title,
        author=book.author,
        genre=book.genre,
        description="Imported from Open Library",
        external_id=book.openlibrary_id
    )
    
    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book


@app.get("/all-users")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    
    high_ratings = db.query(Rating).filter(
        Rating.user_id == user_id,
        Rating.score >= 4
    ).all()

    if not high_ratings:
        return {"message": "Not enough data to generate recommendations"}

    
    liked_book_ids = [r.book_id for r in high_ratings]

    liked_books = db.query(Book).filter(Book.id.in_(liked_book_ids)).all()

    liked_genres = list(set(book.genre for book in liked_books))

    
    candidate_books = db.query(Book).filter(
        Book.genre.in_(liked_genres)
    ).all()

    
    rated_book_ids = db.query(Rating.book_id).filter(
        Rating.user_id == user_id
    ).all()

    rated_book_ids = [id[0] for id in rated_book_ids]

    recommendations = []

    for book in candidate_books:
        if book.id in rated_book_ids:
            continue

        avg_rating = db.query(func.avg(Rating.score)).filter(
            Rating.book_id == book.id
        ).scalar()

        recommendations.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "average_rating": round(avg_rating, 2) if avg_rating else None
        })

    
    recommendations.sort(
        key=lambda x: x["average_rating"] or 0,
        reverse=True
    )

    return recommendations[:5]

@app.get("/trending")
def get_trending_books():

    url = "https://openlibrary.org/search.json?q=bestseller"
    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "Failed to fetch data"}

    data = response.json()

    books = sorted(
        data.get("docs", []),
        key=lambda x: x.get("edition_count", 0),
        reverse=True
    )[:10]

    results = []

    for book in books:
        results.append({
            "title": book.get("title"),
            "author": book.get("author_name", ["Unknown"])[0],
            "openlibrary_id": book.get("key"),
            "edition_count": book.get("edition_count", 0)
        })

    return results

# /*linking*/
app.add_middleware(
    CORSMiddleware,
     allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
