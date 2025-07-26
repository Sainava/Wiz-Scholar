#!/usr/bin/env python3
"""
Verification script to test Wiz-Scholar integration
"""
import requests
import time
import subprocess
import sys
import os

def check_port(port, service_name):
    """Check if a port is available"""
    try:
        response = requests.get(f"http://localhost:{port}/health" if port == 8001 else f"http://localhost:{port}", timeout=5)
        print(f"✅ {service_name} (port {port}): Online")
        return True
    except:
        print(f"❌ {service_name} (port {port}): Offline")
        return False

def check_ai_endpoints():
    """Test AI server endpoints"""
    base_url = "http://localhost:8001"
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ AI Server health check: OK")
        
        # Test sorting hat start endpoint
        response = requests.post(
            f"{base_url}/api/sorting-hat/start",
            json={"session_id": "test-session"},
            timeout=10
        )
        if response.status_code == 200:
            print("✅ Sorting Hat start endpoint: OK")
            return True
        else:
            print(f"❌ Sorting Hat start endpoint: Failed ({response.status_code})")
            return False
            
    except Exception as e:
        print(f"❌ AI Server endpoints: Error - {e}")
        return False

def main():
    print("🔍 Wiz-Scholar Integration Verification")
    print("=" * 50)
    
    # Check if required files exist
    required_files = [
        "wiz-scholar-landing-page/package.json",
        "wiz-scholar-landing-page/src/components/SortingHat.jsx",
        "wiz-scholar-landing-page/src/App.jsx",
        "ai_server/main.py",
        "ai_server/requirements.txt",
        "Sorting_Hat/enhanced_sorting_hat_model.joblib",
        "Sorting_Hat/structured_questions.json"
    ]
    
    print("\n📁 File Structure Check:")
    all_files_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path}")
            all_files_exist = False
    
    if not all_files_exist:
        print("\n⚠️  Some required files are missing!")
        return
    
    print("\n🌐 Server Status Check:")
    frontend_ok = check_port(5173, "Frontend (Vite)")
    ai_server_ok = check_port(8001, "AI Server (FastAPI)")
    
    if ai_server_ok:
        print("\n🤖 AI Endpoints Check:")
        check_ai_endpoints()
    
    print("\n📋 Integration Summary:")
    print(f"Frontend Ready: {'✅' if frontend_ok else '❌'}")
    print(f"AI Server Ready: {'✅' if ai_server_ok else '❌'}")
    print(f"Files Complete: {'✅' if all_files_exist else '❌'}")
    
    if frontend_ok and ai_server_ok and all_files_exist:
        print("\n🎉 SUCCESS! Your integration is working correctly!")
        print("\n🚀 Access your application:")
        print("   Frontend: http://localhost:5173")
        print("   Sorting Hat: http://localhost:5173/sorting-hat")
        print("   AI Server: http://localhost:8001")
    else:
        print("\n⚠️  Integration needs attention. Please:")
        if not frontend_ok:
            print("   - Start frontend: cd wiz-scholar-landing-page && npm run dev")
        if not ai_server_ok:
            print("   - Start AI server: cd ai_server && python main.py")
        if not all_files_exist:
            print("   - Check missing files above")

if __name__ == "__main__":
    main()
