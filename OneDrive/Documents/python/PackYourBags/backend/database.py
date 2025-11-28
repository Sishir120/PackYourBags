from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        # Import models here to avoid circular imports
        from models import User, Blog, Destination, Subscriber, Itinerary
        
        # Create tables if they don't exist (development only)
        if app.config['FLASK_ENV'] == 'development':
            db.create_all()
    
    return db
