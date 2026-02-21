import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import Navbar from '../components/Navbar';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/books`);
      const books = Array.isArray(data) ? data : [];
      const foundBook = books.find(b => b.id === parseInt(id));
      setBook(foundBook || null);
    } catch (error) {
      console.error('Failed to fetch book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToShelf = async (shelfType) => {
    setIsUpdating(true);
    try {
      await apiFetch('/shelf', {
        method: 'POST',
        body: {
          book_id: parseInt(id),
          shelf_type: shelfType,
        },
      });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
      alert('Failed to add book to shelf.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRateBook = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    try {
      await apiFetch('/rate', {
        method: 'POST',
        body: {
          book_id: parseInt(id),
          score: rating,
        },
      });
      alert('Rating submitted successfully!');
      setRating(0);
      fetchBook();
    } catch (error) {
      console.error('Failed to rate book:', error);
      alert(error.message || 'Failed to rate book.');
    }
  };

  const getRatingStars = (avgRating) => {
    if (!avgRating) return '☆☆☆☆☆';
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.floor(avgRating) ? '★' : '☆');
    }
    return stars.join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center glass rounded-2xl p-12 shadow-glow animate-scale-in">
            <p className="text-gray-500 text-lg mb-4">Book not found</p>
            <Link to="/books" className="relative inline-block group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                Browse Books
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 👇 ADD THIS RIGHT BEFORE return
const olid = book?.openlibrary_id?.split("/").pop();

const coverUrl = olid
  ? `https://covers.openlibrary.org/b/olid/${olid}-L.jpg`
  : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/books" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Books
          </Link>
        </div>

        <div className="glass rounded-3xl shadow-glow-lg overflow-hidden animate-slide-up">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-80 bg-gradient-to-br from-blue-100 to-purple-100">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                  </div>
                  <span className="relative text-white font-bold text-8xl opacity-80">
                    {book.title?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 flex-1">
              <h1 className="text-4xl font-bold gradient-text mb-3">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

              {book.average_rating !== null && book.average_rating !== undefined && (
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-yellow-400 text-2xl">{getRatingStars(book.average_rating)}</span>
                  <span className="text-gray-600 font-semibold">{book.average_rating.toFixed(1)} average rating</span>
                </div>
              )}

              <div className="relative inline-block mb-6" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isUpdating}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add to Shelf</span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-60 glass rounded-xl shadow-glow p-2 z-10 animate-scale-in">
                    <button onClick={() => handleAddToShelf('want_to_read')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/60 transition-colors flex items-center space-x-3" disabled={isUpdating}>
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      <span className="font-medium">Want to Read</span>
                    </button>
                    <button onClick={() => handleAddToShelf('currently_reading')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/60 transition-colors flex items-center space-x-3" disabled={isUpdating}>
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                      <span className="font-medium">Currently Reading</span>
                    </button>
                    <button onClick={() => handleAddToShelf('read')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/60 transition-colors flex items-center space-x-3" disabled={isUpdating}>
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                      <span className="font-medium">Read</span>
                    </button>
                  </div>
                )}
              </div>

              {book.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">About this book</h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rate this book</h3>
                <div className="flex items-center space-x-4 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300'} hover:scale-125`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRateBook}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">
                    Submit Rating
                  </div>
                </button>
              </div>

              {book.genre && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Genre</p>
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-medium">
                    {book.genre}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
