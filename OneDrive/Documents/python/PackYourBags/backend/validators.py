"""
Input validation and sanitization
"""
import re
from flask import abort  # type: ignore
from functools import wraps
import bleach  # type: ignore

class InputValidator:
    """Validate and sanitize user inputs"""
    
    EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    PASSWORD_MIN_LENGTH = 8
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        if not email or not isinstance(email, str):
            return False
        return bool(InputValidator.EMAIL_REGEX.match(email))
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if not password or not isinstance(password, str):
            return False, "Password is required"
        
        if len(password) < InputValidator.PASSWORD_MIN_LENGTH:
            return False, f"Password must be at least {InputValidator.PASSWORD_MIN_LENGTH} characters"
        
        # Check for at least one uppercase, lowercase, and digit
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one digit"
        
        return True, "Valid"
    
    @staticmethod
    def sanitize_html(text):
        """Remove potentially dangerous HTML"""
        if not text:
            return text
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']
        allowed_attrs = {'a': ['href', 'title']}
        return bleach.clean(text, tags=allowed_tags, attributes=allowed_attrs, strip=True)
    
    @staticmethod
    def validate_json_keys(data, required_keys, optional_keys=None):
        """Validate JSON input has required keys and only allowed keys"""
        if not isinstance(data, dict):
            return False, "Input must be a JSON object"
        
        # Check required keys
        missing = set(required_keys) - set(data.keys())
        if missing:
            return False, f"Missing required fields: {', '.join(missing)}"
        
        # Check for unexpected keys
        allowed = set(required_keys)
        if optional_keys:
            allowed.update(optional_keys)
        
        unexpected = set(data.keys()) - allowed
        if unexpected:
            return False, f"Unexpected fields: {', '.join(unexpected)}"
        
        return True, "Valid"

def require_json(*required_keys):
    """Decorator to validate JSON input"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            from flask import request, jsonify  # type: ignore
            
            if not request.is_json:
                return jsonify({"success": False, "error": "Content-Type must be application/json"}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({"success": False, "error": "Request body is empty"}), 400
            
            # Check required keys
            missing = set(required_keys) - set(data.keys())
            if missing:
                return jsonify({
                    "success": False,
                    "error": f"Missing required fields: {', '.join(missing)}"
                }), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
