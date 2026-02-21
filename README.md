# Liberra 📚

Liberra is a full-stack book discovery and recommendation platform where users can explore books, rate them, and receive personalized recommendations.

This project is built to deepen understanding of backend architecture, authentication systems, and frontend-backend integration.

---

## 🚀 Features

- User registration and login (JWT-based authentication)
- Browse and search books
- Rate books
- Personalized recommendations based on user ratings
- Protected routes for authenticated users

---

## 🛠 Tech Stack

### Backend
- FastAPI
- SQLAlchemy ORM
- SQLite / PostgreSQL
- JWT Authentication

### Frontend
- React (Vite)
- Fetch API
- Tailwind CSS

---

## 📂 Project Structure

Liberra/
│
├── backend/        # FastAPI backend application
├── frontend/       # React frontend application
└── README.md

---

## ⚙️ Setup Instructions

### Clone Repository

git clone https://github.com/anousha23/Liberra.git
cd Liberra

---

### Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate  (Windows)

pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

---

### Frontend Setup

cd frontend/bookshelf-app
npm install
npm run dev

Frontend runs on:
http://localhost:5173

---

## 🚧 Project Status

Currently under active development.

Planned improvements:
- Add book review functionality
- Improve recommendation algorithm
- User profile pages
- Deployment

---

## 👩‍💻 Author

Anousha  
Second-Year Engineering Student  
Building full-stack applications with FastAPI and React