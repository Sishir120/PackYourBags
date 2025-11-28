"""
Script to verify that blogs were created properly
"""
from app import create_app
from database import db
from models import Blog

def verify_blogs():
    """Verify that blogs were created properly"""
    app = create_app()
    
    with app.app_context():
        print("Verifying blogs...")
        
        # Get all blogs
        blogs = Blog.query.all()
        print(f"Total blogs: {len(blogs)}")
        
        # Show first few blogs
        for i, blog in enumerate(blogs[:5]):
            print(f"{i+1}. {blog.title}")
            print(f"   Destination ID: {blog.destination_id}")
            print(f"   Category: {blog.category}")
            print(f"   AI Generated: {blog.ai_generated}")
            print(f"   Published: {blog.published_at}")
            print()

if __name__ == '__main__':
    verify_blogs()