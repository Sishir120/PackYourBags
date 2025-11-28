"""
Test script to verify Price Tracker with AI integration
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Flask environment
os.environ['FLASK_ENV'] = 'testing'

from services.price_tracker import price_tracker
from models import User, Itinerary, Destination
from database import db
from app import create_app

def test_price_tracker_ai():
    """Test the price tracker with AI integration"""
    print("Testing Price Tracker with AI integration...")
    
    # Create app context
    app = create_app()
    
    # Create a test user
    with app.app_context():
        # Check if test user exists
        user = User.query.filter_by(email='test@example.com').first()
        if not user:
            user = User(
                email='test@example.com',
                name='Test User'
            )
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            print(f"Created test user with ID: {user.id}")
        else:
            print(f"Using existing test user with ID: {user.id}")
        
        # Check if test destination exists
        destination = Destination.query.filter_by(destination_id='dest_001').first()
        if not destination:
            print("No test destination found. Please ensure destinations are loaded.")
            return
        
        # Create a test itinerary
        itinerary = Itinerary(
            user_id=user.id,
            destination_id=destination.destination_id,
            title=f"Test Trip to {destination.name}",
            description="Test itinerary for price tracking",
            estimated_budget=1000.00
        )
        db.session.add(itinerary)
        db.session.commit()
        print(f"Created test itinerary with ID: {itinerary.id}")
        
        # Test price tracker with AI
        print("\nTesting price drop detection with AI enhancement...")
        deals = price_tracker.check_price_drops(user.id)
        
        print(f"Found {len(deals)} deals")
        for i, deal in enumerate(deals):
            print(f"\nDeal {i+1}:")
            print(f"  Destination: {destination.name}")
            print(f"  Original Price: ${deal['original_price']}")
            print(f"  New Price: ${deal['new_price']}")
            print(f"  Savings: ${deal['savings']} ({deal['savings_percentage']}% off)")
            print(f"  Deal Type: {deal['deal_type']}")
            print(f"  Provider: {deal['provider']}")
            print(f"  Expires in: {deal['expires_in']} hours")
            
            if 'ai_analysis' in deal:
                print(f"  AI Analysis: {deal['ai_analysis'][:100]}...")
            else:
                print("  No AI analysis available")
            
            if 'ai_recommendations' in deal:
                print(f"  AI Recommendations: {len(deal['ai_recommendations'])} recommendations")
            else:
                print("  No AI recommendations available")
        
        # Clean up test itinerary
        db.session.delete(itinerary)
        db.session.commit()
        print("\nCleaned up test itinerary")
        
        print("\nPrice tracker AI integration test completed successfully!")

if __name__ == "__main__":
    test_price_tracker_ai()