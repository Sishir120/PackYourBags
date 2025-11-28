"""
Script to generate AI blogs for each destination and add SEO backlinks
"""
from app import create_app
from database import db
from models import Destination, Blog
from services.blog_generator import blog_generator
from datetime import datetime
import random

def generate_blogs_for_destinations():
    """Generate AI blogs for all destinations"""
    app = create_app()
    
    with app.app_context():
        print("Generating AI blogs for destinations...")
        
        # Get all destinations
        destinations = Destination.query.all()
        print(f"Found {len(destinations)} destinations")
        
        generated_count = 0
        skipped_count = 0
        
        # Categories for variety
        categories = ['Adventure', 'Luxury', 'Family', 'Solo', 'Budget']
        
        for dest in destinations:
            # Check if blog already exists for this destination
            existing_blog = Blog.query.filter(
                Blog.destination_id == dest.destination_id
            ).first()
            
            if existing_blog:
                print(f"  Skipping {dest.name} - blog already exists")
                skipped_count += 1
                continue
            
            # Generate blog for destination
            print(f"  Generating blog for {dest.name}...")
            
            try:
                # Get destination data
                dest_data = dest.to_dict()
                
                # Select random category
                category = random.choice(categories)
                
                # Generate blog using AI
                result = blog_generator.generate_blog_post(
                    destination_name=dest.name,
                    category=category,
                    destination_data=dest_data
                )
                
                if result['success']:
                    blog_data = result['blog']
                    
                    # Add backlinks for SEO
                    blog_content = blog_data['content']
                    backlinks = [
                        f"For more information about {dest.name}, visit our [destination guide](/destination/{dest.destination_id}).",
                        f"Discover other amazing places in {dest.country} on our [country page](/destinations?country={dest.country.replace(' ', '%20')}).",
                        f"Looking for travel inspiration? Check out our [blog section](/blog) for more destination guides.",
                        f"Plan your trip to {dest.name} with our [AI travel planner](/itinerary/new)."
                    ]
                    
                    # Add backlinks to content (insert at strategic points)
                    lines = blog_content.split('\n')
                    # Insert backlinks at different points in the content
                    if len(lines) > 10:
                        lines.insert(len(lines) // 3, f"\n{random.choice(backlinks)}\n")
                        lines.insert(2 * len(lines) // 3, f"\n{random.choice(backlinks)}\n")
                    else:
                        lines.append(f"\n{random.choice(backlinks)}\n")
                    
                    blog_content = '\n'.join(lines)
                    blog_data['content'] = blog_content
                    
                    # Create blog entry
                    blog = Blog(
                        title=blog_data['title'],
                        content=blog_data['content'],
                        excerpt=blog_data['excerpt'],
                        category=blog_data['category'],
                        tags=blog_data['tags'],
                        meta_title=blog_data['meta_title'],
                        meta_description=blog_data['meta_description'],
                        meta_keywords=blog_data['meta_keywords'],
                        status='published',
                        ai_generated=True,
                        ai_prompt=blog_data.get('ai_prompt'),
                        destination_id=dest.destination_id  # Now we can use this column
                    )
                    
                    # Set published date
                    blog.published_at = datetime.utcnow()
                    
                    db.session.add(blog)
                    db.session.commit()
                    
                    print(f"    ✓ Created blog: {blog.title}")
                    generated_count += 1
                else:
                    print(f"    ✗ Failed to generate blog for {dest.name}: {result.get('error')}")
            
            except Exception as e:
                print(f"    ✗ Error processing {dest.name}: {str(e)}")
                db.session.rollback()
        
        print(f"\nBlog generation complete!")
        print(f"  Generated: {generated_count} blogs")
        print(f"  Skipped: {skipped_count} destinations (already had blogs)")

def run_blog_generation():
    """Run the blog generation process"""
    print("="*60)
    print("Starting AI Blog Generation for Destinations")
    print("="*60)
    
    generate_blogs_for_destinations()
    
    print("\n" + "="*60)
    print("Process Complete!")
    print("="*60)

if __name__ == '__main__':
    run_blog_generation()