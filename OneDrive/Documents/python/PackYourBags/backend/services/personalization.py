"""
AI Personalization Engine - User preference learning and recommendations
"""
from models import User, Destination, Blog, Itinerary
from database import db
from datetime import datetime, timedelta
import json

class PersonalizationEngine:
    """AI-powered personalization engine"""
    
    def __init__(self):
        self.weights = {
            'travel_history': 0.4,
            'preferences': 0.3,
            'engagement': 0.2,
            'recent_activity': 0.1
        }
    
    def get_personalized_recommendations(self, user_id, limit=10):
        """Get personalized destination recommendations"""
        user = User.query.get(user_id)
        if not user:
            return []
        
        # Analyze user data
        user_profile = self._build_user_profile(user)
        
        # Score all destinations
        destinations = Destination.query.all()
        scored_destinations = []
        
        for dest in destinations:
            score = self._calculate_destination_score(dest, user_profile)
            scored_destinations.append({
                'destination': dest.to_dict(),
                'score': score,
                'reason': self._get_recommendation_reason(dest, user_profile)
            })
        
        # Sort by score
        scored_destinations.sort(key=lambda x: x['score'], reverse=True)
        
        return scored_destinations[:limit]
    
    def get_personalized_blogs(self, user_id, limit=6):
        """Get personalized blog recommendations"""
        user = User.query.get(user_id)
        if not user:
            return []
        
        user_profile = self._build_user_profile(user)
        
        # Get published blogs
        from models import Blog
        blogs = Blog.query.filter_by(status='published').all()
        
        scored_blogs = []
        for blog in blogs:
            score = self._calculate_blog_score(blog, user_profile)
            scored_blogs.append({
                'blog': blog.to_dict(),
                'score': score
            })
        
        scored_blogs.sort(key=lambda x: x['score'], reverse=True)
        
        return [item['blog'] for item in scored_blogs[:limit]]
    
    def update_user_preferences(self, user_id, interaction_data):
        """Update user preferences based on interactions"""
        user = User.query.get(user_id)
        if not user:
            return False
        
        if not user.preferences:
            user.preferences = {}
        
        # Update based on interaction type
        interaction_type = interaction_data.get('type')
        
        if interaction_type == 'destination_view':
            self._update_destination_preferences(user, interaction_data)
        elif interaction_type == 'blog_read':
            self._update_blog_preferences(user, interaction_data)
        elif interaction_type == 'itinerary_create':
            self._update_itinerary_preferences(user, interaction_data)
        
        db.session.commit()
        return True
    
    def _build_user_profile(self, user):
        """Build comprehensive user profile"""
        profile = {
            'preferred_continents': [],
            'preferred_budget': 'mid-range',
            'preferred_categories': [],
            'visited_destinations': [],
            'activity_level': 'moderate'
        }
        
        # Analyze travel history
        if user.travel_history:
            continents = [h.get('continent') for h in user.travel_history if h.get('continent')]
            if continents:
                profile['preferred_continents'] = list(set(continents))
        
        # Extract from preferences
        if user.preferences:
            profile['preferred_budget'] = user.preferences.get('budget_tier', 'mid-range')
            profile['preferred_categories'] = user.preferences.get('categories', [])
            profile['activity_level'] = user.preferences.get('activity_level', 'moderate')
        
        # Analyze itineraries
        itineraries = Itinerary.query.filter_by(user_id=user.id).all()
        for itin in itineraries:
            if itin.destination_id:
                profile['visited_destinations'].append(itin.destination_id)
        
        return profile
    
    def _calculate_destination_score(self, destination, user_profile):
        """Calculate personalization score for destination"""
        score = 0
        
        # Continent match
        if destination.continent in user_profile['preferred_continents']:
            score += 30
        
        # Budget match
        if destination.budget_tier == user_profile['preferred_budget']:
            score += 25
        
        # Not visited
        if destination.destination_id not in user_profile['visited_destinations']:
            score += 20
        
        # Random variety
        score += hash(destination.destination_id) % 25
        
        return score
    
    def _calculate_blog_score(self, blog, user_profile):
        """Calculate personalization score for blog"""
        score = 0
        
        # Category match
        if blog.category in user_profile['preferred_categories']:
            score += 40
        
        # Recent content
        if blog.published_at:
            days_old = (datetime.utcnow() - blog.published_at).days
            if days_old < 7:
                score += 30
            elif days_old < 30:
                score += 15
        
        # Popularity
        score += min(blog.views / 10, 20)
        
        # Random variety
        score += hash(str(blog.id)) % 10
        
        return score
    
    def _get_recommendation_reason(self, destination, user_profile):
        """Generate reason for recommendation"""
        reasons = []
        
        if destination.continent in user_profile['preferred_continents']:
            reasons.append(f"You've enjoyed {destination.continent} before")
        
        if destination.budget_tier == user_profile['preferred_budget']:
            reasons.append(f"Matches your {destination.budget_tier} budget")
        
        if not reasons:
            reasons.append("Discover something new")
        
        return reasons[0]
    
    def _update_destination_preferences(self, user, data):
        """Update preferences based on destination interaction"""
        if 'continent' in data:
            if 'preferred_continents' not in user.preferences:
                user.preferences['preferred_continents'] = []
            
            continent = data['continent']
            if continent not in user.preferences['preferred_continents']:
                user.preferences['preferred_continents'].append(continent)
    
    def _update_blog_preferences(self, user, data):
        """Update preferences based on blog interaction"""
        if 'category' in data:
            if 'categories' not in user.preferences:
                user.preferences['categories'] = []
            
            category = data['category']
            if category not in user.preferences['categories']:
                user.preferences['categories'].append(category)
    
    def _update_itinerary_preferences(self, user, data):
        """Update preferences based on itinerary creation"""
        if 'budget_tier' in data:
            user.preferences['budget_tier'] = data['budget_tier']

# Initialize personalization engine
personalization_engine = PersonalizationEngine()
