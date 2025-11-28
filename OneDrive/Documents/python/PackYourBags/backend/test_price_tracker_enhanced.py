"""
Test script to verify enhanced Price Tracker with AI integration
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.price_tracker import PriceTracker

def test_price_tracker_enhanced():
    """Test the enhanced price tracker functions"""
    print("Testing Enhanced Price Tracker AI integration functions...")
    
    # Create a price tracker instance
    price_tracker = PriceTracker()
    
    # Test deal scoring
    test_deal = {
        'savings_percentage': 25,
        'expires_in': 12,
        'deal_type': 'Flight Discount'
    }
    
    # Mock itinerary object
    class MockItinerary:
        def __init__(self):
            self.id = 1
    
    mock_itinerary = MockItinerary()
    
    # Test deal scoring
    scored_deal = price_tracker._score_deal(test_deal, mock_itinerary)
    print(f"Deal scoring test:")
    print(f"  Savings: {scored_deal['savings_percentage']}%")
    print(f"  Expires in: {scored_deal['expires_in']} hours")
    print(f"  Deal type: {scored_deal['deal_type']}")
    print(f"  Score: {scored_deal['score']}")
    print(f"  Urgency level: {scored_deal['urgency_level']}")
    
    # Test deal type weights
    print(f"\nDeal type weights:")
    for deal_type, weight in price_tracker.deal_weights.items():
        print(f"  {deal_type}: {weight}")
    
    # Test deal type generation
    print(f"\nDeal type generation:")
    for i in range(5):
        deal_type = price_tracker._get_deal_type()
        print(f"  Generated: {deal_type}")
    
    # Test AI response parsing
    sample_ai_response = """ANALYSIS: This is an excellent deal for a flight to Bali with 25% savings.
BOOKING_URGENCY: Book within 24 hours to secure this price.
COMPLEMENTARY_SERVICES: Consider booking a hotel in Bali to complete your package.
MAXIMIZATION_TIPS: Visit Ubud for cultural experiences and Seminyak for beaches."""
    
    parsed_response = price_tracker._parse_ai_response(sample_ai_response)
    print(f"\nAI response parsing:")
    for key, value in parsed_response.items():
        print(f"  {key}: {value[:50]}...")
    
    # Test recommendations generation
    class MockDestination:
        def __init__(self):
            self.name = 'Bali'
            self.country = 'Indonesia'
            self.highlights = ['Beaches', 'Temples', 'Rice Terraces']
    
    mock_destination = MockDestination()
    mock_user_preferences = {
        'budget_tier': 'mid-range',
        'travel_styles': ['adventure', 'luxury']
    }
    
    recommendations = price_tracker._generate_recommendations(test_deal, mock_destination, mock_user_preferences)
    print(f"\nRecommendations generation:")
    print(f"  Generated {len(recommendations)} recommendations")
    for i, rec in enumerate(recommendations):
        print(f"  {i+1}. {rec['title']}: {rec['description']}")
    
    print("\nEnhanced price tracker test completed successfully!")

if __name__ == "__main__":
    test_price_tracker_enhanced()