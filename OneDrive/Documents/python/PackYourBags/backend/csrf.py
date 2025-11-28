"""
CSRF Protection for Flask API
"""
from flask import request, session, jsonify  # type: ignore
from functools import wraps  # type: ignore
import secrets  # type: ignore
from datetime import datetime, timedelta  # type: ignore

# Store CSRF tokens (in production, use Redis or similar)
csrf_tokens = {}

def generate_csrf_token():
    """Generate a new CSRF token"""
    return secrets.token_urlsafe(32)

def get_csrf_token():
    """Get or create CSRF token for session"""
    token_key = f"csrf_token_{session.get('session_id', 'default')}"
    
    if token_key not in csrf_tokens:
        csrf_tokens[token_key] = {
            'token': generate_csrf_token(),
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(hours=24)
        }
    
    token_data = csrf_tokens[token_key]
    
    # Check if token expired
    if datetime.utcnow() > token_data['expires_at']:
        csrf_tokens[token_key] = {
            'token': generate_csrf_token(),
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(hours=24)
        }
        token_data = csrf_tokens[token_key]
    
    return token_data['token']

def validate_csrf_token(token):
    """Validate CSRF token"""
    if not token:
        return False
    
    # Check all stored tokens
    for token_key, token_data in csrf_tokens.items():
        if token_data['token'] == token:
            # Check if expired
            if datetime.utcnow() > token_data['expires_at']:
                del csrf_tokens[token_key]
                return False
            return True
    
    return False

def csrf_protect(f):
    """Decorator to protect routes with CSRF"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip CSRF for GET, HEAD, OPTIONS
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return f(*args, **kwargs)
        
        # Get token from header
        token = request.headers.get('X-CSRF-Token')
        
        if not token:
            return jsonify({
                "success": False,
                "error": "CSRF token missing"
            }), 403
        
        if not validate_csrf_token(token):
            return jsonify({
                "success": False,
                "error": "Invalid CSRF token"
            }), 403
        
        return f(*args, **kwargs)
    return decorated_function

def cleanup_expired_tokens():
    """Clean up expired CSRF tokens"""
    now = datetime.utcnow()
    expired_keys = [
        key for key, data in csrf_tokens.items()
        if now > data['expires_at']
    ]
    for key in expired_keys:
        del csrf_tokens[key]

