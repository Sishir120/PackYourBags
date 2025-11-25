import React, { useEffect, useRef } from 'react';

const MapModal = ({ isOpen, onClose, destination }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (isOpen && window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: destination.latitude, lng: destination.longitude },
        zoom: 12,
      });

      new window.google.maps.Marker({
        position: { lat: destination.latitude, lng: destination.longitude },
        map: map,
        title: destination.name,
      });
    } else if (isOpen) {
      // Google Maps is not loaded, show a message instead
      console.warn('Google Maps is not loaded. Please add your API key to use map features.');
    }
  }, [isOpen, destination]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">{destination.name}</h2>
        {window.google && window.google.maps ? (
          <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
        ) : (
          <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded">
            <div className="text-center">
              <p className="text-gray-500">Map not available</p>
              <p className="text-sm text-gray-400 mt-2">Google Maps API key not configured</p>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MapModal;