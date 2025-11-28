from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from ai_service import ai_service

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load destination data
def load_destinations():
    with open('data/destinations.json', 'r') as f:
        return json.load(f)

# Load subscribers data
def load_subscribers():
    try:
        with open('data/subscribers.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Save subscribers data
def save_subscribers(subscribers):
    with open('data/subscribers.json', 'w') as f:
        json.dump(subscribers, f, indent=2)

@app.route('/')
def home():
    return jsonify({
        "message": "PackYourBags API Server",
        "version": "1.0.0",
        "endpoints": [
            "/api/destinations",
            "/api/destination/<id>/details",
            "/api/subscribe",
            "/api/offers",
            "/api/blogs"
        ]
    })

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    """
    Retrieve destinations with optional filtering
    Query params:
    - filter: "global", "continent", "country"
    - value: filter value (continent name or country name)
    - limit: maximum number of results (default: 20)
    """
    try:
        destinations = load_destinations()
        
        # Get query parameters
        filter_type = request.args.get('filter', 'global')
        filter_value = request.args.get('value', '')
        limit = int(request.args.get('limit', 20))
        
        # Apply filters
        if filter_type == 'continent' and filter_value:
            filtered = [d for d in destinations if d['continent'].lower() == filter_value.lower()]
        elif filter_type == 'country' and filter_value:
            filtered = [d for d in destinations if d['country'].lower() == filter_value.lower()]
        else:
            filtered = destinations
        
        # Randomize order for variety
        random.shuffle(filtered)
        
        # Apply limit
        result = filtered[:limit]
        
        return jsonify({
            "success": True,
            "count": len(result),
            "destinations": result
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/destination/<destination_id>/details', methods=['GET'])
def get_destination_details(destination_id):
    """
    Get comprehensive details for a specific destination
    """
    try:
        destinations = load_destinations()
        
        # Find destination by ID
        destination = next((d for d in destinations if d['id'] == destination_id), None)
        
        if not destination:
            return jsonify({
                "success": False,
                "error": "Destination not found"
            }), 404
        
        # Add extended information
        extended_data = destination.copy()
        
        # Generate local tips (placeholder for AI-generated content)
        extended_data['local_tips'] = generate_local_tips(destination)
        
        # Find similar destinations
        extended_data['similar_destinations'] = find_similar_destinations(
            destinations, destination
        )
        
        # Generate full description (placeholder for AI)
        extended_data['full_description'] = generate_full_description(destination)
        
        return jsonify({
            "success": True,
            "destination": extended_data
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    """
    Register user email and preferences for personalized offers
    Request body:
    {
        "email": "user@example.com",
        "preferences": {
            "continents": ["Asia", "Europe"],
            "budget_tier": "budget-friendly",
            "travel_style": ["adventure", "culture"]
        }
    }
    """
    try:
        data = request.get_json()
        email = data.get('email')
        preferences = data.get('preferences', {})
        
        if not email:
            return jsonify({
                "success": False,
                "error": "Email is required"
            }), 400
        
        subscribers = load_subscribers()
        
        # Check if email exists
        existing = next((s for s in subscribers if s['email'] == email), None)
        
        if existing:
            # Update preferences
            existing['preferences'] = preferences
            existing['updated_at'] = datetime.now().isoformat()
            subscriber_id = existing['subscriber_id']
            message = "Preferences updated successfully"
        else:
            # Create new subscriber
            subscriber_id = f"sub_{len(subscribers) + 1:04d}"
            new_subscriber = {
                "subscriber_id": subscriber_id,
                "email": email,
                "subscribed_at": datetime.now().isoformat(),
                "preferences": preferences,
                "engagement_score": 0,
                "last_offer_sent": None
            }
            subscribers.append(new_subscriber)
            message = "Subscription successful"
        
        save_subscribers(subscribers)
        
        # Generate welcome offer
        welcome_offer = generate_welcome_offer(preferences)
        
        return jsonify({
            "success": True,
            "message": message,
            "subscriber_id": subscriber_id,
            "welcome_offer": welcome_offer
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/offers', methods=['GET'])
def get_offers():
    """
    Generate personalized travel offers
    Query params:
    - subscriber_id: for personalization
    - destination_id: for destination-specific offers
    - budget: budget constraint
    """
    try:
        subscriber_id = request.args.get('subscriber_id')
        destination_id = request.args.get('destination_id')
        budget = request.args.get('budget')
        
        destinations = load_destinations()
        
        # Get subscriber preferences if available
        preferences = {}
        if subscriber_id:
            subscribers = load_subscribers()
            subscriber = next((s for s in subscribers if s['subscriber_id'] == subscriber_id), None)
            if subscriber:
                preferences = subscriber.get('preferences', {})
        
        # Generate offers
        offers = generate_offers(destinations, preferences, destination_id, budget)
        
        return jsonify({
            "success": True,
            "offers": offers
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    """
    Retrieve blog posts (placeholder - to be implemented in Phase 2)
    """
    return jsonify({
        "success": True,
        "total_count": 0,
        "blogs": [],
        "message": "Blog system will be implemented in Phase 2"
    })

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """
    AI chat endpoint for travel questions
    Request body:
    {
        "message": "What should I pack for Bali?",
        "context": {"destination": "Bali", "budget": "mid-range"}
    }
    """
    try:
        data = request.get_json()
        message = data.get('message')
        context = data.get('context', {})
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        response = ai_service.chat_with_ai(message, context)
        
        return jsonify({
            "success": True,
            "response": response,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/travel-plan', methods=['POST'])
def generate_travel_plan():
    """
    Generate AI travel plan for a destination
    Request body:
    {
        "destination_id": "dest_001",
        "preferences": {"duration": 5, "budget": "mid-range"}
    }
    """
    try:
        data = request.get_json()
        destination_id = data.get('destination_id')
        preferences = data.get('preferences', {})
        
        if not destination_id:
            return jsonify({
                "success": False,
                "error": "Destination ID is required"
            }), 400
        
        # Get destination data
        destinations = load_destinations()
        destination = next((d for d in destinations if d['id'] == destination_id), None)
        
        if not destination:
            return jsonify({
                "success": False,
                "error": "Destination not found"
            }), 404
        
        # Generate travel plan
        plan = ai_service.generate_travel_plan(destination, preferences)
        
        return jsonify(plan)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Helper functions

def generate_local_tips(destination):
    """Generate local tips for a destination (placeholder for AI)"""
    tips_templates = {
        "Asia": [
            f"Visit {destination['name']} during the {destination['best_season']} for the best weather and fewer crowds.",
            f"Try local street food near {destination['highlights'][0]} for an authentic culinary experience.",
            "Learn a few basic phrases in the local language - locals appreciate the effort!",
            "Book accommodations near the city center for easy access to major attractions.",
            "Use local transportation apps for convenient and affordable travel within the city."
        ],
        "Europe": [
            f"Arrive early at {destination['highlights'][0]} to avoid tourist crowds.",
            "Consider purchasing a city pass for discounts on attractions and public transport.",
            "Explore neighborhoods beyond the main tourist areas for authentic local experiences.",
            "Try the local cuisine at family-run restaurants rather than touristy spots.",
            "Book museums and popular attractions in advance to skip the lines."
        ],
        "Americas": [
            f"The best time to experience {destination['name']} is during {destination['best_season']}.",
            "Stay in locally-owned guesthouses to support the community and get insider tips.",
            "Don't miss the sunset views - locals recommend getting there an hour early.",
            "Download offline maps before you go as WiFi can be spotty in some areas.",
            "Carry cash as not all vendors accept credit cards, especially in markets."
        ],
        "Africa": [
            f"Book your visit to {destination['highlights'][0]} well in advance, especially during peak season.",
            "Respect local customs and dress codes, particularly when visiting religious sites.",
            "Bargaining is expected in markets - start at 50% of the asking price.",
            "Stay hydrated and use sunscreen - the sun can be intense year-round.",
            "Hire a local guide for the best experience and to support the local economy."
        ],
        "Oceania": [
            f"Pack layers - weather in {destination['name']} can change quickly throughout the day.",
            "Book activities like diving or adventure sports at least a day in advance.",
            "Rent a car if possible to explore beyond the main tourist areas at your own pace.",
            "Check for seasonal wildlife viewing opportunities unique to this region.",
            "Stay sun-safe with reef-friendly sunscreen to protect marine ecosystems."
        ]
    }
    
    continent = destination['continent']
    return tips_templates.get(continent, tips_templates['Asia'])

def find_similar_destinations(all_destinations, current_destination):
    """Find similar destinations based on continent and budget tier"""
    similar = [
        d for d in all_destinations
        if d['id'] != current_destination['id'] and
        (d['continent'] == current_destination['continent'] or
         d['budget_tier'] == current_destination['budget_tier'])
    ]
    
    random.shuffle(similar)
    return similar[:3]

def generate_full_description(destination):
    """Generate full description (placeholder for AI)"""
    return f"{destination['name']} is a captivating destination in {destination['country']}, {destination['continent']}. " \
           f"{destination['quick_fact']} The area is renowned for its incredible attractions including " \
           f"{', '.join(destination['highlights'][:3])}. Whether you're seeking adventure, culture, or relaxation, " \
           f"{destination['name']} offers unforgettable experiences for every type of traveler. " \
           f"The ideal time to visit is during {destination['best_season']} when conditions are perfect for exploration."

def generate_welcome_offer(preferences):
    """Generate personalized welcome offer"""
    continents = preferences.get('continents', ['Asia'])
    budget_tier = preferences.get('budget_tier', 'budget-friendly')
    
    continent = continents[0] if continents else 'Asia'
    
    offers_map = {
        'budget-friendly': {
            'title': '🌟 Budget Explorer Special: Save 25% on Your First Adventure!',
            'description': f'Discover amazing {continent} destinations without breaking the bank. Get exclusive deals on accommodations and experiences.',
            'value_proposition': 'Up to 25% savings on budget-friendly destinations'
        },
        'mid-range': {
            'title': '✨ Comfort Traveler Exclusive: Premium Experience at Great Value',
            'description': f'Enjoy the perfect balance of comfort and value in {continent}. Curated mid-range hotels and authentic experiences.',
            'value_proposition': '20% off on selected mid-range packages'
        },
        'luxury': {
            'title': '👑 Luxury Escape: VIP Treatment Awaits',
            'description': f'Indulge in the finest {continent} has to offer. Five-star resorts, private tours, and unforgettable luxury.',
            'value_proposition': 'Complimentary upgrades and exclusive amenities'
        }
    }
    
    offer_data = offers_map.get(budget_tier, offers_map['budget-friendly'])
    
    return {
        'offer_id': f'offer_{datetime.now().strftime("%Y%m%d%H%M%S")}',
        'title': offer_data['title'],
        'description': offer_data['description'],
        'value_proposition': offer_data['value_proposition'],
        'valid_until': (datetime.now() + timedelta(days=14)).isoformat(),
        'terms': 'Offer valid for new subscribers. Terms and conditions apply.'
    }

def generate_offers(destinations, preferences, destination_id=None, budget=None):
    """Generate personalized travel offers"""
    offers = []
    
    # Filter destinations based on preferences
    if preferences.get('continents'):
        filtered = [d for d in destinations if d['continent'] in preferences['continents']]
    else:
        filtered = destinations
    
    if preferences.get('budget_tier'):
        filtered = [d for d in filtered if d['budget_tier'] == preferences['budget_tier']]
    
    # If specific destination requested
    if destination_id:
        filtered = [d for d in destinations if d['id'] == destination_id]
    
    # Select random destinations for offers
    random.shuffle(filtered)
    selected = filtered[:3]
    
    for dest in selected:
        offer = {
            'offer_id': f'offer_{dest["id"]}_{datetime.now().strftime("%Y%m%d")}',
            'destination': dest,
            'title': f'🎯 Limited Time: {dest["name"]} Adventure Deal',
            'description': f'Explore {dest["name"]} with exclusive savings! Experience {dest["highlights"][0]}, '
                          f'{dest["highlights"][1]}, and more. Best visited during {dest["best_season"]}.',
            'value_proposition': f'Save up to 30% on {dest["budget_tier"]} packages',
            'valid_until': (datetime.now() + timedelta(days=7)).isoformat(),
            'affiliate_link': '#'  # Placeholder for future monetization
        }
        offers.append(offer)
    
    return offers

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    app.run(debug=debug, port=port, host=host)
