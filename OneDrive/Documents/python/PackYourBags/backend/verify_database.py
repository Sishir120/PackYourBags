"""
Script to verify that destinations have been correctly seeded in the database
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination

def verify_database():
    """Verify that destinations have been correctly seeded"""
    # Create Flask app
    app = create_app()
    
    # Verify database within app context
    with app.app_context():
        # Count total destinations
        total_destinations = Destination.query.count()
        print(f"Total destinations in database: {total_destinations}")
        
        # Get first destination
        first_dest = Destination.query.first()
        if first_dest:
            print(f"First destination: {first_dest.name}")
            print(f"Has local tips: {bool(first_dest.local_tips)}")
            print(f"Has description: {bool(first_dest.description)}")
            print(f"Has coordinates: {first_dest.latitude is not None and first_dest.longitude is not None}")
            print(f"Budget tier: {first_dest.budget_tier}")
            print(f"Continent: {first_dest.continent}")
            
            # Show sample of enhanced data
            if first_dest.local_tips:
                print(f"Sample local tip: {first_dest.local_tips[0] if first_dest.local_tips else 'None'}")
            
            # Count destinations by continent
            continents = Destination.query.with_entities(Destination.continent).distinct().all()
            print(f"\nContinents covered: {[c[0] for c in continents]}")
            
            # Count destinations by budget tier
            budget_tiers = Destination.query.with_entities(Destination.budget_tier).distinct().all()
            print(f"Budget tiers: {[b[0] for b in budget_tiers]}")
            
        else:
            print("No destinations found in database")

if __name__ == "__main__":
    verify_database()