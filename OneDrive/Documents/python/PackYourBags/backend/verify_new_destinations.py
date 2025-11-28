"""
Script to verify that new destinations and blogs have been added correctly
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination, Blog

def verify_new_destinations():
    """Verify that new destinations and blogs have been added correctly"""
    # Create Flask app
    app = create_app()
    
    # Verify within app context
    with app.app_context():
        # Count total destinations and blogs
        total_destinations = Destination.query.count()
        total_blogs = Blog.query.count()
        
        print(f"Total destinations in database: {total_destinations}")
        print(f"Total blogs in database: {total_blogs}")
        
        # Get the 8 most recently added destinations
        print("\nNewly added destinations:")
        new_destinations = Destination.query.order_by(Destination.id.desc()).limit(8).all()
        for dest in new_destinations:
            print(f"  - {dest.name} ({dest.country})")
        
        # Get the 8 most recently added blogs
        print("\nNewly generated blogs:")
        new_blogs = Blog.query.order_by(Blog.id.desc()).limit(8).all()
        for blog in new_blogs:
            print(f"  - {blog.title}")
        
        # Verify that each new destination has a blog
        print("\nVerifying destination-blog relationships:")
        for dest in new_destinations:
            blog_count = Blog.query.filter_by(destination_id=dest.destination_id).count()
            print(f"  - {dest.name}: {blog_count} blog(s)")

if __name__ == "__main__":
    verify_new_destinations()