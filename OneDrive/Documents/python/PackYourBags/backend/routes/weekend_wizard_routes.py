"""
Weekend Wizard Routes - API endpoints for Google Calendar integration and weekend trip planning
"""
from flask import Blueprint, jsonify, request  # pyright: ignore[reportMissingImports]
from services.google_calendar import google_calendar_service
from services.price_tracker import price_tracker
from services.onesignal import onesignal_service
from services.feature_flags import feature_flags_service
from services.posthog import posthog_service
from models import User, PriceWatch
from database import db
import logging
from datetime import datetime, timedelta

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
weekend_wizard_bp = Blueprint('weekend_wizard', __name__, url_prefix='/api/weekend-wizard')

@weekend_wizard_bp.route('/connect', methods=['POST'])
def connect_google_calendar():
    """
    Connect user's Google Calendar
    """
    try:
        # Check if feature is enabled
        if not feature_flags_service.is_enabled('weekend_wizard_enabled'):
            return jsonify({
                'success': False,
                'error': 'Weekend Wizard feature is currently disabled'
            }), 400
        
        data = request.get_json()
        user_id = data.get('user_id')
        token = data.get('token')
        
        if not user_id or not token:
            return jsonify({
                'success': False,
                'error': 'User ID and token are required'
            }), 400
        
        # Store encrypted token
        success = google_calendar_service.store_user_token(user_id, token)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Google Calendar connected successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to connect Google Calendar'
            }), 500
    
    except Exception as e:
        logger.error(f"Error connecting Google Calendar: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to connect Google Calendar'
        }), 500

@weekend_wizard_bp.route('/scan', methods=['POST'])
def scan_weekend():
    """
    Scan for next available 3-day weekend and find flight prices
    """
    try:
        # Check if feature is enabled
        if not feature_flags_service.is_enabled('weekend_wizard_enabled'):
            return jsonify({
                'success': False,
                'error': 'Weekend Wizard feature is currently disabled'
            }), 400
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        # Track analytics event
        posthog_service.track_weekend_scan_started(user_id)
        
        # Get user
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        # Check if user has home airport
        home_airport = user.preferences.get('home_airport_iata') if user.preferences else None
        if not home_airport:
            return jsonify({
                'success': False,
                'error': 'Home airport not set. Please update your profile with home_airport_iata.'
            }), 400
        
        # Find next free weekend
        weekend = google_calendar_service.find_free_weekend(user_id)
        if not weekend:
            return jsonify({
                'success': True,
                'message': 'No long weekends detected. Want us to scan public holidays?',
                'nextWeekend': None,
                'flights': []
            })
        
        # Get AI-recommended destinations (mock implementation)
        # In a real implementation, this would call the AI service
        recommended_destinations = [
            'PAR',  # Paris
            'ROM',  # Rome
            'LON',  # London
            'BER',  # Berlin
            'MAD'   # Madrid
        ]
        
        # Get flight prices for recommended destinations
        flights = google_calendar_service.get_flight_prices(
            home_airport,
            recommended_destinations,
            weekend['start_date'],
            weekend['end_date']
        )
        
        # Store cheapest price in price_watch table
        if flights:
            cheapest_flight = min(flights, key=lambda x: x['price'] if x['price'] else float('inf'))
            if cheapest_flight['price']:
                # Check if price watch already exists
                existing_watch = PriceWatch.query.filter_by(
                    user_id=user_id,
                    destination=cheapest_flight['destination']
                ).first()
                
                if existing_watch:
                    existing_watch.last_price = existing_watch.target_price
                    existing_watch.target_price = cheapest_flight['price']
                    if existing_watch.last_price:
                        existing_watch.pct_drop = int(
                            ((existing_watch.last_price - cheapest_flight['price']) / existing_watch.last_price) * 100
                        )
                else:
                    # Create new price watch
                    price_watch = PriceWatch(
                        user_id=user_id,
                        destination=cheapest_flight['destination'],
                        target_price=cheapest_flight['price'],
                        last_price=None,
                        pct_drop=None
                    )
                    db.session.add(price_watch)
                
                db.session.commit()
                
                # Send push notification on Monday 08:15 user-local-time
                # For now, we'll send it immediately for testing
                success = onesignal_service.send_weekend_alert(
                    user_id,
                    weekend['start_date'].split('T')[0],
                    cheapest_flight['destination'],
                    cheapest_flight['price']
                )
                
                # Track analytics event
                if success:
                    posthog_service.track_weekend_push_sent(
                        user_id,
                        cheapest_flight['destination'],
                        cheapest_flight['price']
                    )
        
        return jsonify({
            'success': True,
            'nextWeekend': weekend,
            'flights': flights
        })
    
    except Exception as e:
        logger.error(f"Error scanning weekend: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to scan for weekend'
        }), 500

