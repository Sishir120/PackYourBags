import React, { useState, useEffect } from 'react';
import { destinationApi } from '../utils/destinationApi';

const AdminDestinationManager = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [newImages, setNewImages] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newDestination, setNewDestination] = useState({
    name: '',
    country: '',
    continent: '',
    highlights: '',
    quick_fact: '',
    best_season: '',
    budget_tier: 'budget-friendly',
    latitude: '',
    longitude: '',
    description: '',
    local_tips: ''
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await destinationApi.getDestinations();
      if (data.success) {
        setDestinations(data.destinations);
      }
    } catch (err) {
      setError('Failed to fetch destinations');
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...newImages];
    updatedImages[index] = value;
    setNewImages(updatedImages);
  };

  const handleUpdateImages = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Call the backend API to update images
      const response = await fetch(`/api/admin/destinations/${selectedDestination.destination_id}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: newImages.filter(img => img.trim() !== '')
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Images updated successfully!');
        // Update the local state
        const updatedDestinations = destinations.map(dest =>
          dest.destination_id === selectedDestination.destination_id
            ? { ...dest, images: result.images }
            : dest
        );
        setDestinations(updatedDestinations);
        setSelectedDestination({ ...selectedDestination, images: result.images });
      } else {
        setError(result.error || 'Failed to update images');
      }
    } catch (err) {
      setError('Failed to update images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Prepare highlights and local_tips arrays
      const highlights = newDestination.highlights
        ? newDestination.highlights.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const local_tips = newDestination.local_tips
        ? newDestination.local_tips.split(',').map(item => item.trim()).filter(item => item)
        : [];

      // Prepare data for API
      const destinationData = {
        name: newDestination.name,
        country: newDestination.country,
        continent: newDestination.continent,
        highlights: highlights,
        quick_fact: newDestination.quick_fact,
        best_season: newDestination.best_season,
        budget_tier: newDestination.budget_tier,
        description: newDestination.description,
        local_tips: local_tips,
        latitude: newDestination.latitude,
        longitude: newDestination.longitude,
        images: ['', '', '', ''] // Empty images initially
      };

      // Call the backend API to add a new destination
      const response = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(destinationData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Destination added successfully!');
        // Refresh the destinations list
        fetchDestinations();

        // Reset form
        setNewDestination({
          name: '',
          country: '',
          continent: '',
          highlights: '',
          quick_fact: '',
          best_season: '',
          budget_tier: 'budget-friendly',
          latitude: '',
          longitude: '',
          description: '',
          local_tips: ''
        });
      } else {
        setError(result.error || 'Failed to add destination');
      }
    } catch (err) {
      setError('Failed to add destination: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTopDestinationsByContinent = () => {
    const continents = {};
    destinations.forEach(dest => {
      if (!continents[dest.continent]) {
        continents[dest.continent] = [];
      }
      continents[dest.continent].push(dest);
    });
    return continents;
  };

  const topDestinations = getTopDestinationsByContinent();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Destination Management</h1>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Update Existing Destination Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Destination Images</h2>
            <p className="text-gray-600 mb-4">Select a destination to update its images</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Destination
              </label>
              <select
                value={selectedDestination?.destination_id || ''}
                onChange={(e) => {
                  const dest = destinations.find(d => d.destination_id === e.target.value);
                  setSelectedDestination(dest);
                  if (dest && dest.images) {
                    // Fill the images array with existing images + empty slots
                    const filledImages = [...dest.images];
                    while (filledImages.length < 4) {
                      filledImages.push('');
                    }
                    setNewImages(filledImages.slice(0, 4));
                  } else {
                    setNewImages(['', '', '', '']);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a destination...</option>
                {destinations.map((dest) => (
                  <option key={dest.destination_id} value={dest.destination_id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </select>
            </div>

            {selectedDestination && (
              <form onSubmit={handleUpdateImages} className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Current Images for {selectedDestination.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedDestination.images?.map((img, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`Destination ${index + 1}`}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Update Images</h3>
                  {newImages.map((image, index) => (
                    <div key={index} className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">
                        Image {index + 1} URL
                      </label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Updating...' : 'Update Images'}
                </button>
              </form>
            )}
          </div>

          {/* Add New Destination */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Destination</h2>
            <p className="text-gray-600 mb-4">Add a new destination to the database</p>

            <form onSubmit={handleAddDestination} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    value={newDestination.name}
                    onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={newDestination.country}
                    onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Continent *
                  </label>
                  <select
                    value={newDestination.continent}
                    onChange={(e) => setNewDestination({ ...newDestination, continent: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select continent</option>
                    <option value="Africa">Africa</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Antarctica">Antarctica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Tier
                  </label>
                  <select
                    value={newDestination.budget_tier}
                    onChange={(e) => setNewDestination({ ...newDestination, budget_tier: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="budget-friendly">Budget Friendly</option>
                    <option value="mid-range">Mid Range</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highlights (comma-separated)
                </label>
                <input
                  type="text"
                  value={newDestination.highlights}
                  onChange={(e) => setNewDestination({ ...newDestination, highlights: e.target.value })}
                  placeholder="e.g., beaches, culture, nightlife"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Fact
                </label>
                <textarea
                  value={newDestination.quick_fact}
                  onChange={(e) => setNewDestination({ ...newDestination, quick_fact: e.target.value })}
                  placeholder="Interesting fact about this destination"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDestination.description}
                  onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                  placeholder="Detailed description of the destination"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local Tips (comma-separated)
                </label>
                <input
                  type="text"
                  value={newDestination.local_tips}
                  onChange={(e) => setNewDestination({ ...newDestination, local_tips: e.target.value })}
                  placeholder="e.g., best local food, cultural tips"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Best Season
                  </label>
                  <input
                    type="text"
                    value={newDestination.best_season}
                    onChange={(e) => setNewDestination({ ...newDestination, best_season: e.target.value })}
                    placeholder="e.g., March to May"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coordinates
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newDestination.latitude}
                      onChange={(e) => setNewDestination({ ...newDestination, latitude: e.target.value })}
                      placeholder="Latitude"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newDestination.longitude}
                      onChange={(e) => setNewDestination({ ...newDestination, longitude: e.target.value })}
                      placeholder="Longitude"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Adding...' : 'Add Destination'}
              </button>
            </form>
          </div>
        </div>

        {/* Top Destinations by Continent */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Destinations by Continent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(topDestinations).map(([continent, dests]) => (
              <div key={continent} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-3">{continent}</h3>
                <ul className="space-y-2">
                  {dests.slice(0, 5).map((dest) => (
                    <li key={dest.destination_id} className="flex justify-between items-center">
                      <span className="text-gray-700">{dest.name}</span>
                      <span className="text-sm text-gray-500">{dest.country}</span>
                    </li>
                  ))}
                  {dests.length > 5 && (
                    <li className="text-sm text-gray-500">+ {dests.length - 5} more destinations</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-blue-800 mb-2">How to Use This Tool</h3>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>Use high-quality images from Unsplash or similar sources (1200px width recommended)</li>
            <li>Ensure images are relevant to the destination and showcase its unique features</li>
            <li>For new destinations, provide as much accurate information as possible</li>
            <li>Test all image URLs to ensure they load correctly</li>
            <li>This tool now connects directly to the backend database</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDestinationManager;