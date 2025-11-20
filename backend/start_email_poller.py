# backend/start_email_poller.py - Run Email Poller Service

import asyncio
import sys
import os

# Add the app directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.email_poller import email_poller_service

async def main():
    print("\n" + "="*60)
    print("📧 EMAIL POLLER SERVICE")
    print("="*60)
    print(f"Email: {os.getenv('EMAIL_USER')}")
    print(f"Checking inbox every 60 seconds...")
    print("Press Ctrl+C to stop")
    print("="*60 + "\n")
    
    await email_poller_service.start_polling()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n🛑 Email poller stopped by user")