@weekend_wizard_bp.route('/price-watch', methods=['POST'])
def toggle_price_watch():
    """
    Toggle price watch for a destination
    """
    try:
        # Check if feature is enabled
        if not feature_flags_service.is_enabled('weekend_wizard_enabled'):
            return jsonify({
                'success': False,
                'error': 'Weekend Wizard feature is currently disabled'
            }), 400
        
        data = request.get_json()
        user_id = data.get('user_id')
        destination = data.get('destination')
        watch_enabled = data.get('watch_enabled', True)
        
        if not user_id or not destination:
            return jsonify({
                'success': False,
                'error': 'User ID and destination are required'
            }), 400
        
        # Track analytics event
        posthog_service.track_watch_toggle_changed(user_id, destination, watch_enabled)
        
        if watch_enabled:
            # Create or update price watch
            existing_watch = PriceWatch.query.filter_by(
                user_id=user_id,
                destination=destination
            ).first()
            
            if not existing_watch:
                price_watch = PriceWatch(
                    user_id=user_id,
                    destination=destination,
                    target_price=None,
                    last_price=None,
                    pct_drop=None
                )
                db.session.add(price_watch)
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'Price watch enabled',
                    'watch': price_watch.to_dict()
                })
            else:
                return jsonify({
                    'success': True,
                    'message': 'Price watch already enabled',
                    'watch': existing_watch.to_dict()
                })
        else:
            # Remove price watch
            existing_watch = PriceWatch.query.filter_by(
                user_id=user_id,
                destination=destination
            ).first()
            
            if existing_watch:
                db.session.delete(existing_watch)
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'Price watch disabled'
                })
            else:
                return jsonify({
                    'success': True,
                    'message': 'Price watch was not enabled'
                })
    
    except Exception as e:
        logger.error(f"Error toggling price watch: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to toggle price watch'
        }), 500

@weekend_wizard_bp.route('/price-watch/check', methods=['POST'])
def check_price_drops():
    """
    Check for price drops on watched destinations
    """
    try:
        # Check if feature is enabled
        if not feature_flags_service.is_enabled('price_pulse_enabled'):
            return jsonify({
                'success': False,
                'error': 'Price Pulse feature is currently disabled'
            }), 400
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        # Get user's price watches
        price_watches = PriceWatch.query.filter_by(user_id=user_id).all()
        
        alerts = []
        
        for watch in price_watches:
            try:
                # Mock implementation - in real app, call Google Flights and Airbnb APIs
                # For now, we'll simulate price checking
                
                # Simulate flight price check
                current_price = watch.target_price or 1000  # Default if no previous price
                # Simulate 8% or more drop occasionally
                import random
                if random.random() < 0.3:  # 30% chance of a drop
                    new_price = int(current_price * random.uniform(0.85, 0.92))  # 8-15% drop
                    pct_drop = int(((current_price - new_price) / current_price) * 100)
                    
                    if pct_drop >= 8 and (not watch.target_price or new_price < watch.target_price):
                        alerts.append({
                            'destination': watch.destination,
                            'old_price': current_price,
                            'new_price': new_price,
                            'pct_drop': pct_drop,
                            'total_price': new_price + 300  # Simulated Airbnb cost
                        })
                        
                        # Send push notification
                        success = onesignal_service.send_price_drop_alert(
                            user_id,
                            watch.destination,
                            pct_drop,
                            new_price + 300
                        )
                        
                        # Track analytics event
                        if success:
                            posthog_service.track_price_drop_push_sent(
                                user_id,
                                watch.destination,
                                pct_drop,
                                new_price + 300
                            )
                        
                        # Update watch
                        watch.last_price = current_price
                        watch.target_price = new_price
                        watch.pct_drop = pct_drop
                        db.session.commit()
                        
            except Exception as e:
                logger.error(f"Error checking price for {watch.destination}: {str(e)}")
                continue
        
        return jsonify({
            'success': True,
            'alerts': alerts
        })
        
    except Exception as e:
        logger.error(f"Error checking price drops: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to check price drops'
        }), 500

@weekend_wizard_bp.route('/price-watch/mute', methods=['POST'])
def mute_price_alert():
    """
    Mute price alerts for a destination for 30 days
    """
    try:
        # Check if feature is enabled
        if not feature_flags_service.is_enabled('price_pulse_enabled'):
            return jsonify({
                'success': False,
                'error': 'Price Pulse feature is currently disabled'
            }), 400
        
        data = request.get_json()
        user_id = data.get('user_id')
        destination = data.get('destination')
        
        if not user_id or not destination:
            return jsonify({
                'success': False,
                'error': 'User ID and destination are required'
            }), 400
        
        # Find price watch
        watch = PriceWatch.query.filter_by(
            user_id=user_id,
            destination=destination
        ).first()
        
        if not watch:
            return jsonify({
                'success': False,
                'error': 'Price watch not found'
            }), 404
        
        # Set mute until 30 days from now
        watch.muted_until = datetime.utcnow().date() + timedelta(days=30)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Price alerts muted for 30 days'
        })
        
    except Exception as e:
        logger.error(f"Error muting price alert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to mute price alert'
        }), 500