"""
Script to run the destination management tool
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    print("PackYourBags Destination Management Tool")
    print("=" * 50)
    
    # Import and run the main destination manager
    try:
        from worldwide_destinations_manager import main as destination_manager_main
        destination_manager_main()
    except ImportError as e:
        print(f"Error importing destination manager: {e}")
        print("Make sure you're running this script from the backend directory")

if __name__ == "__main__":
    main()