"""
Script to check all destination images
"""
from app import create_app
from database import db
from models import Destination

def check_all_destination_images():
    """Check images for all destinations"""
    app = create_app()
    
    with app.app_context():
        # Check images for all destinations
        destinations = Destination.query.all()
        
        print("Current destination images:")
        print("=" * 50)
        
        for dest in destinations:
            print(f"{dest.name}:")
            if dest.images:
                for i, img in enumerate(dest.images[:3]):  # Show first 3 images
                    print(f"  Image {i+1}: {img}")
                if len(dest.images) > 3:
                    print(f"  ... and {len(dest.images) - 3} more")
            else:
                print("  No images found")
            print()

if __name__ == '__main__':
    check_all_destination_images()