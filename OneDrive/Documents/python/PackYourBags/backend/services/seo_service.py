"""
SEO Service - Comprehensive SEO optimization for PackYourBags
"""
from models import Blog, Destination
from database import db
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SEOService:
    """Comprehensive SEO service for content optimization"""
    
    def __init__(self):
        self.default_meta = {
            'site_name': 'PackYourBags',
            'title_suffix': ' | PackYourBags - AI Travel Discovery',
            'description': 'Discover your next adventure with PackYourBags. AI-powered travel planning, personalized recommendations, and exclusive deals.',
            'keywords': 'travel, ai travel, itinerary planning, travel deals, destination discovery',
            'author': 'PackYourBags Team'
        }
    
    def optimize_blog_seo(self, blog_id):
        """
        Optimize SEO for a specific blog post
        """
        try:
            blog = Blog.query.get(blog_id)
            if not blog:
                return False
            
            # Generate SEO metadata if missing
            if not blog.meta_title:
                blog.meta_title = self._generate_meta_title(blog.title)
            
            if not blog.meta_description:
                blog.meta_description = self._generate_meta_description(blog.content)
            
            if not blog.meta_keywords:
                blog.meta_keywords = self._generate_meta_keywords(blog.title, blog.category, blog.tags)
            
            # Ensure proper length limits
            blog.meta_title = blog.meta_title[:70]
            blog.meta_description = blog.meta_description[:160]
            
            db.session.commit()
            logger.info(f"SEO optimized for blog {blog_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error optimizing blog SEO: {str(e)}")
            return False
    
    def optimize_all_blogs(self):
        """
        Optimize SEO for all blog posts
        """
        try:
            blogs = Blog.query.all()
            optimized_count = 0
            
            for blog in blogs:
                if self.optimize_blog_seo(blog.id):
                    optimized_count += 1
            
            logger.info(f"SEO optimized for {optimized_count} blogs")
            return optimized_count
            
        except Exception as e:
            logger.error(f"Error optimizing all blogs: {str(e)}")
            return 0
    
    def generate_sitemap(self):
        """
        Generate XML sitemap for search engines
        """
        try:
            # Get all published blogs
            blogs = Blog.query.filter_by(status='published').all()
            
            # Get all destinations
            destinations = Destination.query.all()
            
            # Generate sitemap XML
            sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
            sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            
            # Add homepage
            sitemap_xml += self._sitemap_url_entry('/', '1.0', 'daily')
            
            # Add blog list page
            sitemap_xml += self._sitemap_url_entry('/blogs', '0.9', 'weekly')
            
            # Add each blog post
            for blog in blogs:
                sitemap_xml += self._sitemap_url_entry(
                    f'/blogs/{blog.slug}', 
                    '0.8', 
                    'monthly',
                    blog.updated_at
                )
            
            # Add destinations page
            sitemap_xml += self._sitemap_url_entry('/destinations', '0.9', 'weekly')
            
            # Add each destination
            for dest in destinations:
                sitemap_xml += self._sitemap_url_entry(
                    f'/destinations/{dest.destination_id}', 
                    '0.7', 
                    'monthly',
                    dest.updated_at
                )
            
            sitemap_xml += '</urlset>'
            
            logger.info("Sitemap generated successfully")
            return sitemap_xml
            
        except Exception as e:
            logger.error(f"Error generating sitemap: {str(e)}")
            return None
    
    def get_seo_stats(self):
        """
        Get SEO statistics for the site
        """
        try:
            # Count published blogs
            total_blogs = Blog.query.filter_by(status='published').count()
            
            # Count blogs with SEO metadata
            blogs_with_meta_title = Blog.query.filter(
                Blog.status == 'published',
                Blog.meta_title.isnot(None),
                Blog.meta_title != ''
            ).count()
            
            blogs_with_meta_desc = Blog.query.filter(
                Blog.status == 'published',
                Blog.meta_description.isnot(None),
                Blog.meta_description != ''
            ).count()
            
            blogs_with_keywords = Blog.query.filter(
                Blog.status == 'published',
                Blog.meta_keywords.isnot(None),
                Blog.meta_keywords != ''
            ).count()
            
            # Count destinations
            total_destinations = Destination.query.count()
            
            stats = {
                'total_blogs': total_blogs,
                'blogs_with_meta_title': blogs_with_meta_title,
                'blogs_with_meta_description': blogs_with_meta_desc,
                'blogs_with_keywords': blogs_with_keywords,
                'meta_title_completion': round((blogs_with_meta_title / total_blogs * 100) if total_blogs > 0 else 0, 1),
                'meta_description_completion': round((blogs_with_meta_desc / total_blogs * 100) if total_blogs > 0 else 0, 1),
                'keywords_completion': round((blogs_with_keywords / total_blogs * 100) if total_blogs > 0 else 0, 1),
                'total_destinations': total_destinations
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting SEO stats: {str(e)}")
            return None
    
    def _generate_meta_title(self, title):
        """
        Generate meta title for a blog post
        """
        # Remove extra whitespace and ensure proper length
        clean_title = ' '.join(title.split())
        if len(clean_title) <= 55:
            return clean_title + self.default_meta['title_suffix']
        else:
            return clean_title[:55] + '...' + self.default_meta['title_suffix']
    
    def _generate_meta_description(self, content):
        """
        Generate meta description from content
        """
        # Extract first few sentences and clean up
        sentences = content.split('. ')
        description = '. '.join(sentences[:2]) + '.'
        
        # Clean up extra whitespace
        description = ' '.join(description.split())
        
        # Ensure proper length
        if len(description) > 160:
            description = description[:157] + '...'
        
        return description
    
    def _generate_meta_keywords(self, title, category, tags):
        """
        Generate meta keywords from title, category, and tags
        """
        keywords = []
        
        # Add words from title
        title_words = title.lower().split()
        keywords.extend([word.strip(',.!?') for word in title_words if len(word) > 3])
        
        # Add category
        if category:
            keywords.append(category.lower())
        
        # Add tags
        if tags:
            if isinstance(tags, list):
                keywords.extend([tag.lower() for tag in tags])
            elif isinstance(tags, str):
                keywords.extend([tag.strip().lower() for tag in tags.split(',')])
        
        # Remove duplicates and join
        unique_keywords = list(set(keywords))
        return ', '.join(unique_keywords[:10])  # Limit to 10 keywords
    
    def _sitemap_url_entry(self, url, priority, changefreq, lastmod=None):
        """
        Generate a sitemap URL entry
        """
        entry = f'  <url>\n'
        entry += f'    <loc>https://packyourbags.example.com{url}</loc>\n'
        entry += f'    <priority>{priority}</priority>\n'
        entry += f'    <changefreq>{changefreq}</changefreq>\n'
        
        if lastmod:
            entry += f'    <lastmod>{lastmod.strftime("%Y-%m-%d")}</lastmod>\n'
        
        entry += f'  </url>\n'
        return entry

# Initialize SEO service
seo_service = SEOService()