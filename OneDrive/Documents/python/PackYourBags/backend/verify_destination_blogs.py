"""
Script to verify that all destinations have corresponding blogs
"""
from app import create_app
from models import Destination, Blog

def verify_destination_blogs():
    app = create_app()
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        print(f"Total destinations: {len(destinations)}")
        
        # Get all blogs
        blogs = Blog.query.all()
        print(f"Total blogs: {len(blogs)}")
        
        # Check which destinations have blogs
        destinations_with_blogs = 0
        destinations_without_blogs = []
        
        for dest in destinations:
            blog = Blog.query.filter_by(destination_id=dest.destination_id).first()
            if blog:
                destinations_with_blogs += 1
                print(f"✓ {dest.name} - Has blog: {blog.title}")
            else:
                destinations_without_blogs.append(dest)
                print(f"✗ {dest.name} - No blog found")
        
        print(f"\nSummary:")
        print(f"Destinations with blogs: {destinations_with_blogs}")
        print(f"Destinations without blogs: {len(destinations_without_blogs)}")
        
        if destinations_without_blogs:
            print(f"\nDestinations missing blogs:")
            for dest in destinations_without_blogs:
                print(f"- {dest.name}")

if __name__ == "__main__":
    verify_destination_blogs()