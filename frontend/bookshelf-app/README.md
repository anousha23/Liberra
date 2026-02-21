# 📚 Bookshelf - Dynamic Book Tracking Application

A **flashy, modern** Goodreads-style book tracking application with stunning gradients, animations, and multiple shades of blue. Built with React, Vite, and TailwindCSS, perfectly matching your FastAPI backend.

## ✨ Features

### 🎨 Dynamic UI Design
- **Multiple Blue Gradients** - From blue-400 to purple-600 throughout the app
- **Glass-morphism Effects** - Frosted glass cards with backdrop blur
- **Smooth Animations** - Float, slide-up, fade-in, and scale-in animations
- **Gradient Text** - Eye-catching gradient text for headings
- **Glow Effects** - Beautiful shadow-glow on hover
- **Animated Backgrounds** - Floating orbs and gradient blobs

### 📖 Core Features
- ✅ **Register & Login** - User authentication with JWT tokens
- ✅ **All Books Page** - Browse complete catalog with average ratings
- ✅ **Search Books** - Search Open Library and import books
- ✅ **Book Details** - View info, rate books (1-5 stars), add to shelves
- ✅ **Three Shelves** - Want to Read, Currently Reading, Read
- ✅ **Recommendations** - Personalized based on your ratings
- ✅ **Add to Shelf Dropdown** - Quick access on every book card

## 🎯 Matches Your Backend Exactly

### API Endpoints Used:
```
POST   /register              - Register new user
POST   /login                 - Login (OAuth2PasswordRequestForm)
GET    /books                 - Get all books with average ratings
GET    /search?query=...      - Search Open Library
POST   /import-book           - Import book from Open Library
POST   /rate                  - Rate a book (1-5)
POST   /shelf                 - Add book to shelf
GET    /shelf?shelf_type=...  - Get books from shelf
GET    /recommendations       - Get personalized recommendations
```

### Authentication:
- Uses `access_token` from `/login` endpoint
- Stored in `localStorage` as `access_token`
- Auto-attached to all authenticated requests
- OAuth2PasswordRequestForm compatible

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Your FastAPI backend running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
```bash
cd bookshelf-app
npm install
```

2. **Configure API:**
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

## 🎨 Design System

### Colors
- **Primary Blues:** `#3b82f6` to `#2563eb`
- **Purple Accents:** `#764ba2` to `#667eea`
- **Shelf Colors:**
  - Want to Read: Yellow-Orange gradient
  - Currently Reading: Blue gradient
  - Read: Green-Emerald gradient

### Animations
- `float` - Floating orbs (6s infinite)
- `slide-up` - Page entry animation
- `fade-in` - Smooth fade in
- `scale-in` - Dropdown animations
- `shimmer` - Loading shimmer effect

### Typography
- **Headings:** Poppins (bold, gradient)
- **Body:** Inter (clean, readable)

## 📁 Project Structure

```
bookshelf-app/
├── src/
│   ├── api/
│   │   └── apiFetch.js           # API client with JWT
│   ├── components/
│   │   ├── Navbar.jsx            # Animated navbar
│   │   ├── BookCard.jsx          # Flashy book card
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── pages/
│   │   ├── Register.jsx          # Registration with animated bg
│   │   ├── Login.jsx             # Login with animated bg
│   │   ├── AllBooks.jsx          # Main catalog
│   │   ├── Search.jsx            # Search & import
│   │   ├── BookDetails.jsx       # Book info & rating
│   │   ├── Shelves.jsx           # Three shelves
│   │   └── Recommendations.jsx   # Personalized picks
│   ├── App.jsx                   # Router
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔄 Data Flow

1. **Register:** `/register` → Store user → Redirect to login
2. **Login:** `/login` → Get `access_token` → Store in localStorage → Redirect to `/books`
3. **Browse:** `/books` → Display all books with average ratings
4. **Search:** `/search?query=...` → Search Open Library → Import with `/import-book`
5. **Rate:** `/rate` → Submit rating (1-5) → Updates average rating
6. **Shelves:** `/shelf` (POST/GET) → Add/view books in shelves
7. **Recommendations:** `/recommendations` → Get personalized picks

## 🎯 Key Components

### BookCard
- Hover effects with gradient overlay
- Floating animations on placeholder covers
- Dynamic rating stars with color coding
- Add to shelf dropdown

### Navbar
- Glass-morphism effect on scroll
- Animated search bar
- Dropdown shelves menu
- Gradient logo

### Auth Pages
- Animated floating background orbs
- Glass cards with blur effects
- Gradient buttons with hover glow
- Error handling with animations

## 🛠️ Built With

- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **React Router 6** - Client-side routing
- **TailwindCSS** - Utility-first CSS
- **Native Fetch API** - HTTP requests
- **JWT** - Token authentication

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:8000
```

## 🚢 Build for Production

```bash
npm run build
```

Output: `dist/` directory

Preview production build:
```bash
npm run preview
```

## 🎨 Customization

### Change Gradient Colors
Edit `tailwind.config.js`:
```javascript
backgroundImage: {
  'gradient-blue': 'linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR 100%)',
}
```

### Modify Animations
Edit `tailwind.config.js` → `animation` and `keyframes`

### Change Fonts
1. Update Google Fonts in `index.html`
2. Update Tailwind font families in `tailwind.config.js`

## 🤝 Backend Requirements

Your FastAPI backend should:
- Run on `http://localhost:8000` (or update `.env`)
- Have CORS enabled for `http://localhost:5173`
- Use OAuth2PasswordRequestForm for `/login`
- Return `access_token` in login response
- Accept Bearer token in Authorization header

## 📄 License

MIT License

## 🎉 Enjoy!

A modern, flashy, dynamic book tracking experience! 🚀✨
