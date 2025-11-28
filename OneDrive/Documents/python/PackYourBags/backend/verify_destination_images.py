"""
Script to verify all destination images have been updated correctly
"""
from app import create_app
from database import db
from models import Destination

def verify_destination_images():
    """Verify all destination images have been updated correctly"""
    app = create_app()
    
    with app.app_context():
        # Check images for all destinations
        destinations = Destination.query.all()
        
        print("Verification of destination images:")
        print("=" * 50)
        
        for dest in destinations:
            print(f"{dest.name}:")
            if dest.images:
                print(f"  Number of images: {len(dest.images)}")
                print(f"  First image: {dest.images[0][:50]}...")
                if len(dest.images) > 1:
                    print(f"  Second image: {dest.images[1][:50]}...")
            else:
                print("  No images found")
            print()

if __name__ == '__main__':
    verify_destination_images()