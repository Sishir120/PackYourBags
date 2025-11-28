"""
Simple test script to verify Price Tracker AI integration functions
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.price_tracker import PriceTracker
from ai_service import ai_service

def test_price_tracker_simple():
    """Test the price tracker AI functions without database"""
    print("Testing Price Tracker AI integration functions...")
    
    # Create a price tracker instance
    price_tracker = PriceTracker()
    
    # Test deal type generation
    deal_type = price_tracker._get_deal_type()
    print(f"Generated deal type: {deal_type}")
    
    # Test recommendations generation
    deal = {
        'deal_type': 'Flight Discount',
        'destination_id': 'dest_001'
    }
    
    # Mock destination object
    class MockDestination:
        def __init__(self):
            self.name = 'Bali'
            self.country = 'Indonesia'
    
    destination = MockDestination()
    recommendations = price_tracker._generate_recommendations(deal, destination)
    print(f"Generated recommendations: {len(recommendations)}")
    for rec in recommendations:
        print(f"  - {rec['title']}: {rec['description']}")
    
    # Test AI service availability
    print(f"AI Service Provider: {ai_service.provider}")
    print(f"AI Service Model: {ai_service.model}")
    print(f"AI Service API Key configured: {bool(ai_service.api_key and ai_service.api_key != 'your_api_key_here')}")
    
    # Test AI enhancement function with mock data
    mock_deal = {
        'itinerary_id': 1,
        'user_id': 1,
        'destination_id': 'dest_001',
        'original_price': 1000,
        'new_price': 750,
        'savings': 250,
        'savings_percentage': 25,
        'deal_type': 'Flight Discount',
        'provider': 'skyscanner',
        'expires_in': 12,
        'timestamp': '2023-01-01T00:00:00Z'
    }
    
    # Mock itinerary object
    class MockItinerary:
        def __init__(self):
            self.id = 1
    
    mock_itinerary = MockItinerary()
    
    # Test the AI enhancement (this will work even without database)
    try:
        enhanced_deal = price_tracker._enhance_deal_with_ai(mock_deal, mock_itinerary)
        print(f"AI enhancement successful!")
        print(f"Deal has AI analysis: {'ai_analysis' in enhanced_deal}")
        print(f"Deal has AI recommendations: {'ai_recommendations' in enhanced_deal}")
    except Exception as e:
        print(f"AI enhancement test failed: {e}")
        print("This is expected if AI API key is not configured")
    
    print("\nPrice tracker AI integration test completed!")

if __name__ == "__main__":
    test_price_tracker_simple()