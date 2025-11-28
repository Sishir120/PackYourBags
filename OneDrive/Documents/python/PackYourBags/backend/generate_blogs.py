"""
Script to generate AI-powered blog posts for all destinations
Run this to populate the database with travel blogs
"""

import sys
import os
from datetime import datetime
from slugify import slugify  # type: ignore

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models import Blog, Destination
from services.blog_generator import blog_generator

# Create app instance
app = create_app()

def generate_blogs_for_all_destinations():
    """Generate blog posts for all destinations in the database"""
    
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        
        if not destinations:
            print("❌ No destinations found in database. Please run migration first.")
            return
        
        print(f"\n🚀 Starting blog generation for {len(destinations)} destinations...")
        print("=" * 60)
        
        categories = ['Adventure', 'Luxury', 'Budget', 'Family', 'Solo']
        generated_count = 0
        skipped_count = 0
        
        for dest in destinations:
            # Check if blog already exists
            existing_blog = Blog.query.filter_by(destination_id=dest.destination_id).first()
            if existing_blog:
                print(f"⏭️  Skipping {dest.name} - Blog already exists")
                skipped_count += 1
                continue
            
            # Choose category based on destination budget tier
            category = 'Budget' if dest.budget_tier == 'budget-friendly' else \
                      'Luxury' if dest.budget_tier == 'luxury' else \
                      'Adventure'
            
            print(f"\n📝 Generating blog for: {dest.name}, {dest.country}")
            print(f"   Category: {category}")
            print(f"   Budget Tier: {dest.budget_tier}")
            
            try:
                # Prepare destination data
                dest_data = {
                    'name': dest.name,
                    'country': dest.country,
                    'continent': dest.continent,
                    'highlights': dest.highlights.split(',') if dest.highlights else [],
                    'best_season': dest.best_season,
                    'budget_tier': dest.budget_tier,
                    'quick_fact': dest.quick_fact
                }
                
                # Generate blog content
                result = blog_generator.generate_blog_post(
                    destination_name=dest.name,
                    category=category,
                    destination_data=dest_data
                )
                
                if result['success']:
                    blog_data = result['blog']
                    
                    # Create blog entry
                    blog = Blog(
                        title=blog_data['title'],
                        slug=slugify(blog_data['title']),
                        excerpt=blog_data['excerpt'],
                        content=blog_data['content'],
                        author='AI Travel Expert',
                        category=category,
                        tags=','.join(blog_data.get('tags', [])),
                        destination_id=dest.destination_id,
                        featured_image=dest.image_url if hasattr(dest, 'image_url') else None,
                        meta_title=blog_data.get('meta_title', blog_data['title'][:70]),
                        meta_description=blog_data.get('meta_description', blog_data['excerpt'][:160]),
                        meta_keywords=blog_data.get('meta_keywords', ''),
                        ai_generated=True,
                        status='published',
                        published_at=datetime.utcnow()
                    )
                    
                    db.session.add(blog)
                    db.session.commit()
                    
                    print(f"   ✅ Blog created successfully!")
                    print(f"   📰 Title: {blog.title}")
                    print(f"   🔗 Slug: {blog.slug}")
                    generated_count += 1
                else:
                    print(f"   ❌ Error: {result.get('error', 'Unknown error')}")
                
            except Exception as e:
                print(f"   ❌ Exception: {str(e)}")
                db.session.rollback()
        
        print("\n" + "=" * 60)
        print(f"✨ Blog generation complete!")
        print(f"   Generated: {generated_count} blogs")
        print(f"   Skipped: {skipped_count} blogs")
        print(f"   Total: {generated_count + skipped_count} destinations")
        print("=" * 60 + "\n")

if __name__ == '__main__':
    generate_blogs_for_all_destinations()
