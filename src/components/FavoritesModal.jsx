import React from 'react';

const FavoritesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-modal-title"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 id="favorites-modal-title" className="text-2xl font-bold text-gray-900 mb-4">
          Favorites
        </h2>
        <p className="text-gray-600">
          This feature is coming soon! You'll be able to see your favorite destinations here.
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FavoritesModal;
