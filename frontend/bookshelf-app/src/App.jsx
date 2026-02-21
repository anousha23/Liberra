import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './api/apiFetch';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import AllBooks from './pages/AllBooks';
import Search from './pages/Search';
import BookDetails from './pages/BookDetails';
import Shelves from './pages/Shelves';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/books" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/books" replace /> : <Login />}
        />

        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/books" replace /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <AllBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelves"
          element={
            <ProtectedRoute>
              <Shelves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
