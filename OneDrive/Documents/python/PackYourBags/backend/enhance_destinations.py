"""
Script to enhance destination data with AI for improved accuracy and completeness
"""

import json
import os
import sys
from typing import Dict, List
import time

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_service import AIService

def load_destinations(file_path: str) -> List[Dict]:
    """Load destinations from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_destinations(destinations: List[Dict], file_path: str):
    """Save destinations to JSON file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(destinations, f, indent=2, ensure_ascii=False)

def enhance_destination_with_ai(destination: Dict, ai_service: AIService) -> Dict:
    """Enhance a single destination with AI"""
    try:
        # Create a prompt to verify and enhance destination data
        prompt = f"""
        Please verify and enhance the following travel destination information for accuracy. 
        Provide corrected and expanded information where needed.
        
        Destination: {destination['name']}
        Country: {destination['country']}
        Continent: {destination['continent']}
        Current Highlights: {', '.join(destination['highlights'])}
        Current Quick Fact: {destination['quick_fact']}
        Current Best Season: {destination['best_season']}
        Current Budget Tier: {destination['budget_tier']}
        Current Coordinates: {destination['coordinates']}
        
        Please provide:
        1. Verified and corrected information for all fields
        2. Enhanced highlights list (5-7 items)
        3. More detailed and accurate quick fact
        4. More precise best season information
        5. More accurate budget tier classification
        6. Verified coordinates
        7. Additional local tips (3-5 items)
        8. Verified and expanded description
        
        Format your response as JSON with the following structure:
        {{
            "name": "{destination['name']}",
            "country": "verified country name",
            "continent": "verified continent",
            "highlights": ["enhanced highlight 1", "enhanced highlight 2", ...],
            "quick_fact": "enhanced quick fact",
            "best_season": "enhanced best season",
            "budget_tier": "budget-friendly|mid-range|luxury",
            "coordinates": {{"lat": verified_lat, "lng": verified_lng}},
            "local_tips": ["tip 1", "tip 2", ...],
            "description": "enhanced detailed description"
        }}
        """
        
        # Generate enhanced data using AI
        enhanced_json_str = ai_service.generate_text(prompt, max_tokens=2000)
        
        # Parse the JSON response
        try:
            # Clean up the response to ensure it's valid JSON
            start = enhanced_json_str.find('{')
            end = enhanced_json_str.rfind('}') + 1
            if start != -1 and end > start:
                json_str = enhanced_json_str[start:end]
                enhanced_data = json.loads(json_str)
                
                # Update the destination with enhanced data
                destination.update(enhanced_data)
                print(f"Successfully enhanced {destination['name']}")
            else:
                print(f"Failed to parse JSON for {destination['name']}")
        except json.JSONDecodeError as e:
            print(f"JSON parsing error for {destination['name']}: {str(e)}")
            print(f"Response was: {enhanced_json_str[:200]}...")
            
    except Exception as e:
        print(f"Error enhancing {destination['name']}: {str(e)}")
    
    return destination

def enhance_all_destinations(destinations_file: str, output_file: str = None):
    """Enhance all destinations in the file"""
    if output_file is None:
        output_file = destinations_file
    
    # Load destinations
    destinations = load_destinations(destinations_file)
    print(f"Loaded {len(destinations)} destinations")
    
    # Initialize AI service
    ai_service = AIService()
    
    # Check if AI service is configured
    if not ai_service.api_key or ai_service.api_key == 'your_api_key_here':
        print("AI service not configured. Please set AI_API_KEY in .env file.")
        return
    
    print(f"Using AI provider: {ai_service.provider}")
    print(f"Using AI model: {ai_service.model}")
    
    # Enhance each destination
    enhanced_destinations = []
    for i, destination in enumerate(destinations):
        print(f"Enhancing destination {i+1}/{len(destinations)}: {destination['name']}")
        
        # Enhance with AI
        enhanced_destination = enhance_destination_with_ai(destination, ai_service)
        enhanced_destinations.append(enhanced_destination)
        
        # Add delay to respect API rate limits
        time.sleep(1)
    
    # Save enhanced destinations
    save_destinations(enhanced_destinations, output_file)
    print(f"Enhanced destinations saved to {output_file}")

if __name__ == "__main__":
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define file paths
    destinations_file = os.path.join(script_dir, 'data', 'destinations.json')
    output_file = os.path.join(script_dir, 'data', 'destinations_enhanced.json')
    
    # Enhance destinations
    enhance_all_destinations(destinations_file, output_file)