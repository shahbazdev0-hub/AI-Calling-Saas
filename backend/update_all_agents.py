# test_twilio.py - Run this to test credentials

import os
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get credentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
phone_number = os.getenv("TWILIO_PHONE_NUMBER")

print("\n" + "="*60)
print("🔑 TESTING TWILIO CREDENTIALS")
print("="*60)
print(f"Account SID: {account_sid}")
print(f"Auth Token: {auth_token[:10]}...{auth_token[-4:] if auth_token else 'MISSING'}")
print(f"Phone Number: {phone_number}")
print("="*60 + "\n")

try:
    # Test authentication
    client = Client(account_sid, auth_token)
    
    # Fetch account info to verify auth
    account = client.api.accounts(account_sid).fetch()
    
    print("✅ Authentication SUCCESS!")
    print(f"   Account Status: {account.status}")
    print(f"   Account Name: {account.friendly_name}")
    
    # Test phone number
    try:
        incoming_phone_numbers = client.incoming_phone_numbers.list(
            phone_number=phone_number,
            limit=1
        )
        
        if incoming_phone_numbers:
            print(f"✅ Phone Number {phone_number} is valid and active")
        else:
            print(f"⚠️  Phone Number {phone_number} not found in your account")
    except Exception as e:
        print(f"❌ Phone Number Error: {e}")
    
except Exception as e:
    print(f"❌ AUTHENTICATION FAILED!")
    print(f"   Error: {e}")
    print("\n💡 SOLUTION:")
    print("   1. Go to https://console.twilio.com/")
    print("   2. Copy your Auth Token")
    print("   3. Update TWILIO_AUTH_TOKEN in backend/.env")
    print("   4. Restart your server")

print("\n" + "="*60 + "\n")