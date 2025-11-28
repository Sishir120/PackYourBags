"""
Script to run the AI image columns migration within Flask app context
"""

import sys
import os
from sqlalchemy import text  # pyright: ignore[reportMissingImports]

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db

def run_migration():
    """Run the AI image columns migration"""
    app = create_app()
    
    with app.app_context():
        try:
            # Check if columns already exist
            result = db.session.execute(
                text("PRAGMA table_info(destinations)")
            )
            columns = [row[1] for row in result.fetchall()]
            
            # Add ai_image_url column if it doesn't exist
            if 'ai_image_url' not in columns:
                db.session.execute(
                    text('ALTER TABLE destinations ADD COLUMN ai_image_url VARCHAR(500)')
                )
                print("Added ai_image_url column")
            else:
                print("ai_image_url column already exists")
            
            # Add ai_images column if it doesn't exist
            if 'ai_images' not in columns:
                db.session.execute(
                    text('ALTER TABLE destinations ADD COLUMN ai_images JSON')
                )
                print("Added ai_images column")
            else:
                print("ai_images column already exists")
            
            db.session.commit()
            print("Successfully added AI image columns to destinations table")
        except Exception as e:
            print(f"Error running migration: {str(e)}")
            db.session.rollback()

if __name__ == "__main__":
    run_migration()