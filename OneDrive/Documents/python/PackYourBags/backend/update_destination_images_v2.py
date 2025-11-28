"""
Script to update destination images with better, more specific high-quality images
"""
from app import create_app
from database import db
from models import Destination

# Better, more specific high-quality images for destinations that truly represent each location
# These images showcase the unique features and beauty of each destination
DESTINATION_IMAGES = {
    "Pokhara": [
        "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",  # Phewa Lake with Annapurna reflection
        "https://images.unsplash.com/photo-1544896389-2a377f0d1b0f?w=1200&q=80",  # Annapurna mountain range from Pokhara
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80",  # World Peace Pagoda (Shanti Stupa)
        "https://images.unsplash.com/photo-1722595631994-6de3b5318da1?w=1200&q=80"   # Colorful sunset at Phewa Lake
    ],
    "Kathmandu": [
        "https://images.unsplash.com/photo-1596150683813-3984b33a9d63?w=1200&q=80",  # Kathmandu Durbar Square
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Swayambhunath Stupa (Monkey Temple)
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # Boudhanath Stupa
        "https://images.unsplash.com/photo-1647172122108-202c8497fdbd?w=1200&q=80"   # Durbar Square with flying pigeons
    ],
    "Chitwan National Park": [
        "https://images.unsplash.com/photo-1583899206887-b580f1b81543?w=1200&q=80",  # Jungle safari with wildlife
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80",  # One-horned rhinoceros in habitat
        "https://images.unsplash.com/photo-1748343200591-3971d003dff4?w=1200&q=80",  # Elephants at breeding center
        "https://images.unsplash.com/photo-1587240138703-03d5b0c3b3a4?w=1200&q=80"   # Bird watching in the park
    ]
}

def update_destination_images():
    """Update destination images with better, more specific high-quality images"""
    app = create_app()
    
    with app.app_context():
        # Update images for each destination
        for dest_name, images in DESTINATION_IMAGES.items():
            dest = Destination.query.filter_by(name=dest_name).first()
            if dest:
                dest.images = images
                print(f"Updated images for {dest_name}")
                print(f"  Images: {images}")
                print()
            else:
                print(f"Destination {dest_name} not found")
                print()
        
        # Commit changes
        db.session.commit()
        print("All destination images updated successfully!")

if __name__ == '__main__':
    update_destination_images()