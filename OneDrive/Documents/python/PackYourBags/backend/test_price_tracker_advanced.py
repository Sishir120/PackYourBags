"""
Test script to verify advanced Price Tracker features
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.price_tracker import PriceTracker

def test_price_tracker_advanced():
    """Test the advanced price tracker functions"""
    print("Testing Advanced Price Tracker features...")
    
    # Create a price tracker instance
    price_tracker = PriceTracker()
    
    # Test deal scoring with confidence
    test_deal = {
        'savings_percentage': 25,
        'expires_in': 12,
        'deal_type': 'Flight Discount',
        'ai_confidence_score': '8'
    }
    
    # Mock itinerary object
    class MockItinerary:
        def __init__(self):
            self.id = 1
    
    mock_itinerary = MockItinerary()
    
    # Test deal scoring with confidence
    scored_deal = price_tracker._score_deal(test_deal, mock_itinerary)
    print(f"Deal scoring with confidence test:")
    print(f"  Savings: {scored_deal['savings_percentage']}%")
    print(f"  Expires in: {scored_deal['expires_in']} hours")
    print(f"  Deal type: {scored_deal['deal_type']}")
    print(f"  Confidence score: {scored_deal['confidence_score']}")
    print(f"  Score: {scored_deal['score']}")
    print(f"  Urgency level: {scored_deal['urgency_level']}")
    
    # Test personalization
    class MockUser:
        def __init__(self):
            self.id = 1
            self.preferences = {
                'budget_tier': 'mid-range',
                'travel_styles': ['luxury', 'adventure']
            }
            self.travel_history = ['dest_001', 'dest_002']
    
    mock_user = MockUser()
    
    # Mock User query to return our mock user
    import models
    original_user_query = models.User.query
    
    class MockUserQuery:
        def get(self, user_id):
            return mock_user if user_id == 1 else None
    
    models.User.query = MockUserQuery()
    
    personalized_deal = price_tracker._personalize_deal(scored_deal, 1)
    print(f"\nPersonalization test:")
    print(f"  Original score: {scored_deal['score']}")
    print(f"  Personalized score: {personalized_deal['personalized_score']}")
    print(f"  Preference multiplier: {personalized_deal['preference_multiplier']}")
    
    # Test price history generation
    price_history = price_tracker._generate_price_history(1000, 750)
    print(f"\nPrice history generation test:")
    print(f"  Generated {len(price_history)} price points")
    print(f"  First price: ${price_history[0]['price']}")
    print(f"  Last price: ${price_history[-1]['price']}")
    
    # Test deal comparison feature
    comparison_result = price_tracker.compare_deals([1, 2, 3])
    print(f"\nDeal comparison feature test:")
    print(f"  Comparison result: {comparison_result['comparison']}")
    print(f"  Deal IDs: {comparison_result['deal_ids']}")
    
    # Test deal history feature
    history_result = price_tracker.get_deal_history(1, 'dest_001')
    print(f"\nDeal history feature test:")
    print(f"  History result: {history_result['history']}")
    print(f"  User ID: {history_result['user_id']}")
    print(f"  Destination ID: {history_result['destination_id']}")
    
    # Restore original User query
    models.User.query = original_user_query
    
    # Test preference weights
    print(f"\nPreference weights:")
    for pref, weight in price_tracker.preference_weights.items():
        print(f"  {pref}: {weight}")
    
    print("\nAdvanced price tracker test completed successfully!")

if __name__ == "__main__":
    test_price_tracker_advanced()