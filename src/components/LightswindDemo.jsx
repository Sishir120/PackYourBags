import React from 'react';

// Import lightswind components
import { Button } from '@/components/lightswind/button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { Badge } from '@/components/lightswind/badge';
import { Alert } from '@/components/lightswind/alert';
import LightswindDestinationCard from './LightswindDestinationCard';
import LightswindTravelForm from './LightswindTravelForm';

const LightswindDemo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Lightswind Components Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Button Examples */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Card>
        
        {/* Input Examples */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Inputs</h2>
          <div className="space-y-4">
            <Input placeholder="Default input" />
            <Input placeholder="Success input" variant="success" />
            <Input placeholder="Error input" variant="error" />
          </div>
        </Card>
      </div>
      
      {/* Badge Examples */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </Card>
      
      {/* Alert Examples */}
      <div className="space-y-4 mb-8">
        <Alert variant="info">
          <Alert.Title>Information</Alert.Title>
          <Alert.Description>This is an informational alert.</Alert.Description>
        </Alert>
        
        <Alert variant="success">
          <Alert.Title>Success</Alert.Title>
          <Alert.Description>Your action was completed successfully.</Alert.Description>
        </Alert>
        
        <Alert variant="warning">
          <Alert.Title>Warning</Alert.Title>
          <Alert.Description>Please review the information below.</Alert.Description>
        </Alert>
        
        <Alert variant="error">
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>There was an error processing your request.</Alert.Description>
        </Alert>
      </div>
      
      {/* Combined Example */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Travel Booking Form</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <Input placeholder="Where do you want to go?" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Travel Dates</label>
            <Input type="date" />
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="success">Best Price Guarantee</Badge>
            <div className="space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="primary">Book Now</Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Destination Card Example */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Destination Card Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LightswindDestinationCard 
            destination={{
              name: "Santorini, Greece",
              location: "Cyclades, Greece",
              description: "Famous for its dramatic views, stunning sunsets, and white-washed buildings with blue accents.",
              price: "1299",
              rating: "4.8",
              image: "https://images.unsplash.com/photo-1570077188908-113b74d9acac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              tags: ["Beach", "Romantic", "Luxury"]
            }}
          />
          <LightswindDestinationCard 
            destination={{
              name: "Kyoto, Japan",
              location: "Kansai, Japan",
              description: "Experience traditional Japanese culture with temples, gardens, and historic districts.",
              price: "1599",
              rating: "4.9",
              image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              tags: ["Culture", "Temples", "Cherry Blossoms"]
            }}
          />
          <LightswindDestinationCard 
            destination={{
              name: "Banff, Canada",
              location: "Alberta, Canada",
              description: "Explore the Canadian Rockies with turquoise lakes, mountain vistas, and outdoor adventures.",
              price: "999",
              rating: "4.7",
              image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              tags: ["Mountains", "Hiking", "Nature"]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LightswindDemo;