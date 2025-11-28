#!/usr/bin/env python3
"""
Script to expose your local PackYourBags application to the internet using ngrok.
This makes both your frontend and backend accessible online for testing and sharing.
"""

import subprocess
import sys
import time
import threading
import os
import requests
from pathlib import Path

def check_ngrok_installed():
    """Check if ngrok is installed and available in PATH"""
    try:
        result = subprocess.run(['ngrok', '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print(f"✓ ngrok is installed: {result.stdout.strip()}")
            return True
        else:
            print("✗ ngrok is not installed or not in PATH")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("✗ ngrok is not installed or not in PATH")
        return False

def install_ngrok_instructions():
    """Provide instructions to install ngrok"""
    print("\nTo install ngrok:")
    print("1. Visit https://ngrok.com/download")
    print("2. Download the Windows version")
    print("3. Extract and add ngrok.exe to your system PATH")
    print("   OR place it in this project directory")
    print("4. Sign up for a free account at https://ngrok.com/signup")
    print("5. Authenticate with: ngrok authtoken YOUR_AUTH_TOKEN")

def start_local_servers():
    """Start both frontend and backend servers"""
    print("Starting local servers...")
    
    # Start backend server
    backend_process = subprocess.Popen(
        ["python", "app.py"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    print("✓ Backend server started (port 5000)")
    
    # Wait a bit for backend to initialize
    time.sleep(3)
    
    # Start frontend server
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd="frontend_temp",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    print("✓ Frontend server started (port 3000)")
    
    return backend_process, frontend_process

def expose_with_ngrok():
    """Expose both servers using ngrok"""
    print("\nExposing servers with ngrok...")
    
    # Start ngrok for backend (port 5000)
    backend_ngrok = subprocess.Popen(
        ["ngrok", "http", "5000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Start ngrok for frontend (port 3000)
    frontend_ngrok = subprocess.Popen(
        ["ngrok", "http", "3000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    print("✓ ngrok processes started")
    print("Waiting for ngrok to establish connections...")
    
    # Give ngrok time to start
    time.sleep(5)
    
    # Try to get the public URLs
    try:
        # This is a simple approach - in practice, you might want to parse the ngrok API
        print("\nCheck the ngrok terminal windows for your public URLs")
        print("Typically:")
        print("- Backend will be at: https://xxxxxxx.ngrok.io (forwarding to localhost:5000)")
        print("- Frontend will be at: https://yyyyyyy.ngrok.io (forwarding to localhost:3000)")
        print("\nYou'll need to update your frontend configuration to point to the backend URL")
    except Exception as e:
        print(f"Could not retrieve ngrok URLs automatically: {e}")
        print("Check the ngrok terminal outputs for the public URLs")

def update_frontend_config(backend_url):
    """Update frontend configuration to point to the public backend URL"""
    env_file = Path("frontend_temp/.env")
    
    if env_file.exists():
        content = env_file.read_text()
        # Replace the API base URL
        updated_content = content.replace(
            "VITE_API_BASE_URL=http://localhost:5000/api",
            f"VITE_API_BASE_URL={backend_url}/api"
        )
        
        env_file.write_text(updated_content)
        print(f"✓ Updated frontend .env to use backend URL: {backend_url}")
        
        # Rebuild frontend
        print("Rebuilding frontend...")
        try:
            subprocess.run(["npm", "run", "build"], cwd="frontend_temp", check=True)
            print("✓ Frontend rebuilt successfully")
        except subprocess.CalledProcessError:
            print("⚠ Warning: Could not rebuild frontend. You may need to do this manually.")
    else:
        print("⚠ Frontend .env file not found")

def main():
    print("PackYourBags - Make Localhost Online")
    print("=" * 40)
    
    # Check if ngrok is installed
    if not check_ngrok_installed():
        install_ngrok_instructions()
        return
    
    try:
        # Start local servers
        backend_process, frontend_process = start_local_servers()
        
        # Expose with ngrok
        expose_with_ngrok()
        
        print("\n" + "=" * 50)
        print("YOUR APPLICATION IS NOW ACCESSIBLE ONLINE!")
        print("=" * 50)
        print("1. Check the ngrok terminal windows for public URLs")
        print("2. Update your frontend .env with the backend ngrok URL")
        print("3. Rebuild your frontend: cd frontend_temp && npm run build")
        print("\nPress Ctrl+C to stop all servers")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\nStopping servers...")
            backend_process.terminate()
            frontend_process.terminate()
            print("Servers stopped.")
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()