import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { destinationApi } from '../utils/destinationApi';
import ReactMarkdown from 'react-markdown';

const DestinationPage = () => {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        // This is a temporary solution. In a real application,
        // you would have an API endpoint to fetch a destination by slug.
        const response = await destinationApi.getDestinations();
        if (response.success) {
          const dest = response.destinations.find(d => d.slug === slug);
          setDestination(dest);
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!destination) {
    return <div>Destination not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{destination.name}</h1>
      <img src={destination.image_url} alt={destination.name} className="w-full h-96 object-cover rounded-lg mb-8" />
      <div className="prose lg:prose-xl">
        <ReactMarkdown>{destination.blog}</ReactMarkdown>
      </div>
    </div>
  );
};

export default DestinationPage;
