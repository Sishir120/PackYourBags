from database import db
from models import Destination
import random

def update_images():
    """Update all destination images with high-quality Unsplash photos"""
    
    # Accurate Creative Commons destination images from Unsplash
    destination_images = {
        'Paris': [
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=95',  # Eiffel Tower
            'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&q=95'   # Arc de Triomphe
        ],
        'Tokyo': [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=95',  # Tokyo Tower
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=95'   # Shibuya Crossing
        ],
        'Bali': [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=95',  # Bali Rice Terraces
            'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&q=95'   # Bali Temple
        ],
        'New York': [
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=95',  # NYC Skyline
            'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=1200&q=95'   # Brooklyn Bridge
        ],
        'Santorini': [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=95',  # Santorini Blue Domes
            'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=95'   # Oia Village
        ],
        'Maldives': [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=95',  # Maldives Overwater Bungalows
            'https://images.unsplash.com/photo-1589197331516-2e1673c17aef?w=1200&q=95'   # Maldives Beach
        ],
        'Dubai': [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=95',  # Burj Khalifa
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=95'   # Dubai Marina
        ],
        'Rome': [
            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=95',  # Colosseum
            'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&q=95'   # Trevi Fountain
        ],
        'Barcelona': [
            'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=95',  # Sagrada Familia
            'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=1200&q=95'   # Park Guell
        ],
        'Iceland': [
            'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=95',  # Northern Lights
            'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=1200&q=95'   # Kirkjufell Mountain
        ],
        'London': [
            'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=95',  # Big Ben
            'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1200&q=95'   # Tower Bridge
        ],
        'Sydney': [
            'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=95',  # Sydney Opera House
            'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=1200&q=95'   # Harbour Bridge
        ],
        'Thailand': [
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=95',  # Thai Temple
            'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=95'   # Phi Phi Islands
        ],
        'Switzerland': [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=95',  # Matterhorn
            'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1200&q=95'   # Swiss Alps
        ],
        'Amsterdam': [
            'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=95',  # Amsterdam Canals
            'https://images.unsplash.com/photo-1584003564911-9b034deb5a94?w=1200&q=95'   # Windmills
        ],
        'Venice': [
            'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=95',  # Venice Canals
            'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&q=95'   # Grand Canal
        ],
        'Prague': [
            'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200&q=95',  # Prague Castle
            'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=95'   # Charles Bridge
        ],
        'Norway': [
            'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1200&q=95',  # Lofoten Islands
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=95'   # Norwegian Fjords
        ],
        'Morocco': [
            'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=95',  # Marrakech
            'https://images.unsplash.com/photo-1511978415931-e5e68f60de71?w=1200&q=95'   # Chefchaouen
        ],
        'Peru': [
            'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=95',  # Machu Picchu
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=95'   # Rainbow Mountain
        ]
    }
    
    destinations = Destination.query.all()
    
    for dest in destinations:
        name_key = dest.name
        if name_key in destination_images:
            dest.images = destination_images[name_key]
        else:
            # Fallback to generic travel images
            dest.images = ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90', 'https://images.unsplash.com/photo-1476514525273-4b6c4c1e7af9?w=1200&q=90']
    
    db.session.commit()
    print(f'✓ Updated {len(destinations)} destinations with high-quality images')

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    
    with app.app_context():
        update_images()
