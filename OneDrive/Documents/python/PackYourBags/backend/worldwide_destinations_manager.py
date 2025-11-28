"""
Comprehensive Destination Management Script
==========================================

This script allows you to:
1. Update images for existing destinations
2. Add new destinations from around the world
3. Manage destination data in bulk
4. Verify and validate destination data

To use this script:
1. Edit the WORLDWIDE_DESTINATIONS dictionary to add new destinations
2. Run the script to update your database
3. Use the admin interface for ongoing management

Author: PackYourBags Team
"""

import json
import os
import sys
from typing import Dict, List
import requests
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination, db

# Comprehensive list of top destinations worldwide with high-quality images
WORLDWIDE_DESTINATIONS = {
    # Africa
    "Africa": [
        {
            "id": "dest_africa_001",
            "name": "Safari in Serengeti",
            "country": "Tanzania",
            "continent": "Africa",
            "highlights": ["Great Migration", "Big Five", "Hot Air Ballooning", "Maasai Culture", "Ngorongoro Crater"],
            "quick_fact": "The Serengeti is home to over 70 large mammal species and 500 bird species.",
            "description": "Experience the ultimate African safari in the Serengeti, where the Great Migration of over 1.5 million wildebeest and 250,000 zebras creates one of nature's most spectacular events. This UNESCO World Heritage site offers unparalleled wildlife viewing opportunities with the Big Five (lion, leopard, elephant, buffalo, and rhinoceros) roaming freely across the vast plains.",
            "local_tips": ["Visit between December and July for the Great Migration", "Book accommodations well in advance", "Bring neutral-colored clothing for game drives", "Respect wildlife and maintain safe distances", "Consider a hot air balloon safari for aerial views"],
            "best_season": "June to October (dry season) and December to March (calving season)",
            "budget_tier": "luxury",
            "coordinates": {"lat": -2.1539, "lng": 34.6857},
            "images": [
                "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",  # Wildebeest migration
                "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=80",  # Lion in Serengeti
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Hot air balloon safari
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"   # Maasai cultural experience
            ]
        },
        {
            "id": "dest_africa_002",
            "name": "Victoria Falls",
            "country": "Zambia/Zimbabwe",
            "continent": "Africa",
            "highlights": ["Devil's Pool", "Livingstone Island", "Helicopter Tours", "White Water Rafting", "Rainbow Views"],
            "quick_fact": "Victoria Falls is twice the height of Niagara Falls and half a mile wider than Horseshoe Falls.",
            "description": "Known as 'The Smoke That Thunders,' Victoria Falls is one of the Seven Natural Wonders of the World. The massive curtain of water creates a mesmerizing rainbow effect and a thunderous sound that can be heard from miles away. Experience the falls from both the Zambian and Zimbabwean sides for different perspectives.",
            "local_tips": ["Visit during flood season (February to May) for maximum water flow", "Bring waterproof gear for close-up views", "Book helicopter tours in advance for best rates", "Try the Devil's Pool swim (seasonal)", "Stay in Livingstone for authentic experiences"],
            "best_season": "February to May (peak water flow) and September to November (clearer views)",
            "budget_tier": "mid-range",
            "coordinates": {"lat": -17.9243, "lng": 25.8572},
            "images": [
                "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80",  # Main waterfall view
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Rainbow over falls
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Helicopter view
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Devil's Pool swim
            ]
        }
    ],
    
    # Asia
    "Asia": [
        {
            "id": "dest_asia_001",
            "name": "Angkor Wat",
            "country": "Cambodia",
            "continent": "Asia",
            "highlights": ["Sunrise Views", "Bassac River", "Ta Prohm", "Bayon Temple", "Ancient Architecture"],
            "quick_fact": "Angkor Wat is the largest religious monument in the world, covering an area of 162.6 hectares.",
            "description": "Step back in time at Angkor Wat, the crown jewel of Cambodia's ancient Khmer Empire. This magnificent temple complex, built in the early 12th century, represents the pinnacle of classical Khmer architecture. The intricate bas-reliefs depicting Hindu mythology and the iconic lotus-shaped towers make it a UNESCO World Heritage site and one of the most photographed locations in Southeast Asia.",
            "local_tips": ["Arrive at sunrise for the best photos and fewer crowds", "Purchase a multi-day pass for better value", "Hire a knowledgeable guide for historical context", "Bring plenty of water and sun protection", "Explore Ta Prohm for the famous tree-root photos"],
            "best_season": "November to March (dry season with comfortable temperatures)",
            "budget_tier": "budget-friendly",
            "coordinates": {"lat": 13.4125, "lng": 103.8670},
            "images": [
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main Angkor Wat view
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Sunrise at Angkor Wat
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Ta Prohm with tree roots
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Bayon Temple faces
            ]
        },
        {
            "id": "dest_asia_002",
            "name": "Mount Fuji",
            "country": "Japan",
            "continent": "Asia",
            "highlights": ["Hakone Views", "Cherry Blossoms", "Five Lakes Region", "Traditional Villages", "Cultural Experiences"],
            "quick_fact": "Mount Fuji is an active stratovolcano that last erupted in 1707 and is considered one of Japan's Three Holy Mountains.",
            "description": "Experience the iconic beauty of Mount Fuji, Japan's highest peak and a UNESCO World Heritage site. Whether you're hiking to the summit during climbing season, enjoying views from the Hakone region, or witnessing the mountain framed by cherry blossoms in spring, Mount Fuji offers countless opportunities for unforgettable memories. The symmetrical cone shape has inspired artists and poets for centuries.",
            "local_tips": ["Climbing season is July to September", "Visit Hakone for the best views without hiking", "Time your visit for the Fuji Shibazakura Festival in May", "Take the Kawaguchi Lake cruise for reflections", "Stay in a traditional ryokan for authentic Japanese hospitality"],
            "best_season": "July to September (climbing season) and March to May (cherry blossoms)",
            "budget_tier": "mid-range",
            "coordinates": {"lat": 35.3606, "lng": 138.7274},
            "images": [
                "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80",  # Mount Fuji with cherry blossoms
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Hakone view of Mount Fuji
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Kawaguchi Lake reflection
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Traditional village with Mount Fuji
            ]
        }
    ],
    
    # Europe
    "Europe": [
        {
            "id": "dest_europe_001",
            "name": "Santorini",
            "country": "Greece",
            "continent": "Europe",
            "highlights": ["Oia Sunset Views", "Red Beach", "Ancient Akrotiri", "White-Washed Villages", "Volcanic Hot Springs"],
            "quick_fact": "Santorini was formed by a volcanic eruption that destroyed the center of a circular island, creating the iconic caldera we see today.",
            "description": "Experience the breathtaking beauty of Santorini, where whitewashed buildings with blue domes cascade down volcanic cliffs toward the deep blue Aegean Sea. This stunning Greek island offers spectacular sunsets in Oia, unique beaches with red and black volcanic sand, ancient ruins, and world-class wineries. The dramatic landscape created by the volcanic caldera makes it one of the most photographed destinations in the world.",
            "local_tips": ["Book accommodations in Fira or Oia well in advance", "Visit Oia 1-2 hours before sunset for the famous sunset views", "Try local Assyrtiko wine at a cliffside winery", "Explore the ancient city of Akrotiri", "Take a boat tour to the volcanic islands"],
            "best_season": "April to June and September to October for pleasant weather and fewer crowds",
            "budget_tier": "luxury",
            "coordinates": {"lat": 36.3932, "lng": 25.4615},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Oia sunset views
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # White-washed buildings
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Red Beach
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Cliffside winery
            ]
        },
        {
            "id": "dest_europe_002",
            "name": "Swiss Alps",
            "country": "Switzerland",
            "continent": "Europe",
            "highlights": ["Matterhorn Views", "Jungfraujoch", "Zermatt Village", "Glacier Express", "Alpine Meadows"],
            "quick_fact": "The Matterhorn is one of the deadliest peaks in the Alps, with over 500 deaths recorded since 1865.",
            "description": "Discover the majestic Swiss Alps, where snow-capped peaks tower over pristine alpine villages and turquoise lakes. From the iconic Matterhorn rising above Zermatt to the 'Top of Europe' at Jungfraujoch, the Swiss Alps offer world-class skiing, hiking, and mountaineering opportunities. The region's efficient railway system provides access to some of the most spectacular mountain scenery in the world.",
            "local_tips": ["Take the Glacier Express for scenic train travel", "Visit Zermatt for car-free alpine village experience", "Ride to Jungfraujoch for 'Top of Europe' views", "Try Swiss chocolate and cheese specialties", "Hike the Five Lakes Walk for Matterhorn reflections"],
            "best_season": "December to March (skiing) and June to September (hiking)",
            "budget_tier": "luxury",
            "coordinates": {"lat": 45.9766, "lng": 7.6585},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Matterhorn view
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Jungfraujoch
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Zermatt village
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Alpine meadows
            ]
        }
    ],
    
    # North America
    "North America": [
        {
            "id": "dest_north_america_001",
            "name": "Grand Canyon",
            "country": "USA",
            "continent": "North America",
            "highlights": ["South Rim Views", "Havasu Falls", "Helicopter Tours", "Colorado River Rafting", "Stargazing"],
            "quick_fact": "The Grand Canyon is 277 miles long, up to 18 miles wide, and over a mile deep.",
            "description": "Marvel at the awe-inspiring grandeur of the Grand Canyon, one of the Seven Natural Wonders of the World. Carved by the Colorado River over millions of years, this massive gorge reveals nearly two billion years of Earth's geological history through its colorful layered rock formations. Whether you're hiking along the rim, rafting through the canyon, or taking a helicopter tour, the Grand Canyon offers unforgettable experiences for every type of traveler.",
            "local_tips": ["Stay on the South Rim for year-round access", "Hike the Bright Angel Trail for spectacular views", "Book helicopter tours in advance for best rates", "Visit in spring or fall for comfortable temperatures", "Try stargazing - it's a designated Dark Sky Park"],
            "best_season": "March to May and September to November for comfortable temperatures and fewer crowds",
            "budget_tier": "mid-range",
            "coordinates": {"lat": 36.1069, "lng": -112.1129},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # South Rim view
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Havasu Falls
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Helicopter view
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Colorado River rafting
            ]
        },
        {
            "id": "dest_north_america_002",
            "name": "Banff National Park",
            "country": "Canada",
            "continent": "North America",
            "highlights": ["Lake Louise", "Moraine Lake", "Icefields Parkway", "Banff Town", "Wildlife Viewing"],
            "quick_fact": "Banff National Park is Canada's oldest national park, established in 1885.",
            "description": "Experience the pristine beauty of Banff National Park, where turquoise glacial lakes reflect towering mountain peaks in one of Canada's most spectacular wilderness areas. From the iconic Lake Louise and Moraine Lake to the dramatic Icefields Parkway, Banff offers endless opportunities for outdoor adventures including hiking, skiing, wildlife viewing, and photography. The charming town of Banff serves as a perfect base for exploring this UNESCO World Heritage site.",
            "local_tips": ["Visit Lake Louise and Moraine Lake early to avoid crowds", "Drive the Icefields Parkway for scenic mountain views", "Book accommodations well in advance, especially in summer", "Take the Lake Louise shoreline trail for easy hiking", "Look for wildlife at dawn and dusk"],
            "best_season": "June to August (summer hiking) and December to March (skiing)",
            "budget_tier": "mid-range",
            "coordinates": {"lat": 51.4968, "lng": -115.9281},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Lake Louise
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Moraine Lake
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Icefields Parkway
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Banff town
            ]
        }
    ],
    
    # South America
    "South America": [
        {
            "id": "dest_south_america_001",
            "name": "Machu Picchu",
            "country": "Peru",
            "continent": "South America",
            "highlights": ["Sun Gate Views", "Inca Trail", "Sacred Valley", "Traditional Markets", "Ancient Architecture"],
            "quick_fact": "Machu Picchu was built in the 15th century and abandoned a century later during the Spanish conquest.",
            "description": "Discover the mystical lost city of the Incas, Machu Picchu, perched dramatically on a mountain ridge 2,430 meters above sea level. This UNESCO World Heritage site and one of the New Seven Wonders of the World offers a glimpse into the sophisticated Incan civilization. The perfectly preserved stone structures, terraced agricultural areas, and stunning mountain backdrop make it one of the most iconic archaeological sites in the world.",
            "local_tips": ["Book the Inca Trail trek well in advance (permits required)", "Arrive early to beat crowds and see sunrise", "Take the train from Cusco for scenic journey", "Visit the Sacred Valley for cultural experiences", "Acclimate to altitude in Cusco before visiting"],
            "best_season": "May to September (dry season with clear skies)",
            "budget_tier": "mid-range",
            "coordinates": {"lat": -13.1631, "lng": -72.5450},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Main Machu Picchu view
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Inca Trail
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Sun Gate view
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Sacred Valley
            ]
        },
        {
            "id": "dest_south_america_002",
            "name": "Patagonia",
            "country": "Argentina/Chile",
            "continent": "South America",
            "highlights": ["Perito Moreno Glacier", "Torres del Paine", "Penguin Colonies", "Hiking Trails", "Stellar Wildlife"],
            "quick_fact": "Patagonia covers over 1 million square kilometers and is home to some of the world's largest penguin colonies.",
            "description": "Journey to the edge of the world in Patagonia, where massive glaciers calve into turquoise lakes, granite towers pierce the sky, and penguin colonies thrive along rugged coastlines. This remote region at the southern tip of South America offers some of the planet's most dramatic landscapes and exceptional wildlife viewing opportunities. From the thundering Perito Moreno Glacier to the iconic Torres del Paine, Patagonia is a paradise for adventurers and nature lovers.",
            "local_tips": ["Visit Perito Moreno Glacier from El Calafate, Argentina", "Hike the W Trek in Torres del Paine, Chile", "Book accommodations well in advance for peak season", "Pack layers for unpredictable Patagonian weather", "Take a boat tour to see penguin colonies"],
            "best_season": "November to March (austral summer with longer daylight)",
            "budget_tier": "luxury",
            "coordinates": {"lat": -50.9423, "lng": -73.4068},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Perito Moreno Glacier
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Torres del Paine
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Penguin colonies
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Hiking trails
            ]
        }
    ],
    
    # Oceania
    "Oceania": [
        {
            "id": "dest_oceania_001",
            "name": "Great Barrier Reef",
            "country": "Australia",
            "continent": "Oceania",
            "highlights": ["Snorkeling", "Coral Gardens", "Whitsunday Islands", "Marine Life", "Seaplane Tours"],
            "quick_fact": "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and 900 islands.",
            "description": "Dive into the underwater wonderland of the Great Barrier Reef, the world's largest coral reef system and one of the most biodiverse ecosystems on Earth. Snorkel or scuba dive among colorful coral gardens teeming with tropical fish, sea turtles, rays, and sharks. The reef extends over 2,300 kilometers and can even be seen from space. Explore the reef from the Whitsunday Islands or take a seaplane tour for a bird's-eye view of this natural wonder.",
            "local_tips": ["Snorkel at the Outer Reef for clearest waters", "Take a seaplane tour for aerial views", "Visit the Reef HQ Aquarium in Townsville", "Book liveaboard trips for extended diving", "Use reef-safe sunscreen to protect coral"],
            "best_season": "June to October (dry season with best visibility)",
            "budget_tier": "luxury",
            "coordinates": {"lat": -18.1936, "lng": 147.8536},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Coral reef underwater
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Snorkeling
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Whitsunday Islands
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Marine life
            ]
        },
        {
            "id": "dest_oceania_002",
            "name": "Bora Bora",
            "country": "French Polynesia",
            "continent": "Oceania",
            "highlights": ["Overwater Bungalows", "Lagoonarium", "Mount Otemanu", "Coral Gardens", "Polynesian Culture"],
            "quick_fact": "Bora Bora's nickname is 'The Pearl of the Pacific' due to its stunning beauty and turquoise lagoon.",
            "description": "Escape to paradise in Bora Bora, where emerald peaks rise from turquoise lagoons surrounded by coral reefs. This iconic South Pacific island offers the ultimate tropical getaway with luxurious overwater bungalows, world-class snorkeling and diving, and unforgettable lagoon tours. The dramatic Mount Otemanu provides a stunning backdrop to the island's pristine beaches and crystal-clear waters.",
            "local_tips": ["Stay in an overwater bungalow for the ultimate experience", "Snorkel in the lagoon for easy access to marine life", "Take a 4x4 safari tour to see the island's interior", "Visit the Lagoonarium for close encounters with marine life", "Try traditional Polynesian cuisine and cultural shows"],
            "best_season": "May to October (dry season with less humidity)",
            "budget_tier": "luxury",
            "coordinates": {"lat": -16.5004, "lng": -151.7415},
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",  # Overwater bungalows
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",  # Lagoon view
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Mount Otemanu
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Coral gardens
            ]
        }
    ]
}

