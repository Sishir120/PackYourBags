import random
import logging
from datetime import datetime, timedelta
from models import User, Destination, Itinerary
from database import db
from ai_service import ai_service

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PriceTracker:
    """Smart price tracking service with AI integration"""
    
    def __init__(self):
        self.providers = {
            'flights': ['skyscanner', 'google_flights'],
            'hotels': ['booking', 'expedia']
        }
        
        # Deal type weights for scoring
        self.deal_weights = {
            'Flight Discount': 0.8,
            'Hotel Deal': 0.7,
            'Package Savings': 0.9,
            'Last Minute Deal': 0.6,
            'Early Bird Special': 0.75
        }
        
        # User preferences weights for personalization
        self.preference_weights = {
            'budget': 0.3,
            'luxury': 0.2,
            'adventure': 0.2,
            'family': 0.15,
            'solo': 0.15
        }
    
    def check_price_drops(self, user_id=None):
        """
        Check for price drops on monitored itineraries
        Returns list of deals found
        """
        deals = []
        
        # If user_id specified, only check their itineraries
        if user_id:
            itineraries = Itinerary.query.filter_by(user_id=user_id).all()
        else:
            # Check all itineraries (for background jobs)
            itineraries = Itinerary.query.all()
        
        for itinerary in itineraries:
            try:
                deal = self._check_itinerary_for_deals(itinerary)
                if deal:
                    # Enhance deal with AI recommendations
                    enhanced_deal = self._enhance_deal_with_ai(deal, itinerary)
                    # Add deal score
                    scored_deal = self._score_deal(enhanced_deal, itinerary)
                    # Add personalization score
                    personalized_deal = self._personalize_deal(scored_deal, user_id)
                    deals.append(personalized_deal)
            except Exception as e:
                logger.error(f"Error checking itinerary {itinerary.id}: {str(e)}")
        
        # Sort deals by personalized score (highest first)
        deals.sort(key=lambda x: x.get('personalized_score', x.get('score', 0)), reverse=True)
        
        return deals
    
    def _check_itinerary_for_deals(self, itinerary):
        """
        Check a specific itinerary for price drops
        """
        # Simulate price checking - in a real implementation, this would call external APIs
        original_price = getattr(itinerary, 'estimated_budget', 0) or 0
        
        if original_price <= 0:
            return None
        
        # Simulate a 5-25% price drop (or no change)
        price_change = random.uniform(-0.25, 0.05)
        new_price = original_price * (1 + price_change)
        
        # Only create deal if price dropped
        if price_change < 0:
            savings = original_price - new_price
            
            return {
                'itinerary_id': itinerary.id,
                'user_id': itinerary.user_id,
                'destination_id': itinerary.destination_id,
                'original_price': round(original_price, 2),
                'new_price': round(new_price, 2),
                'savings': round(savings, 2),
                'savings_percentage': round(abs(price_change) * 100, 1),
                'deal_type': self._get_deal_type(),
                'provider': random.choice(self.providers['flights'] + self.providers['hotels']),
                'expires_in': random.randint(2, 24),  # hours
                'timestamp': datetime.utcnow().isoformat(),
                'price_history': self._generate_price_history(original_price, new_price)
            }
        
        return None
    
    def _generate_price_history(self, original_price, new_price):
        """
        Generate simulated price history for visualization
        """
        history = []
        current_price = original_price
        days_back = 30
        
        for i in range(days_back, -1, -1):
            # Simulate price fluctuations
            fluctuation = random.uniform(-0.05, 0.05)
            current_price = current_price * (1 + fluctuation)
            history.append({
                'date': (datetime.utcnow() - timedelta(days=i)).isoformat(),
                'price': round(current_price, 2)
            })
        
        # Ensure the last entry is the current deal price
        history[-1]['price'] = new_price
        
        return history
    
    def _enhance_deal_with_ai(self, deal, itinerary):
        """
        Enhance deal with AI-generated recommendations and insights
        """
        try:
            # Get destination info
            destination = Destination.query.filter_by(destination_id=deal['destination_id']).first()
            if not destination:
                return deal
            
            # Get user info for personalization
            user = User.query.get(deal['user_id'])
            user_preferences = user.preferences if user and user.preferences else {}
            
            # Generate AI insights for the deal with personalization
            prompt = f"""
            A travel deal has been found for {destination.name}, {destination.country}.
            Original price: ${deal['original_price']}
            New price: ${deal['new_price']}
            Savings: ${deal['savings']} ({deal['savings_percentage']}% off)
            Deal type: {deal['deal_type']}
            Provider: {deal['provider']}
            
            User preferences: {user_preferences}
            
            Please provide:
            1. A brief analysis of why this is a good deal (personalized to user preferences if available)
            2. Recommendations on when to book (urgency based on expiration time)
            3. Suggestions for complementary services (e.g., if it's a flight deal, suggest hotels)
            4. Tips for maximizing the value of this deal based on destination highlights: {', '.join(destination.highlights[:3]) if destination.highlights else 'N/A'}
            5. A confidence score from 1-10 on how good this deal is
            
            Keep the response concise and actionable.
            Format your response as:
            ANALYSIS: [Your analysis here]
            BOOKING_URGENCY: [Urgency recommendation]
            COMPLEMENTARY_SERVICES: [Service suggestions]
            MAXIMIZATION_TIPS: [Value maximization tips]
            CONFIDENCE_SCORE: [Number from 1-10]
            """
            
            ai_insights = ai_service.generate_text(prompt, max_tokens=500)
            
            # Parse AI response
            parsed_insights = self._parse_ai_response(ai_insights)
            
            # Add AI insights to the deal
            deal.update(parsed_insights)
            deal['ai_recommendations'] = self._generate_recommendations(deal, destination, user_preferences)
            
            return deal
        except Exception as e:
            logger.error(f"Error enhancing deal with AI: {str(e)}")
            # Return deal without AI enhancements if there's an error
            return deal
    
    def _parse_ai_response(self, ai_response):
        """
        Parse AI response into structured data
        """
        try:
            lines = ai_response.split('\n')
            parsed = {}
            
            current_section = None
            content = []
            
            for line in lines:
                line = line.strip()
                if line.startswith('ANALYSIS:'):
                    current_section = 'analysis'
                    content = [line.replace('ANALYSIS:', '').strip()]
                elif line.startswith('BOOKING_URGENCY:'):
                    if current_section:
                        parsed[f'ai_{current_section}'] = ' '.join(content)
                    current_section = 'booking_urgency'
                    content = [line.replace('BOOKING_URGENCY:', '').strip()]
                elif line.startswith('COMPLEMENTARY_SERVICES:'):
                    if current_section:
                        parsed[f'ai_{current_section}'] = ' '.join(content)
                    current_section = 'complementary_services'
                    content = [line.replace('COMPLEMENTARY_SERVICES:', '').strip()]
                elif line.startswith('MAXIMIZATION_TIPS:'):
                    if current_section:
                        parsed[f'ai_{current_section}'] = ' '.join(content)
                    current_section = 'maximization_tips'
                    content = [line.replace('MAXIMIZATION_TIPS:', '').strip()]
                elif line.startswith('CONFIDENCE_SCORE:'):
                    if current_section:
                        parsed[f'ai_{current_section}'] = ' '.join(content)
                    current_section = 'confidence_score'
                    content = [line.replace('CONFIDENCE_SCORE:', '').strip()]
                elif line and current_section:
                    content.append(line)
            
            # Add the last section
            if current_section:
                parsed[f'ai_{current_section}'] = ' '.join(content)
            
            return parsed
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return {'ai_analysis': ai_response}
    
    def _generate_recommendations(self, deal, destination, user_preferences=None):
        """
        Generate complementary recommendations based on the deal and user preferences
        """
        recommendations = []
        
        # Base recommendations
        if 'Flight' in deal['deal_type']:
            recommendations.append({
                'type': 'hotel',
                'title': f'Hotel deals for {destination.name}',
                'description': f'Find accommodation in {destination.name} to complement your flight savings'
            })
        elif 'Hotel' in deal['deal_type']:
            recommendations.append({
                'type': 'flight',
                'title': f'Flight deals to {destination.name}',
                'description': f'Pair your hotel savings with affordable flights to {destination.name}'
            })
        else:  # Package deal
            recommendations.append({
                'type': 'activity',
                'title': f'Activities in {destination.name}',
                'description': f'Enhance your trip with local experiences and tours in {destination.name}'
            })
        
        # Personalized recommendations based on user preferences
        if user_preferences:
            budget_tier = user_preferences.get('budget_tier', 'mid-range')
            travel_styles = user_preferences.get('travel_styles', [])
            
            if 'luxury' in travel_styles and budget_tier in ['mid-range', 'luxury']:
                recommendations.append({
                    'type': 'upgrade',
                    'title': 'Luxury Upgrade Opportunity',
                    'description': f'With your {deal["savings_percentage"]}% savings, consider upgrading to a luxury experience in {destination.name}'
                })
            
            if 'adventure' in travel_styles:
                recommendations.append({
                    'type': 'activity',
                    'title': 'Adventure Activities',
                    'description': f'Book adventure tours in {destination.name} to maximize your trip experience'
                })
                
            if 'family' in travel_styles:
                recommendations.append({
                    'type': 'family',
                    'title': 'Family-Friendly Options',
                    'description': f'Look for family-friendly accommodations and activities in {destination.name}'
                })
        
        return recommendations
    
    def _score_deal(self, deal, itinerary):
        """
        Score deals based on savings, urgency, and deal type
        """
        try:
            # Base score on savings percentage (0-100)
            savings_score = deal['savings_percentage']
            
            # Weight by deal type
            deal_type_weight = self.deal_weights.get(deal['deal_type'], 0.5)
            
            # Urgency score (higher for deals expiring soon)
            urgency_score = max(0, (24 - deal['expires_in']) / 24 * 100)
            
            # Confidence score from AI if available
            confidence_score = 5  # Default
            if 'ai_confidence_score' in deal:
                try:
                    confidence_score = float(deal['ai_confidence_score'])
                except:
                    pass
            
            # Final score (weighted combination)
            final_score = (savings_score * 0.4 + urgency_score * 0.3 + deal_type_weight * 20 * 0.2 + confidence_score * 10 * 0.1)
            
            deal['score'] = round(final_score, 2)
            deal['urgency_level'] = 'high' if deal['expires_in'] < 6 else 'medium' if deal['expires_in'] < 12 else 'low'
            deal['confidence_score'] = confidence_score
            
            return deal
        except Exception as e:
            logger.error(f"Error scoring deal: {str(e)}")
            deal['score'] = deal['savings_percentage']  # Fallback to savings percentage
            deal['urgency_level'] = 'medium'
            deal['confidence_score'] = 5
            return deal
    
    def _personalize_deal(self, deal, user_id):
        """
        Personalize deal score based on user preferences and history
        """
        try:
            user = User.query.get(user_id)
            if not user:
                deal['personalized_score'] = deal['score']
                return deal
            
            user_preferences = user.preferences if user.preferences else {}
            travel_history = user.travel_history if user.travel_history else []
            
            # Base personalized score on original score
            personalized_score = deal['score']
            
            # Adjust based on user preferences
            preference_multiplier = 1.0
            travel_styles = user_preferences.get('travel_styles', [])
            
            for style in travel_styles:
                if style in self.preference_weights:
                    preference_multiplier += self.preference_weights[style]
            
            # Adjust based on travel history (if destination is familiar, slightly reduce score)
            destination_id = deal['destination_id']
            if any(dest_id == destination_id for dest_id in travel_history):
                preference_multiplier *= 0.9  # Slightly reduce for familiar destinations
            
            # Apply personalization
            personalized_score *= preference_multiplier
            
            deal['personalized_score'] = round(personalized_score, 2)
            deal['preference_multiplier'] = round(preference_multiplier, 2)
            
            return deal
        except Exception as e:
            logger.error(f"Error personalizing deal: {str(e)}")
            deal['personalized_score'] = deal['score']
            deal['preference_multiplier'] = 1.0
            return deal
    
    def _get_deal_type(self):
        """
        Determine deal type based on savings
        """
        deal_types = [
            'Flight Discount',
            'Hotel Deal',
            'Package Savings',
            'Last Minute Deal',
            'Early Bird Special'
        ]
        return random.choice(deal_types)
    
    def get_user_deals(self, user_id, limit=10):
        """
        Get recent deals for a specific user
        """
        # In a real implementation, this would query a deals table
        # For now, we'll simulate by checking current itineraries
        return self.check_price_drops(user_id)[:limit]
    
    def compare_deals(self, deal_ids):
        """
        Compare multiple deals and return analysis
        """
        # In a real implementation, this would fetch deals from database
        # For now, we'll return a mock comparison
        return {
            'comparison': 'Deal comparison feature ready for implementation',
            'deal_ids': deal_ids
        }
    
    def get_deal_history(self, user_id, destination_id=None):
        """
        Get price history for a specific destination or all destinations
        """
        # In a real implementation, this would query a price history table
        # For now, we'll return mock data
        return {
            'history': 'Price history tracking feature ready for implementation',
            'user_id': user_id,
            'destination_id': destination_id
        }
    
    def subscribe_to_deals(self, user_id, destination_id=None):
        """
        Subscribe user to deal alerts for specific destination or all trips
        """
        # In a real implementation, this would update a subscriptions table
        logger.info(f"User {user_id} subscribed to deals for destination {destination_id}")
        return True
    
    def unsubscribe_from_deals(self, user_id, destination_id=None):
        """
        Unsubscribe user from deal alerts
        """
        # In a real implementation, this would update a subscriptions table
        logger.info(f"User {user_id} unsubscribed from deals for destination {destination_id}")
        return True

# Initialize price tracker
price_tracker = PriceTracker()