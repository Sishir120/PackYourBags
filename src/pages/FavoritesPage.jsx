import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { getFavorites } from '../utils/api';
import DestinationCard from '../components/DestinationCard';
import Loading from '../components/Loading';

const FavoritesPage = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavorites(user.id);
      if (response.success) {
        setFavorites(response.favorites);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchFavorites}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold text-gray-900">Your Favorite Destinations</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">Start exploring destinations and pin your favorites!</p>
          <Link 
            to="/destinations" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Discover Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <DestinationCard 
              key={fav.destination.destination_id} 
              destination={fav.destination} 
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;