import { useState, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/recommendations');
      if (data.message) {
        setError(data.message);
        setRecommendations([]);
      } else {
        setRecommendations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load recommendations.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 animate-pulse"></div>
              <svg className="relative w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold gradient-text">Personalized For You</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Based on your reading preferences and ratings
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Finding perfect books for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <svg className="mx-auto h-20 w-20 text-purple-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Not Enough Data</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => (window.location.href = '/books')}
              className="relative inline-block group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
                Rate Some Books
              </div>
            </button>
          </div>
        ) : recommendations.length > 0 ? (
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-medium">
                {recommendations.length} {recommendations.length === 1 ? 'recommendation' : 'recommendations'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((book, index) => (
                <div key={book.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <BookCard book={book} onShelfUpdate={fetchRecommendations} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl shadow-glow animate-scale-in">
            <svg className="mx-auto h-20 w-20 text-purple-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-500 mb-6">Rate some books to get personalized recommendations!</p>
            <button
              onClick={() => (window.location.href = '/books')}
              className="relative inline-block group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
                Browse Books
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Recommendations;
