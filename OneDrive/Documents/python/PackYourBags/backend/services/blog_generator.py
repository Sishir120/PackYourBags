from ai_service import ai_service
from datetime import datetime
import re

class BlogGenerator:
    """AI-powered blog content generator for travel articles"""
    
    CATEGORIES = {
        'Adventure': 'thrilling, adventurous experiences',
        'Luxury': 'premium, high-end luxury travel',
        'Family': 'family-friendly activities and destinations',
        'Solo': 'solo traveler experiences and tips',
        'Budget': 'budget-conscious travel tips and destinations'
    }
    
    def generate_blog_post(self, destination_name, category='Adventure', keywords=None, destination_data=None):
        """
        Generate a complete blog post using AI
        
        Args:
            destination_name: Name of the destination
            category: Blog category (Adventure, Luxury, Family, Solo, Budget)
            keywords: List of SEO keywords
            destination_data: Optional destination data for context
        
        Returns:
            dict: Generated blog data with title, content, meta fields
        """
        
        # Build context from destination data
        context = self._build_context(destination_name, category, destination_data)
        
        # Generate blog content
        prompt = self._create_blog_prompt(destination_name, category, context, keywords)
        
        try:
            content = ai_service.generate_text(prompt, max_tokens=2000)
            
            # Extract structured content
            blog_data = self._parse_blog_content(content, destination_name, category)
            
            # Add SEO metadata
            blog_data['meta_title'] = self._generate_meta_title(destination_name, category)
            blog_data['meta_description'] = self._generate_meta_description(blog_data['excerpt'])
            blog_data['meta_keywords'] = self._generate_keywords(destination_name, category, keywords)
            
            # Add tags
            blog_data['tags'] = self._generate_tags(destination_name, category)
            
            # Mark as AI generated
            blog_data['ai_generated'] = True
            blog_data['ai_prompt'] = prompt
            blog_data['category'] = category
            
            return {
                "success": True,
                "blog": blog_data
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _build_context(self, destination_name, category, destination_data):
        """Build context string from destination data"""
        if not destination_data:
            return f"{destination_name} is a popular travel destination."
        
        context_parts = [
            f"Location: {destination_data.get('country', 'Unknown')}, {destination_data.get('continent', 'Unknown')}",
        ]
        
        if destination_data.get('highlights'):
            highlights = ', '.join(destination_data['highlights'][:3])
            context_parts.append(f"Key attractions: {highlights}")
        
        if destination_data.get('best_season'):
            context_parts.append(f"Best time to visit: {destination_data['best_season']}")
        
        if destination_data.get('budget_tier'):
            context_parts.append(f"Budget level: {destination_data['budget_tier']}")
        
        return '. '.join(context_parts)
    
    def _create_blog_prompt(self, destination_name, category, context, keywords):
        """Create AI prompt for blog generation"""
        
        category_style = self.CATEGORIES.get(category, 'general travel')
        keyword_text = f"Include these keywords naturally: {', '.join(keywords)}" if keywords else ""
        
        prompt = f"""Write a comprehensive, engaging travel blog post about {destination_name} for {category_style} travelers.

Context: {context}

{keyword_text}

The blog post should:
1. Have an attention-grabbing title (60-70 characters)
2. Start with a compelling introduction paragraph (hook the reader)
3. Include 4-5 main sections with practical information:
   - What makes {destination_name} special
   - Top things to do and see
   - Local tips and insider knowledge
   - Best time to visit and practical considerations
   - Final thoughts and recommendations
4. Use vivid, descriptive language that inspires travel
5. Be SEO-optimized with natural keyword placement
6. Include practical travel tips
7. Be 800-1200 words in length
8. End with an engaging conclusion

Format the response as follows:

TITLE: [Your catchy title here]

EXCERPT: [A compelling 2-3 sentence summary]

CONTENT:
[Full blog post content with clear sections and engaging narrative]

Write in an enthusiastic, informative tone that makes readers want to visit {destination_name}."""

        return prompt
    
    def _parse_blog_content(self, ai_response, destination_name, category):
        """Parse AI response into structured blog data"""
        
        # Extract title
        title_match = re.search(r'TITLE:\s*(.+?)(?:\n|$)', ai_response, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else f"Discover {destination_name}: A {category} Traveler's Guide"
        
        # Extract excerpt
        excerpt_match = re.search(r'EXCERPT:\s*(.+?)(?:\n\n|CONTENT:)', ai_response, re.IGNORECASE | re.DOTALL)
        excerpt = excerpt_match.group(1).strip() if excerpt_match else f"Explore the wonders of {destination_name} with our comprehensive travel guide."
        
        # Extract main content
        content_match = re.search(r'CONTENT:\s*(.+)', ai_response, re.IGNORECASE | re.DOTALL)
        content = content_match.group(1).strip() if content_match else ai_response
        
        # Clean up content
        content = content.replace('TITLE:', '').replace('EXCERPT:', '').replace('CONTENT:', '').strip()
        
        return {
            'title': title,
            'excerpt': excerpt[:200] + '...' if len(excerpt) > 200 else excerpt,
            'content': content
        }
    
    def _generate_meta_title(self, destination_name, category):
        """Generate SEO-optimized meta title"""
        templates = {
            'Adventure': f"{destination_name} Adventure Guide | Thrilling Experiences & Tips",
            'Luxury': f"Luxury Travel to {destination_name} | Premium Experiences",
            'Family': f"{destination_name} Family Travel Guide | Kid-Friendly Activities",
            'Solo': f"Solo Travel to {destination_name} | Independent Traveler's Guide",
            'Budget': f"{destination_name} on a Budget | Affordable Travel Tips"
        }
        
        meta_title = templates.get(category, f"{destination_name} Travel Guide | PackYourBags")
        return meta_title[:70]  # SEO limit
    
    def _generate_meta_description(self, excerpt):
        """Generate meta description from excerpt"""
        if len(excerpt) <= 160:
            return excerpt
        
        # Truncate at sentence boundary
        truncated = excerpt[:157] + '...'
        return truncated
    
    def _generate_keywords(self, destination_name, category, custom_keywords=None):
        """Generate SEO keywords"""
        base_keywords = [
            destination_name.lower(),
            f"{destination_name.lower()} travel",
            f"{destination_name.lower()} guide",
            category.lower()
        ]
        
        if custom_keywords:
            base_keywords.extend(custom_keywords)
        
        # Remove duplicates and join
        unique_keywords = list(set(base_keywords))
        return ', '.join(unique_keywords[:10])  # Limit to 10 keywords
    
    def _generate_tags(self, destination_name, category):
        """Generate blog tags"""
        base_tags = [
            destination_name,
            category,
            'Travel Guide',
            'Travel Tips'
        ]
        
        category_tags = {
            'Adventure': ['Adventure Travel', 'Outdoor Activities'],
            'Luxury': ['Luxury Travel', 'Premium Destinations'],
            'Family': ['Family Travel', 'Kid-Friendly'],
            'Solo': ['Solo Travel', 'Independent Travel'],
            'Budget': ['Budget Travel', 'Affordable Destinations']
        }
        
        base_tags.extend(category_tags.get(category, []))
        
        return base_tags[:8]  # Limit to 8 tags
    
    def generate_bulk_blogs(self, destinations, category='Adventure', limit=10):
        """
        Generate multiple blog posts for a list of destinations
        
        Args:
            destinations: List of destination objects
            category: Blog category
            limit: Maximum number of blogs to generate
        
        Returns:
            list: Generated blog data for each destination
        """
        results = []
        
        for dest in destinations[:limit]:
            blog_data = self.generate_blog_post(
                destination_name=dest.get('name'),
                category=category,
                destination_data=dest
            )
            
            if blog_data['success']:
                results.append(blog_data['blog'])
        
        return results

# Initialize blog generator
blog_generator = BlogGenerator()
