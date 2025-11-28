"""
Script to verify that destinations have been updated with multiple images
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination

def verify_images():
    """Verify that destinations have multiple images"""
    # Create Flask app
    app = create_app()
    
    # Verify within app context
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        print(f"Total destinations: {len(destinations)}")
        
        # Check image counts
        for destination in destinations[:5]:  # Check first 5 destinations
            image_count = len(destination.images) if destination.images else 0
            print(f"{destination.name}: {image_count} images")
            if destination.images:
                print(f"  - {destination.images[0]}")
        
        # Check if all destinations have multiple images
        all_have_multiple = True
        for destination in destinations:
            if not destination.images or len(destination.images) < 2:
                all_have_multiple = False
                print(f"WARNING: {destination.name} has only {len(destination.images) if destination.images else 0} images")
        
        if all_have_multiple:
            print("\nAll destinations have multiple images! ✓")
        else:
            print("\nSome destinations need more images.")

if __name__ == "__main__":
    verify_images()