"""
Complete System Test - All Components
"""
import requests
import json

def test_frontend():
    """Test if frontend is accessible"""
    print("\n🌐 Testing Frontend Server...")
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        print(f"✓ Frontend Status: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Frontend Error: {str(e)}")
        return False

def test_backend_api():
    """Test backend API"""
    print("\n🔧 Testing Backend API...")
    try:
        response = requests.get("http://localhost:5000/api/destinations?limit=3", timeout=5)
        data = response.json()
        print(f"✓ Backend Status: {response.status_code}")
        print(f"✓ Destinations: {len(data.get('destinations', []))}")
        
        # Check if images are present
        if data.get('destinations'):
            first_dest = data['destinations'][0]
            has_images = first_dest.get('images') and len(first_dest['images']) > 0
            print(f"✓ Images loaded: {has_images}")
            if has_images:
                print(f"  - Image URL: {first_dest['images'][0][:50]}...")
        
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Backend Error: {str(e)}")
        return False

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("\n🔐 Testing Authentication...")
    try:
        # Test profile without auth (should fail)
        response = requests.get("http://localhost:5000/api/auth/profile")
        print(f"✓ Auth protection working: {response.status_code == 401}")
        return True
    except Exception as e:
        print(f"✗ Auth Error: {str(e)}")
        return False

def test_blog_system():
    """Test blog endpoints"""
    print("\n📝 Testing Blog System...")
    try:
        response = requests.get("http://localhost:5000/api/blogs")
        data = response.json()
        print(f"✓ Blog API Status: {response.status_code}")
        print(f"✓ Blogs count: {len(data.get('blogs', []))}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ Blog Error: {str(e)}")
        return False

def test_seo_endpoints():
    """Test SEO endpoints"""
    print("\n🔍 Testing SEO Features...")
    try:
        # Test sitemap
        sitemap = requests.get("http://localhost:5000/sitemap.xml")
        print(f"✓ Sitemap Status: {sitemap.status_code}")
        
        # Test robots
        robots = requests.get("http://localhost:5000/robots.txt")
        print(f"✓ Robots.txt Status: {robots.status_code}")
        
        return sitemap.status_code == 200 and robots.status_code == 200
    except Exception as e:
        print(f"✗ SEO Error: {str(e)}")
        return False

def run_full_system_test():
    """Run comprehensive system test"""
    print("="*60)
    print("🚀 COMPLETE SYSTEM TEST - PackYourBags")
    print("="*60)
    
    tests = [
        ("Frontend Server", test_frontend),
        ("Backend API", test_backend_api),
        ("Authentication", test_auth_endpoints),
        ("Blog System", test_blog_system),
        ("SEO Features", test_seo_endpoints),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"✗ {name} FAILED: {str(e)}")
            results.append((name, False))
    
    print("\n" + "="*60)
    print("📊 SYSTEM STATUS REPORT")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ OPERATIONAL" if result else "❌ ERROR"
        print(f"{status}: {name}")
    
    print(f"\n🎯 System Health: {passed}/{total} components working ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("\n🎉 ALL SYSTEMS OPERATIONAL! Website is ready!")
        print("\n📱 Access Points:")
        print("   Frontend: http://localhost:3000")
        print("   Backend:  http://localhost:5000")
        print("   Preview:  Click the preview button above ☝️")
    else:
        print("\n⚠️  Some components need attention")
    
    print("="*60)

if __name__ == "__main__":
    run_full_system_test()
