import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Users, Mail, CheckCircle, ExternalLink } from 'lucide-react';
import { destinationApi } from '../utils/destinationApi';
import { requestQuote } from '../utils/requestQuote';
import Loading from '../components/Loading';

const ItineraryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [affiliateOption, setAffiliateOption] = useState(null); // New state for affiliate option
  const [formData, setFormData] = useState({
    travelDates: '',
    numberOfTravelers: 1,
    email: ''
  });

  useEffect(() => {
    fetchDestinationDetails();
  }, [id]);

  const fetchDestinationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await destinationApi.getDestinationDetails(id);
      if (data.success && data.destination) {
        setDestination(data.destination);
        // Check for affiliate options when destination loads
        checkAffiliateOptions(data.destination);
      } else {
        setError('Destination not found');
      }
    } catch (err) {
      console.error('Error fetching destination details:', err);
      setError('Failed to load destination details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to check for available affiliate options
  const checkAffiliateOptions = (dest) => {
    // This is a simplified implementation - in a real app, you would check actual affiliate APIs
    // For now, we'll simulate based on destination name and location

    // Example logic for determining affiliate options
    const airbnbDestinations = ['Paris', 'New York', 'London', 'Tokyo', 'Barcelona', 'Rome', 'Amsterdam', 'Berlin'];
    const tripAdvisorDestinations = ['Paris', 'New York', 'London', 'Tokyo', 'Barcelona', 'Rome', 'Amsterdam', 'Berlin', 'Sydney', 'Dubai', 'Bangkok'];

    const destName = dest.name || '';
    const destCountry = dest.country || '';

    // Check if destination has Airbnb options
    if (airbnbDestinations.some(city =>
      destName.toLowerCase().includes(city.toLowerCase()) ||
      destCountry.toLowerCase().includes(city.toLowerCase()))) {
      setAffiliateOption({
        type: 'airbnb',
        name: 'Airbnb',
        url: `https://www.airbnb.com/s/${encodeURIComponent(destName)}/homes`,
        message: 'Find unique stays on Airbnb'
      });
      return;
    }

    // Check if destination has TripAdvisor options
    if (tripAdvisorDestinations.some(city =>
      destName.toLowerCase().includes(city.toLowerCase()) ||
      destCountry.toLowerCase().includes(city.toLowerCase()))) {
      setAffiliateOption({
        type: 'tripadvisor',
        name: 'TripAdvisor',
        url: `https://www.tripadvisor.com/Search?&q=${encodeURIComponent(destName)}`,
        message: 'Discover hotels and reviews on TripAdvisor'
      });
      return;
    }

    // No affiliate options available
    setAffiliateOption({
      type: 'none',
      name: 'Not Available',
      message: 'No affiliate options currently available for this destination'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfTravelers' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.travelDates || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Submit quote request
    try {
      const requestData = {
        destination: destination.name,
        destinationId: id,
        travelDates: formData.travelDates,
        numberOfTravelers: formData.numberOfTravelers,
        email: formData.email
      };

      // Call the requestQuote utility function
      const response = await requestQuote(requestData);

      setBookingSuccess(true);

      // Reset form after successful submission
      setFormData({
        travelDates: '',
        numberOfTravelers: 1,
        email: ''
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  // Function to handle affiliate link click
  const handleAffiliateBooking = () => {
    if (affiliateOption && affiliateOption.type !== 'none') {
      // Open affiliate link in new tab
      window.open(affiliateOption.url, '_blank');
    } else {
      // Show modal for quote request if no affiliate options
      setIsBookingModalOpen(true);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-500 mb-4">
            <MapPin className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDestinationDetails}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!destination) return null;

  // Generate a sample 3-day itinerary
  const generateSampleItinerary = () => {
    return [
      {
        day: 1,
        title: "Arrival & City Exploration",
        activities: [
          "Arrival at airport and transfer to hotel",
          "Welcome dinner at a local restaurant",
          "Evening stroll through the historic district"
        ]
      },
      {
        day: 2,
        title: "Cultural Immersion",
        activities: [
          "Morning visit to main attractions",
          "Lunch at a traditional local eatery",
          "Afternoon cultural workshop or tour",
          "Sunset views from a scenic viewpoint"
        ]
      },
      {
        day: 3,
        title: "Leisure & Departure",
        activities: [
          "Morning at leisure or optional activity",
          "Final shopping or sightseeing",
          "Check-out and departure transfer"
        ]
      }
    ];
  };

  const itinerary = generateSampleItinerary();

  // Function to get Google Maps embed URL
  const getGoogleMapsEmbedUrl = () => {
    if (destination.coordinates && destination.coordinates.lat && destination.coordinates.lng) {
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyB3uYDzF9DzF9DzF9DzF9DzF9DzF9DzF9Dz&center=${destination.coordinates.lat},${destination.coordinates.lng}&zoom=10&maptype=satellite`;
    }
    // Fallback to search if coordinates are not available
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyB3uYDzF9DzF9DzF9DzF9DzF9DzF9DzF9Dz&q=${encodeURIComponent(destination.name + ', ' + destination.country)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {destination.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{destination.country}</span>
                {destination.continent && (
                  <span className="ml-2">• {destination.continent}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500 mb-1">Starting from</span>
              <span className="text-2xl font-bold text-gray-900">
                ${(Math.floor(Math.random() * 500) + 200).toFixed(0)}
                <span className="text-sm font-normal text-gray-500">/person</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary and Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-sky-600" />
                  Location Map
                </h2>
                <p className="text-gray-600 mt-1">
                  Explore {destination.name} on the map
                </p>
              </div>
              <div className="h-96 w-full">
                <iframe
                  src={getGoogleMapsEmbedUrl()}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${destination.name}`}
                ></iframe>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Sample 3-Day Itinerary</h2>
                <p className="text-gray-600 mt-1">
                  A suggested plan to make the most of your trip
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {itinerary.map((day) => (
                  <div key={day.day} className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                        <span className="font-bold text-sky-700">Day {day.day}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{day.title}</h3>
                        <ul className="space-y-2">
                          {day.activities.map((activity, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-sky-500 mt-2 mr-3"></div>
                              <span className="text-gray-700">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking and Info */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Book Your Trip</h2>
                <p className="text-gray-600 mt-1">
                  Find accommodation and plan your journey
                </p>
              </div>
              <div className="p-6">
                {affiliateOption && affiliateOption.type !== 'none' ? (
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">
                          {affiliateOption.name} Options Available
                        </span>
                      </div>
                      <p className="text-green-700 mt-1 text-sm">
                        {affiliateOption.message}
                      </p>
                    </div>
                    <button
                      onClick={handleAffiliateBooking}
                      className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-orange-500 text-white font-bold rounded-lg hover:from-sky-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      Book Now on {affiliateOption.name}
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="font-medium text-gray-800">
                          No Affiliate Options Available
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">
                        Request a custom quote from our travel experts
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Request Custom Quote
                </button>
              </div>
            </div>

            {/* Destination Info */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Destination Info</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Best Time to Visit</p>
                    <p className="font-medium">{destination.best_season || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Popularity</p>
                    <p className="font-medium">{destination.popularity || 'Moderate'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Quick Fact</p>
                    <p className="font-medium">{destination.quick_fact || 'No quick fact available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Request Custom Quote</h2>
                <p className="text-gray-600 mt-1">
                  Our travel experts will create a personalized itinerary for you
                </p>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="travelDates" className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Dates
                    </label>
                    <input
                      type="text"
                      id="travelDates"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleInputChange}
                      placeholder="e.g., June 15-22, 2023"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="numberOfTravelers" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Travelers
                    </label>
                    <input
                      type="number"
                      id="numberOfTravelers"
                      name="numberOfTravelers"
                      value={formData.numberOfTravelers}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Request Quote
                  </button>
                </div>
                {bookingSuccess && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>
                      Quote request submitted successfully! We'll contact you shortly.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPage;