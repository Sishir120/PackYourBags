import os  # type: ignore
from datetime import timedelta
from dotenv import load_dotenv  # type: ignore

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Database Configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///packyourbags.db')
    
    # PostgreSQL configuration (production)
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')
    
    # Flask Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Server Configuration (bind to localhost in dev, configurable in production)
    HOST = os.getenv('HOST', '127.0.0.1' if os.getenv('FLASK_ENV') == 'development' else '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    
    # AI Configuration
    AI_API_KEY = os.getenv('AI_API_KEY') or os.getenv('OPENROUTER_API_KEY')
    AI_PROVIDER = os.getenv('AI_PROVIDER', 'openai')
    AI_MODEL = os.getenv('AI_MODEL', 'gpt-4-turbo-preview')
    
    # Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # SEO Configuration
    SITE_NAME = 'PackYourBags'
    SITE_URL = os.getenv('SITE_URL', 'http://localhost:3000')
    SITE_DESCRIPTION = 'AI-Powered Travel Discovery & Planning Platform'
    
    # Pagination
    POSTS_PER_PAGE = 12
    
    # Session Configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_ECHO = False
    
    # Ensure these are set in production
    SECRET_KEY = os.getenv('SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY must be set in production")

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}