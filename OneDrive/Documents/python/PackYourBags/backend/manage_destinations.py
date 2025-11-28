"""
Comprehensive Destination Management Script
This script allows you to:
1. Update images for existing destinations
2. Add new destinations from around the world
3. Generate AI blogs for new destinations
4. Verify and validate destination data
"""

import json
import os
import sys
from typing import Dict, List
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination, Blog, db
from services.blog_generator import BlogGenerator

# Comprehensive list of top destinations worldwide with high-quality images
WORLDWIDE_DESTINATIONS = {
    # Africa
    "Africa": [
        {
            "id": "dest_africa_001",
            "name": "Safari in Serengeti",
            "country": "Tanzania",
            "continent": "Africa",
            "highlights": ["Great Migration", "Big Five Safari", "Hot Air Balloon Ride", "Maasai Culture", "Ngorongoro Crater"],
            "quick_fact": "The Serengeti is home to over 70 large mammal species and 500 bird species, making it one of the most biodiverse places on Earth.",
            "best_season": "June to October for the Great Migration",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=80",
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80"
            ],
            "coordinates": {"lat": -2.153333, "lng": 34.685833}
        },
        {
            "id": "dest_africa_002",
            "name": "Marrakech",
            "country": "Morocco",
            "continent": "Africa",
            "highlights": ["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace", "Atlas Mountains", "Traditional Souks"],
            "quick_fact": "Marrakech is known as the 'Red City' due to the red sandstone used in its buildings, and it's one of the imperial cities of Morocco.",
            "best_season": "March to May and September to November",
            "budget_tier": "mid-range",
            "images": [
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"
            ],
            "coordinates": {"lat": 31.629495, "lng": -7.981084}
        },
        {
            "id": "dest_africa_003",
            "name": "Victoria Falls",
            "country": "Zambia/Zimbabwe",
            "continent": "Africa",
            "highlights": ["Devil's Pool", "Helicopter Tours", "White Water Rafting", "Rainbow Views", "Livingstone Island"],
            "quick_fact": "Victoria Falls is the world's largest sheet of falling water, twice the height of Niagara Falls and twice the width of the Horseshoe Falls.",
            "best_season": "February to May for peak flow",
            "budget_tier": "mid-range",
            "images": [
                "https://images.unsplash.com/photo-1590003431020-08abf9895a9f?w=1200&q=80",
                "https://images.unsplash.com/photo-1590003939009-d0b0a5d8e6a6?w=1200&q=80",
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80"
            ],
            "coordinates": {"lat": -17.924345, "lng": 25.857210}
        }
    ],
    
    # Asia
    "Asia": [
        {
            "id": "dest_asia_001",
            "name": "Kyoto",
            "country": "Japan",
            "continent": "Asia",
            "highlights": ["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Kinkaku-ji (Golden Pavilion)", "Traditional Tea Ceremony", "Gion District"],
            "quick_fact": "Kyoto was Japan's capital for over 1,000 years and is home to over 2,000 religious places, including 1,600 Buddhist temples and 400 Shinto shrines.",
            "best_season": "March to May (cherry blossoms) and October to November (autumn colors)",
            "budget_tier": "mid-range",
            "images": [
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
                "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80",
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80"
            ],
            "coordinates": {"lat": 35.011636, "lng": 135.768029}
        },
        {
            "id": "dest_asia_002",
            "name": "Bali",
            "country": "Indonesia",
            "continent": "Asia",
            "highlights": ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Sacred Monkey Forest", "Traditional Dance Performances"],
            "quick_fact": "Bali is known as the 'Island of the Gods' and has over 20,000 Hindu temples, with the most important being the Mother Temple Besakih.",
            "best_season": "April to October (dry season)",
            "budget_tier": "mid-range",
            "images": [
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
                "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"
            ],
            "coordinates": {"lat": -8.340539, "lng": 115.091951}
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
            "best_season": "April to June and September to October for pleasant weather and fewer crowds",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"
            ],
            "coordinates": {"lat": 36.3932, "lng": 25.4615}
        },
        {
            "id": "dest_europe_002",
            "name": "Paris",
            "country": "France",
            "continent": "Europe",
            "highlights": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Seine River Cruise"],
            "quick_fact": "Paris has more than 400 parks and gardens, covering about 3,000 hectares, which is roughly 10% of the city's total area.",
            "best_season": "April to June and September to October for mild weather",
            "budget_tier": "mid-range",
            "images": [
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
                "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"
            ],
            "coordinates": {"lat": 48.8566, "lng": 2.3522}
        }
    ],
    
    # North America
    "North America": [
        {
            "id": "dest_north_america_001",
            "name": "New York City",
            "country": "USA",
            "continent": "North America",
            "highlights": ["Times Square", "Central Park", "Statue of Liberty", "Brooklyn Bridge", "Broadway Shows"],
            "quick_fact": "New York City has over 800 miles of shoreline and is home to more than 800 languages, making it the most linguistically diverse city in the world.",
            "best_season": "April to June and September to November for comfortable weather",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
                "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"
            ],
            "coordinates": {"lat": 40.7128, "lng": -74.0060}
        },
        {
            "id": "dest_north_america_002",
            "name": "Banff National Park",
            "country": "Canada",
            "continent": "North America",
            "highlights": ["Lake Louise", "Moraine Lake", "Banff Gondola", "Johnston Canyon", "Icefields Parkway"],
            "quick_fact": "Banff National Park is Canada's oldest national park, established in 1885, and is part of the Canadian Rocky Mountain Parks UNESCO World Heritage Site.",
            "best_season": "June to August for summer activities and December to March for winter sports",
            "budget_tier": "mid-range",
            "images": [
                "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"
            ],
            "coordinates": {"lat": 51.4968, "lng": -115.9281}
        }
    ],
    
    # South America
    "South America": [
        {
            "id": "dest_south_america_001",
            "name": "Machu Picchu",
            "country": "Peru",
            "continent": "South America",
            "highlights": ["Inca Trail Trek", "Sun Gate Views", "Temple of the Sun", "Intihuatana Stone", "Aguas Calientes Town"],
            "quick_fact": "Machu Picchu sits at an elevation of 2,430 meters (7,970 feet) above sea level and was designated a UNESCO World Heritage Site in 1983.",
            "best_season": "May to September (dry season)",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
                "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"
            ],
            "coordinates": {"lat": -13.1631, "lng": -72.5450}
        },
        {
            "id": "dest_south_america_002",
            "name": "Patagonia",
            "country": "Argentina/Chile",
            "continent": "South America",
            "highlights": ["Perito Moreno Glacier", "Torres del Paine", "Fitz Roy Mountain", "Penguin Colonies", "Horseback Riding"],
            "quick_fact": "Patagonia covers over 1 million square kilometers and is home to some of the world's most pristine wilderness areas, including the world's southernmost national park.",
            "best_season": "October to April (spring/summer in the Southern Hemisphere)",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"
            ],
            "coordinates": {"lat": -50.9423, "lng": -73.4067}
        }
    ],
    
    # Oceania
    "Oceania": [
        {
            "id": "dest_oceania_001",
            "name": "Great Barrier Reef",
            "country": "Australia",
            "continent": "Oceania",
            "highlights": ["Snorkeling", "Scuba Diving", "Whitsunday Islands", "Coral Reefs", "Marine Life"],
            "quick_fact": "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometers.",
            "best_season": "June to October for best visibility and weather",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"
            ],
            "coordinates": {"lat": -18.1416, "lng": 147.7638}
        },
        {
            "id": "dest_oceania_002",
            "name": "Fiji Islands",
            "country": "Fiji",
            "continent": "Oceania",
            "highlights": ["Mamanuca Islands", "Yasawa Islands", "Beachfront Bungalows", "Traditional Culture", "Water Sports"],
            "quick_fact": "Fiji consists of more than 300 islands, but only about 106 are permanently inhabited, with Viti Levu and Vanua Levu being the two largest.",
            "best_season": "May to October (dry season)",
            "budget_tier": "luxury",
            "images": [
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
                "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
                "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",
                "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"
            ],
            "coordinates": {"lat": -17.7134, "lng": 178.0650}
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
            # Check if destination name exists in our image dictionary
            found = False
            for continent_destinations in WORLDWIDE_DESTINATIONS.values():
                for continent_dest in continent_destinations:
                    if dest.name == continent_dest["name"]:
                        # Update with specific images for this destination
                        dest.images = continent_dest["images"]
                        updated_count += 1
                        print(f"✓ Updated {dest.name} with {len(dest.images)} images")
                        found = True
                        break
                if found:
                    break
            
            # If not found, use a generic but relevant image
            if not found:
                generic_images = [
                    "https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80",
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
                    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
                ]
                dest.images = generic_images
                updated_count += 1
                print(f"✓ Updated {dest.name} with generic images")
        
        # Commit changes
        db.session.commit()
        print(f"\nSuccessfully updated images for {updated_count} destinations!")

def add_new_destinations():
    """Add new destinations to the database"""
    app = create_app()
    
    with app.app_context():
        added_count = 0
        skipped_count = 0
        
        # Iterate through all continents and destinations
        for continent, destinations in WORLDWIDE_DESTINATIONS.items():
            print(f"\nAdding destinations for {continent}:")
            for dest_data in destinations:
                # Check if destination already exists
                existing = Destination.query.filter_by(destination_id=dest_data['id']).first()
                if existing:
                    print(f"  - {dest_data['name']} already exists, skipping...")
                    skipped_count += 1
                    continue
                
                # Create destination object
                destination = Destination(
                    destination_id=dest_data['id'],
                    name=dest_data['name'],
                    country=dest_data['country'],
                    continent=dest_data['continent'],
                    highlights=dest_data.get('highlights', []),
                    quick_fact=dest_data.get('quick_fact', ''),
                    best_season=dest_data.get('best_season', ''),
                    budget_tier=dest_data.get('budget_tier', 'mid-range'),
                    images=dest_data.get('images', []),
                    latitude=dest_data.get('coordinates', {}).get('lat'),
                    longitude=dest_data.get('coordinates', {}).get('lng')
                )
                
                db.session.add(destination)
                db.session.flush()  # Get the ID without committing
                added_count += 1
                print(f"  ✓ Added {destination.name}")
        
        # Commit all changes
        db.session.commit()
        print(f"\nAdded {added_count} new destinations, skipped {skipped_count} existing ones")

def generate_blogs_for_new_destinations():
    """Generate AI blogs for new destinations"""
    app = create_app()
    
    with app.app_context():
        # Initialize blog generator
        blog_generator = BlogGenerator()
        
        # Get all destinations without blogs
        destinations = Destination.query.all()
        generated_count = 0
        skipped_count = 0
        
        categories = ['Adventure', 'Luxury', 'Family', 'Solo', 'Budget']
        
        print("Generating blogs for destinations...")
        
        for dest in destinations:
            # Check if blog already exists for this destination
            existing_blog = Blog.query.filter(
                Blog.destination_id == dest.destination_id
            ).first()
            
            if existing_blog:
                print(f"  - Skipping {dest.name} - blog already exists")
                skipped_count += 1
                continue
            
            # Generate blog for destination
            print(f"  Generating blog for {dest.name}...")
            
            try:
                # Get destination data
                dest_data = dest.to_dict()
                
                # Select random category
                import random
                category = random.choice(categories)
                
                # Generate blog using AI
                result = blog_generator.generate_blog_post(
                    destination_name=dest.name,
                    category=category,
                    destination_data=dest_data
                )
                
                if result['success']:
                    blog_data = result['blog']
                    
                    # Create blog entry
                    blog = Blog(
                        title=blog_data['title'],
                        content=blog_data['content'],
                        excerpt=blog_data['excerpt'],
                        category=blog_data['category'],
                        tags=blog_data['tags'],
                        meta_title=blog_data['meta_title'],
                        meta_description=blog_data['meta_description'],
                        meta_keywords=blog_data['meta_keywords'],
                        status='published',
                        ai_generated=True,
                        ai_prompt=blog_data.get('ai_prompt'),
                        destination_id=dest.destination_id,
                        published_at=datetime.utcnow()
                    )
                    
                    db.session.add(blog)
                    db.session.commit()
                    
                    print(f"    ✓ Created blog: {blog.title}")
                    generated_count += 1
                else:
                    print(f"    ✗ Failed to generate blog for {dest.name}: {result.get('error')}")
            
            except Exception as e:
                print(f"    ✗ Error processing {dest.name}: {str(e)}")
                db.session.rollback()
        
        print(f"\nBlog generation complete!")
        print(f"  Generated: {generated_count} blogs")
        print(f"  Skipped: {skipped_count} destinations (already had blogs)")

def verify_destinations():
    """Verify all destinations have proper data"""
    app = create_app()
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        
        print(f"Verifying {len(destinations)} destinations...")
        
        issues = []
        for dest in destinations:
            # Check for missing data
            if not dest.images or len(dest.images) == 0:
                issues.append(f"{dest.name}: Missing images")
            
            if not dest.highlights or len(dest.highlights) == 0:
                issues.append(f"{dest.name}: Missing highlights")
            
            if not dest.quick_fact:
                issues.append(f"{dest.name}: Missing quick fact")
            
            if not dest.country:
                issues.append(f"{dest.name}: Missing country")
            
            if not dest.continent:
                issues.append(f"{dest.name}: Missing continent")
        
        if issues:
            print("\nIssues found:")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print("\n✓ All destinations verified successfully!")

def main():
    """Main function to run all destination management tasks"""
    print("=" * 60)
    print("PackYourBags Destination Management System")
    print("=" * 60)
    print("This script will:")
    print("1. Add new destinations from around the world")
    print("2. Update destination images with high-quality photos")
    print("3. Generate AI blogs for destinations")
    print("4. Verify all destination data")
    print("=" * 60)
    
    # Add new destinations
    print("\n1. Adding new destinations...")
    add_new_destinations()
    
    # Update destination images
    print("\n2. Updating destination images...")
    update_destination_images()
    
    # Generate blogs for new destinations
    print("\n3. Generating blogs for destinations...")
    generate_blogs_for_new_destinations()
    
    # Verify all destinations
    print("\n4. Verifying destination data...")
    verify_destinations()
    
    print("\n" + "=" * 60)
    print("Destination management complete!")
    print("Your travel SaaS now includes destinations from all continents.")
    print("=" * 60)

if __name__ == '__main__':
    main()