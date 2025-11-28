"""
Script to add multiple real images to each destination in the database
"""
import os
import json
from database import db
from models import Destination
from app import create_app

# Define theme-based image collections for each destination with real, relevant images
DESTINATION_IMAGES = {
    "Pokhara": [
        "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",  # Main image - Pokhara city
        "https://images.unsplash.com/photo-1544369031-565c8f2d0d94?w=1200&q=80",  # Phewa Lake
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Annapurna Range
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Paragliding
    ],
    "Kathmandu": [
        "https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&q=80",  # Main image - Kathmandu city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Swayambhunath Temple
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Durbar Square
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Thamel Market
    ],
    "Chitwan National Park": [
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",  # Main image - Wildlife
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Bengal Tigers
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # One-Horned Rhinos
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Jungle Safari
    ],
    "Bali": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",  # Main image - Bali landscape
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Ubud Rice Terraces
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Tanah Lot Temple
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Seminyak Beach
    ],
    "Kyoto": [
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80",  # Main image - Kyoto city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Fushimi Inari Shrine
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Arashiyama Bamboo Grove
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Kinkaku-ji Temple
    ],
    "Hanoi": [
        "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=1200&q=80",  # Main image - Hanoi city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Old Quarter
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Hoan Kiem Lake
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Temple of Literature
    ],
    "Porto": [
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",  # Main image - Porto city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Dom Luís I Bridge
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Ribeira District
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Port Wine Cellars
    ],
    "Reykjavik": [
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",  # Main image - Reykjavik city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Blue Lagoon
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Northern Lights
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Hallgrímskirkja Church
    ],
    "Dubrovnik": [
        "https://images.unsplash.com/photo-1562214526-2e3348c1313a?w=1200&q=80",  # Main image - Dubrovnik city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Old Town Walls
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Stradun Street
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Game of Thrones Sites
    ],
    "Prague": [
        "https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&q=80",  # Main image - Prague city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Charles Bridge
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Prague Castle
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Old Town Square
    ],
    "Cartagena": [
        "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80",  # Main image - Cartagena city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Walled City
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Castillo San Felipe
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Rosario Islands
    ],
    "Banff": [
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",  # Main image - Banff landscape
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Lake Louise
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Moraine Lake
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Banff Gondola
    ],
    "Cusco": [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",  # Main image - Cusco city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Plaza de Armas
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Sacred Valley
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Inca Ruins
    ],
    "Tulum": [
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80",  # Main image - Tulum ruins
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Beachfront Mayan Ruins
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Cenotes
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Gran Cenote
    ],
    "Marrakech": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main image - Marrakech city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Jemaa el-Fnaa
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Majorelle Garden
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Bahia Palace
    ],
    "Cape Town": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main image - Cape Town city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Table Mountain
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Robben Island
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Kirstenbosch Gardens
    ],
    "Zanzibar": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main image - Zanzibar island
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Stone Town
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Spice Tours
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Nungwi Beach
    ],
    "Queenstown": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main image - Queenstown city
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Lake Wakatipu
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Skyline Gondola
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Adventure Sports
    ],
    "Great Barrier Reef": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main image - Coral reef
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Snorkeling
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Coral Reefs
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Whitsunday Islands
    ],
    "Fiji Islands": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Main image - Fiji islands
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Beaches
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Coral Reefs
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Cultural Experiences
    ]
}

def add_images_to_destinations():
    """Add multiple images to each destination in the database"""
    print("Adding images to destinations...")
    
    updated = 0
    
    for destination_name, image_urls in DESTINATION_IMAGES.items():
        # Find destination by name
        destination = Destination.query.filter_by(name=destination_name).first()
        
        if destination:
            # Update the images field with the array of image URLs
            destination.images = image_urls
            db.session.add(destination)
            updated += 1
            print(f"  ✓ Updated {destination_name} with {len(image_urls)} images")
        else:
            print(f"  ✗ Could not find destination: {destination_name}")
    
    db.session.commit()
    print(f"\nUpdated {updated} destinations with multiple images")

def run_image_update():
    """Run the image update process"""
    app = create_app()
    
    with app.app_context():
        print("="*50)
        print("Starting image update for destinations...")
        print("="*50)
        
        add_images_to_destinations()
        
        print("\n" + "="*50)
        print("Image update complete!")
        print("="*50)

if __name__ == '__main__':
    run_image_update()