import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import Navbar from '../components/Navbar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/search?query=${encodeURIComponent(query)}`);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to search books:', err);
      setError('Failed to search books. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImportBook = async (book) => {
    try {
      const imported = await apiFetch('/import-book', {
        method: 'POST',
        body: {
          title: book.title,
          author: book.author,
          openlibrary_id: book.openlibrary_id,
          genre: book.genre
        },
      });
      
      if (imported.id) {
        navigate(`/book/${imported.id}`);
      }
    } catch (err) {
      console.error('Failed to import book:', err);
      alert('Failed to import book. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 animate-slide-up">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Search Results
          </h1>
          <p className="text-gray-600 text-lg">
            Results for "<span className="font-semibold text-blue-600">{query}</span>"
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Searching...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchSearchResults}
              className="relative inline-block group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">
                Try Again
              </div>
            </button>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-medium">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            <div className="grid gap-4">
              {results.map((book, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-6 hover:shadow-glow transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-gray-200">
  {(() => {
    const olid = book.openlibrary_id?.split("/").pop();
    const coverUrl = olid
      ? `https://covers.openlibrary.org/b/olid/${olid}-M.jpg`
      : null;

    return coverUrl ? (
      <img
        src={coverUrl}
        alt={book.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white font-bold">
        {book.title?.charAt(0) || "?"}
      </div>
    );
  })()}
</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h3>
                      <p className="text-gray-600 mb-2">by {book.author}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {book.genre && (
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium">
                            {book.genre}
                          </span>
                        )}
                        {book.first_publish_year && (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {book.first_publish_year}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleImportBook(book)}
                        className="relative inline-block group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Import Book</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