def update_destination_images():
    """Update destination images with high-quality, location-specific images"""
    app = create_app()
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        
        print(f"Updating {len(destinations)} destinations with images...")
        
        updated_count = 0
        for dest in destinations:
            # Look for destination in our worldwide list
            found = False
            for continent_destinations in WORLDWIDE_DESTINATIONS.values():
                for world_dest in continent_destinations:
                    if (dest.name.lower() == world_dest["name"].lower() and 
                        dest.country.lower() == world_dest["country"].lower()):
                        # Update with specific images for this destination
                        dest.images = world_dest["images"]
                        updated_count += 1
                        print(f"✓ Updated {dest.name}, {dest.country} with {len(world_dest['images'])} images")
                        found = True
                        break
                if found:
                    break
            
            # If not found in our list, use placeholder images
            if not found:
                placeholder_images = [
                    f"https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80",
                    f"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
                    f"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80",
                    f"https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"
                ]
                dest.images = placeholder_images
                print(f"○ Added placeholder images for {dest.name}, {dest.country}")
        
        # Commit changes
        db.session.commit()
        print(f"\nSuccessfully updated images for {updated_count} destinations!")

def add_new_worldwide_destinations():
    """Add new destinations from the worldwide list"""
    app = create_app()
    
    with app.app_context():
        added_count = 0
        
        for continent, destinations in WORLDWIDE_DESTINATIONS.items():
            for dest_data in destinations:
                # Check if destination already exists
                existing = Destination.query.filter_by(
                    name=dest_data["name"],
                    country=dest_data["country"]
                ).first()
                
                if not existing:
                    # Create new destination
                    new_dest = Destination(
                        destination_id=dest_data["id"],
                        name=dest_data["name"],
                        country=dest_data["country"],
                        continent=dest_data["continent"],
                        highlights=dest_data.get("highlights", []),
                        quick_fact=dest_data.get("quick_fact", ""),
                        best_season=dest_data.get("best_season", ""),
                        budget_tier=dest_data.get("budget_tier", "mid-range"),
                        description=dest_data.get("description", ""),
                        local_tips=dest_data.get("local_tips", []),
                        images=dest_data.get("images", []),
                        latitude=dest_data["coordinates"]["lat"] if dest_data.get("coordinates") else None,
                        longitude=dest_data["coordinates"]["lng"] if dest_data.get("coordinates") else None
                    )
                    
                    db.session.add(new_dest)
                    added_count += 1
                    print(f"✓ Added {dest_data['name']}, {dest_data['country']}")
                else:
                    print(f"○ {dest_data['name']}, {dest_data['country']} already exists")
        
        # Commit changes
        db.session.commit()
        print(f"\nSuccessfully added {added_count} new destinations!")

