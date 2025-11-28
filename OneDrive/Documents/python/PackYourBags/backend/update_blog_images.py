"""
Script to update blogs with proper featured images
"""
from app import create_app
from database import db
from models import Blog, Destination

# Dictionary of destination-specific blog images
DESTINATION_BLOG_IMAGES = {
    "Pokhara": "https://images.unsplash.com/photo-1582692119782-7c891b3c489a?w=1200&q=80",
    "Kathmandu": "https://images.unsplash.com/photo-1544896389-2a377f0d1b0f?w=1200&q=80",
    "Chitwan National Park": "https://images.unsplash.com/photo-1591856740359-7300f0d2c874?w=1200&q=80",
    "Bali": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
    "Ubud": "https://images.unsplash.com/photo-1594392101955-f541d3b9988d?w=1200&q=80",
    "Gili Islands": "https://images.unsplash.com/photo-1590523820511-0c12b6d9b9a5?w=1200&q=80",
    "Bangkok": "https://images.unsplash.com/photo-1563492065599-3520f775069a?w=1200&q=80",
    "Chiang Mai": "https://images.unsplash.com/photo-1552152974-194700b75984?w=1200&q=80",
    "Phuket": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
    "Jaipur": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",
    "Udaipur": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",
    "Goa": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
    "Munnar": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",
    "Kerala": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",
    "Dubai": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
    "Abu Dhabi": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",
    "Sharjah": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
    "Paris": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80",
    "Nice": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f2c8c?w=1200&q=80",
    "Lyon": "https://images.unsplash.com/photo-1594209289026-1d63a11d6c7e?w=1200&q=80"
}

def update_blog_images():
    """Update blogs with proper featured images"""
    app = create_app()
    
    with app.app_context():
        # Get all blogs
        blogs = Blog.query.all()
        
        print(f"Updating {len(blogs)} blogs with featured images...")
        
        updated_count = 0
        
        for blog in blogs:
            # Skip if already has featured image
            if blog.featured_image:
                continue
                
            # Try to match with destination
            if blog.destination_id:
                destination = Destination.query.filter_by(destination_id=blog.destination_id).first()
                if destination and destination.images:
                    # Use first destination image
                    blog.featured_image = destination.images[0]
                    updated_count += 1
                    print(f"Updated blog '{blog.title}' with destination image")
                elif destination and destination.name in DESTINATION_BLOG_IMAGES:
                    # Use specific image for this destination
                    blog.featured_image = DESTINATION_BLOG_IMAGES[destination.name]
                    updated_count += 1
                    print(f"Updated blog '{blog.title}' with specific image")
            else:
                # Try to extract destination from blog title
                for dest_name, image_url in DESTINATION_BLOG_IMAGES.items():
                    if dest_name.lower() in blog.title.lower():
                        blog.featured_image = image_url
                        updated_count += 1
                        print(f"Updated blog '{blog.title}' with matched image")
                        break
        
        # Commit changes
        if updated_count > 0:
            db.session.commit()
            print(f"Successfully updated {updated_count} blogs with featured images")
        else:
            print("No blogs needed updates")

if __name__ == '__main__':
    update_blog_images()