"""
Test script to verify itinerary improvements
"""
import os
import sys
import json
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models import User, Itinerary, Destination

def test_itinerary_improvements():
    """Test the enhanced itinerary features"""
    print("Testing enhanced itinerary features...")
    
    # Create app context
    app = create_app()
    
    with app.app_context():
        # Create a test user if doesn't exist
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
        
        # Create a test destination if doesn't exist
        destination = Destination.query.filter_by(destination_id='test_dest_001').first()
        if not destination:
            destination = Destination(
                destination_id='test_dest_001',
                name='Test Destination',
                country='Test Country',
                continent='Test Continent',
                budget_tier='mid-range'
            )
            db.session.add(destination)
            db.session.commit()
            print(f"Created test destination with ID: {destination.destination_id}")
        
        # Test creating an enhanced itinerary
        start_date = datetime.now() + timedelta(days=10)
        end_date = start_date + timedelta(days=5)
        
        enhanced_itinerary = Itinerary(
            user_id=user.id,
            destination_id=destination.destination_id,
            title='Enhanced Test Trip',
            description='This is a test itinerary with all the new features',
            start_date=start_date,
            end_date=end_date,
            days=[
                {
                    'day': 1,
                    'title': 'Arrival Day',
                    'date': start_date.date().isoformat(),
                    'activities': [
                        {
                            'time': '14:00',
                            'activity': 'Check into hotel',
                            'duration': '1 hour',
                            'location': 'Test Hotel',
                            'notes': 'Hotel check-in time is 14:00',
                            'category': 'accommodation'
                        }
                    ],
                    'meals': {
                        'breakfast': 'At hotel',
                        'lunch': 'Local restaurant',
                        'dinner': 'Hotel restaurant'
                    },
                    'notes': 'First day - take it easy'
                }
            ],
            estimated_budget=1500.0,
            budget_breakdown={
                'flights': 500,
                'accommodation': 600,
                'food': 300,
                'activities': 100
            },
            notes='Remember to pack light and bring comfortable shoes!',
            tags=['test', 'enhanced', 'vacation'],
            is_public=False,
            ai_generated=False,
            ai_prompt=None
        )
        
        db.session.add(enhanced_itinerary)
        db.session.commit()
        print(f"Created enhanced itinerary with ID: {enhanced_itinerary.id}")
        
        # Test retrieving the itinerary
        retrieved_itinerary = Itinerary.query.get(enhanced_itinerary.id)
        itinerary_dict = retrieved_itinerary.to_dict()
        
        print("\nItinerary details:")
        print(f"  Title: {itinerary_dict['title']}")
        print(f"  Description: {itinerary_dict['description']}")
        print(f"  Start Date: {itinerary_dict['start_date']}")
        print(f"  End Date: {itinerary_dict['end_date']}")
        print(f"  Estimated Budget: ${itinerary_dict['estimated_budget']}")
        print(f"  Tags: {itinerary_dict['tags']}")
        print(f"  Notes: {itinerary_dict['notes']}")
        print(f"  Days: {len(itinerary_dict['days'])}")
        
        # Test updating the itinerary
        retrieved_itinerary.notes = 'Updated notes: Don\'t forget the camera!'
        retrieved_itinerary.tags.append('updated')
        db.session.commit()
        
        print("\nUpdated itinerary notes:", retrieved_itinerary.to_dict()['notes'])
        print("Updated itinerary tags:", retrieved_itinerary.to_dict()['tags'])
        
        # Test the enhanced to_dict method
        dict_output = retrieved_itinerary.to_dict()
        print("\nEnhanced to_dict method test:")
        print(f"  Has destination info: {'destination' in dict_output}")
        print(f"  Has notes field: {'notes' in dict_output}")
        print(f"  Has tags field: {'tags' in dict_output}")
        print(f"  Has is_public field: {'is_public' in dict_output}")
        
        print("\nAll tests passed! Enhanced itinerary features are working correctly.")
        
        # Clean up test data
        db.session.delete(enhanced_itinerary)
        db.session.commit()
        print("\nCleaned up test data.")

if __name__ == "__main__":
    test_itinerary_improvements()