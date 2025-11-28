"""
Price Tracker Routes - API endpoints for price monitoring and deal alerts
"""
from flask import Blueprint, jsonify, request
from services.price_tracker import price_tracker
from models import User, Itinerary
from database import db
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
price_tracker_bp = Blueprint('price_tracker', __name__, url_prefix='/api/price-tracker')

@price_tracker_bp.route('/deals', methods=['GET'])
def get_deals():
    """
    Get price deals for the current user
    """
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        deals = price_tracker.get_user_deals(user_id)
        
        return jsonify({
            'success': True,
            'deals': deals,
            'count': len(deals)
        })
    
    except Exception as e:
        logger.error(f"Error fetching deals: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch deals'
        }), 500

@price_tracker_bp.route('/subscribe', methods=['POST'])
def subscribe_to_deals():
    """
    Subscribe to price deal alerts
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        destination_id = data.get('destination_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        success = price_tracker.subscribe_to_deals(user_id, destination_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Successfully subscribed to deal alerts'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to subscribe to deal alerts'
            }), 500
    
    except Exception as e:
        logger.error(f"Error subscribing to deals: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to subscribe to deal alerts'
        }), 500

@price_tracker_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe_from_deals():
    """
    Unsubscribe from price deal alerts
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        destination_id = data.get('destination_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        success = price_tracker.unsubscribe_from_deals(user_id, destination_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Successfully unsubscribed from deal alerts'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to unsubscribe from deal alerts'
            }), 500
    
    except Exception as e:
        logger.error(f"Error unsubscribing from deals: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to unsubscribe from deal alerts'
        }), 500

@price_tracker_bp.route('/check', methods=['POST'])
def check_prices():
    """
    Manually trigger price check for user's itineraries
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        deals = price_tracker.check_price_drops(user_id)
        
        return jsonify({
            'success': True,
            'deals': deals,
            'count': len(deals),
            'message': f'Found {len(deals)} deals'
        })
    
    except Exception as e:
        logger.error(f"Error checking prices: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to check prices'
        }), 500

@price_tracker_bp.route('/compare', methods=['POST'])
def compare_deals():
    """
    Compare multiple deals
    """
    try:
        data = request.get_json()
        deal_ids = data.get('deal_ids', [])
        
        if not deal_ids:
            return jsonify({
                'success': False,
                'error': 'Deal IDs are required'
            }), 400
        
        comparison = price_tracker.compare_deals(deal_ids)
        
        return jsonify({
            'success': True,
            'comparison': comparison
        })
    
    except Exception as e:
        logger.error(f"Error comparing deals: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to compare deals'
        }), 500

@price_tracker_bp.route('/history', methods=['GET'])
def get_deal_history():
    """
    Get price history for deals
    """
    try:
        user_id = request.args.get('user_id')
        destination_id = request.args.get('destination_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'User ID is required'
            }), 400
        
        history = price_tracker.get_deal_history(user_id, destination_id)
        
        return jsonify({
            'success': True,
            'history': history
        })
    
    except Exception as e:
        logger.error(f"Error fetching deal history: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch deal history'
        }), 500

@price_tracker_bp.route('/ai-analysis/<int:deal_id>', methods=['GET'])
def get_deal_ai_analysis(deal_id):
    """
    Get AI analysis for a specific deal (placeholder for future implementation)
    In a full implementation, this would retrieve stored AI analysis for a deal
    """
    try:
        # This is a placeholder - in a real implementation, we would retrieve
        # the deal from a database and return its AI analysis
        return jsonify({
            'success': True,
            'message': 'AI analysis endpoint ready for implementation',
            'deal_id': deal_id
        })
    except Exception as e:
        logger.error(f"Error getting AI analysis for deal {deal_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get AI analysis'
        }), 500