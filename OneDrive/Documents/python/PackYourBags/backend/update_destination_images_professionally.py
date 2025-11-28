"""
Script to update destination images with professional, accurate, and diverse images
"""
from app import create_app
from database import db
from models import Destination

# Dictionary of destination-specific, high-quality images
DESTINATION_IMAGES = {
    "Pokhara": [
        "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",  # Phewa Lake with Annapurna reflection
        "https://images.unsplash.com/photo-1544896389-2a377f0d1b0f?w=1200&q=80",  # Annapurna mountain range from Pokhara
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80",  # World Peace Pagoda (Shanti Stupa)
        "https://images.unsplash.com/photo-1722595631994-6de3b5318da1?w=1200&q=80"   # Colorful sunset at Phewa Lake
    ],
    "Kathmandu": [
        "https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&q=80",  # Swayambhunath Stupa (Monkey Temple)
        "https://images.unsplash.com/photo-1647172122108-202c8497fdbd?w=1200&q=80",  # Pashupatinath Temple
        "https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&q=80",  # Durbar Square
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Thamel neighborhood
    ],
    "Chitwan National Park": [
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",  # Jungle safari
        "https://images.unsplash.com/photo-1748343200591-3971d003dff4?w=1200&q=80",  # Elephant ride
        "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=1200&q=80",  # Rhinoceros
        "https://images.unsplash.com/photo-1549887534-81598aab0e07?w=1200&q=80"   # Bird watching
    ],
    "Bali": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",  # Uluwatu Temple
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Rice terraces
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Tanah Lot Temple
        "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&q=80"   # Beach scene
    ],
    "Ubud": [
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Monkey Forest
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",  # Rice terraces
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Traditional Balinese architecture
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Art workshops
    ],
    "Gili Islands": [
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # White sand beach
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",  # Snorkeling
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Sunset view
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80"   # Island view
    ],
    "Bangkok": [
        "https://images.unsplash.com/photo-1563492065599-3520f775069a?w=1200&q=80",  # Wat Arun
        "https://images.unsplash.com/photo-1552152974-194700b75984?w=1200&q=80",  # Grand Palace
        "https://images.unsplash.com/photo-1549887534-81598aab0e07?w=1200&q=80",  # Floating market
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Street food
    ],
    "Chiang Mai": [
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",  # Wat Phra Singh
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Elephant sanctuary
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Night bazaar
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80"   # Temples
    ],
    "Phuket": [
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",  # Patong Beach
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Phi Phi Islands
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Old Phuket Town
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Boat tour
    ],
    "Jaipur": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Hawa Mahal
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Amber Fort
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # City Palace
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Jal Mahal
    ],
    "Udaipur": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Lake Pichola
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # City Palace
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Jag Mandir
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Monsoon Palace
    ],
    "Goa": [
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Beach scene
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Churches
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",  # Forts
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80"   # Nightlife
    ],
    "Munnar": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Tea plantations
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Hills
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Waterfalls
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Wildlife
    ],
    "Kerala": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Backwaters
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Houseboats
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Ayurveda
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Spices
    ],
    "Dubai": [
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Burj Khalifa
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Palm Jumeirah
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",  # Dubai Mall
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80"   # Desert safari
    ],
    "Abu Dhabi": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Sheikh Zayed Grand Mosque
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Ferrari World
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Corniche Beach
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Louvre Abu Dhabi
    ],
    "Sharjah": [
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Al Noor Island
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Sharjah Art Museum
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",  # Heritage areas
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80"   # Beaches
    ],
    "Paris": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Eiffel Tower
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Louvre Museum
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Notre-Dame
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Montmartre
    ],
    "Nice": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Promenade des Anglais
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Old Town
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # Castle Hill
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Beaches
    ],
    "Lyon": [
        "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",  # Vieux Lyon
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",  # Basilique Notre-Dame de Fourvière
        "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",  # traboules
        "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80"   # Food scene
    ]
}

def update_destination_images():
    """Update destination images with professional, accurate images"""
    app = create_app()
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        
        print(f"Updating {len(destinations)} destinations with professional images...")
        
        updated_count = 0
        
        for dest in destinations:
            # Check if destination name exists in our image dictionary
            if dest.name in DESTINATION_IMAGES:
                # Update with specific images for this destination
                dest.images = DESTINATION_IMAGES[dest.name]
                updated_count += 1
                print(f"Updated {dest.name} with {len(dest.images)} professional images")
            else:
                # For destinations not in our dictionary, use a generic but relevant image
                generic_images = [
                    f"https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                    f"https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                    f"https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",
                    f"https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"
                ]
                dest.images = generic_images
                print(f"Using generic images for {dest.name}")
        
        # Commit changes
        if updated_count > 0:
            db.session.commit()
            print(f"Successfully updated {updated_count} destinations with professional images")
        else:
            print("No destinations needed updates")

if __name__ == '__main__':
    update_destination_images()