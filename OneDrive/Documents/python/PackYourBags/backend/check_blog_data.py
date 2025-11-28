"""
Script to check blog data and identify issues with fonts and images
"""
from app import create_app
from database import db
from models import Blog

def check_blog_data():
    """Check blog data for font and image issues"""
    app = create_app()
    
    with app.app_context():
        # Get first few blogs
        blogs = Blog.query.limit(5).all()
        
        print("Blog Data Check:")
        print("=" * 50)
        
        for i, blog in enumerate(blogs, 1):
            print(f"Blog {i}:")
            print(f"  Title: {blog.title}")
            print(f"  Featured Image: {blog.featured_image}")
            print(f"  Content Length: {len(blog.content) if blog.content else 0}")
            print(f"  Has Content: {bool(blog.content)}")
            print()

if __name__ == '__main__':
    check_blog_data()