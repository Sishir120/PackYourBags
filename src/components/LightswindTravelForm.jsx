import React, { useState } from 'react';
import { Card } from '@/components/lightswind/card';
import { Button } from '@/components/lightswind/button';
import { Input } from '@/components/lightswind/input';
import { Select } from '@/components/lightswind/select';
import { Textarea } from '@/components/lightswind/textarea';

const LightswindTravelForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    dates: '',
    travelers: '1',
    budget: '',
    interests: '',
    specialRequests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would call an API
    alert('Travel plan submitted! In a real application, this would generate your personalized itinerary.');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Plan Your Perfect Trip</h1>
        <p className="text-gray-600 mb-6">Let us help you create a personalized travel experience</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <Input
                name="destination"
                placeholder="Where do you want to go?"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Travel Dates</label>
              <Input
                name="dates"
                type="date"
                value={formData.dates}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Number of Travelers</label>
              <Select
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
              >
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="5+">5+ Travelers</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Budget (USD)</label>
              <Input
                name="budget"
                type="number"
                placeholder="e.g., 2000"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Travel Interests</label>
            <Select
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              multiple
            >
              <option value="beach">Beach & Relaxation</option>
              <option value="adventure">Adventure & Outdoor</option>
              <option value="culture">Culture & History</option>
              <option value="food">Food & Culinary</option>
              <option value="nature">Nature & Wildlife</option>
              <option value="shopping">Shopping & Entertainment</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Special Requests</label>
            <Textarea
              name="specialRequests"
              placeholder="Any special requirements or preferences?"
              rows="4"
              value={formData.specialRequests}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" variant="primary" className="px-8">
              Create My Itinerary
            </Button>
          </div>
        </form>
      </Card>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 text-center">
          <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Personalized Itineraries</h3>
          <p className="text-gray-600 text-sm">Get custom travel plans based on your interests and budget</p>
        </Card>
        
        <Card className="p-5 text-center">
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
          <p className="text-gray-600 text-sm">We'll match any lower price and give you additional benefits</p>
        </Card>
        
        <Card className="p-5 text-center">
          <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
          <p className="text-gray-600 text-sm">Our travel experts are available anytime to assist you</p>
        </Card>
      </div>
    </div>
  );
};

export default LightswindTravelForm;