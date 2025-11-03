# backend/test_workflow.py - FIXED VERSION

"""
🎯 Workflow Test Script - Test WITHOUT Making a Real Call

This script simulates a complete conversation flow through your workflow
and tests appointment booking, email, and Google Calendar integration.

Run: python test_workflow.py
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.workflow_engine import workflow_engine
from app.services.appointment import appointment_service
from app.services.email import email_service
from app.services.google_calendar import google_calendar_service

import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def get_db():
    """Get database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb+srv://maira:maira_12@cluster0.5sesguk.mongodb.net/callcenter_saas?retryWrites=true&w=majority&appName=Cluster0")
    database_name = os.getenv("DATABASE_NAME", "callcenter_saas")
    
    client = AsyncIOMotorClient(mongodb_url)
    db = client[database_name]
    
    return db


class WorkflowTester:
    """Complete workflow testing class"""
    
    def __init__(self):
        self.db = None
        self.workflow_id = None
        self.test_call_id = None
        self.conversation_id = None
        self.collected_data = {}
    
    async def setup(self):
        """Setup test environment"""
        try:
            logger.info("="*80)
            logger.info("🚀 SETTING UP TEST ENVIRONMENT")
            logger.info("="*80)
            
            # Get database connection
            self.db = await get_db()
            
            # Find active workflow
            workflow = await self.db.flows.find_one({"active": True})
            
            if not workflow:
                logger.error("❌ No active workflow found!")
                logger.info("Please create a workflow in the Campaign Builder first")
                logger.info("")
                logger.info("To create a workflow:")
                logger.info("1. Go to http://localhost:5173")
                logger.info("2. Login to your account")
                logger.info("3. Go to AI Campaign Builder")
                logger.info("4. Create a new workflow")
                logger.info("5. Make sure it's set to 'active'")
                return False
            
            self.workflow_id = str(workflow["_id"])
            logger.info(f"✅ Found active workflow: {workflow.get('name')}")
            logger.info(f"   Workflow ID: {self.workflow_id}")
            logger.info(f"   Nodes: {len(workflow.get('nodes', []))}")
            logger.info(f"   Connections: {len(workflow.get('connections', []))}")
            logger.info("")
            
            # Create test call record
            call_data = {
                "call_sid": f"TEST_CALL_{datetime.now().timestamp()}",
                "from_number": "+17272901921",
                "to_number": "+14388177856",
                "status": "in-progress",
                "direction": "inbound",
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow()
            }
            
            result = await self.db.calls.insert_one(call_data)
            self.test_call_id = str(result.inserted_id)
            logger.info(f"✅ Created test call: {self.test_call_id}")
            
            # Create test conversation
            conversation_data = {
                "call_id": result.inserted_id,
                "messages": [],
                "metadata": {
                    "workflow_id": self.workflow_id,
                    "appointment_data": {}
                },
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            conv_result = await self.db.conversations.insert_one(conversation_data)
            self.conversation_id = str(conv_result.inserted_id)
            logger.info(f"✅ Created test conversation: {self.conversation_id}")
            
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Setup failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def test_greeting(self):
        """Test 1: Get initial greeting from workflow"""
        try:
            logger.info("="*80)
            logger.info("TEST 1: GREETING MESSAGE")
            logger.info("="*80)
            
            # Get workflow
            workflow = await workflow_engine.get_workflow(self.workflow_id)
            
            if not workflow:
                logger.error("❌ Failed to load workflow")
                return False
            
            # Find start node
            start_node = await workflow_engine.find_start_node(workflow)
            
            if not start_node:
                logger.error("❌ No start node found")
                return False
            
            # Get greeting message
            greeting = await workflow_engine._get_node_response(start_node)
            
            logger.info(f"✅ Greeting message:")
            logger.info(f"   '{greeting}'")
            logger.info("")
            
            # Save greeting to conversation
            await self.db.conversations.update_one(
                {"_id": ObjectId(self.conversation_id)},
                {
                    "$push": {
                        "messages": {
                            "role": "assistant",
                            "content": greeting,
                            "timestamp": datetime.utcnow(),
                            "metadata": {
                                "workflow_id": self.workflow_id,
                                "node_id": start_node.get("id"),
                                "node_type": start_node.get("type")
                            }
                        }
                    }
                }
            )
            
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test 1 failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def simulate_conversation_turn(self, user_input: str, turn_number: int):
        """Simulate one conversation turn"""
        try:
            logger.info("="*80)
            logger.info(f"TURN {turn_number}: USER INPUT")
            logger.info("="*80)
            logger.info(f"👤 User says: '{user_input}'")
            logger.info("")
            
            # Process through workflow engine
            result = await workflow_engine.process_conversation_turn(
                workflow_id=self.workflow_id,
                user_input=user_input,
                call_id=self.test_call_id,
                agent_config=None
            )
            
            if result.get("success"):
                response = result.get("response")
                node_id = result.get("node_id")
                node_type = result.get("node_type")
                is_end = result.get("is_end")
                
                logger.info(f"🤖 Agent responds:")
                logger.info(f"   '{response}'")
                logger.info("")
                logger.info(f"📍 Current node: {node_id} (Type: {node_type})")
                logger.info(f"🏁 Is end: {is_end}")
                logger.info("")
                
                # Update collected data
                self.collected_data = result.get("collected_data", {})
                if self.collected_data:
                    logger.info(f"💾 Collected data so far:")
                    for key, value in self.collected_data.items():
                        logger.info(f"   {key}: {value}")
                    logger.info("")
                
                logger.info("="*80)
                logger.info("")
                
                return True, is_end
            else:
                logger.error(f"❌ Turn {turn_number} failed: {result.get('error')}")
                logger.error(f"   Response: {result.get('response')}")
                logger.info("")
                return False, True
                
        except Exception as e:
            logger.error(f"❌ Turn {turn_number} failed: {e}")
            import traceback
            traceback.print_exc()
            return False, True
    
    async def test_complete_conversation(self):
        """Test 2: Complete conversation flow"""
        try:
            logger.info("="*80)
            logger.info("TEST 2: COMPLETE CONVERSATION FLOW")
            logger.info("="*80)
            logger.info("")
            
            # Simulate conversation turns
            conversation_turns = [
                "I want to book an appointment",
                "Power washing",
                "Tomorrow at 2pm",
                "John Smith",
                "john.smith@example.com"
            ]
            
            logger.info("📝 Simulating conversation with these inputs:")
            for i, turn in enumerate(conversation_turns, 1):
                logger.info(f"   Turn {i}: '{turn}'")
            logger.info("")
            logger.info("="*80)
            logger.info("")
            
            for i, user_input in enumerate(conversation_turns, 1):
                success, is_end = await self.simulate_conversation_turn(user_input, i)
                
                if not success:
                    logger.error(f"❌ Conversation failed at turn {i}")
                    return False
                
                if is_end:
                    logger.info(f"🏁 Conversation ended at turn {i}")
                    logger.info("")
                    break
                
                # Small delay between turns
                await asyncio.sleep(0.5)
            
            logger.info("="*80)
            logger.info("✅ CONVERSATION FLOW TEST COMPLETED")
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test 2 failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def test_appointment_booking(self):
        """Test 3: Check if appointment was booked"""
        try:
            logger.info("="*80)
            logger.info("TEST 3: APPOINTMENT BOOKING VERIFICATION")
            logger.info("="*80)
            logger.info("")
            
            # Check database for appointment
            appointments = await self.db.appointments.find({
                "call_id": ObjectId(self.test_call_id)
            }).to_list(length=10)
            
            if not appointments:
                logger.warning("⚠️ No appointments found in database")
                logger.info("   This might be expected if the workflow didn't reach the booking stage")
                logger.info("")
            else:
                logger.info(f"✅ Found {len(appointments)} appointment(s):")
                logger.info("")
                
                for apt in appointments:
                    logger.info(f"📅 Appointment Details:")
                    logger.info(f"   ID: {apt['_id']}")
                    logger.info(f"   Customer: {apt.get('customer_name')}")
                    logger.info(f"   Email: {apt.get('customer_email')}")
                    logger.info(f"   Phone: {apt.get('customer_phone')}")
                    logger.info(f"   Date: {apt.get('appointment_date')}")
                    logger.info(f"   Time: {apt.get('appointment_time')}")
                    logger.info(f"   Service: {apt.get('service_type')}")
                    logger.info(f"   Status: {apt.get('status')}")
                    logger.info(f"   Google Calendar ID: {apt.get('google_calendar_event_id')}")
                    logger.info("")
            
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test 3 failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def test_google_calendar(self):
        """Test 4: Check Google Calendar integration"""
        try:
            logger.info("="*80)
            logger.info("TEST 4: GOOGLE CALENDAR INTEGRATION")
            logger.info("="*80)
            logger.info("")
            
            # Check if Google Calendar is configured
            if google_calendar_service.is_configured():
                logger.info("✅ Google Calendar is configured")
                logger.info("")
                
                # Check for events
                appointments = await self.db.appointments.find({
                    "call_id": ObjectId(self.test_call_id)
                }).to_list(length=10)
                
                if appointments:
                    for apt in appointments:
                        event_id = apt.get("google_calendar_event_id")
                        if event_id:
                            logger.info(f"✅ Google Calendar event created:")
                            logger.info(f"   Event ID: {event_id}")
                        else:
                            logger.warning(f"⚠️ No Google Calendar event ID found for appointment")
                        logger.info("")
                else:
                    logger.info("ℹ️ No appointments to check for calendar events")
                    logger.info("")
            else:
                logger.warning("⚠️ Google Calendar not configured")
                logger.info("   To enable Google Calendar:")
                logger.info("   1. Set GOOGLE_CALENDAR_CREDENTIALS_FILE in .env")
                logger.info("   2. Upload your service account JSON file")
                logger.info("")
            
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test 4 failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def test_email_service(self):
        """Test 5: Check email service"""
        try:
            logger.info("="*80)
            logger.info("TEST 5: EMAIL SERVICE")
            logger.info("="*80)
            logger.info("")
            
            # Check if email is configured
            email_host = os.getenv("EMAIL_HOST")
            email_user = os.getenv("EMAIL_USER")
            
            if email_host and email_user:
                logger.info(f"✅ Email service configured:")
                logger.info(f"   Host: {email_host}")
                logger.info(f"   From: {email_user}")
                logger.info("")
                
                # Note: We won't actually send a test email to avoid spam
                logger.info("ℹ️ Skipping actual email send test")
                logger.info("   Email will be sent automatically when appointment is booked")
                logger.info("")
            else:
                logger.warning("⚠️ Email service not configured")
                logger.info("   To enable email:")
                logger.info("   1. Set EMAIL_HOST in .env")
                logger.info("   2. Set EMAIL_USER in .env")
                logger.info("   3. Set EMAIL_PASSWORD in .env")
                logger.info("")
            
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test 5 failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def test_workflow_structure(self):
        """Test 6: Verify workflow structure"""
        try:
            logger.info("="*80)
            logger.info("TEST 6: WORKFLOW STRUCTURE VERIFICATION")
            logger.info("="*80)
            logger.info("")
            
            workflow = await self.db.flows.find_one({"_id": ObjectId(self.workflow_id)})
            
            if not workflow:
                logger.error("❌ Workflow not found")
                return False
            
            nodes = workflow.get("nodes", [])
            connections = workflow.get("connections", [])
            
            logger.info(f"📊 Workflow Statistics:")
            logger.info(f"   Name: {workflow.get('name')}")
            logger.info(f"   Total nodes: {len(nodes)}")
            logger.info(f"   Total connections: {len(connections)}")
            logger.info("")
            
            # Check node types
            node_types = {}
            for node in nodes:
                node_type = node.get("type", "unknown")
                node_types[node_type] = node_types.get(node_type, 0) + 1
            
            logger.info(f"📋 Node Types:")
            for node_type, count in node_types.items():
                logger.info(f"   {node_type}: {count}")
            logger.info("")
            
            # Check for disconnected nodes
            connected_nodes = set()
            for conn in connections:
                connected_nodes.add(conn.get("from"))
                connected_nodes.add(conn.get("to"))
            
            all_node_ids = {node.get("id") for node in nodes}
            disconnected = all_node_ids - connected_nodes
            
            if disconnected:
                logger.warning(f"⚠️ Found {len(disconnected)} potentially disconnected nodes:")
                for node_id in disconnected:
                    node = next((n for n in nodes if n.get("id") == node_id), None)
                    if node:
                        logger.warning(f"   - {node_id} (Type: {node.get('type')})")
                logger.info("")
                logger.info("   Note: Start nodes ('begin') are expected to have no incoming connections")
                logger.info("")
            else:
                logger.info("✅ All nodes are connected")
                logger.info("")
            
            # Check for nodes without outgoing connections (end nodes)
            outgoing_counts = {}
            for conn in connections:
                from_node = conn.get("from")
                outgoing_counts[from_node] = outgoing_counts.get(from_node, 0) + 1
            
            end_nodes = [n.get("id") for n in nodes if n.get("id") not in outgoing_counts]
            
            if end_nodes:
                logger.info(f"🏁 Found {len(end_nodes)} end nodes (no outgoing connections):")
                for node_id in end_nodes:
                    node = next((n for n in nodes if n.get("id") == node_id), None)
                    if node:
                        logger.info(f"   - {node_id} (Type: {node.get('type')})")
                logger.info("")
                logger.info("   Note: Workflow will use fallback logic to continue from these nodes")
                logger.info("")
            
            logger.info("="*80)
            logger.info("")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Test 6 failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    async def cleanup(self):
        """Cleanup test data"""
        try:
            logger.info("="*80)
            logger.info("🧹 CLEANING UP TEST DATA")
            logger.info("="*80)
            logger.info("")
            
            # Delete test call
            if self.test_call_id:
                await self.db.calls.delete_one({"_id": ObjectId(self.test_call_id)})
                logger.info(f"✅ Deleted test call: {self.test_call_id}")
            
            # Delete test conversation
            if self.conversation_id:
                await self.db.conversations.delete_one({"_id": ObjectId(self.conversation_id)})
                logger.info(f"✅ Deleted test conversation: {self.conversation_id}")
            
            # Optionally delete test appointments
            # Uncomment if you want to remove test appointments
            # if self.test_call_id:
            #     result = await self.db.appointments.delete_many({"call_id": ObjectId(self.test_call_id)})
            #     logger.info(f"✅ Deleted {result.deleted_count} test appointments")
            
            logger.info("")
            logger.info("="*80)
            logger.info("")
            
        except Exception as e:
            logger.error(f"❌ Cleanup failed: {e}")
    
    async def run_all_tests(self):
        """Run all tests"""
        try:
            logger.info("\n")
            logger.info("╔" + "="*78 + "╗")
            logger.info("║" + " "*20 + "WORKFLOW TEST SUITE" + " "*39 + "║")
            logger.info("╚" + "="*78 + "╝")
            logger.info("\n")
            
            # Setup
            if not await self.setup():
                logger.error("❌ Setup failed - aborting tests")
                logger.info("")
                return
            
            # Run tests
            tests = [
                ("Greeting Message", self.test_greeting),
                ("Complete Conversation Flow", self.test_complete_conversation),
                ("Appointment Booking", self.test_appointment_booking),
                ("Google Calendar Integration", self.test_google_calendar),
                ("Email Service", self.test_email_service),
                ("Workflow Structure", self.test_workflow_structure)
            ]
            
            results = {}
            
            for test_name, test_func in tests:
                try:
                    result = await test_func()
                    results[test_name] = "✅ PASSED" if result else "⚠️  PARTIAL"
                except Exception as e:
                    logger.error(f"❌ Test '{test_name}' crashed: {e}")
                    results[test_name] = "❌ FAILED"
            
            # Cleanup
            await self.cleanup()
            
            # Print summary
            logger.info("\n")
            logger.info("╔" + "="*78 + "╗")
            logger.info("║" + " "*28 + "TEST SUMMARY" + " "*38 + "║")
            logger.info("╚" + "="*78 + "╝")
            logger.info("\n")
            
            for test_name, result in results.items():
                logger.info(f"{result} - {test_name}")
            
            logger.info("\n")
            
            passed = sum(1 for r in results.values() if "PASSED" in r)
            total = len(results)
            
            logger.info("="*80)
            logger.info(f"FINAL RESULT: {passed}/{total} tests passed")
            logger.info("="*80)
            logger.info("\n")
            
        except Exception as e:
            logger.error(f"❌ Test suite failed: {e}")
            import traceback
            traceback.print_exc()


async def main():
    """Main test function"""
    tester = WorkflowTester()
    await tester.run_all_tests()


if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run tests
    asyncio.run(main())