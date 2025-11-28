"""
Script to test if destination images are properly stored in the database
"""
from app import create_app
from database import db
from models import Destination

def test_destination_images():
    """Test destination images"""
    app = create_app()
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        
        print("Testing destination images...")
        print("=" * 50)
        
        for dest in destinations:
            print(f"Destination: {dest.name}")
            print(f"  Country: {dest.country}")
            print(f"  Images count: {len(dest.images) if dest.images else 0}")
            if dest.images:
                for i, img in enumerate(dest.images):
                    print(f"    Image {i+1}: {img}")
            else:
                print("    No images found!")
            print()

if __name__ == '__main__':
    test_destination_images()