#!/usr/bin/env python3
"""Test backend server startup."""
import subprocess
import time
import sys
import requests

def test_server():
    """Start server briefly and test endpoint."""
    print("[INFO] Testing backend server startup...")
    
    # Start server in background
    proc = subprocess.Popen(
        ['uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Give server time to start
    print("[INFO] Waiting for server to start...")
    time.sleep(5)
    
    try:
        # Test health endpoint
        response = requests.get('http://localhost:8000/health', timeout=5)
        if response.status_code == 200:
            print("[OK] Server started successfully!")
            print(f"[OK] Health check: {response.json()}")
            return True
        else:
            print(f"[WARN] Server responded with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Could not connect to server: {e}")
        return False
    finally:
        # Stop server
        proc.terminate()
        proc.wait(timeout=3)
        print("[INFO] Server stopped.")

if __name__ == "__main__":
    success = test_server()
    sys.exit(0 if success else 1)
