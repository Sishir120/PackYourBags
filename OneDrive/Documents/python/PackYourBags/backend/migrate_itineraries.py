"""
Migration script to add new columns to the itineraries table
"""
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db

def migrate_itineraries_table():
    """Add new columns to the itineraries table"""
    print("Migrating itineraries table...")
    
    # Create app context
    app = create_app()
    
    with app.app_context():
        try:
            # Add new columns to itineraries table
            columns_to_add = [
                ('notes', 'TEXT'),
                ('tags', 'JSON'),
                ('is_public', 'BOOLEAN DEFAULT 0')
            ]
            
            for column_name, column_type in columns_to_add:
                try:
                    # Use raw SQL execution
                    sql = f'ALTER TABLE itineraries ADD COLUMN {column_name} {column_type}'
                    db.session.execute(db.text(sql))
                    print(f"Added {column_name} column")
                except Exception as e:
                    print(f"{column_name} column may already exist: {e}")
            
            db.session.commit()
            print("Migration completed successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate_itineraries_table()