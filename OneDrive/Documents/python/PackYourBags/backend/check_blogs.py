"""
Script to check the current state of blogs in the database
"""
from app import create_app
from models import Blog

def check_blogs():
    app = create_app()
    
    with app.app_context():
        blogs = Blog.query.all()
        print(f"Total blogs: {len(blogs)}")
        
        published = Blog.query.filter_by(status='published').all()
        print(f"Published blogs: {len(published)}")
        
        print("\nAll blog titles:")
        for i, blog in enumerate(blogs, 1):
            status = "Published" if blog.status == 'published' else "Draft"
            print(f"{i}. {blog.title} ({status})")

if __name__ == "__main__":
    check_blogs()