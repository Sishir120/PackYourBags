from flask import Blueprint, jsonify, request  # pyright: ignore[reportMissingImports]
from services.supabase_service import supabase_service
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity  # pyright: ignore[reportMissingImports]

supabase_auth_bp = Blueprint('supabase_auth', __name__, url_prefix='/api/auth')

@supabase_auth_bp.route('/login', methods=['POST'])
def login():
    """Login with email and password using Supabase"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                "success": False,
                "error": "Email and password are required"
            }), 400
        
        # Authenticate with Supabase
        result = supabase_service.authenticate_user(email, password)
        
        if not result["success"]:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 401
        
        user = result["user"]
        session = result["session"]
        
        # Create JWT token for our app
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            "success": True,
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": getattr(user, 'user_metadata', {}).get('name', '')
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@supabase_auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with Supabase"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name', '')
        
        if not email or not password:
            return jsonify({
                "success": False,
                "error": "Email and password are required"
            }), 400
        
        # Register with Supabase
        result = supabase_service.register_user(email, password, name)
        
        if not result["success"]:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 400
        
        user = result["user"]
        session = result["session"]
        
        # Create JWT token for our app
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            "success": True,
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": name
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@supabase_auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile information"""
    try:
        user_id = get_jwt_identity()
        
        # Get user profile from Supabase
        result = supabase_service.get_user_profile(user_id)
        
        if not result["success"]:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 404
        
        user = result["user"]

        if isinstance(user, dict):
            user_data = {
                "id": user.get("id"),
                "email": user.get("email"),
                "name": user.get("name", ""),
                "subscription_tier": user.get("subscription_tier", "free"),
                "ai_credits": user.get("ai_credits", 10),
                "total_ai_queries": user.get("total_ai_queries", 0)
            }
        else:
            user_data = {
                "id": user.id,
                "email": user.email,
                "name": getattr(user, 'name', ''),
                "subscription_tier": getattr(user, 'subscription_tier', 'free'),
                "ai_credits": getattr(user, 'ai_credits', 10),
                "total_ai_queries": getattr(user, 'total_ai_queries', 0)
            }

        return jsonify({
            "success": True,
            "user": user_data
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@supabase_auth_bp.route('/subscription', methods=['POST'])
@jwt_required()
def upgrade_subscription():
    """Upgrade user's subscription"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        tier = data.get('tier', 'premium')
        
        # Upgrade subscription in Supabase
        result = supabase_service.upgrade_subscription(user_id, tier)
        
        if not result["success"]:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 400
        
        return jsonify({
            "success": True,
            "message": result["message"]
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@supabase_auth_bp.route('/subscription-status', methods=['GET'])
@jwt_required()
def get_subscription_status():
    """Get user's subscription status"""
    try:
        user_id = get_jwt_identity()
        
        # Get subscription status from Supabase
        result = supabase_service.get_subscription_status(user_id)
        
        if not result["success"]:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 404
        
        return jsonify({
            "success": True,
            "subscription": result
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500