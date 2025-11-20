# backend/test_email_inbound.py - TEST EMAIL INBOUND AI AUTO-REPLY

import asyncio
import httpx
import json

# ============================================
# CONFIGURATION
# ============================================
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "shahbazdev0@gmail.com"

# ============================================
# TEST CASES
# ============================================

async def test_simple_inquiry():
    """Test 1: Simple customer inquiry"""
    print("\n" + "="*80)
    print("📧 TEST 1: Simple Customer Inquiry")
    print("="*80)
    
    payload = {
        "from": TEST_EMAIL,
        "to": "support@callcenterpro.com",
        "subject": "Question about your services",
        "text": "Hi, I'm interested in learning more about your call center services. What packages do you offer and what are your pricing options?"
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/v1/email-webhook/webhook/test",
            json=payload
        )
        
        print(f"\n📤 Sent email from: {TEST_EMAIL}")
        print(f"📝 Subject: {payload['subject']}")
        print(f"💬 Message: {payload['text']}")
        print(f"\n📥 Response Status: {response.status_code}")
        print(f"📋 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ai_response_sent"):
                print(f"\n✅ AI auto-reply sent to {TEST_EMAIL}")
                print(f"🤖 AI Source: {result.get('source', 'unknown')}")
            else:
                print(f"\n⚠️ No AI response was sent")
        else:
            print(f"\n❌ Error: {response.text}")
    
    return response.status_code == 200


async def test_appointment_booking():
    """Test 2: Appointment booking request"""
    print("\n" + "="*80)
    print("📧 TEST 2: Appointment Booking Request")
    print("="*80)
    
    payload = {
        "from": TEST_EMAIL,
        "to": "support@callcenterpro.com",
        "subject": "Book an appointment",
        "text": "Hello, I would like to book an appointment for a plumbing consultation next week. Please let me know your available times."
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/v1/email-webhook/webhook/test",
            json=payload
        )
        
        print(f"\n📤 Sent email from: {TEST_EMAIL}")
        print(f"📝 Subject: {payload['subject']}")
        print(f"💬 Message: {payload['text']}")
        print(f"\n📥 Response Status: {response.status_code}")
        print(f"📋 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ai_response_sent"):
                print(f"\n✅ AI auto-reply sent to {TEST_EMAIL}")
                print(f"🤖 AI Source: {result.get('source', 'unknown')}")
                if result.get('source') == 'appointment_booking':
                    print("📅 Appointment booking flow initiated!")
            else:
                print(f"\n⚠️ No AI response was sent")
        else:
            print(f"\n❌ Error: {response.text}")
    
    return response.status_code == 200


async def test_follow_up_booking():
    """Test 3: Follow-up with name for appointment booking"""
    print("\n" + "="*80)
    print("📧 TEST 3: Follow-up - Providing Name")
    print("="*80)
    
    payload = {
        "from": TEST_EMAIL,
        "to": "support@callcenterpro.com",
        "subject": "Re: Book an appointment",
        "text": "My name is Hamid Raza"
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/v1/email-webhook/webhook/test",
            json=payload
        )
        
        print(f"\n📤 Sent email from: {TEST_EMAIL}")
        print(f"📝 Subject: {payload['subject']}")
        print(f"💬 Message: {payload['text']}")
        print(f"\n📥 Response Status: {response.status_code}")
        print(f"📋 Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


async def test_pricing_question():
    """Test 4: Pricing question"""
    print("\n" + "="*80)
    print("📧 TEST 4: Pricing Question")
    print("="*80)
    
    payload = {
        "from": TEST_EMAIL,
        "to": "support@callcenterpro.com",
        "subject": "Pricing inquiry",
        "text": "What is the cost of your premium plan? Do you offer any discounts for annual subscriptions?"
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/v1/email-webhook/webhook/test",
            json=payload
        )
        
        print(f"\n📤 Sent email from: {TEST_EMAIL}")
        print(f"📝 Subject: {payload['subject']}")
        print(f"💬 Message: {payload['text']}")
        print(f"\n📥 Response Status: {response.status_code}")
        print(f"📋 Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


async def test_technical_support():
    """Test 5: Technical support question"""
    print("\n" + "="*80)
    print("📧 TEST 5: Technical Support Question")
    print("="*80)
    
    payload = {
        "from": TEST_EMAIL,
        "to": "support@callcenterpro.com",
        "subject": "Integration help needed",
        "text": "I'm having trouble integrating your API with my CRM system. Can you provide documentation or help me troubleshoot the connection issues?"
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/v1/email-webhook/webhook/test",
            json=payload
        )
        
        print(f"\n📤 Sent email from: {TEST_EMAIL}")
        print(f"📝 Subject: {payload['subject']}")
        print(f"💬 Message: {payload['text']}")
        print(f"\n📥 Response Status: {response.status_code}")
        print(f"📋 Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200


async def check_email_logs():
    """Check email logs to verify emails were stored"""
    print("\n" + "="*80)
    print("📊 CHECKING EMAIL LOGS")
    print("="*80)
    
    # Note: This requires authentication, so we'll just inform the user
    print("\n📋 To verify emails were stored and sent:")
    print("   1. Go to your dashboard: http://localhost:5173/dashboard")
    print("   2. Navigate to Email Logs section")
    print("   3. You should see:")
    print(f"      - Inbound emails FROM: {TEST_EMAIL}")
    print(f"      - Outbound auto-replies TO: {TEST_EMAIL}")
    print("\n📬 Also check your actual email inbox at shahbazdev0@gmail.com")
    print("   for the AI auto-reply emails!")


async def main():
    """Run all tests"""
    print("\n" + "🚀"*40)
    print("\n   📧 EMAIL INBOUND AI AUTO-REPLY TEST SUITE")
    print(f"   📬 Test Email: {TEST_EMAIL}")
    print(f"   🌐 Backend URL: {BASE_URL}")
    print("\n" + "🚀"*40)
    
    # Check if server is running
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code != 200:
                print("\n❌ Backend server is not responding correctly!")
                print("   Make sure to run: uvicorn app.main:app --reload --port 8000")
                return
    except Exception as e:
        print(f"\n❌ Cannot connect to backend server at {BASE_URL}")
        print(f"   Error: {e}")
        print("\n   Make sure to run: uvicorn app.main:app --reload --port 8000")
        return
    
    print("\n✅ Backend server is running!")
    
    # Run tests
    results = []
    
    # Test 1: Simple inquiry
    results.append(("Simple Inquiry", await test_simple_inquiry()))
    await asyncio.sleep(2)  # Wait between tests
    
    # Test 2: Appointment booking
    results.append(("Appointment Booking", await test_appointment_booking()))
    await asyncio.sleep(2)
    
    # Test 3: Follow-up with name
    results.append(("Follow-up Name", await test_follow_up_booking()))
    await asyncio.sleep(2)
    
    # Test 4: Pricing question
    results.append(("Pricing Question", await test_pricing_question()))
    await asyncio.sleep(2)
    
    # Test 5: Technical support
    results.append(("Technical Support", await test_technical_support()))
    
    # Check logs
    await check_email_logs()
    
    # Summary
    print("\n" + "="*80)
    print("📊 TEST RESULTS SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {status} - {name}")
    
    print(f"\n   Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Check your email inbox for AI responses.")
    else:
        print("\n⚠️ Some tests failed. Check the error messages above.")
    
    print("\n" + "="*80)


if __name__ == "__main__":
    asyncio.run(main())