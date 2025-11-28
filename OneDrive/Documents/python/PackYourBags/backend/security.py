"""
Security Configuration and Rate Limiting
"""
import os
import secrets

# Note: The following imports may show as errors in some linters due to packages being installed
# in user directories, but they are correctly installed and functional.
from flask_limiter import Limiter  # type: ignore
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman  # type: ignore

class SecurityConfig:
    """Security settings for the application"""
    
    # Rate limiting
    RATELIMIT_STORAGE_URL = "memory://"
    RATELIMIT_DEFAULT = "100 per hour"
    RATELIMIT_AUTH = "5 per minute"
    
    # Session security
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # CSRF Protection
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None
    
    # Content Security Policy - Enhanced for production
    CSP = {
        'default-src': "'self'",
        'script-src': [
            "'self'",
            "'unsafe-inline'",  # Required for Vite in development
            "'unsafe-eval'",     # Required for Vite in development (remove in production if possible)
            "https://cdn.jsdelivr.net",
            "https://browser.sentry-cdn.com"  # Sentry
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'",  # Required for Tailwind CSS
            "https://fonts.googleapis.com"
        ],
        'font-src': [
            "'self'",
            "https://fonts.gstatic.com",
            "data:"
        ],
        'img-src': [
            "'self'",
            "data:",
            "https:",
            "blob:"
        ],
        'connect-src': [
            "'self'",
            "https://api.openrouter.ai",
            "https://*.sentry.io",  # Sentry
            "https://o4507076168933376.ingest.us.sentry.io"  # Sentry endpoint
        ],
        'frame-src': "'none'",
        'object-src': "'none'",
        'base-uri': "'self'",
        'form-action': "'self'",
        'frame-ancestors': "'none'",
        'upgrade-insecure-requests': ''
    }
    
    @staticmethod
    def generate_secret_key():
        """Generate a secure secret key"""
        return secrets.token_hex(32)

def init_security(app):
    """Initialize security features"""
    
    # Rate limiter - more generous limits for development
    if app.debug:
        # Very high limits for development to avoid rate limiting issues
        default_limits = ["1000 per minute"]
    else:
        # Production limits
        default_limits = ["200 per day", "50 per hour"]
    
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=default_limits,
        storage_uri="memory://"
    )
    
    # Security headers
    # In production, always enforce HTTPS and strict security
    # In development, be more lenient but still set security headers
    force_https = not app.debug and os.getenv('FORCE_HTTPS', 'true').lower() == 'true'
    
    Talisman(app,
        force_https=force_https,
        strict_transport_security=not app.debug,  # HSTS only in production
        strict_transport_security_max_age=31536000,  # 1 year
        strict_transport_security_include_subdomains=True,
        content_security_policy=SecurityConfig.CSP if not app.debug else None,  # CSP only in production
        content_security_policy_nonce_in=['script-src', 'style-src'],
        referrer_policy='strict-origin-when-cross-origin',
        feature_policy={
            'geolocation': "'none'",
            'notifications': "'none'",
            'push': "'none'",
            'sync-xhr': "'none'"
        }
    )
    
    return limiter
