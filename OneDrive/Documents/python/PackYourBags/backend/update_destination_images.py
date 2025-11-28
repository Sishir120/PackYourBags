"""
Script to update destinations with multiple high-quality, destination-specific images
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

# High-quality, destination-specific images
DESTINATION_IMAGES = {
    "Pokhara": [
        "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",
        "https://images.unsplash.com/photo-1572928100451-6a2b7e8a7a3f?w=1200&q=80",
        "https://images.unsplash.com/photo-1587135996004-6d9e3e9f5c1e?w=1200&q=80"
    ],
    "Kathmandu": [
        "https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&q=80",
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&q=80",
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&q=80"
    ],
    "Chitwan National Park": [
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80"
    ],
    "Bali": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Kyoto": [
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Hanoi": [
        "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Porto": [
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Reykjavik": [
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Dubrovnik": [
        "https://images.unsplash.com/photo-1562214526-2e3348c1313a?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Prague": [
        "https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Cartagena": [
        "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Banff": [
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Cusco": [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Tulum": [
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Marrakech": [
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Cape Town": [
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Zanzibar": [
        "https://images.unsplash.com/photo-1584949091598-c34daaaa4aa9?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Queenstown": [
        "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Great Barrier Reef": [
        "https://images.unsplash.com/photo-1549965822-199c7360b284?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Fiji Islands": [
        "https://images.unsplash.com/photo-1562553281-dd39392039e4?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Santorini": [
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",
        "https://images.unsplash.com/photo-1587135996004-6d9e3e9f5c1e?w=1200&q=80"
    ],
    "Machu Picchu": [
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Safari in Serengeti": [
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1587135996004-6d9e3e9f5c1e?w=1200&q=80"
    ],
    "Tokyo": [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "New York City": [
        "https://images.unsplash.com/photo-1496585391839-5330b6039b11?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Sydney": [
        "https://images.unsplash.com/photo-1506973035762-964019c3c9f2?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Petra": [
        "https://images.unsplash.com/photo-1589636945480-6c7a2c1f0b7e?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ],
    "Banff National Park": [
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
        "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
    ]
}

def update_destination_images():
    """Update destinations with multiple high-quality images"""
    # Create Flask app
    app = create_app()
    
    # Update destinations within app context
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        print(f"Found {len(destinations)} destinations to update")
        
        updated_count = 0
        
        for destination in destinations:
            try:
                # Get destination-specific images
                destination_name = destination.name
                images = DESTINATION_IMAGES.get(destination_name, [])
                
                # If we don't have specific images for this destination, use a fallback
                if not images:
                    # Try to find a similar destination
                    for key in DESTINATION_IMAGES.keys():
                        if destination_name in key or key in destination_name:
                            images = DESTINATION_IMAGES[key]
                            break
                
                # If still no images, use a generic fallback
                if not images:
                    images = [
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90",
                        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",
                        "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80"
                    ]
                
                # Update the destination with multiple images
                destination.images = images
                
                # Commit the changes
                db.session.add(destination)
                updated_count += 1
                print(f"Updated images for: {destination.name}")
                
            except Exception as e:
                print(f"Error updating images for {destination.name}: {str(e)}")
                continue
        
        # Commit all changes
        try:
            db.session.commit()
            print(f"Successfully updated images for {updated_count} destinations")
        except Exception as e:
            db.session.rollback()
            print(f"Error committing changes: {str(e)}")

if __name__ == "__main__":
    update_destination_images()