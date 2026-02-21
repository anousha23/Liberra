import { useState, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/books');
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please try again later.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 animate-slide-up">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold gradient-text mb-3">
              Discover Books
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg">
            Explore our complete collection of amazing reads
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchBooks}
              className="relative inline-block group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                Try Again
              </div>
            </button>
          </div>
        ) : books.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">
                {books.length} {books.length === 1 ? 'book' : 'books'} available
              </p>
              <div className="flex items-center space-x-2 glass rounded-lg px-4 py-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">All Books</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book, index) => (
                <div key={book.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <BookCard book={book} onShelfUpdate={fetchBooks} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <svg className="mx-auto h-20 w-20 text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Books Yet</h3>
            <p className="text-gray-500">The library is empty. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllBooks;
