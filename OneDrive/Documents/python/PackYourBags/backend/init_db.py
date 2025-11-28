"""
Database initialization script
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db

def init_database():
    """Initialize the database tables"""
    print("Initializing database tables...")
    
    # Create app context
    app = create_app()
    
    # Create all tables
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

if __name__ == "__main__":
    init_database()