#!/usr/bin/env python3
"""
IPL Analytics Dashboard Startup Script
This script starts both the Flask backend and provides instructions for the React frontend
"""

import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread

def install_requirements():
    """Install Python requirements"""
    print("🔧 Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Python requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing Python requirements: {e}")
        return False
    return True

def start_flask_server():
    """Start the Flask backend server"""
    print("🚀 Starting Flask backend server...")
    try:
        # Start Flask server
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n🛑 Flask server stopped.")
    except Exception as e:
        print(f"❌ Error starting Flask server: {e}")

def check_node_installation():
    """Check if Node.js is installed"""
    try:
        subprocess.check_output(["node", "--version"], stderr=subprocess.STDOUT)
        subprocess.check_output(["npm", "--version"], stderr=subprocess.STDOUT)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_node_dependencies():
    """Install Node.js dependencies"""
    print("🔧 Installing Node.js dependencies...")
    try:
        subprocess.check_call(["npm", "install"])
        print("✅ Node.js dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing Node.js dependencies: {e}")
        return False

def start_react_server():
    """Start the React development server"""
    print("🚀 Starting React frontend server...")
    try:
        subprocess.run(["npm", "start"])
    except KeyboardInterrupt:
        print("\n🛑 React server stopped.")
    except Exception as e:
        print(f"❌ Error starting React server: {e}")

def main():
    """Main startup function"""
    print("🏏 IPL Analytics Dashboard Startup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("app.py") or not os.path.exists("package.json"):
        print("❌ Please run this script from the project root directory.")
        return
    
    # Install Python requirements
    if not install_requirements():
        return
    
    # Check Node.js installation
    if not check_node_installation():
        print("❌ Node.js is not installed. Please install Node.js and npm first.")
        print("📥 Download from: https://nodejs.org/")
        return
    
    # Install Node.js dependencies
    if not install_node_dependencies():
        return
    
    print("\n🎉 Setup complete! Starting servers...")
    print("=" * 50)
    
    # Start Flask server in a separate thread
    flask_thread = Thread(target=start_flask_server, daemon=True)
    flask_thread.start()
    
    # Wait a moment for Flask to start
    time.sleep(3)
    
    # Start React server
    try:
        start_react_server()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
    
    print("\n👋 Thank you for using IPL Analytics Dashboard!")

if __name__ == "__main__":
    main()
