from flask import Flask, jsonify, session, send_from_directory, request  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
from flask_jwt_extended import JWTManager  # pyright: ignore[reportMissingImports]
import os
from config import config
from database import init_db
from security import init_security
import json
from dotenv import load_dotenv  # pyright: ignore[reportMissingImports]
from datetime import datetime, timedelta

def create_app(config_name=None):
    """Application factory pattern"""
    
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Load environment variables
    load_dotenv()
    
    # CORS configuration
    # In production, replace with actual frontend URLs
    if app.debug:
        # Development: Allow all origins for local development
        allowed_origins = "*"
    else:
        allowed_origins = os.getenv('CORS_ORIGINS', '').split(',')

    # Initialize extensions
    CORS(app, 
         origins=allowed_origins,
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
         expose_headers=["X-CSRF-Token"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
    
    init_db(app)
    jwt = JWTManager(app)
    
    # Initialize security features
    try:
        limiter = init_security(app)
    except:
        limiter = None  # Skip if dependencies not installed
    
    # Register blueprints
    from routes.blog_routes import blog_bp
    from routes.ai_blog_routes import ai_blog_bp
    from routes.seo_routes import seo_bp
    from routes.auth_routes import auth_bp
    from routes.itinerary_routes import itinerary_bp
    from routes.personalization_routes import personalization_bp
    from routes.ai_chat_routes import ai_chat_bp
    from routes.contact_routes import contact_bp
    # Import Supabase auth routes
    from routes.supabase_auth_routes import supabase_auth_bp
    # Import subscription routes
    from routes.subscription_routes import subscription_bp
    # Import price tracker routes
    from routes.price_tracker_routes import price_tracker_bp
    # Import destination management routes
    from routes.destination_routes import destination_bp
    # Import quote request routes
    from routes.quote_routes import quote_bp
    # Import automation routes
    from routes.automation_routes import automation_bp
    # Import weekend wizard routes
    from routes.weekend_wizard_routes import weekend_wizard_bp

    app.register_blueprint(blog_bp)
    app.register_blueprint(ai_blog_bp)
    app.register_blueprint(seo_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(itinerary_bp)
    app.register_blueprint(personalization_bp)
    app.register_blueprint(ai_chat_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(supabase_auth_bp)  # Register Supabase auth routes
    app.register_blueprint(subscription_bp)  # Register subscription routes
    app.register_blueprint(price_tracker_bp)  # Register price tracker routes
    app.register_blueprint(destination_bp)  # Register destination management routes
    app.register_blueprint(quote_bp)  # Register quote request routes
    app.register_blueprint(automation_bp)  # Register automation routes
    app.register_blueprint(weekend_wizard_bp)  # Register weekend wizard routes
    
    # Import and register legacy routes (refactored)
    register_legacy_routes(app)
    
    # CSRF token endpoint
    @app.route('/api/csrf-token', methods=['GET'])
    def get_csrf_token():
        """Get CSRF token for frontend"""
        from csrf import get_csrf_token
        import secrets
        
        # Initialize session if needed
        if 'session_id' not in session:
            session['session_id'] = secrets.token_hex(16)
        
        token = get_csrf_token()
        
        return jsonify({
            "success": True,
            "csrf_token": token
        })
    
    # Serve frontend static files with proper MIME types
    @app.route('/assets/<path:filename>')
    def frontend_assets(filename):
        response = send_from_directory('../frontend_temp/dist/assets', filename)
        # Ensure proper MIME types for JavaScript modules
        if filename.endswith('.js'):
            response.headers['Content-Type'] = 'application/javascript'
        elif filename.endswith('.css'):
            response.headers['Content-Type'] = 'text/css'
        return response
    
    # Serve frontend index.html for all other routes (SPA support)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def frontend(path):
        # If the path is an API route, return 404
        if path.startswith('api/'):
            return jsonify({"error": "API endpoint not found"}), 404
        # Otherwise serve the frontend index.html
        return send_from_directory('../frontend_temp/dist', 'index.html')
    
    # Root endpoint
    @app.route('/api/')
    def home():
        return jsonify({
            "message": "PackYourBags API Server - Phase 2",
            "version": "2.0.0",
            "endpoints": {
                "legacy": [
                    "/api/destinations",
                    "/api/destination/<id>/details",
                    "/api/subscribe",
                    "/api/offers",
                    "/api/ai/chat",
                    "/api/ai/travel-plan"
                ],
                "blogs": [
                    "/api/blogs",
                    "/api/blogs/<slug>",
                    "/api/blogs/categories",
                    "/api/blogs/featured"
                ],
                "ai_blogs": [
                    "/api/ai/blogs/generate",
                    "/api/ai/blogs/bulk-generate",
                    "/api/ai/blogs/regenerate/<id>"
                ],
                "seo": [
                    "/sitemap.xml",
                    "/robots.txt",
                    "/api/seo/meta/<page_type>/<identifier>",
                    "/api/seo/stats"
                ],
                "auth": [
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/profile",
                    "/api/auth/subscription",
                    "/api/auth/subscription-status"
                ]
            }
        })
    
    return app

def register_legacy_routes(app):
    """Register refactored legacy routes using database"""
    from database import db  # type: ignore
    from models import Destination, Subscriber, Favorite, User  # type: ignore
    from ai_service import ai_service
    import random
    
    @app.route('/api/destinations', methods=['GET'])
    def get_destinations():
        """Retrieve destinations with optional filtering"""
        try:
            # Get query parameters
            filter_type = request.args.get('filter', 'global')
            filter_value = request.args.get('value', '')
            activity = request.args.get('activity', '')  # New parameter for activity filtering
            limit = int(request.args.get('limit', 20))
            
            # Build query
            query = Destination.query
            
            # Apply filters
            if filter_type == 'continent' and filter_value:
                query = query.filter_by(continent=filter_value)
            elif filter_type == 'country' and filter_value:
                query = query.filter_by(country=filter_value)
            
            # Apply activity filter if provided
            if activity:
                # For activity filtering, we'll search in highlights and description
                query = query.filter(
                    (Destination.highlights.contains(activity)) |
                    (Destination.description.contains(activity)) |
                    (Destination.name.contains(activity))
                )
            
            # Get results
            destinations = query.all()
            
            # Randomize and limit
            random.shuffle(destinations)
            result = [d.to_dict() for d in destinations[:limit]]
            
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
        """Get comprehensive details for a specific destination"""
        try:
            # Prevent processing undefined destination IDs
            if not destination_id or destination_id.lower() == 'undefined':
                return jsonify({
                    "success": False,
                    "error": "Invalid destination ID"
                }), 400
            
            destination = Destination.query.filter_by(destination_id=destination_id).first()
            
            if not destination:
                return jsonify({
                    "success": False,
                    "error": "Destination not found"
                }), 404
            
            dest_dict = destination.to_dict()
            
            # Find similar destinations
            similar = Destination.query.filter(
                (Destination.continent == destination.continent) |
                (Destination.budget_tier == destination.budget_tier)
            ).filter(Destination.id != destination.id).limit(3).all()
            
            dest_dict['similar_destinations'] = [d.to_dict() for d in similar]
            
            return jsonify({
                "success": True,
                "destination": dest_dict
            })
        
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    @app.route('/api/favorites', methods=['GET'])
    def get_favorites():
        """Get all favorites for a user"""
        try:
            # Get user_id from query parameters (in a real app, this would come from authentication)
            user_id = request.args.get('user_id')
            
            if not user_id:
                return jsonify({
                    "success": False,
                    "error": "User ID is required"
                }), 400
            
            # Get favorites for user
            favorites = Favorite.query.filter_by(user_id=user_id).all()
            
            # Convert to dictionary format
            favorites_list = [fav.to_dict() for fav in favorites]
            
            return jsonify({
                "success": True,
                "favorites": favorites_list,
                "count": len(favorites_list)
            })
        
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    @app.route('/api/favorites', methods=['POST'])
    def add_favorite():
        """Add a destination to user's favorites"""
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            destination_id = data.get('destination_id')
            
            if not user_id or not destination_id:
                return jsonify({
                    "success": False,
                    "error": "User ID and Destination ID are required"
                }), 400
            
            # Check if destination exists
            destination = Destination.query.filter_by(destination_id=destination_id).first()
            if not destination:
                return jsonify({
                    "success": False,
                    "error": "Destination not found"
                }), 404
            
            # Check if already favorited
            existing_favorite = Favorite.query.filter_by(
                user_id=user_id, 
                destination_id=destination_id
            ).first()
            
            if existing_favorite:
                return jsonify({
                    "success": False,
                    "error": "Destination already favorited"
                }), 400
            
            # Create new favorite
            favorite = Favorite(
                user_id=user_id,
                destination_id=destination_id
            )
            
            db.session.add(favorite)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": "Destination added to favorites",
                "favorite": favorite.to_dict()
            })
        
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    @app.route('/api/favorites/<favorite_id>', methods=['DELETE'])
    def remove_favorite(favorite_id):
        """Remove a destination from user's favorites"""
        try:
            # Get user_id from query parameters (in a real app, this would come from authentication)
            user_id = request.args.get('user_id')
            
            if not user_id:
                return jsonify({
                    "success": False,
                    "error": "User ID is required"
                }), 400
            
            # Find favorite
            favorite = Favorite.query.filter_by(
                id=favorite_id,
                user_id=user_id
            ).first()
            
            if not favorite:
                return jsonify({
                    "success": False,
                    "error": "Favorite not found"
                }), 404
            
            # Delete favorite
            db.session.delete(favorite)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": "Destination removed from favorites"
            })
        
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    @app.route('/api/subscribe', methods=['POST'])
    def subscribe():
        """Register user email and preferences"""
        try:
            data = request.get_json()
            email = data.get('email')
            preferences = data.get('preferences', {})
            
            if not email:
                return jsonify({
                    "success": False,
                    "error": "Email is required"
                }), 400
            
            # Check if subscriber exists
            subscriber = Subscriber.query.filter_by(email=email).first()
            
            if subscriber:
                # Update preferences
                subscriber.preferences = preferences
                message = "Preferences updated successfully"
                subscriber_id = subscriber.subscriber_id
            else:
                # Create new subscriber
                count = Subscriber.query.count()
                subscriber_id = f"sub_{count + 1:04d}"
                
                subscriber = Subscriber(
                    subscriber_id=subscriber_id,
                    email=email,
                    preferences=preferences
                )
                db.session.add(subscriber)
                message = "Subscription successful"
            
            db.session.commit()
            
            # Generate welcome offer
            welcome_offer = generate_welcome_offer(preferences)
            
            return jsonify({
                "success": True,
                "message": message,
                "subscriber_id": subscriber_id,
                "welcome_offer": welcome_offer
            })
        
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
    
    @app.route('/api/offers', methods=['GET'])
    def get_offers():
        """Generate personalized travel offers"""
        try:
            subscriber_id = request.args.get('subscriber_id')
            destination_id = request.args.get('destination_id')
            budget = request.args.get('budget')
            
            # Get subscriber preferences if available
            preferences = {}
            if subscriber_id:
                subscriber = Subscriber.query.filter_by(subscriber_id=subscriber_id).first()
                if subscriber:
                    preferences = subscriber.preferences
            
            # Get destinations
            query = Destination.query
            
            if preferences.get('continents'):
                query = query.filter(Destination.continent.in_(preferences['continents']))
            
            if preferences.get('budget_tier'):
                query = query.filter_by(budget_tier=preferences['budget_tier'])
            
            if destination_id:
                query = query.filter_by(destination_id=destination_id)
            
            destinations = query.limit(3).all()
            
            # Generate offers
            offers = []
            for dest in destinations:
                offer = {
                    'offer_id': f'offer_{dest.destination_id}_{datetime.utcnow().strftime("%Y%m%d")}',
                    'destination': dest.to_dict(),
                    'title': f'🎯 Limited Time: {dest.name} Adventure Deal',
                    'description': f'Explore {dest.name} with exclusive savings! Experience {dest.highlights[0] if dest.highlights else "amazing attractions"}.',
                    'value_proposition': f'Save up to 30% on {dest.budget_tier} packages',
                    'valid_until': (datetime.utcnow() + timedelta(days=7)).isoformat(),
                    'affiliate_link': '#'
                }
                offers.append(offer)
            
            return jsonify({
                "success": True,
                "offers": offers
            })
        
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500

    @app.route('/api/ai/chat', methods=['POST'])
    def ai_chat():
        """AI chat endpoint for travel questions (legacy compatibility)"""
        try:
            data = request.get_json()
            message = data.get('message')
            context = data.get('context', {})
            
            if not message:
                return jsonify({
                    "success": False,
                    "error": "Message is required"
                }), 400
            
            # Use the same AI service but without subscription checking for legacy compatibility
            response = ai_service.chat_with_ai(message, context)
            
            return jsonify({
                "success": True,
                "response": response,
                "timestamp": datetime.utcnow().isoformat()
            })
        
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500

    @app.route('/api/ai-chat', methods=['POST'])
    def ai_chat_frontend():
        """AI chat endpoint for frontend (Vercel compatibility)"""
        try:
            data = request.get_json()
            # Handle 'messages' array from frontend
            messages = data.get('messages', [])
            
            if not messages or not isinstance(messages, list):
                return jsonify({'error': 'Messages array is required'}), 400
                
            # Extract the last user message
            last_user_message = next((m['content'] for m in reversed(messages) if m['role'] == 'user'), None)
            
            if not last_user_message:
                return jsonify({'error': 'No user message found'}), 400
                
            # Call AI service
            response = ai_service.chat_with_ai(last_user_message)
            
            return jsonify({
                'choices': [
                    {
                        'message': {
                            'role': 'assistant',
                            'content': response
                        }
                    }
                ]
            })
        except Exception as e:
            print(f"Error in /api/ai-chat: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/ai/travel-plan', methods=['POST'])
    def generate_travel_plan():
        """Generate AI travel plan for a destination"""
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
            destination = Destination.query.filter_by(destination_id=destination_id).first()
            
            if not destination:
                return jsonify({
                    "success": False,
                    "error": "Destination not found"
                }), 404
            
            # Generate travel plan
            plan = ai_service.generate_travel_plan(destination.to_dict(), preferences)
            
            return jsonify(plan)
        
        except Exception as e:
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500

    def generate_welcome_offer(preferences):
        """Generate personalized welcome offer"""
        budget_tier = preferences.get('budget_tier', 'budget-friendly')
        continents = preferences.get('continents', ['Asia'])
        continent = continents[0] if continents else 'Asia'
        
        offers_map = {
            'budget-friendly': {
                'title': '🌟 Budget Explorer Special: Save 25% on Your First Adventure!',
                'description': f'Discover amazing {continent} destinations without breaking the bank.',
                'value_proposition': 'Up to 25% savings on budget-friendly destinations'
            },
            'mid-range': {
                'title': '✨ Comfort Traveler Exclusive: Premium Experience at Great Value',
                'description': f'Enjoy the perfect balance of comfort and value in {continent}.',
                'value_proposition': '20% off on selected mid-range packages'
            },
            'luxury': {
                'title': '👑 Luxury Escape: VIP Treatment Awaits',
                'description': f'Indulge in the finest {continent} has to offer.',
                'value_proposition': 'Complimentary upgrades and exclusive amenities'
            }
        }
        
        offer_data = offers_map.get(budget_tier, offers_map['budget-friendly'])
        
        return {
            'offer_id': f'offer_{datetime.utcnow().strftime("%Y%m%d%H%M%S")}',
            'title': offer_data['title'],
            'description': offer_data['description'],
            'value_proposition': offer_data['value_proposition'],
            'valid_until': (datetime.utcnow() + timedelta(days=14)).isoformat(),
            'terms': 'Offer valid for new subscribers. Terms and conditions apply.'
        }

def load_destinations_from_json():
    """Loads destination data from the JSON file."""
    with open('data/destinations.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def get_destinations():
    """API endpoint to get all travel destinations."""
    destinations = load_destinations_from_json()
    return jsonify(destinations)

if __name__ == '__main__':
    app = create_app()
    app.run(
        debug=app.config['DEBUG'],
        port=app.config['PORT'],
        host=app.config['HOST']
    )