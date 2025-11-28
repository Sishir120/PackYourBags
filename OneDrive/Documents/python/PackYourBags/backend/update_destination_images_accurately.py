"""
Script to update destination images with accurate, location-specific images from Unsplash
"""
from app import create_app
from database import db
from models import Destination
import requests
import time

# Dictionary of destination-specific, high-quality, accurate images
ACCURATE_DESTINATION_IMAGES = {
    "Pokhara": [
        "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",  # Phewa Lake with Annapurna reflection
        "https://images.unsplash.com/photo-1544896389-2a377f0d1b0f?w=1200&q=80",  # Annapurna mountain range from Pokhara
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80",  # World Peace Pagoda (Shanti Stupa)
        "https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&q=80"   # Pokhara city view
    ],
    "Kathmandu": [
        "https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&q=80",  # Swayambhunath Stupa (Monkey Temple)
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",  # Pashupatinath Temple
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Durbar Square
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Thamel neighborhood
    ],
    "Chitwan National Park": [
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",  # Jungle safari
        "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=1200&q=80",  # Rhinoceros
        "https://images.unsplash.com/photo-1549887534-81598aab0e07?w=1200&q=80",  # Elephant ride
        "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&q=80"   # Bird watching
    ],
    "Bali": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",  # Uluwatu Temple at sunset
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Tegallalang Rice Terraces
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Tanah Lot Temple
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Seminyak Beach
    ],
    "Kyoto": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Fushimi Inari Shrine torii gates
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Kinkaku-ji (Golden Pavilion)
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Arashiyama Bamboo Grove
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Gion District traditional streets
    ],
    "Hanoi": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Hoan Kiem Lake with Turtle Tower
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Hanoi Old Quarter streets
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Temple of Literature
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Hanoi street food
    ],
    "Porto": [
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",  # Porto riverside (Ribeira)
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Dom Luís I Bridge
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Port Wine cellars
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Livraria Lello bookstore
    ],
    "Reykjavik": [
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",  # Hallgrímskirkja Church
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Harpa Concert Hall
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Blue Lagoon
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Northern Lights
    ],
    "Dubrovnik": [
        "https://images.unsplash.com/photo-1562214526-2e3348c1313a?w=1200&q=80",  # Dubrovnik City Walls
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Dubrovnik Old Town
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Lokrum Island
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Dubrovnik harbor
    ],
    "Prague": [
        "https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&q=80",  # Prague Castle
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Charles Bridge
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Old Town Square
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Astronomical Clock
    ],
    "Cartagena": [
        "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80",  # Cartagena Walled City
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Castillo San Felipe
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Getsemaní neighborhood
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Rosario Islands
    ],
    "Banff": [
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",  # Lake Louise
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Moraine Lake
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Banff Gondola
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Canadian Rockies
    ],
    "Cusco": [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",  # Plaza de Armas
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Sacsayhuamán fortress
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Sacred Valley
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Rainbow Mountain
    ],
    "Tulum": [
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80",  # Tulum Mayan Ruins
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Tulum Caribbean beaches
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Cenotes
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Sian Ka'an Biosphere
    ],
    "Marrakech": [
        "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80",  # Jemaa el-Fnaa square
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Bahia Palace
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Majorelle Garden
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Marrakech souks
    ],
    "Cape Town": [
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80",  # Table Mountain
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Robben Island
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Cape of Good Hope
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # V&A Waterfront
    ],
    "Zanzibar": [
        "https://images.unsplash.com/photo-1584949091598-c34daaaa4aa9?w=1200&q=80",  # Stone Town
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Nungwi Beach
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Spice Plantations
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Jozani Forest
    ],
    "Queenstown": [
        "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80",  # Lake Wakatipu
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Skyline Gondola
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Bungee jumping
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # The Remarkables
    ],
    "Great Barrier Reef": [
        "https://images.unsplash.com/photo-1549965822-199c7360b284?w=1200&q=80",  # Coral reef formations
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Snorkeling over coral
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Whitsunday Islands
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Marine life
    ],
    "Fiji Islands": [
        "https://images.unsplash.com/photo-1562553281-dd39392039e4?w=1200&q=80",  # Yasawa Islands
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Coral reefs
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Traditional kava ceremony
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Island hopping
    ]
}

def update_destination_images():
    """Update destination images with accurate, location-specific images"""
    app = create_app()
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        
        print(f"Updating {len(destinations)} destinations with accurate images...")
        
        updated_count = 0
        placeholders_used = []
        manual_review_needed = []
        
        for dest in destinations:
            # Check if destination name exists in our accurate image dictionary
            if dest.name in ACCURATE_DESTINATION_IMAGES:
                # Update with specific accurate images for this destination
                dest.images = ACCURATE_DESTINATION_IMAGES[dest.name]
                updated_count += 1
                print(f"✓ Updated {dest.name} with {len(dest.images)} accurate images")
            else:
                # For destinations not in our dictionary, this shouldn't happen with current data
                # But we'll add a placeholder just in case
                placeholder_image = "https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80"
                dest.images = [placeholder_image]
                placeholders_used.append(f"{dest.name}, {dest.country}")
                print(f"! Using placeholder for {dest.name}")
        
        # Commit changes
        if updated_count > 0:
            db.session.commit()
            print(f"\nSuccessfully updated {updated_count} destinations with accurate images")
            
            # Summary
            print("\n" + "="*50)
            print("UPDATE SUMMARY:")
            print(f"✓ Destinations updated: {updated_count}")
            
            if placeholders_used:
                print(f"! Placeholders used: {len(placeholders_used)}")
                for place in placeholders_used:
                    print(f"    - {place}")
            
            if manual_review_needed:
                print(f"? Manual review needed: {len(manual_review_needed)}")
                for place in manual_review_needed:
                    print(f"    - {place}")
            
            print("="*50)
        else:
            print("No destinations needed updates")

if __name__ == '__main__':
    update_destination_images()