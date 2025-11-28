from flask import Blueprint, Response, jsonify, current_app
from database import db
from models import Blog, Destination
from datetime import datetime
import json

seo_bp = Blueprint('seo', __name__)

@seo_bp.route('/sitemap.xml')
def sitemap():
    """Generate dynamic XML sitemap"""
    try:
        site_url = current_app.config.get('SITE_URL', 'http://localhost:3000')
        
        # Start XML
        xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
        xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        
        # Homepage
        xml_content.append(f'''
  <url>
    <loc>{site_url}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>{datetime.utcnow().strftime('%Y-%m-%d')}</lastmod>
  </url>''')
        
        # Blog index
        xml_content.append(f'''
  <url>
    <loc>{site_url}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>{datetime.utcnow().strftime('%Y-%m-%d')}</lastmod>
  </url>''')
        
        # Individual blog posts
        blogs = Blog.query.filter_by(status='published').all()
        for blog in blogs:
            lastmod = blog.updated_at or blog.created_at
            xml_content.append(f'''
  <url>
    <loc>{site_url}/blog/{blog.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>{lastmod.strftime('%Y-%m-%d')}</lastmod>
  </url>''')
        
        # Destinations
        destinations = Destination.query.all()
        for dest in destinations:
            xml_content.append(f'''
  <url>
    <loc>{site_url}/destination/{dest.destination_id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>''')
        
        # Static pages
        static_pages = [
            ('/about', '0.6', 'monthly'),
            ('/contact', '0.5', 'monthly'),
        ]
        
        for page, priority, changefreq in static_pages:
            xml_content.append(f'''
  <url>
    <loc>{site_url}{page}</loc>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>''')
        
        xml_content.append('</urlset>')
        
        xml_string = '\n'.join(xml_content)
        
        return Response(xml_string, mimetype='application/xml')
    
    except Exception as e:
        return Response(f'<!-- Error generating sitemap: {str(e)} -->', mimetype='application/xml'), 500

@seo_bp.route('/robots.txt')
def robots():
    """Generate robots.txt file"""
    site_url = current_app.config.get('SITE_URL', 'http://localhost:3000')
    
    robots_content = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Sitemap
Sitemap: {site_url}/sitemap.xml

