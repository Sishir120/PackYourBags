"""
Script to add new destinations to the database and generate blogs for them
"""

import json
import os
import sys
from typing import Dict, List

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination, Blog, db
from services.blog_generator import BlogGenerator

def load_new_destinations(file_path: str) -> List[Dict]:
    """Load new destinations from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def add_destinations_to_database(destinations_file: str):
    """Add new destinations to the database"""
    # Create Flask app
    app = create_app()
    
    # Load new destinations from JSON file
    new_destinations = load_new_destinations(destinations_file)
    print(f"Loaded {len(new_destinations)} new destinations from {destinations_file}")
    
    # Initialize blog generator
    blog_generator = BlogGenerator()
    
    # Add destinations within app context
    with app.app_context():
        added_destinations = []
        
        for i, dest_data in enumerate(new_destinations):
            try:
                # Check if destination already exists
                existing = Destination.query.filter_by(destination_id=dest_data['id']).first()
                if existing:
                    print(f"Destination {dest_data['name']} already exists, skipping...")
                    continue
                
                # Create destination object
                destination = Destination(
                    destination_id=dest_data['id'],
                    name=dest_data['name'],
                    country=dest_data['country'],
                    continent=dest_data['continent'],
                    highlights=dest_data.get('highlights', []),
                    quick_fact=dest_data.get('quick_fact', ''),
                    best_season=dest_data.get('best_season', ''),
                    budget_tier=dest_data.get('budget_tier', 'mid-range'),
                    images=[dest_data.get('image_url', '')] if dest_data.get('image_url') else [],
                    latitude=dest_data.get('coordinates', {}).get('lat'),
                    longitude=dest_data.get('coordinates', {}).get('lng')
                )
                
                db.session.add(destination)
                db.session.flush()  # Get the ID without committing
                added_destinations.append(destination)
                print(f"Added destination: {destination.name}")
                
            except Exception as e:
                print(f"Error adding destination {dest_data.get('name', 'Unknown')}: {str(e)}")
                continue
        
        # Commit all new destinations
        try:
            db.session.commit()
            print(f"Successfully added {len(added_destinations)} new destinations to database")
        except Exception as e:
            db.session.rollback()
            print(f"Error committing destinations: {str(e)}")
            return []
        
        # Generate blogs for each new destination
        print("Generating blogs for new destinations...")
        generated_blogs = []
        
        for destination in added_destinations:
            try:
                # Determine blog category based on budget tier
                if destination.budget_tier == 'luxury':
                    category = 'Luxury'
                elif destination.budget_tier == 'budget-friendly':
                    category = 'Budget'
                else:
                    category = 'Adventure'
                
                # Generate blog using AI
                result = blog_generator.generate_blog_post(
                    destination_name=destination.name,
                    category=category,
                    destination_data=destination.to_dict()
                )
                
                if result['success']:
                    blog_data = result['blog']
                    
                    # Create blog entry in database
                    blog = Blog(
                        title=blog_data['title'],
                        content=blog_data['content'],
                        excerpt=blog_data['excerpt'],
                        category=category,
                        tags=blog_data['tags'],
                        meta_title=blog_data['meta_title'],
                        meta_description=blog_data['meta_description'],
                        meta_keywords=blog_data['meta_keywords'],
                        status='published',
                        ai_generated=True,
                        ai_prompt=blog_data.get('ai_prompt'),
                        destination_id=destination.destination_id
                    )
                    
                    db.session.add(blog)
                    generated_blogs.append(blog.title)
                    print(f"Generated blog for {destination.name}: {blog.title}")
                else:
                    print(f"Failed to generate blog for {destination.name}: {result.get('error', 'Unknown error')}")
            
            except Exception as e:
                print(f"Error generating blog for {destination.name}: {str(e)}")
                continue
        
        # Commit all blogs
        try:
            db.session.commit()
            print(f"Successfully generated {len(generated_blogs)} blogs")
        except Exception as e:
            db.session.rollback()
            print(f"Error committing blogs: {str(e)}")
        
        return added_destinations

if __name__ == "__main__":
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define file path
    destinations_file = os.path.join(script_dir, 'data', 'new_destinations.json')
    
    # Add destinations and generate blogs
    added_destinations = add_destinations_to_database(destinations_file)
    
    if added_destinations:
        print(f"\nSuccessfully added {len(added_destinations)} new destinations with blogs:")
        for dest in added_destinations:
            print(f"  - {dest.name} ({dest.country})")
    else:
        print("\nNo new destinations were added.")