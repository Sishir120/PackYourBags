import json
from app import create_app
from database import db
from models import Destination

def check_destination_images():
    """Check destination images for issues"""
    app = create_app()
    
    with app.app_context():
        # Get ALL destinations
        destinations = Destination.query.all()
        
        print("Destination Image Check:")
        print("=" * 50)
        
        # Track statistics
        total_destinations = len(destinations)
        destinations_with_images = 0
        destinations_with_multiple_images = 0
        destinations_needing_review = []
        
        for i, dest in enumerate(destinations, 1):
            print(f"{i}. {dest.name} ({dest.country}):")
            images_count = len(dest.images) if dest.images else 0
            print(f"   Images: {images_count}")
            
            if dest.images and len(dest.images) > 0:
                destinations_with_images += 1
                if len(dest.images) > 1:
                    destinations_with_multiple_images += 1
                
                # Check if any images are from the generic set (indicating they may need better images)
                generic_images = [
                    "https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80",
                    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80",
                    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
                    "https://images.unsplash.com/photo-1506973035762-994680826ce2?w=1200&q=80",
                    "https://images.unsplash.com/photo-1520332251656-c033b63585c4?w=1200&q=80",
                    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&q=80",
                    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=80",
                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80"
                ]
                
                has_generic_image = any(img in generic_images for img in dest.images)
                if has_generic_image:
                    destinations_needing_review.append({
                        'name': dest.name,
                        'country': dest.country,
                        'reason': 'Uses generic placeholder images'
                    })
                
                # Show first 2 images
                for j, img in enumerate(dest.images[:2]):
                    print(f"     [{j+1}] {img}")
            else:
                destinations_needing_review.append({
                    'name': dest.name,
                    'country': dest.country,
                    'reason': 'No images found'
                })
                print("     No images found")
            print()
        
        # Print summary
        print("=" * 50)
        print("SUMMARY:")
        print(f"Total destinations: {total_destinations}")
        print(f"Destinations with images: {destinations_with_images}")
        print(f"Destinations with multiple images: {destinations_with_multiple_images}")
        print(f"Destinations needing review: {len(destinations_needing_review)}")
        
        if destinations_needing_review:
            print("\nDESTINATIONS NEEDING REVIEW:")
            for dest in destinations_needing_review:
                print(f"  - {dest['name']}, {dest['country']}: {dest['reason']}")

if __name__ == '__main__':
    check_destination_images()