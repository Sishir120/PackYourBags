from flask import Blueprint, jsonify, request  # type: ignore
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt  # type: ignore
from database import db  # type: ignore
from models import User  # type: ignore
from datetime import datetime, timedelta  # type: ignore
from validators import InputValidator, require_json  # type: ignore
import re  # type: ignore

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
@require_json('email', 'password')
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password')
        name = data.get('name', '').strip()
        
        # Validate email
        if not InputValidator.validate_email(email):
            return jsonify({
                "success": False,
                "error": "Invalid email format"
            }), 400
        
        # Validate password
        is_valid, msg = InputValidator.validate_password(password)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": msg
            }), 400
        
        # Sanitize name
        if name:
            name = InputValidator.sanitize_html(name)
        
        # Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({
                "success": False,
                "error": "Email already registered"
            }), 400
        
        # Create new user
        user = User(email=email, name=name)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id), fresh=True)
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": user.to_dict(include_sensitive=True),
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
@require_json('email', 'password')
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password')
        
        # Validate email format
        if not InputValidator.validate_email(email):
            return jsonify({
                "success": False,
                "error": "Invalid credentials"
            }), 401
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                "success": False,
                "error": "Invalid email or password"
            }), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id), fresh=True)
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user.to_dict(include_sensitive=True),
            "access_token": access_token,
            "refresh_token": refresh_token
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        identity = int(get_jwt_identity())
        access_token = create_access_token(identity=identity, fresh=False)
        
        return jsonify({
            "success": True,
            "access_token": access_token
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        return jsonify({
            "success": True,
            "user": user.to_dict(include_sensitive=True)
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            user.name = data['name']
        
        if 'preferences' in data:
            user.preferences = data['preferences']
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Profile updated successfully",
            "user": user.to_dict(include_sensitive=True)
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.route('/travel-history', methods=['POST'])
@jwt_required()
def add_travel_history():
    """Add to travel history"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        data = request.get_json()
        
        # Add to travel history
        if not user.travel_history:
            user.travel_history = []
        
        history_entry = {
            "destination_id": data.get('destination_id'),
            "visited_at": datetime.utcnow().isoformat(),
            "rating": data.get('rating'),
            "notes": data.get('notes')
        }
        
        user.travel_history.append(history_entry)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Travel history updated",
            "travel_history": user.travel_history
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update user settings including email preferences and notifications"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        data = request.get_json()
        
        # Update email preferences
        if 'email_preferences' in data:
            email_prefs = data['email_preferences']
            if not user.preferences:
                user.preferences = {}
            user.preferences['email'] = email_prefs
        
        # Update notification preferences
        if 'notifications' in data:
            notifications = data['notifications']
            if not user.preferences:
                user.preferences = {}
            user.preferences['notifications'] = notifications
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Settings updated successfully",
            "preferences": user.preferences
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        # Validate input
        if not current_password or not new_password:
            return jsonify({
                "success": False,
                "error": "Current password and new password are required"
            }), 400
        
        # Check current password
        if not user.check_password(current_password):
            return jsonify({
                "success": False,
                "error": "Current password is incorrect"
            }), 400
        
        # Validate new password
        is_valid, msg = InputValidator.validate_password(new_password)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": msg
            }), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Password changed successfully"
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
