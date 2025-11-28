from app import create_app
from models import Destination

def check_specific_destinations():
    app = create_app()
    
    with app.app_context():
        # Check specific destinations mentioned by user
        destination_names = ["Zanzibar", "Kathmandu", "Pokhara", "Great Barrier Reef"]
        
        print("Checking specific destinations:")
        print("=" * 50)
        
        for name in destination_names:
            dest = Destination.query.filter_by(name=name).first()
            if dest:
                print(f"{dest.name}:")
                print(f"  Country: {dest.country}")
                print(f"  Budget Tier: {dest.budget_tier}")
                print(f"  Best Season: {dest.best_season}")
                print(f"  Number of images: {len(dest.images) if dest.images else 0}")
                if dest.images:
                    for i, image in enumerate(dest.images[:2]):  # Show first 2 images
                        print(f"    Image {i+1}: {image[:50]}...")
                print()
            else:
                print(f"Destination '{name}' not found in database")
                print()

if __name__ == '__main__':
    check_specific_destinations()