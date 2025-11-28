import subprocess
import time
import webbrowser
import threading

def start_backend():
    """Start the backend server"""
    print("Starting backend server...")
    backend_process = subprocess.Popen(
        ["python", "app.py"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return backend_process

def start_frontend():
    """Start the frontend server"""
    print("Starting frontend server...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd="frontend_temp",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return frontend_process

def monitor_process(process, name):
    """Monitor a process and print its output"""
    try:
        stdout, stderr = process.communicate()
        if stdout:
            print(f"{name} stdout: {stdout.decode()}")
        if stderr:
            print(f"{name} stderr: {stderr.decode()}")
    except Exception as e:
        print(f"Error monitoring {name}: {e}")

def main():
    print("Starting PackYourBags application...")
    
    # Start backend
    backend_process = start_backend()
    print("Backend server started on http://localhost:5000")
    
    # Wait a bit for backend to initialize
    time.sleep(5)
    
    # Start frontend
    frontend_process = start_frontend()
    print("Frontend server started on http://localhost:3000")
    
    print("\nApplication is running!")
    print("Backend: http://localhost:5000")
    print("Frontend: http://localhost:3000")
    print("\nPress Ctrl+C to stop the servers")
    
    try:
        # Monitor processes in separate threads
        backend_thread = threading.Thread(target=monitor_process, args=(backend_process, "Backend"))
        frontend_thread = threading.Thread(target=monitor_process, args=(frontend_process, "Frontend"))
        
        backend_thread.daemon = True
        frontend_thread.daemon = True
        
        backend_thread.start()
        frontend_thread.start()
        
        # Keep the main thread alive
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped.")

if __name__ == "__main__":
    main()