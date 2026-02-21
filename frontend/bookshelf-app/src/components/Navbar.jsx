import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/apiFetch';

const Navbar = () => {
  const [isShelvesOpen, setIsShelvesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShelvesOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-glow' : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/books" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold gradient-text">Bookshelf</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, genres..."
                className="relative w-full px-5 py-2.5 pl-12 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link
              to="/books"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              All Books
            </Link>

            <Link
              to="/recommendations"
              className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>For You</span>
            </Link>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsShelvesOpen(!isShelvesOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <span>My Shelves</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isShelvesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isShelvesOpen && (
                <div className="absolute right-0 mt-2 w-60 glass rounded-xl shadow-glow p-2 animate-scale-in">
                  <Link
                    to="/shelves?shelf=want_to_read"
                    className="block px-4 py-3 rounded-lg hover:bg-white/60 transition-colors"
                    onClick={() => setIsShelvesOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-gray-700">Want to Read</span>
                    </div>
                  </Link>
                  <Link
                    to="/shelves?shelf=currently_reading"
                    className="block px-4 py-3 rounded-lg hover:bg-white/60 transition-colors"
                    onClick={() => setIsShelvesOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
                      <span className="font-medium text-gray-700">Currently Reading</span>
                    </div>
                  </Link>
                  <Link
                    to="/shelves?shelf=read"
                    className="block px-4 py-3 rounded-lg hover:bg-white/60 transition-colors"
                    onClick={() => setIsShelvesOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-gray-700">Read</span>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200/50 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
