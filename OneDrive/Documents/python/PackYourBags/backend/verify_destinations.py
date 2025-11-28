"""
Script to verify and enhance destination data for accuracy
"""

import json
import os
import sys
import re
from typing import Dict, List

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def load_destinations(file_path: str) -> List[Dict]:
    """Load destinations from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_destinations(destinations: List[Dict], file_path: str):
    """Save destinations to JSON file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(destinations, f, indent=2, ensure_ascii=False)

def validate_coordinates(coordinates: Dict) -> bool:
    """Validate coordinate format and ranges"""
    if not isinstance(coordinates, dict):
        return False
    
    lat = coordinates.get('lat')
    lng = coordinates.get('lng')
    
    if lat is None or lng is None:
        return False
    
    try:
        lat = float(lat)
        lng = float(lng)
    except (ValueError, TypeError):
        return False
    
    # Check valid ranges
    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        return False
    
    return True

def validate_budget_tier(budget_tier: str) -> bool:
    """Validate budget tier values"""
    valid_tiers = ['budget-friendly', 'mid-range', 'luxury']
    return budget_tier in valid_tiers

def validate_season(season: str) -> bool:
    """Basic validation for season format"""
    if not isinstance(season, str):
        return False
    
    # Check if it contains months or season words
    season_keywords = ['january', 'february', 'march', 'april', 'may', 'june', 
                      'july', 'august', 'september', 'october', 'november', 'december',
                      'spring', 'summer', 'autumn', 'fall', 'winter', 'year-round',
                      'dry season', 'wet season']
    
    season_lower = season.lower()
    return any(keyword in season_lower for keyword in season_keywords)

def verify_destination(destination: Dict) -> Dict:
    """Verify and enhance a single destination"""
    # Verify required fields
    required_fields = ['name', 'country', 'continent', 'highlights', 'quick_fact', 
                      'best_season', 'budget_tier', 'coordinates']
    
    for field in required_fields:
        if field not in destination:
            print(f"Warning: Missing field '{field}' in {destination.get('name', 'Unknown')}")
            destination[field] = "" if field != 'highlights' and field != 'coordinates' else ([] if field == 'highlights' else {})
    
    # Verify coordinates
    if not validate_coordinates(destination['coordinates']):
        print(f"Warning: Invalid coordinates for {destination['name']}")
        # Try to fix common issues
        coords = destination['coordinates']
        if isinstance(coords, dict):
            # Try to convert string values to floats
            try:
                if 'lat' in coords:
                    coords['lat'] = float(coords['lat'])
                if 'lng' in coords:
                    coords['lng'] = float(coords['lng'])
                destination['coordinates'] = coords
            except (ValueError, TypeError):
                destination['coordinates'] = {"lat": 0, "lng": 0}
        else:
            destination['coordinates'] = {"lat": 0, "lng": 0}
    
    # Verify budget tier
    if not validate_budget_tier(destination['budget_tier']):
        print(f"Warning: Invalid budget tier '{destination['budget_tier']}' for {destination['name']}")
        destination['budget_tier'] = 'mid-range'  # Default to mid-range
    
    # Verify season
    if not validate_season(destination['best_season']):
        print(f"Warning: Potentially invalid season format for {destination['name']}")
        # Keep as is but log the warning
    
    # Verify highlights
    if not isinstance(destination['highlights'], list):
        print(f"Warning: Highlights should be a list for {destination['name']}")
        destination['highlights'] = []
    
    # Verify quick fact
    if not isinstance(destination['quick_fact'], str):
        print(f"Warning: Quick fact should be a string for {destination['name']}")
        destination['quick_fact'] = ""
    
    # Add local_tips if not present
    if 'local_tips' not in destination:
        destination['local_tips'] = []
    
    # Verify local_tips
    if not isinstance(destination['local_tips'], list):
        print(f"Warning: Local tips should be a list for {destination['name']}")
        destination['local_tips'] = []
    
    # Add description if not present
    if 'description' not in destination:
        destination['description'] = ""
    
    # Verify description
    if not isinstance(destination['description'], str):
        print(f"Warning: Description should be a string for {destination['name']}")
        destination['description'] = ""
    
    # Ensure we have a slug
    if 'slug' not in destination:
        # Create slug from name and country
        name_slug = re.sub(r'[^a-zA-Z0-9]+', '-', destination['name'].lower()).strip('-')
        country_slug = re.sub(r'[^a-zA-Z0-9]+', '-', destination['country'].lower()).strip('-')
        destination['slug'] = f"{name_slug}-{country_slug}"
    
    # Ensure we have an id
    if 'id' not in destination:
        # Create ID from name and country
        name_part = re.sub(r'[^a-zA-Z0-9]+', '', destination['name'].lower())[:10]
        country_part = re.sub(r'[^a-zA-Z0-9]+', '', destination['country'].lower())[:10]
        destination['id'] = f"dest_{name_part}_{country_part}"
    
    # Ensure we have an image_url
    if 'image_url' not in destination:
        destination['image_url'] = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    
    return destination

def verify_all_destinations(destinations_file: str, output_file: str = None):
    """Verify all destinations in the file"""
    if output_file is None:
        output_file = destinations_file
    
    # Load destinations
    destinations = load_destinations(destinations_file)
    print(f"Loaded {len(destinations)} destinations")
    
    # Verify each destination
    verified_destinations = []
    for i, destination in enumerate(destinations):
        print(f"Verifying destination {i+1}/{len(destinations)}: {destination['name']}")
        verified_destination = verify_destination(destination)
        verified_destinations.append(verified_destination)
    
    # Save verified destinations
    save_destinations(verified_destinations, output_file)
    print(f"Verified destinations saved to {output_file}")

if __name__ == "__main__":
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define file paths
    destinations_file = os.path.join(script_dir, 'data', 'destinations.json')
    output_file = os.path.join(script_dir, 'data', 'destinations_verified.json')
    
    # Verify destinations
    verify_all_destinations(destinations_file, output_file)