# Crawl delay (be polite to servers)
Crawl-delay: 1
"""
    
    return Response(robots_content, mimetype='text/plain')

@seo_bp.route('/api/seo/meta/<page_type>/<identifier>')
def get_meta_tags(page_type, identifier):
    """
    Get meta tags for a specific page
    page_type: 'blog', 'destination', 'home'
    identifier: slug or id
    """
    try:
        site_name = current_app.config.get('SITE_NAME', 'PackYourBags')
        site_url = current_app.config.get('SITE_URL', 'http://localhost:3000')
        
        if page_type == 'blog':
            blog = Blog.query.filter_by(slug=identifier).first()
            
            if not blog:
                return jsonify({"success": False, "error": "Blog not found"}), 404
            
            meta = {
                "title": blog.meta_title or blog.title,
                "description": blog.meta_description or blog.excerpt,
                "keywords": blog.meta_keywords,
                "canonical": f"{site_url}/blog/{blog.slug}",
                "og": {
                    "title": blog.title,
                    "description": blog.excerpt,
                    "image": blog.featured_image or f"{site_url}/default-blog-image.jpg",
                    "url": f"{site_url}/blog/{blog.slug}",
                    "type": "article",
                    "site_name": site_name
                },
                "twitter": {
                    "card": "summary_large_image",
                    "title": blog.title,
                    "description": blog.excerpt,
                    "image": blog.featured_image or f"{site_url}/default-blog-image.jpg"
                },
                "schema": {
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": blog.title,
                    "description": blog.excerpt,
                    "image": blog.featured_image,
                    "datePublished": blog.published_at.isoformat() if blog.published_at else None,
                    "dateModified": blog.updated_at.isoformat() if blog.updated_at else None,
                    "author": {
                        "@type": "Organization",
                        "name": site_name
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": site_name,
                        "logo": {
                            "@type": "ImageObject",
                            "url": f"{site_url}/logo.png"
                        }
                    }
                }
            }
            
        elif page_type == 'destination':
            dest = Destination.query.filter_by(destination_id=identifier).first()
            
            if not dest:
                return jsonify({"success": False, "error": "Destination not found"}), 404
            
            meta = {
                "title": f"{dest.name} Travel Guide | {site_name}",
                "description": dest.description or f"Discover {dest.name}, {dest.country}. {dest.quick_fact}",
                "keywords": f"{dest.name}, {dest.country}, {dest.continent}, travel guide, {dest.budget_tier}",
                "canonical": f"{site_url}/destination/{dest.destination_id}",
                "og": {
                    "title": f"{dest.name} - {dest.country}",
                    "description": dest.quick_fact,
                    "image": dest.images[0] if dest.images else f"{site_url}/default-destination-image.jpg",
                    "url": f"{site_url}/destination/{dest.destination_id}",
                    "type": "website",
                    "site_name": site_name
                },
                "twitter": {
                    "card": "summary_large_image",
                    "title": f"{dest.name} - {dest.country}",
                    "description": dest.quick_fact,
                    "image": dest.images[0] if dest.images else f"{site_url}/default-destination-image.jpg"
                },
                "schema": {
                    "@context": "https://schema.org",
                    "@type": "TouristDestination",
                    "name": dest.name,
                    "description": dest.description or dest.quick_fact,
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": dest.latitude,
                        "longitude": dest.longitude
                    } if dest.latitude and dest.longitude else None,
                    "touristType": dest.budget_tier
                }
            }
            
        elif page_type == 'home':
            meta = {
                "title": f"{site_name} | AI-Powered Travel Discovery & Planning",
                "description": "Discover your next adventure with PackYourBags. AI-powered travel recommendations, interactive destination roulette, and personalized trip planning.",
                "keywords": "travel, destinations, trip planning, AI travel assistant, vacation planning, adventure travel",
                "canonical": site_url,
                "og": {
                    "title": f"{site_name} - Discover Your Next Adventure",
                    "description": "AI-powered travel discovery platform. Spin the roulette, explore destinations, and plan your perfect trip.",
                    "image": f"{site_url}/og-image.jpg",
                    "url": site_url,
                    "type": "website",
                    "site_name": site_name
                },
                "twitter": {
                    "card": "summary_large_image",
                    "title": f"{site_name} - Discover Your Next Adventure",
                    "description": "AI-powered travel discovery and planning platform",
                    "image": f"{site_url}/twitter-card.jpg"
                },
                "schema": {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": site_name,
                    "url": site_url,
                    "description": "AI-powered travel discovery and planning platform",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": f"{site_url}/search?q={{search_term_string}}",
                        "query-input": "required name=search_term_string"
                    }
                }
            }
        
        else:
            return jsonify({"success": False, "error": "Invalid page type"}), 400
        
        return jsonify({
            "success": True,
            "meta": meta
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@seo_bp.route('/api/seo/stats')
def seo_stats():
    """Get SEO statistics"""
    try:
        stats = {
            "total_blogs": Blog.query.filter_by(status='published').count(),
            "total_destinations": Destination.query.count(),
            "featured_blogs": Blog.query.filter_by(status='published', featured=True).count(),
            "categories": db.session.query(Blog.category, db.func.count(Blog.id)).filter_by(status='published').group_by(Blog.category).all(),
            "sitemap_urls": Blog.query.filter_by(status='published').count() + Destination.query.count() + 5,  # +5 for static pages
            "last_updated": datetime.utcnow().isoformat()
        }
        
        return jsonify({
            "success": True,
            "stats": stats
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
