import React from 'react';
import { Card } from '@/components/lightswind/card';
import { Button } from '@/components/lightswind/button';
import { Badge } from '@/components/lightswind/badge';

const LightswindDestinationCard = ({ destination }) => {
  const {
    name,
    location,
    description,
    price,
    rating,
    image,
    tags = []
  } = destination;

  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-sky-400 to-orange-300 flex items-center justify-center">
            <span className="text-white text-xl font-bold">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="primary" className="font-bold">
            ${price}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            <span className="text-sm font-bold">{rating}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-3">{location}</p>
        
        <p className="text-gray-800 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="primary" className="flex-1 mr-2">
            View Details
          </Button>
          <Button variant="outline" className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LightswindDestinationCard;