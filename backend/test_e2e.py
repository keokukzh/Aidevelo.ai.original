"""End-to-end smoke tests for the build system."""

import asyncio
import time
import requests
from typing import Dict, Any


class E2ETestRunner:
    """Simple E2E test runner for the build system."""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def test_health_endpoints(self) -> bool:
        """Test health endpoints."""
        print("Testing health endpoints...")
        
        try:
            # Test basic health
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code != 200:
                print(f"❌ Basic health check failed: {response.status_code}")
                return False
            
            health_data = response.json()
            if health_data.get("status") != "ok":
                print(f"❌ Health status not ok: {health_data}")
                return False
            
            print("✅ Basic health check passed")
            
            # Test full health
            response = self.session.get(f"{self.base_url}/health/full")
            if response.status_code != 200:
                print(f"❌ Full health check failed: {response.status_code}")
                return False
            
            full_health = response.json()
            print(f"✅ Full health check passed: {full_health}")
            
            return True
            
        except Exception as e:
            print(f"❌ Health check failed with exception: {e}")
            return False
    
    def test_build_workflow(self) -> bool:
        """Test complete build workflow."""
        print("Testing build workflow...")
        
        try:
            # Create a build
            build_request = {
                "prompt": "Create a simple Python hello world script",
                "settings": {"language": "python"}
            }
            
            response = self.session.post(f"{self.base_url}/build", json=build_request)
            if response.status_code != 200:
                print(f"❌ Build creation failed: {response.status_code}")
                return False
            
            build_data = response.json()
            run_id = build_data.get("run_id")
            if not run_id:
                print("❌ No run_id returned")
                return False
            
            print(f"✅ Build created with run_id: {run_id}")
            
            # Poll for completion (with timeout)
            max_wait = 60  # 60 seconds timeout
            start_time = time.time()
            
            while time.time() - start_time < max_wait:
                response = self.session.get(f"{self.base_url}/runs/{run_id}")
                if response.status_code != 200:
                    print(f"❌ Failed to get run status: {response.status_code}")
                    return False
                
                run_data = response.json()
                status = run_data.get("status")
                
                print(f"Run status: {status}")
                
                if status in ["completed", "failed", "canceled"]:
                    break
                
                time.sleep(2)
            else:
                print("❌ Build did not complete within timeout")
                return False
            
            # Check final status
            if status == "completed":
                print("✅ Build completed successfully")
                
                # Check diffs
                response = self.session.get(f"{self.base_url}/runs/{run_id}/diffs")
                if response.status_code == 200:
                    diffs_data = response.json()
                    diffs = diffs_data.get("diffs", [])
                    print(f"✅ Found {len(diffs)} diffs")
                else:
                    print("⚠️ Could not retrieve diffs")
                
                return True
            else:
                print(f"❌ Build failed with status: {status}")
                return False
                
        except Exception as e:
            print(f"❌ Build workflow failed with exception: {e}")
            return False
    
    def test_cancel_workflow(self) -> bool:
        """Test cancel workflow."""
        print("Testing cancel workflow...")
        
        try:
            # Create a build
            build_request = {
                "prompt": "Create a complex application that takes a long time",
                "settings": {"complexity": "high"}
            }
            
            response = self.session.post(f"{self.base_url}/build", json=build_request)
            if response.status_code != 200:
                print(f"❌ Build creation failed: {response.status_code}")
                return False
            
            build_data = response.json()
            run_id = build_data.get("run_id")
            print(f"✅ Build created with run_id: {run_id}")
            
            # Wait a moment then cancel
            time.sleep(1)
            
            cancel_request = {"step_id": "test_cancel"}
            response = self.session.post(f"{self.base_url}/runs/{run_id}/cancel", json=cancel_request)
            if response.status_code != 200:
                print(f"❌ Cancel failed: {response.status_code}")
                return False
            
            # Check that it's canceled
            response = self.session.get(f"{self.base_url}/runs/{run_id}")
            if response.status_code != 200:
                print(f"❌ Failed to get run status after cancel: {response.status_code}")
                return False
            
            run_data = response.json()
            status = run_data.get("status")
            
            if status == "canceled":
                print("✅ Build canceled successfully")
                return True
            else:
                print(f"❌ Build not canceled, status: {status}")
                return False
                
        except Exception as e:
            print(f"❌ Cancel workflow failed with exception: {e}")
            return False
    
    def test_metrics(self) -> bool:
        """Test metrics endpoint."""
        print("Testing metrics endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/metrics")
            if response.status_code != 200:
                print(f"❌ Metrics endpoint failed: {response.status_code}")
                return False
            
            metrics_data = response.json()
            print(f"✅ Metrics: {metrics_data}")
            return True
            
        except Exception as e:
            print(f"❌ Metrics test failed with exception: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all E2E tests."""
        print("🚀 Starting E2E tests...")
        
        tests = [
            ("Health Endpoints", self.test_health_endpoints),
            ("Build Workflow", self.test_build_workflow),
            ("Cancel Workflow", self.test_cancel_workflow),
            ("Metrics", self.test_metrics),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n--- {test_name} ---")
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        
        print(f"\n📊 Results: {passed}/{total} tests passed")
        return passed == total


def main():
    """Run E2E tests."""
    runner = E2ETestRunner()
    success = runner.run_all_tests()
    
    if success:
        print("\n🎉 All E2E tests passed!")
        exit(0)
    else:
        print("\n💥 Some E2E tests failed!")
        exit(1)


if __name__ == "__main__":
    main()
