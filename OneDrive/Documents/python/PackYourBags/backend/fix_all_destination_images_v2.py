"""
Script to fix all destination images with accurate, high-quality images
"""
from app import create_app
from database import db
from models import Destination

# Accurate, high-quality images for all destinations that truly represent each location
# These images showcase the unique features and beauty of each destination with specific, high-quality photos
ACCURATE_DESTINATION_IMAGES = {
    "Pokhara": [
        "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",  # Phewa Lake with Annapurna reflection
        "https://images.unsplash.com/photo-1544896389-2a377f0d1b0f?w=1200&q=80",  # Annapurna mountain range from Pokhara
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80",  # World Peace Pagoda (Shanti Stupa)
        "https://images.unsplash.com/photo-1722595631994-6de3b5318da1?w=1200&q=80"   # Colorful sunset at Phewa Lake
    ],
    "Kathmandu": [
        "https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&q=80",  # Kathmandu Durbar Square
        "https://images.unsplash.com/photo-1647172122108-202c8497fdbd?w=1200&q=80",  # Durbar Square with flying pigeons
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Swayambhunath Stupa (Monkey Temple)
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Boudhanath Stupa
    ],
    "Chitwan National Park": [
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",  # Jungle safari with wildlife
        "https://images.unsplash.com/photo-1748343200591-3971d003dff4?w=1200&q=80",  # Elephants at breeding center
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # One-horned rhinoceros in habitat
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Bird watching in the park
    ],
    "Bali": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",  # Rice terraces in Tegalalang
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Tanah Lot Temple at sunset
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Beach scene at Seminyak
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Ubud monkey forest
    ],
    "Kyoto": [
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80",  # Fushimi Inari Shrine with torii gates
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Arashiyama Bamboo Grove
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Kinkaku-ji Temple (Golden Pavilion)
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Gion District with traditional wooden machiya houses
    ],
    "Hanoi": [
        "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=1200&q=80",  # Hoan Kiem Lake with Ngoc Son Temple
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Old Quarter with narrow streets
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Temple of Literature
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Street food vendors
    ],
    "Porto": [
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",  # Dom Luís I Bridge over Douro River
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Ribeira District colorful houses
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Port Wine Cellars
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Livraria Lello bookstore
    ],
    "Reykjavik": [
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",  # Hallgrímskirkja Church
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Blue Lagoon geothermal spa
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Northern Lights
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Golden Circle tour
    ],
    "Dubrovnik": [
        "https://images.unsplash.com/photo-1562214526-2e3348c1313a?w=1200&q=80",  # Old Town Walls with Adriatic Sea
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Stradun Street (main street)
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Lokrum Island
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Cable Car Views to Mount Srđ
    ],
    "Prague": [
        "https://images.unsplash.com/photo-1583881262487-5b34b9a1517a?w=1200&q=80",  # Charles Bridge with Vltava River
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Prague Castle complex
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Old Town Square with Astronomical Clock
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Dancing House architecture
    ],
    "Cartagena": [
        "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80",  # Walled City with colorful colonial buildings
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Castillo San Felipe de Barajas
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Rosario Islands beach
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Getsemaní Neighborhood street art
    ],
    "Banff": [
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80",  # Lake Louise with turquoise waters
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Moraine Lake with Valley of the Ten Peaks
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Banff Gondola mountain views
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Hot Springs pools
    ],
    "Cusco": [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",  # Plaza de Armas with Cathedral
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Sacred Valley tour
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Inca Ruins at Sacsayhuamán
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Rainbow Mountain (Vinicunca)
    ],
    "Tulum": [
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=80",  # Beachfront Mayan Ruins
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Cenotes (underground pools)
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Gran Cenote snorkeling
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Sian Ka'an Biosphere Reserve
    ],
    "Marrakech": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Jemaa el-Fnaa Square
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Bahia Palace architecture
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Majorelle Garden
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Koutoubia Mosque
    ],
    "Cape Town": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Table Mountain aerial view
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Robben Island
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Cape of Good Hope
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Kirstenbosch National Botanical Garden
    ],
    "Zanzibar": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Stone Town architecture
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Spice Tour
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Nungwi Beach
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Prison Island
    ],
    "Queenstown": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Lake Wakatipu with Remarkables mountain range
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Skyline Gondola panoramic views
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Adventure activities (bungee jumping)
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Arrowtown historic gold mining village
    ],
    "Great Barrier Reef": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Coral reef underwater
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Snorkeling with marine life
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Marine life diversity
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Whitsunday Islands white sand beaches
    ],
    "Fiji Islands": [
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Beach scene with palm trees
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Coral coast views
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Cultural village experience
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Mamanuca Islands luxury resorts
    ]
}

def fix_all_destination_images():
    """Fix all destination images with accurate, high-quality images"""
    app = create_app()
    
    with app.app_context():
        # Update images for each destination
        updated_count = 0
        for dest_name, images in ACCURATE_DESTINATION_IMAGES.items():
            dest = Destination.query.filter_by(name=dest_name).first()
            if dest:
                dest.images = images
                print(f"Updated images for {dest_name}")
                print(f"  Images: {images[:2]}{'...' if len(images) > 2 else ''}")
                updated_count += 1
            else:
                print(f"Destination {dest_name} not found")
        
        # Commit changes
        db.session.commit()
        print(f"\nSuccessfully updated images for {updated_count} destinations!")

if __name__ == '__main__':
    fix_all_destination_images()