import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';

const BookCard = ({ book, onShelfUpdate, showShelfButton = true }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  const handleAddToShelf = async (shelfType) => {
    setIsUpdating(true);
    try {
      await apiFetch('/shelf', {
        method: 'POST',
        body: {
          book_id: book.id,
          shelf_type: shelfType,
        },
      });
      setIsDropdownOpen(false);
      if (onShelfUpdate) {
        onShelfUpdate();
      }
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
      alert('Failed to add book to shelf. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRatingStars = (rating) => {
    if (!rating) return { stars: '☆☆☆☆☆', color: 'text-gray-300' };
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars ? '★' : '☆');
    }
    
    let color = 'text-gray-300';
    if (rating >= 4) color = 'text-yellow-400';
    else if (rating >= 3) color = 'text-blue-400';
    else if (rating >= 2) color = 'text-purple-400';
    
    return { stars: stars.join(''), color };
  };

  const ratingInfo = getRatingStars(book.average_rating);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/book/${book.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                <div className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
              </div>
              <span className="relative text-white font-bold text-6xl opacity-80">
                {book.title?.charAt(0) || '?'}
              </span>
            </div>
          )}
          
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {book.average_rating !== null && book.average_rating !== undefined && (
                <div className="flex items-center space-x-1 mb-2">
                  <span className={`${ratingInfo.color} text-lg drop-shadow-lg`}>{ratingInfo.stars}</span>
                  <span className="text-xs text-white/90 font-semibold">({book.average_rating.toFixed(1)})</span>
                </div>
              )}
              {book.description && (
                <p className="text-sm text-white/90 line-clamp-2">
                  {book.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {showShelfButton && (
        <div className="absolute top-3 right-3 z-10" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`p-2.5 rounded-xl glass hover:bg-white/90 shadow-lg transition-all duration-300 ${
              isHovered || isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            disabled={isUpdating}
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-glow p-2 animate-scale-in">
              <button
                onClick={() => handleAddToShelf('want_to_read')}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/60 transition-colors flex items-center space-x-3"
                disabled={isUpdating}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Want to Read</span>
              </button>
              <button
                onClick={() => handleAddToShelf('currently_reading')}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/60 transition-colors flex items-center space-x-3"
                disabled={isUpdating}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                <span className="text-sm font-medium">Currently Reading</span>
              </button>
              <button
                onClick={() => handleAddToShelf('read')}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/60 transition-colors flex items-center space-x-3"
                disabled={isUpdating}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium">Read</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-1.5 text-base group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        {book.genre && (
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium">
            {book.genre}
          </span>
        )}
      </div>
    </div>
  );
};

export default BookCard;
