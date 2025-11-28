"""
Script to update destination images with high-quality Unsplash photos
This uses Unsplash's public API to fetch relevant images
"""

import json
import os

# Real destination image URLs from Unsplash (curated high-quality travel photos)
DESTINATION_IMAGES = {
    "Pokhara": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",  # Nepal mountains
    "Kathmandu": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",  # Kathmandu temples
    "Chitwan National Park": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",  # Wildlife
    "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",  # Bali rice terraces
    "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",  # Kyoto temple
    "Hanoi": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",  # Hanoi street
    "Porto": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",  # Porto Portugal
    "Reykjavik": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",  # Iceland
    "Dubrovnik": "https://images.unsplash.com/photo-1555990538-c6d8fbb036a7?w=800&q=80",  # Dubrovnik
    "Prague": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80",  # Prague
    "Cartagena": "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&q=80",  # Cartagena
    "Banff": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80",  # Banff Lake Louise
    "Cusco": "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",  # Cusco Peru
    "Tulum": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",  # Tulum ruins
    "Marrakech": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",  # Marrakech
    "Cape Town": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",  # Cape Town
    "Santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",  # Santorini
    "Barcelona": "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&q=80",  # Barcelona
    "Amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",  # Amsterdam
    "Istanbul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",  # Istanbul
    "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",  # Tokyo
    "Seoul": "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80",  # Seoul
    "Bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",  # Bangkok
    "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",  # Singapore
    "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",  # Dubai
    "Maldives": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",  # Maldives
    "Queenstown": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",  # Queenstown
    "Sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",  # Sydney
    "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",  # NYC
    "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",  # Paris
    "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",  # London
    "Rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",  # Rome
    "Venice": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",  # Venice
    "Edinburgh": "https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?w=800&q=80",  # Edinburgh
}

def update_destination_images():
    """Update destination images in the JSON file"""
    
    json_path = os.path.join(os.path.dirname(__file__), 'data', 'destinations.json')
    
    if not os.path.exists(json_path):
        print(f"❌ destinations.json not found at {json_path}")
        return
    
    # Read current data
    with open(json_path, 'r', encoding='utf-8') as f:
        destinations = json.load(f)
    
    print(f"🔄 Updating images for {len(destinations)} destinations...")
    updated_count = 0
    
    # Update images
    for dest in destinations:
        dest_name = dest.get('name', '')
        
        if dest_name in DESTINATION_IMAGES:
            old_url = dest.get('image_url', '')
            new_url = DESTINATION_IMAGES[dest_name]
            dest['image_url'] = new_url
            print(f"✅ Updated {dest_name}: {new_url}")
            updated_count += 1
        else:
            # Use a generic high-quality travel photo if specific one not found
            generic_url = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
            dest['image_url'] = generic_url
            print(f"⚠️  Using generic image for {dest_name}")
            updated_count += 1
    
    # Save updated data
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(destinations, f, indent=2, ensure_ascii=False)
    
    print(f"\n✨ Successfully updated {updated_count} destination images!")
    print(f"📁 Saved to: {json_path}")

if __name__ == '__main__':
    update_destination_images()
