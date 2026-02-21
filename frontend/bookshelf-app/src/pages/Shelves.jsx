import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';

const Shelves = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeShelf = searchParams.get('shelf') || 'want_to_read';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shelfConfig = {
    want_to_read: {
      label: 'Want to Read',
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      icon: '📚',
      description: 'Books you plan to read',
    },
    currently_reading: {
      label: 'Currently Reading',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      icon: '📖',
      description: 'Books you are reading now',
    },
    read: {
      label: 'Read',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      icon: '✅',
      description: 'Books you have finished',
    },
  };

  useEffect(() => {
    fetchShelfBooks();
  }, [activeShelf]);

  const fetchShelfBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/shelf?shelf_type=${activeShelf}`);
      const bookList = Array.isArray(data) ? data : (data.books || []);
      setBooks(bookList);
    } catch (err) {
      console.error('Failed to fetch shelf books:', err);
      setError('Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShelfChange = (shelf) => {
    setSearchParams({ shelf });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-5xl font-bold gradient-text mb-3">My Shelves</h1>
          <p className="text-gray-600 text-lg">Organize your reading journey</p>
        </div>

        {/* Shelf Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 glass rounded-xl p-1.5 shadow-glow inline-flex">
            {Object.entries(shelfConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleShelfChange(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeShelf === key
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-md transform scale-105`
                    : 'text-gray-600 hover:bg-white/60'
                }`}
              >
                <span className="mr-2">{config.icon}</span>
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Shelf Header */}
        <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${shelfConfig[activeShelf].bgGradient} border-2 border-white/50 animate-fade-in`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {shelfConfig[activeShelf].label}
          </h2>
          <p className="text-gray-600">{shelfConfig[activeShelf].description}</p>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className={`w-20 h-20 border-4 border-transparent border-t-current rounded-full animate-spin bg-gradient-to-r ${shelfConfig[activeShelf].gradient} bg-clip-text`}></div>
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
              onClick={fetchShelfBooks}
              className="relative inline-block group"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${shelfConfig[activeShelf].gradient} rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300`}></div>
              <div className={`relative px-6 py-2 bg-gradient-to-r ${shelfConfig[activeShelf].gradient} text-white rounded-lg font-medium`}>
                Try Again
              </div>
            </button>
          </div>
        ) : books.length > 0 ? (
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-medium">
                {books.length} {books.length === 1 ? 'book' : 'books'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book, index) => (
                <div key={book.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <BookCard book={book} onShelfUpdate={fetchShelfBooks} showShelfButton={false} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <div className="text-7xl mb-4 animate-float">{shelfConfig[activeShelf].icon}</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Your {shelfConfig[activeShelf].label} shelf is empty
            </h3>
            <p className="text-gray-500 mb-6">{shelfConfig[activeShelf].description}</p>
            <button
              onClick={() => (window.location.href = '/books')}
              className="relative inline-block group"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${shelfConfig[activeShelf].gradient} rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300`}></div>
              <div className={`relative px-6 py-3 bg-gradient-to-r ${shelfConfig[activeShelf].gradient} text-white rounded-lg font-semibold`}>
                Browse Books
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shelves;
