import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/lightswind/button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { Badge } from '@/components/lightswind/badge';
import { Alert } from '@/components/lightswind/alert';
import LightswindDemo from './LightswindDemo';
import LightswindDestinationCard from './LightswindDestinationCard';
import LightswindTravelForm from './LightswindTravelForm';

// Mock destination data for testing
const mockDestination = {
  name: "Test Destination",
  location: "Test Location",
  description: "Test description for the destination",
  price: "999",
  rating: "4.5",
  image: "https://example.com/test-image.jpg",
  tags: ["Beach", "Romantic"]
};

describe('Lightswind Components', () => {
  test('renders LightswindDemo component', () => {
    render(<LightswindDemo />);
    expect(screen.getByText('Lightswind Components Demo')).toBeInTheDocument();
  });

  test('renders LightswindDestinationCard component', () => {
    render(<LightswindDestinationCard destination={mockDestination} />);
    expect(screen.getByText(mockDestination.name)).toBeInTheDocument();
    expect(screen.getByText(mockDestination.location)).toBeInTheDocument();
    expect(screen.getByText(`$${mockDestination.price}`)).toBeInTheDocument();
  });

  test('renders LightswindTravelForm component', () => {
    render(<LightswindTravelForm />);
    expect(screen.getByText('Plan Your Perfect Trip')).toBeInTheDocument();
  });

  test('renders lightswind Button component', () => {
    render(<Button variant="primary">Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('renders lightswind Card component', () => {
    render(<Card><p>Test Card Content</p></Card>);
    expect(screen.getByText('Test Card Content')).toBeInTheDocument();
  });

  test('renders lightswind Input component', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  test('renders lightswind Badge component', () => {
    render(<Badge variant="primary">Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  test('renders lightswind Alert component', () => {
    render(
      <Alert>
        <Alert.Title>Test Alert</Alert.Title>
        <Alert.Description>Test alert description</Alert.Description>
      </Alert>
    );
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('Test alert description')).toBeInTheDocument();
  });
});