from flask import Blueprint, jsonify, request
from database import db
from models import Blog, Destination
from services.blog_generator import blog_generator
from datetime import datetime

ai_blog_bp = Blueprint('ai_blogs', __name__, url_prefix='/api/ai/blogs')

@ai_blog_bp.route('/generate', methods=['POST'])
def generate_blog():
    """
    Generate a blog post using AI
    Request body:
    {
        "destination_name": "Bali",
        "destination_id": "dest_001",  # Optional
        "category": "Adventure",
        "keywords": ["beach", "culture"],  # Optional
        "auto_publish": false  # Optional, defaults to false (creates draft)
    }
    """
    try:
        data = request.get_json()
        
        destination_name = data.get('destination_name')
        destination_id = data.get('destination_id')
        category = data.get('category', 'Adventure')
        keywords = data.get('keywords', [])
        auto_publish = data.get('auto_publish', False)
        
        if not destination_name:
            return jsonify({
                "success": False,
                "error": "Destination name is required"
            }), 400
        
        # Get destination data if ID provided
        destination_data = None
        if destination_id:
            dest = Destination.query.filter_by(destination_id=destination_id).first()
            if dest:
                destination_data = dest.to_dict()
        
        # Generate blog using AI
        result = blog_generator.generate_blog_post(
            destination_name=destination_name,
            category=category,
            keywords=keywords,
            destination_data=destination_data
        )
        
        if not result['success']:
            return jsonify(result), 500
        
        blog_data = result['blog']
        
        # Create blog entry in database
        blog = Blog(
            title=blog_data['title'],
            content=blog_data['content'],
            excerpt=blog_data['excerpt'],
            category=blog_data['category'],
            tags=blog_data['tags'],
            meta_title=blog_data['meta_title'],
            meta_description=blog_data['meta_description'],
            meta_keywords=blog_data['meta_keywords'],
            status='published' if auto_publish else 'draft',
            ai_generated=True,
            ai_prompt=blog_data.get('ai_prompt')
        )
        
        if auto_publish:
            blog.published_at = datetime.utcnow()
        
        db.session.add(blog)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Blog {'published' if auto_publish else 'created as draft'} successfully",
            "blog": blog.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@ai_blog_bp.route('/bulk-generate', methods=['POST'])
def bulk_generate_blogs():
    """
    Generate multiple blog posts for multiple destinations
    Request body:
    {
        "category": "Adventure",
        "limit": 5,
        "auto_publish": false
    }
    """
    try:
        data = request.get_json()
        
        category = data.get('category', 'Adventure')
        limit = min(int(data.get('limit', 5)), 20)  # Max 20 at a time
        auto_publish = data.get('auto_publish', False)
        
        # Get destinations from database
        destinations = Destination.query.limit(limit).all()
        
        if not destinations:
            return jsonify({
                "success": False,
                "error": "No destinations found"
            }), 404
        
        created_blogs = []
        errors = []
        
        for dest in destinations:
            try:
                dest_data = dest.to_dict()
                
                # Generate blog
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
                        content=blog_data['content'],
                        excerpt=blog_data['excerpt'],
                        category=blog_data['category'],
                        tags=blog_data['tags'],
                        meta_title=blog_data['meta_title'],
                        meta_description=blog_data['meta_description'],
                        meta_keywords=blog_data['meta_keywords'],
                        status='published' if auto_publish else 'draft',
                        ai_generated=True,
                        ai_prompt=blog_data.get('ai_prompt')
                    )
                    
                    if auto_publish:
                        blog.published_at = datetime.utcnow()
                    
                    db.session.add(blog)
                    created_blogs.append(blog.title)
                else:
                    errors.append(f"Failed to generate blog for {dest.name}")
            
            except Exception as e:
                errors.append(f"Error processing {dest.name}: {str(e)}")
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Generated {len(created_blogs)} blogs",
            "created_blogs": created_blogs,
            "errors": errors if errors else None
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@ai_blog_bp.route('/regenerate/<int:blog_id>', methods=['POST'])
def regenerate_blog(blog_id):
    """
    Regenerate an existing AI blog with new prompt or parameters
    Request body:
    {
        "category": "Luxury",  # Optional, change category
        "keywords": ["premium", "exclusive"]  # Optional
    }
    """
    try:
        blog = Blog.query.get(blog_id)
        
        if not blog:
            return jsonify({
                "success": False,
                "error": "Blog not found"
            }), 404
        
        if not blog.ai_generated:
            return jsonify({
                "success": False,
                "error": "This blog was not AI-generated"
            }), 400
        
        data = request.get_json()
        category = data.get('category', blog.category)
        keywords = data.get('keywords', [])
        
        # Extract destination name from title (basic extraction)
        destination_name = blog.title.split(':')[0].strip()
        
        # Regenerate content
        result = blog_generator.generate_blog_post(
            destination_name=destination_name,
            category=category,
            keywords=keywords
        )
        
        if not result['success']:
            return jsonify(result), 500
        
        blog_data = result['blog']
        
        # Update blog
        blog.title = blog_data['title']
        blog.content = blog_data['content']
        blog.excerpt = blog_data['excerpt']
        blog.category = blog_data['category']
        blog.tags = blog_data['tags']
        blog.meta_title = blog_data['meta_title']
        blog.meta_description = blog_data['meta_description']
        blog.meta_keywords = blog_data['meta_keywords']
        blog.ai_prompt = blog_data.get('ai_prompt')
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Blog regenerated successfully",
            "blog": blog.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
