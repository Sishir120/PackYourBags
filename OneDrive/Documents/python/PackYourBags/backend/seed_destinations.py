"""
Script to seed the database with enhanced destination data
"""

import json
import os
import sys
from typing import Dict, List

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination, db

def load_destinations(file_path: str) -> List[Dict]:
    """Load destinations from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def seed_destinations(destinations_file: str):
    """Seed the database with destinations from JSON file"""
    # Create Flask app
    app = create_app()
    
    # Load destinations from JSON file
    destinations = load_destinations(destinations_file)
    print(f"Loaded {len(destinations)} destinations from {destinations_file}")
    
    # Seed database within app context
    with app.app_context():
        # Clear existing destinations
        Destination.query.delete()
        db.session.commit()
        print("Cleared existing destinations")
        
        # Add new destinations
        for i, dest_data in enumerate(destinations):
            try:
                # Create destination object
                destination = Destination(
                    destination_id=dest_data.get('id', f"dest_{i+1:03d}"),
                    name=dest_data.get('name', ''),
                    country=dest_data.get('country', ''),
                    continent=dest_data.get('continent', ''),
                    highlights=dest_data.get('highlights', []),
                    quick_fact=dest_data.get('quick_fact', ''),
                    best_season=dest_data.get('best_season', ''),
                    budget_tier=dest_data.get('budget_tier', 'mid-range'),
                    description=dest_data.get('description', ''),
                    local_tips=dest_data.get('local_tips', []),
                    images=[dest_data.get('image_url', '')] if dest_data.get('image_url') else [],
                    latitude=dest_data.get('coordinates', {}).get('lat'),
                    longitude=dest_data.get('coordinates', {}).get('lng')
                )
                
                db.session.add(destination)
                print(f"Added destination: {destination.name}")
                
            except Exception as e:
                print(f"Error adding destination {dest_data.get('name', 'Unknown')}: {str(e)}")
                continue
        
        # Commit changes
        db.session.commit()
        print(f"Successfully seeded {len(destinations)} destinations to database")

if __name__ == "__main__":
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define file path
    destinations_file = os.path.join(script_dir, 'data', 'destinations.json')
    
    # Seed destinations
    seed_destinations(destinations_file)