from flask import Blueprint, jsonify, request  # pyright: ignore[reportMissingImports]
from database import db
from models import Blog
from datetime import datetime
from slugify import slugify  # pyright: ignore[reportMissingImports]

blog_bp = Blueprint('blogs', __name__, url_prefix='/api/blogs')

@blog_bp.route('', methods=['GET'])
def get_blogs():
    """
    Retrieve blog posts with filtering and pagination
    Query params:
    - category: filter by category
    - tag: filter by tag
    - status: draft, published, archived (default: published)
    - featured: true/false
    - page: page number (default: 1)
    - per_page: items per page (default: 12)
    """
    try:
        # Get query parameters
        category = request.args.get('category')
        tag = request.args.get('tag')
        status = request.args.get('status', 'published')
        featured = request.args.get('featured', '').lower() == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 12))
        
        # Build query
        query = Blog.query
        
        # Apply filters
        if status:
            query = query.filter_by(status=status)
        
        if category:
            query = query.filter_by(category=category)
        
        if tag:
            query = query.filter(Blog.tags.contains([tag]))
        
        if featured:
            query = query.filter_by(featured=True)
        
        # Order by published date (newest first)
        query = query.order_by(Blog.published_at.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        blogs = [blog.to_dict() for blog in pagination.items]
        
        return jsonify({
            "success": True,
            "blogs": blogs,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "pages": pagination.pages,
                "has_next": pagination.has_next,
                "has_prev": pagination.has_prev
            }
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@blog_bp.route('/<slug>', methods=['GET'])
def get_blog_by_slug(slug):
    """Get a single blog post by slug"""
    try:
        blog = Blog.query.filter_by(slug=slug).first()
        
        if not blog:
            return jsonify({
                "success": False,
                "error": "Blog not found"
            }), 404
        
        # Increment view count
        blog.views += 1
        db.session.commit()
        
        return jsonify({
            "success": True,
            "blog": blog.to_dict()
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@blog_bp.route('', methods=['POST'])
def create_blog():
    """
    Create a new blog post
    Request body:
    {
        "title": "Amazing Destinations",
        "content": "Full blog content...",
        "category": "Adventure",
        "tags": ["travel", "adventure"],
        "featured_image": "url",
        "status": "draft",
        "ai_generated": false
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('content'):
            return jsonify({
                "success": False,
                "error": "Title and content are required"
            }), 400
        
        # Generate slug from title
        slug = slugify(data['title'])
        
        # Check if slug already exists
        existing = Blog.query.filter_by(slug=slug).first()
        if existing:
            slug = f"{slug}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        # Create new blog
        blog = Blog(
            title=data['title'],
            slug=slug,
            content=data['content'],
            excerpt=data.get('excerpt'),
            featured_image=data.get('featured_image'),
            category=data.get('category'),
            tags=data.get('tags', []),
            meta_title=data.get('meta_title', data['title'][:70]),
            meta_description=data.get('meta_description'),
            meta_keywords=data.get('meta_keywords'),
            status=data.get('status', 'draft'),
            featured=data.get('featured', False),
            ai_generated=data.get('ai_generated', False),
            ai_prompt=data.get('ai_prompt'),
            author_id=data.get('author_id')  # TODO: Get from authenticated user
        )
        
        # Set published_at if status is published
        if blog.status == 'published' and not blog.published_at:
            blog.published_at = datetime.utcnow()
        
        db.session.add(blog)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Blog created successfully",
            "blog": blog.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@blog_bp.route('/<int:blog_id>', methods=['PUT'])
def update_blog(blog_id):
    """Update an existing blog post"""
    try:
        blog = Blog.query.get(blog_id)
        
        if not blog:
            return jsonify({
                "success": False,
                "error": "Blog not found"
            }), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            blog.title = data['title']
            blog.slug = slugify(data['title'])
        
        if 'content' in data:
            blog.content = data['content']
        
        if 'excerpt' in data:
            blog.excerpt = data['excerpt']
        
        if 'featured_image' in data:
            blog.featured_image = data['featured_image']
        
        if 'category' in data:
            blog.category = data['category']
        
        if 'tags' in data:
            blog.tags = data['tags']
        
        if 'meta_title' in data:
            blog.meta_title = data['meta_title']
        
        if 'meta_description' in data:
            blog.meta_description = data['meta_description']
        
        if 'meta_keywords' in data:
            blog.meta_keywords = data['meta_keywords']
        
        if 'status' in data:
            blog.status = data['status']
            # Set published_at when publishing
            if data['status'] == 'published' and not blog.published_at:
                blog.published_at = datetime.utcnow()
        
        if 'featured' in data:
            blog.featured = data['featured']
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Blog updated successfully",
            "blog": blog.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@blog_bp.route('/<int:blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    """Delete a blog post"""
    try:
        blog = Blog.query.get(blog_id)
        
        if not blog:
            return jsonify({
                "success": False,
                "error": "Blog not found"
            }), 404
        
        db.session.delete(blog)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Blog deleted successfully"
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@blog_bp.route('/categories', methods=['GET'])
def get_blog_categories():
    """Get all blog categories with post counts"""
    try:
        # Get all unique categories with counts
        categories = db.session.query(
            Blog.category,
            db.func.count(Blog.id).label('count')
        ).filter(
            Blog.status == 'published'
        ).group_by(
            Blog.category
        ).all()
        
        # Format results
        result = [
            {
                'name': category,
                'count': count
            }
            for category, count in categories
        ]
        
        return jsonify({
            "success": True,
            "categories": result
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@blog_bp.route('/featured', methods=['GET'])
def get_featured_blogs():
    """Get featured blog posts for homepage"""
    try:
        blogs = Blog.query.filter_by(
            status='published',
            featured=True
        ).order_by(Blog.published_at.desc()).limit(3).all()
        
        return jsonify({
            "success": True,
            "blogs": [blog.to_dict() for blog in blogs]
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
