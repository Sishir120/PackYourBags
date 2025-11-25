import React from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchSuggestions = ({ searchTerm, onSelect }) => {
  // Sample suggestions based on popular searches
  const suggestions = [
    "Tokyo with kids",
    "cheap beaches in January",
    "European cities for first-time visitors",
    "adventure travel in South America",
    "budget-friendly Asian destinations",
    "romantic getaways in Europe",
    "family-friendly national parks",
    "winter ski destinations",
    "cultural experiences in India",
    "luxury resorts in the Maldives"
  ];

  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm 
    ? suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : suggestions.slice(0, 5);

  if (!searchTerm || filteredSuggestions.length === 0) return null;

  return (
    <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
      <div className="py-2">
        {filteredSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span>{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;