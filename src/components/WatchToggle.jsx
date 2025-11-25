import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

const WatchToggle = ({ city, user, onToggle }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, we would check if the user is already watching this destination
  useEffect(() => {
    // This is a placeholder - in a real implementation, we would make an API call
    // to check if the user is watching this destination
    setIsWatching(false);
  }, [city, user]);

  const handleToggle = async () => {
    if (!user || !user.id) {
      alert('Please sign in to use price watching');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real implementation, we would make an API call to toggle the watch
      // For now, we'll just simulate the toggle
      const newWatchingState = !isWatching;
      setIsWatching(newWatchingState);
      
      // Call the onToggle callback if provided
      if (onToggle) {
        onToggle(city, newWatchingState);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error toggling watch:', error);
      alert('Failed to toggle price watch. Please try again.');
      // Revert the state change if there was an error
      setIsWatching(!isWatching);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
        isWatching
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      ) : isWatching ? (
        <Bell className="w-4 h-4" />
      ) : (
        <BellOff className="w-4 h-4" />
      )}
      <span>{isWatching ? 'Watching' : 'Watch prices'}</span>
    </button>
  );
};

export default WatchToggle;