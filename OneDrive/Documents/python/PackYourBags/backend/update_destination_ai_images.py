"""
Script to update destinations with AI-generated images and cache the URLs
"""

import json
import os
import sys
from typing import Dict, List

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Flask app context
from app import create_app
from models import Destination, db
from ai_image_prompts import generate_ai_image_prompt

# Import OpenAI for image generation
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("OpenAI library not available. Using placeholder images.")

def generate_ai_image(prompt: str) -> str:
    """
    Generate an AI image using DALL-E and return the URL
    
    Args:
        prompt: The prompt to use for image generation
        
    Returns:
        URL of the generated image or a placeholder if generation fails
    """
    # If OpenAI is not available, return a placeholder
    if not OPENAI_AVAILABLE:
        return "https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80"
    
    try:
        # Get API key from environment
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("OPENAI_API_KEY not set. Using placeholder image.")
            return "https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80"
        
        client = OpenAI(api_key=api_key)
        
        # Generate image
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard"
        )
        
        # Return the URL of the generated image
        return response.data[0].url
    except Exception as e:
        print(f"Error generating AI image: {str(e)}")
        # Return a placeholder image on error
        return "https://images.unsplash.com/photo-1473496169904-6586040d009a?w=1200&q=80"

def update_destination_ai_images():
    """Update destinations with AI-generated images"""
    # Create Flask app
    app = create_app()
    
    # Update destinations within app context
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        print(f"Found {len(destinations)} destinations to update with AI images")
        
        # Load existing AI image cache if it exists
        ai_image_cache = {}
        cache_file = 'data/ai_image_cache.json'
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r') as f:
                    ai_image_cache = json.load(f)
                print(f"Loaded {len(ai_image_cache)} cached AI images")
            except Exception as e:
                print(f"Error loading AI image cache: {str(e)}")
        
        updated_count = 0
        generated_count = 0
        cached_count = 0
        
        for destination in destinations:
            try:
                # Check if we already have a cached AI image for this destination
                dest_id = destination.id
                if dest_id in ai_image_cache:
                    # Use cached image
                    destination.ai_image_url = ai_image_cache[dest_id]
                    cached_count += 1
                    print(f"Using cached AI image for: {destination.name}")
                else:
                    # Generate AI image prompt
                    prompt = generate_ai_image_prompt({
                        'name': destination.name,
                        'country': destination.country,
                        'highlights': destination.highlights or []
                    })
                    
                    print(f"Generating AI image for: {destination.name}")
                    print(f"Prompt: {prompt}")
                    
                    # Generate AI image
                    ai_image_url = generate_ai_image(prompt)
                    
                    # Update destination with AI image URL
                    destination.ai_image_url = ai_image_url
                    
                    # Cache the URL
                    ai_image_cache[dest_id] = ai_image_url
                    generated_count += 1
                    
                    # Save cache every 5 images to avoid losing progress
                    if generated_count % 5 == 0:
                        try:
                            with open(cache_file, 'w') as f:
                                json.dump(ai_image_cache, f, indent=2)
                            print(f"Saved AI image cache with {len(ai_image_cache)} entries")
                        except Exception as e:
                            print(f"Error saving AI image cache: {str(e)}")
                
                # Commit the changes
                db.session.add(destination)
                updated_count += 1
                print(f"Updated AI image for: {destination.name}")
                
            except Exception as e:
                print(f"Error updating AI image for {destination.name}: {str(e)}")
                continue
        
        # Commit all changes
        try:
            db.session.commit()
            print(f"Successfully updated AI images for {updated_count} destinations")
            print(f"Generated: {generated_count}, Cached: {cached_count}")
            
            # Save final cache
            try:
                with open(cache_file, 'w') as f:
                    json.dump(ai_image_cache, f, indent=2)
                print(f"Final AI image cache saved with {len(ai_image_cache)} entries")
            except Exception as e:
                print(f"Error saving final AI image cache: {str(e)}")
                
        except Exception as e:
            db.session.rollback()
            print(f"Error committing changes: {str(e)}")

def update_destination_with_multiple_ai_images():
    """Update destinations with multiple AI-generated images"""
    # Create Flask app
    app = create_app()
    
    # Update destinations within app context
    with app.app_context():
        # Get all destinations
        destinations = Destination.query.all()
        print(f"Found {len(destinations)} destinations to update with multiple AI images")
        
        # Load existing AI image cache if it exists
        ai_image_cache = {}
        cache_file = 'data/ai_image_cache_multi.json'
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r') as f:
                    ai_image_cache = json.load(f)
                print(f"Loaded {len(ai_image_cache)} cached AI image sets")
            except Exception as e:
                print(f"Error loading AI image cache: {str(e)}")
        
        updated_count = 0
        generated_count = 0
        cached_count = 0
        
        for destination in destinations:
            try:
                # Check if we already have cached AI images for this destination
                dest_id = destination.id
                if dest_id in ai_image_cache:
                    # Use cached images
                    destination.ai_images = ai_image_cache[dest_id]
                    cached_count += 1
                    print(f"Using cached AI images for: {destination.name}")
                else:
                    # Generate 3 AI images for each destination
                    ai_images = []
                    for i in range(3):
                        # Generate AI image prompt
                        prompt = generate_ai_image_prompt({
                            'name': destination.name,
                            'country': destination.country,
                            'highlights': destination.highlights or []
                        })
                        
                        print(f"Generating AI image {i+1}/3 for: {destination.name}")
                        print(f"Prompt: {prompt}")
                        
                        # Generate AI image
                        ai_image_url = generate_ai_image(prompt)
                        ai_images.append(ai_image_url)
                    
                    # Update destination with AI images
                    destination.ai_images = ai_images
                    
                    # Cache the URLs
                    ai_image_cache[dest_id] = ai_images
                    generated_count += 1
                    
                    # Save cache every 3 destinations to avoid losing progress
                    if generated_count % 3 == 0:
                        try:
                            with open(cache_file, 'w') as f:
                                json.dump(ai_image_cache, f, indent=2)
                            print(f"Saved AI image cache with {len(ai_image_cache)} entries")
                        except Exception as e:
                            print(f"Error saving AI image cache: {str(e)}")
                
                # Commit the changes
                db.session.add(destination)
                updated_count += 1
                print(f"Updated AI images for: {destination.name}")
                
            except Exception as e:
                print(f"Error updating AI images for {destination.name}: {str(e)}")
                continue
        
        # Commit all changes
        try:
            db.session.commit()
            print(f"Successfully updated AI images for {updated_count} destinations")
            print(f"Generated: {generated_count}, Cached: {cached_count}")
            
            # Save final cache
            try:
                with open(cache_file, 'w') as f:
                    json.dump(ai_image_cache, f, indent=2)
                print(f"Final AI image cache saved with {len(ai_image_cache)} entries")
            except Exception as e:
                print(f"Error saving final AI image cache: {str(e)}")
                
        except Exception as e:
            db.session.rollback()
            print(f"Error committing changes: {str(e)}")

if __name__ == "__main__":
    # Check if we want to update with single or multiple images
    import argparse
    parser = argparse.ArgumentParser(description='Update destinations with AI-generated images')
    parser.add_argument('--multi', action='store_true', help='Generate multiple images per destination')
    args = parser.parse_args()
    
    if args.multi:
        update_destination_with_multiple_ai_images()
    else:
        update_destination_ai_images()