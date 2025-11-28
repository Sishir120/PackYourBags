"""
Fuzz Testing Suite for PackYourBags API
Tests input validation, SQL injection, XSS, and other security vulnerabilities
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"
TIMEOUT = 10

class FuzzTester:
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0
    
    def test(self, name, func):
        """Run a test and record results"""
        try:
            result = func()
            if result:
                self.passed += 1
                print(f"[PASS] {name}")
            else:
                self.failed += 1
                print(f"[FAIL] {name}")
            self.results.append({"test": name, "passed": result})
        except Exception as e:
            self.failed += 1
            print(f"[ERROR] {name}: {str(e)}")
            self.results.append({"test": name, "passed": False, "error": str(e)})
    
    def sql_injection_tests(self):
        """Test SQL injection vulnerabilities"""
        print("\n=== SQL Injection Tests ===")
        
        payloads = [
            "' OR '1'='1",
            "admin'--",
            "' OR 1=1--",
            "'; DROP TABLE users--",
            "1' UNION SELECT NULL--"
        ]
        
        for payload in payloads:
            self.test(f"SQL Injection: {payload[:20]}", lambda p=payload: self._test_sql_injection(p))
    
    def _test_sql_injection(self, payload):
        """Test if SQL injection is blocked"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": payload, "password": payload},
                timeout=TIMEOUT
            )
            # Should return 400/401, not 500 (which indicates server error/injection)
            return response.status_code in [400, 401]
        except:
            return False
    
    def xss_tests(self):
        """Test XSS vulnerabilities"""
        print("\n=== XSS Tests ===")
        
        payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "<svg onload=alert('XSS')>"
        ]
        
        for payload in payloads:
            self.test(f"XSS: {payload[:30]}", lambda p=payload: self._test_xss(p))
    
    def _test_xss(self, payload):
        """Test if XSS is sanitized"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/register",
                json={"email": "test@test.com", "password": "Test123!", "name": payload},
                timeout=TIMEOUT
            )
            # Should either reject or sanitize
            if response.status_code == 201:
                data = response.json()
                # Check if payload was sanitized
                return payload not in str(data)
            return True
        except:
            return False
    
    def input_validation_tests(self):
        """Test input validation"""
        print("\n=== Input Validation Tests ===")
        
        # Invalid email formats
        invalid_emails = ["notanemail", "@test.com", "test@", "test..test@test.com"]
        for email in invalid_emails:
            self.test(f"Invalid email: {email}", lambda e=email: self._test_invalid_email(e))
        
        # Weak passwords
        weak_passwords = ["123", "password", "test", "12345678"]
        for pwd in weak_passwords:
            self.test(f"Weak password: {pwd}", lambda p=pwd: self._test_weak_password(p))
    
    def _test_invalid_email(self, email):
        """Test invalid email rejection"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/register",
                json={"email": email, "password": "Test123!"},
                timeout=TIMEOUT
            )
            return response.status_code == 400
        except:
            return False
    
    def _test_weak_password(self, password):
        """Test weak password rejection"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/register",
                json={"email": "test@test.com", "password": password},
                timeout=TIMEOUT
            )
            return response.status_code == 400
        except:
            return False
    
    def rate_limit_tests(self):
        """Test rate limiting"""
        print("\n=== Rate Limiting Tests ===")
        
        def test_rate_limit():
            # Make multiple rapid requests
            responses = []
            for i in range(10):
                try:
                    r = requests.post(
                        f"{BASE_URL}/api/auth/login",
                        json={"email": "test@test.com", "password": "test"},
                        timeout=TIMEOUT
                    )
                    responses.append(r.status_code)
                except:
                    pass
            # Should get rate limited (429) at some point
            return 429 in responses or len(responses) < 10
        
        self.test("Rate limiting active", test_rate_limit)
    
    def json_payload_tests(self):
        """Test JSON payload handling"""
        print("\n=== JSON Payload Tests ===")
        
        # Empty payload
        self.test("Empty JSON payload", lambda: self._test_empty_payload())
        
        # Malformed JSON
        self.test("Malformed JSON", lambda: self._test_malformed_json())
        
        # Oversized payload
        self.test("Oversized payload", lambda: self._test_oversized_payload())
    
    def _test_empty_payload(self):
        """Test empty payload handling"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={},
                timeout=TIMEOUT
            )
            return response.status_code == 400
        except:
            return False
    
    def _test_malformed_json(self):
        """Test malformed JSON handling"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/auth/login",
                data="not json",
                headers={"Content-Type": "application/json"},
                timeout=TIMEOUT
            )
            return response.status_code == 400
        except:
            return False
    
    def _test_oversized_payload(self):
        """Test oversized payload rejection"""
        try:
            huge_payload = {"data": "x" * 1000000}  # 1MB of data
            response = requests.post(
                f"{BASE_URL}/api/auth/register",
                json=huge_payload,
                timeout=TIMEOUT
            )
            return response.status_code in [400, 413]  # Bad request or payload too large
        except:
            return True  # Timeout is also acceptable
    
    def run_all_tests(self):
        """Run all security tests"""
        print("=" * 60)
        print("SECURITY FUZZ TESTING SUITE")
        print("=" * 60)
        
        self.sql_injection_tests()
        self.xss_tests()
        self.input_validation_tests()
        self.rate_limit_tests()
        self.json_payload_tests()
        
        print("\n" + "=" * 60)
        print(f"RESULTS: {self.passed} passed, {self.failed} failed")
        print(f"Success Rate: {(self.passed/(self.passed+self.failed)*100):.1f}%")
        print("=" * 60)
        
        return self.results

if __name__ == "__main__":
    tester = FuzzTester()
    results = tester.run_all_tests()