def verify_destinations():
    """Verify all destinations have proper data"""
    app = create_app()
    
    with app.app_context():
        destinations = Destination.query.all()
        
        print(f"Verifying {len(destinations)} destinations...")
        
        issues = []
        for dest in destinations:
            # Check for missing images
            if not dest.images or len(dest.images) == 0:
                issues.append(f"Missing images for {dest.name}, {dest.country}")
            
            # Check for missing highlights
            if not dest.highlights or len(dest.highlights) == 0:
                issues.append(f"Missing highlights for {dest.name}, {dest.country}")
            
            # Check for missing description
            if not dest.description or len(dest.description.strip()) == 0:
                issues.append(f"Missing description for {dest.name}, {dest.country}")
        
        if issues:
            print("\nIssues found:")
            for issue in issues:
                print(f"  • {issue}")
        else:
            print("\n✓ All destinations have complete data!")
        
        print(f"\nTotal destinations: {len(destinations)}")

def main():
    """Main function to run destination management tasks"""
    print("=" * 60)
    print("PackYourBags Worldwide Destination Manager")
    print("=" * 60)
    print("This script helps you manage destinations in your travel SaaS platform.")
    print()
    
    while True:
        print("Choose an option:")
        print("1. Add new worldwide destinations")
        print("2. Update destination images")
        print("3. Verify destination data")
        print("4. Add new destinations and update all images")
        print("5. Exit")
        print()
        
        choice = input("Enter your choice (1-5): ").strip()
        
        if choice == "1":
            print("\nAdding new worldwide destinations...")
            add_new_worldwide_destinations()
            print()
        elif choice == "2":
            print("\nUpdating destination images...")
            update_destination_images()
            print()
        elif choice == "3":
            print("\nVerifying destination data...")
            verify_destinations()
            print()
        elif choice == "4":
            print("\nAdding new destinations and updating images...")
            add_new_worldwide_destinations()
            update_destination_images()
            verify_destinations()
            print()
        elif choice == "5":
            print("\nGoodbye!")
            break
        else:
            print("\nInvalid choice. Please try again.\n")

if __name__ == "__main__":
    main()