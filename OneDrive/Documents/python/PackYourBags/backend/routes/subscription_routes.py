from flask import Blueprint, jsonify, request  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity  # type: ignore
from database import db  # type: ignore
from models import User, Subscriber  # type: ignore
from datetime import datetime, timedelta
import json

subscription_bp = Blueprint('subscription', __name__, url_prefix='/api/subscription')

@subscription_bp.route('/plans', methods=['GET'])
def get_subscription_plans():
    """Get available subscription plans"""
    plans = {
        "success": True,
        "plans": {
            "free": {
                "name": "Free",
                "price": 0,
                "period": "month",
                "features": [
                    "10 AI questions per month",
                    "Basic destination recommendations",
                    "Travel tips and advice",
                    "Budget suggestions"
                ],
                "ai_credits": 10,
                "model_access": ["gpt-3.5-turbo"]
            },
            "premium": {
                "name": "Premium",
                "price": 9.99,
                "period": "month",
                "features": [
                    "Unlimited AI conversations",
                    "Detailed itinerary planning",
                    "Priority response times",
                    "Personalized recommendations",
                    "Access to premium AI models"
                ],
                "ai_credits": "unlimited",
                "model_access": ["gpt-3.5-turbo", "gpt-4", "claude-3"]
            },
            "travelpro_special": {
                "name": "TravelPro Special",
                "price": 14.99,
                "period": "month",
                "features": [
                    "Unlimited TravelPro AI conversations",
                    "Specialized travel knowledge base",
                    "Enhanced reasoning capabilities",
                    "Code and technical travel solutions",
                    "Priority for TravelPro model"
                ],
                "ai_credits": "unlimited",
                "model_access": ["travelpro-chat"]
            }
        }
    }
    return jsonify(plans)

@subscription_bp.route('/status', methods=['GET'])
@jwt_required()
def get_subscription_status():
    """Get user's subscription status"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        is_premium = user.subscription_tier == 'premium'
        is_travelpro = user.subscription_tier == 'travelpro'
        
        status = {
            "success": True,
            "subscription": {
                "tier": user.subscription_tier,
                "credits": "unlimited" if (is_premium or is_travelpro) else user.ai_credits,
                "total_queries": user.total_ai_queries,
                "is_premium": is_premium,
                "is_travelpro": is_travelpro,
                "expires": user.subscription_expires.isoformat() if user.subscription_expires else None
            }
        }
        
        return jsonify(status)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@subscription_bp.route('/upgrade', methods=['POST'])
@jwt_required()
def upgrade_subscription():
    """Upgrade user's subscription"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        data = request.get_json()
        tier = data.get('tier', 'premium')
        
        # Validate tier
        valid_tiers = ['free', 'premium', 'travelpro']
        if tier not in valid_tiers:
            return jsonify({
                "success": False,
                "error": f"Invalid tier. Valid options: {', '.join(valid_tiers)}"
            }), 400
        
        # Update user subscription
        user.subscription_tier = tier
        if tier in ['premium', 'travelpro']:
            user.subscription_expires = datetime.utcnow() + timedelta(days=30)
            # For premium tiers, set effectively unlimited credits
            user.ai_credits = 999999
        else:
            user.subscription_expires = None
            # Reset to default free credits if downgrading
            if tier == 'free':
                user.ai_credits = 10
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Subscription upgraded to {tier}",
            "subscription": {
                "tier": user.subscription_tier,
                "credits": "unlimited" if tier in ['premium', 'travelpro'] else user.ai_credits,
                "expires": user.subscription_expires.isoformat() if user.subscription_expires else None
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@subscription_bp.route('/webhook', methods=['POST'])
def subscription_webhook():
    """Handle subscription payment webhooks (simplified)"""
    try:
        data = request.get_json()
        # In a real implementation, you would verify the webhook signature
        # and process the payment information
        
        # This is a simplified version for demonstration
        return jsonify({
            "success": True,
            "message": "Webhook received"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500