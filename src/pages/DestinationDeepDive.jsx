import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ChevronLeft, 
  Calendar, 
  Users, 
  Mail, 
  CheckCircle, 
  ExternalLink,
  Clock,
  DollarSign,
  Hotel,
  Building,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { destinationApi } from '../utils/api';
// Added import for the new automation service utility
import { startAutomationService } from '../utils/automationService';
import Loading from '../components/Loading';

const DestinationDeepDive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    travelDates: '',
    numberOfTravelers: 1,
    email: ''
  });
  const [automationSuccess, setAutomationSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        // Fixed: Use the correct API function
        const response = await destinationApi.getDestinationDetails(id);
        setDestination(response.destination);
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAutomationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.travelDates || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Submit automation service request
    try {
      const requestData = {
        destination: destination.name,
        destinationId: id,
        travelDates: formData.travelDates,
        numberOfTravelers: formData.numberOfTravelers,
        email: formData.email
      };
      
      // Call the startAutomationService utility function
      const response = await startAutomationService(requestData);
      
      setAutomationSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        travelDates: '',
        numberOfTravelers: 1,
        email: ''
      });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsAutomationModalOpen(false);
        setAutomationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting automation request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  // Function to generate affiliate link based on destination
  const getAffiliateLink = (destinationName) => {
    // Sample affiliate links - in a real implementation, you would have actual affiliate links
    const affiliateLinks = {
      'Paris': 'https://affiliate.example.com/?destination=Paris&partner_id=PackYourBags123',
      'New York': 'https://affiliate.example.com/?destination=NewYork&partner_id=PackYourBags123',
      'London': 'https://affiliate.example.com/?destination=London&partner_id=PackYourBags123',
      'Tokyo': 'https://affiliate.example.com/?destination=Tokyo&partner_id=PackYourBags123',
      'Bali': 'https://affiliate.example.com/?destination=Bali&partner_id=PackYourBags123',
      'default': 'https://affiliate.example.com/?destination=' + encodeURIComponent(destinationName) + '&partner_id=PackYourBags123'
    };
    
    return affiliateLinks[destinationName] || affiliateLinks['default'];
  };

  // Function to check if destination has affiliate options
  const hasAffiliateOptions = (destinationName) => {
    const supportedDestinations = ['Paris', 'New York', 'London', 'Tokyo', 'Bali'];
    return supportedDestinations.includes(destinationName);
  };

  // Function to get Google Maps embed URL
  const getGoogleMapsEmbedUrl = () => {
    if (destination.coordinates && destination.coordinates.lat && destination.coordinates.lng) {
      return `https://www.google.com/maps/embed/v1/view?key=AIzaSyB3uYDzF9DzF9DzF9DzF9DzF9DzF9DzF9Dz&center=${destination.coordinates.lat},${destination.coordinates.lng}&zoom=10&maptype=satellite`;
    }
    // Fallback to search if coordinates are not available
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyB3uYDzF9DzF9DzF9DzF9DzF9DzF9DzF9Dz&q=${encodeURIComponent(destination.name + ', ' + destination.country)}`;
  };

  // Get images from destination data
  const getImages = () => {
    if (destination && destination.images && destination.images.length > 0) {
      return destination.images.filter(img => img && img.trim() !== '');
    }
    // Fallback to a default image if no images are available
    return [`https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90&dest=${encodeURIComponent(destination?.name || 'travel')}`];
  };

  const images = getImages();
  const currentImage = images[currentImageIndex] || images[0];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <MapPin className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Destination Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the destination you're looking for.</p>
          <Link 
            to="/" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          <ChevronLeft className="inline-block mr-2" />
          Back to Home
        </Link>
      </div>
      
      {/* Destination Images Carousel */}
      <div className="relative h-96 rounded-xl overflow-hidden shadow-lg mb-8">
        {images.length > 0 ? (
          <>
            <img
              src={currentImage}
              alt={destination.name}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90&dest=${encodeURIComponent(destination.name || 'travel')}`;
                e.target.onerror = null;
              }}
            />
            
            {/* Image Navigation Arrows (only show if there are multiple images) */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-opacity shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-opacity shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800 rotate-180" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    ></div>
                  ))}
                </div>
              </>
            )}
            
            {/* Image Count Badge */}
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{images.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-4">
          <MapPin className="inline-block mr-2" />
          <h1 className="text-3xl font-bold">{destination.name}</h1>
        </div>
        <div className="mb-6">
          <p className="text-gray-700">{destination.description}</p>
        </div>
        
        {/* Google Maps Embed */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <MapPin className="mr-2 text-sky-600" />
            Location Map
          </h2>
          <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg">
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
        
        {/* Affiliate Link Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-sky-50 to-orange-50 rounded-xl border border-sky-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Hotel className="mr-2" />
            View AI Itinerary & Book
          </h2>
          <p className="text-gray-600 mb-4">
            Book your accommodation through our trusted partners and earn rewards while supporting our platform.
          </p>
          {hasAffiliateOptions(destination.name) ? (
            <a
              href={getAffiliateLink(destination.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-500 text-white font-bold rounded-full hover:from-sky-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
            >
              Book Now on Affiliate Platform
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          ) : (
            <div className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-500 font-bold rounded-full cursor-not-allowed">
              Not Available
            </div>
          )}
        </div>
        
        {/* Automation Service Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Building className="mr-2" />
            Book with PackYourBags Automation
          </h2>
          <p className="text-gray-600 mb-4">
            Our automation service handles your booking, monitors prices, and provides a unique cancellation link for maximum flexibility.
          </p>
          <button
            onClick={() => setIsAutomationModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Automated Booking
          </button>
        </div>
        
        {/* Additional Details */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">Destination Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center mb-2">
              <Calendar className="inline-block mr-2 text-gray-600" />
              <span className="text-gray-700">Best Time: {destination.best_season}</span>
            </div>
            <div className="flex items-center mb-2">
              <Users className="inline-block mr-2 text-gray-600" />
              <span className="text-gray-700">Budget Tier: {destination.budget_tier}</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="inline-block mr-2 text-gray-600" />
              <span className="text-gray-700">Quick Fact: {destination.quick_fact}</span>
            </div>
            <div className="flex items-center mb-2">
              <MapPin className="inline-block mr-2 text-gray-600" />
              <span className="text-gray-700">Country: {destination.country}</span>
            </div>
            <div className="flex items-center mb-2">
              <Globe className="inline-block mr-2 text-gray-600" />
              <span className="text-gray-700">Continent: {destination.continent}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Automation Modal */}
      {isAutomationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Automated Booking Service</h2>
            <p className="text-gray-600 mb-6">
              Fill in your travel details and we'll handle the booking process for you.
            </p>
            <form onSubmit={handleAutomationSubmit}>
              <div className="mb-4">
                <label htmlFor="travelDates" className="block text-sm font-medium mb-2">
                  Travel Dates
                </label>
                <input
                  type="text"
                  id="travelDates"
                  name="travelDates"
                  value={formData.travelDates}
                  onChange={handleInputChange}
                  placeholder="e.g., June 15-22, 2023"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="numberOfTravelers" className="block text-sm font-medium mb-2">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  id="numberOfTravelers"
                  name="numberOfTravelers"
                  value={formData.numberOfTravelers}
                  onChange={handleInputChange}
                  min="1"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsAutomationModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Start Automation
                </button>
              </div>
              {automationSuccess && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
                  <CheckCircle className="inline-block mr-2" />
                  <span>
                    Booking Automation Started! Your reservation confirmation and a unique cancellation link will be emailed to you within 24 hours.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDeepDive;