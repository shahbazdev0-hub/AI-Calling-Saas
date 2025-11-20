# # backend/app/services/customer.py
# """
# Customer Service - Business logic for customer operations
# """

# from typing import Optional, Dict, Any, List
# from datetime import datetime, timedelta
# from bson import ObjectId
# import logging
# import csv
# import io

# from app.database import get_database

# logger = logging.getLogger(__name__)


# class CustomerService:
#     """Service for managing customers"""
    
#     def __init__(self):
#         self.db = None
    
#     async def get_db(self):
#         """Get database connection"""
#         if self.db is None:
#             self.db = await get_database()
#         return self.db
    
#     async def create_customer(
#         self,
#         user_id: str,
#         name: str,
#         email: str,
#         phone: str,
#         company: Optional[str] = None,
#         address: Optional[str] = None,
#         tags: List[str] = None,
#         notes: Optional[str] = None
#     ) -> Dict[str, Any]:
#         """
#         Create a new customer
        
#         Args:
#             user_id: Owner user ID
#             name: Customer name
#             email: Customer email
#             phone: Customer phone
#             company: Company name
#             address: Address
#             tags: List of tags
#             notes: Notes
            
#         Returns:
#             Dict with customer details
#         """
#         try:
#             db = await self.get_db()
            
#             # Check if customer with email already exists for this user
#             existing = await db.customers.find_one({
#                 "user_id": user_id,
#                 "email": email.lower()
#             })
            
#             if existing:
#                 logger.warning(f"Customer with email {email} already exists")
#                 return {
#                     "success": False,
#                     "error": "Customer with this email already exists"
#                 }
            
#             # Create customer document
#             customer_doc = {
#                 "name": name,
#                 "email": email.lower(),
#                 "phone": phone,
#                 "company": company,
#                 "address": address,
#                 "tags": tags or [],
#                 "notes": notes,
#                 "total_appointments": 0,
#                 "total_calls": 0,
#                 "total_interactions": 0,
#                 "status": "active",
#                 "user_id": user_id,
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow(),
#                 "last_contact_at": None
#             }
            
#             # Insert into database
#             result = await db.customers.insert_one(customer_doc)
#             customer_doc["_id"] = result.inserted_id
            
#             logger.info(f"✅ Customer created: {name} ({email})")
            
#             return {
#                 "success": True,
#                 "customer": self._format_customer(customer_doc)
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error creating customer: {e}")
#             return {"success": False, "error": str(e)}
    
#     async def get_customer(self, customer_id: str, user_id: str) -> Optional[Dict[str, Any]]:
#         """Get a single customer by ID"""
#         try:
#             db = await self.get_db()
            
#             customer = await db.customers.find_one({
#                 "_id": ObjectId(customer_id),
#                 "user_id": user_id
#             })
            
#             if not customer:
#                 return None
            
#             return self._format_customer(customer)
            
#         except Exception as e:
#             logger.error(f"❌ Error getting customer: {e}")
#             return None
    
#     async def get_customers(
#         self,
#         user_id: str,
#         page: int = 1,
#         limit: int = 10,
#         search: Optional[str] = None,
#         tags: Optional[str] = None,
#         sort_by: str = "created_at",
#         sort_order: str = "desc"
#     ) -> Dict[str, Any]:
#         """
#         Get paginated list of customers
        
#         Args:
#             user_id: Owner user ID
#             page: Page number
#             limit: Items per page
#             search: Search term
#             tags: Comma-separated tags
#             sort_by: Sort field
#             sort_order: Sort direction (asc/desc)
            
#         Returns:
#             Dict with customers and pagination info
#         """
#         try:
#             db = await self.get_db()
            
#             # Build query
#             query = {"user_id": user_id}
            
#             # Add search filter
#             if search:
#                 query["$or"] = [
#                     {"name": {"$regex": search, "$options": "i"}},
#                     {"email": {"$regex": search, "$options": "i"}},
#                     {"phone": {"$regex": search, "$options": "i"}},
#                     {"company": {"$regex": search, "$options": "i"}}
#                 ]
            
#             # Add tags filter
#             if tags:
#                 tag_list = [t.strip() for t in tags.split(",") if t.strip()]
#                 if tag_list:
#                     query["tags"] = {"$in": tag_list}
            
#             # Get total count
#             total = await db.customers.count_documents(query)
            
#             # Calculate pagination
#             skip = (page - 1) * limit
#             total_pages = (total + limit - 1) // limit
            
#             # Sort direction
#             sort_dir = -1 if sort_order == "desc" else 1
            
#             # Get customers
#             cursor = db.customers.find(query).sort(sort_by, sort_dir).skip(skip).limit(limit)
#             customers = await cursor.to_list(length=limit)
            
#             return {
#                 "customers": [self._format_customer(c) for c in customers],
#                 "total": total,
#                 "page": page,
#                 "limit": limit,
#                 "total_pages": total_pages
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error getting customers: {e}")
#             return {
#                 "customers": [],
#                 "total": 0,
#                 "page": page,
#                 "limit": limit,
#                 "total_pages": 0
#             }
    
#     async def update_customer(
#         self,
#         customer_id: str,
#         user_id: str,
#         update_data: Dict[str, Any]
#     ) -> Dict[str, Any]:
#         """Update a customer"""
#         try:
#             db = await self.get_db()
            
#             # Remove None values
#             update_data = {k: v for k, v in update_data.items() if v is not None}
            
#             if not update_data:
#                 return {"success": False, "error": "No data to update"}
            
#             # Add updated_at
#             update_data["updated_at"] = datetime.utcnow()
            
#             # Update customer
#             result = await db.customers.update_one(
#                 {"_id": ObjectId(customer_id), "user_id": user_id},
#                 {"$set": update_data}
#             )
            
#             if result.modified_count == 0:
#                 return {"success": False, "error": "Customer not found or no changes made"}
            
#             # Get updated customer
#             customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
            
#             logger.info(f"✅ Customer updated: {customer_id}")
            
#             return {
#                 "success": True,
#                 "customer": self._format_customer(customer)
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error updating customer: {e}")
#             return {"success": False, "error": str(e)}
    
#     async def delete_customer(self, customer_id: str, user_id: str) -> Dict[str, Any]:
#         """Delete a customer"""
#         try:
#             db = await self.get_db()
            
#             result = await db.customers.delete_one({
#                 "_id": ObjectId(customer_id),
#                 "user_id": user_id
#             })
            
#             if result.deleted_count == 0:
#                 return {"success": False, "error": "Customer not found"}
            
#             logger.info(f"✅ Customer deleted: {customer_id}")
            
#             return {"success": True}
            
#         except Exception as e:
#             logger.error(f"❌ Error deleting customer: {e}")
#             return {"success": False, "error": str(e)}
    
#     async def get_stats(self, user_id: str) -> Dict[str, Any]:
#         """Get customer statistics"""
#         try:
#             db = await self.get_db()
            
#             # Total customers
#             total_customers = await db.customers.count_documents({"user_id": user_id})
            
#             # Active customers
#             active_customers = await db.customers.count_documents({
#                 "user_id": user_id,
#                 "status": "active"
#             })
            
#             # New this month
#             start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
#             new_this_month = await db.customers.count_documents({
#                 "user_id": user_id,
#                 "created_at": {"$gte": start_of_month}
#             })
            
#             # Total appointments
#             total_appointments = await db.appointments.count_documents({"user_id": user_id})
            
#             # Upcoming appointments
#             upcoming_appointments = await db.appointments.count_documents({
#                 "user_id": user_id,
#                 "appointment_date": {"$gte": datetime.utcnow()},
#                 "status": {"$in": ["scheduled", "confirmed"]}
#             })
            
#             # Completed appointments
#             completed_appointments = await db.appointments.count_documents({
#                 "user_id": user_id,
#                 "status": "completed"
#             })
            
#             # Total interactions (calls + appointments + emails + sms)
#             total_calls = await db.calls.count_documents({"user_id": user_id})
#             total_interactions = total_calls + total_appointments
            
#             # Average interactions per customer
#             avg_interactions = total_interactions / total_customers if total_customers > 0 else 0
            
#             return {
#                 "total_customers": total_customers,
#                 "new_this_month": new_this_month,
#                 "active_customers": active_customers,
#                 "total_appointments": total_appointments,
#                 "upcoming_appointments": upcoming_appointments,
#                 "completed_appointments": completed_appointments,
#                 "total_interactions": total_interactions,
#                 "avg_interactions": round(avg_interactions, 1)
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error getting stats: {e}")
#             return {
#                 "total_customers": 0,
#                 "new_this_month": 0,
#                 "active_customers": 0,
#                 "total_appointments": 0,
#                 "upcoming_appointments": 0,
#                 "completed_appointments": 0,
#                 "total_interactions": 0,
#                 "avg_interactions": 0
#             }
    
#     async def get_customer_appointments(self, customer_id: str, user_id: str) -> Dict[str, Any]:
#         """Get appointments for a customer"""
#         try:
#             db = await self.get_db()
            
#             # Get customer to verify ownership
#             customer = await db.customers.find_one({
#                 "_id": ObjectId(customer_id),
#                 "user_id": user_id
#             })
            
#             if not customer:
#                 return {"appointments": [], "error": "Customer not found"}
            
#             # Get appointments by customer email
#             cursor = db.appointments.find({
#                 "user_id": user_id,
#                 "customer_email": customer["email"]
#             }).sort("appointment_date", -1)
            
#             appointments = await cursor.to_list(length=100)
            
#             # Format appointments
#             formatted = []
#             for apt in appointments:
#                 formatted.append({
#                     "id": str(apt["_id"]),
#                     "appointment_date": apt.get("appointment_date"),
#                     "appointment_time": apt.get("appointment_time", ""),
#                     "service_type": apt.get("service_type"),
#                     "status": apt.get("status", "scheduled"),
#                     "notes": apt.get("notes"),
#                     "created_at": apt.get("created_at")
#                 })
            
#             return {"appointments": formatted}
            
#         except Exception as e:
#             logger.error(f"❌ Error getting customer appointments: {e}")
#             return {"appointments": []}
    
#     async def get_customer_calls(self, customer_id: str, user_id: str) -> Dict[str, Any]:
#         """Get call history for a customer"""
#         try:
#             db = await self.get_db()
            
#             # Get customer
#             customer = await db.customers.find_one({
#                 "_id": ObjectId(customer_id),
#                 "user_id": user_id
#             })
            
#             if not customer:
#                 return {"calls": []}
            
#             # Get calls by phone number
#             cursor = db.calls.find({
#                 "user_id": user_id,
#                 "phone_number": customer["phone"]
#             }).sort("created_at", -1)
            
#             calls = await cursor.to_list(length=100)
            
#             # Format calls
#             formatted = []
#             for call in calls:
#                 formatted.append({
#                     "id": str(call["_id"]),
#                     "direction": call.get("direction", "outbound"),
#                     "status": call.get("status", "completed"),
#                     "duration": call.get("duration", 0),
#                     "outcome": call.get("outcome"),
#                     "created_at": call.get("created_at")
#                 })
            
#             return {"calls": formatted}
            
#         except Exception as e:
#             logger.error(f"❌ Error getting customer calls: {e}")
#             return {"calls": []}
    
#     async def get_customer_timeline(self, customer_id: str, user_id: str) -> Dict[str, Any]:
#         """Get interaction timeline for a customer"""
#         try:
#             db = await self.get_db()
            
#             # Get customer
#             customer = await db.customers.find_one({
#                 "_id": ObjectId(customer_id),
#                 "user_id": user_id
#             })
            
#             if not customer:
#                 return {"timeline": []}
            
#             timeline = []
            
#             # Get calls
#             calls = await db.calls.find({
#                 "user_id": user_id,
#                 "phone_number": customer["phone"]
#             }).to_list(length=50)
            
#             for call in calls:
#                 timeline.append({
#                     "id": str(call["_id"]),
#                     "type": "call",
#                     "title": f"{call.get('direction', 'Outbound').title()} Call",
#                     "description": f"Duration: {call.get('duration', 0)}s - {call.get('status', 'completed')}",
#                     "timestamp": call.get("created_at"),
#                     "metadata": {"call_id": str(call["_id"])}
#                 })
            
#             # Get appointments
#             appointments = await db.appointments.find({
#                 "user_id": user_id,
#                 "customer_email": customer["email"]
#             }).to_list(length=50)
            
#             for apt in appointments:
#                 timeline.append({
#                     "id": str(apt["_id"]),
#                     "type": "appointment",
#                     "title": f"Appointment: {apt.get('service_type', 'General')}",
#                     "description": f"Status: {apt.get('status', 'scheduled')}",
#                     "timestamp": apt.get("created_at"),
#                     "metadata": {"appointment_id": str(apt["_id"])}
#                 })
            
#             # Get SMS
#             sms_logs = await db.sms_logs.find({
#                 "user_id": user_id,
#                 "to_number": customer["phone"]
#             }).to_list(length=50)
            
#             for sms in sms_logs:
#                 timeline.append({
#                     "id": str(sms["_id"]),
#                     "type": "sms",
#                     "title": f"SMS {'Sent' if sms.get('direction') == 'outbound' else 'Received'}",
#                     "description": sms.get("message", "")[:100],
#                     "timestamp": sms.get("created_at"),
#                     "metadata": {"sms_id": str(sms["_id"])}
#                 })
            
#             # Sort by timestamp
#             timeline.sort(key=lambda x: x["timestamp"] if x["timestamp"] else datetime.min, reverse=True)
            
#             return {"timeline": timeline[:100]}
            
#         except Exception as e:
#             logger.error(f"❌ Error getting customer timeline: {e}")
#             return {"timeline": []}
    
#     async def add_note(self, customer_id: str, user_id: str, note: str) -> Dict[str, Any]:
#         """Add or update note for a customer"""
#         try:
#             db = await self.get_db()
            
#             result = await db.customers.update_one(
#                 {"_id": ObjectId(customer_id), "user_id": user_id},
#                 {
#                     "$set": {
#                         "notes": note,
#                         "updated_at": datetime.utcnow()
#                     }
#                 }
#             )
            
#             if result.modified_count == 0:
#                 return {"success": False, "error": "Customer not found"}
            
#             return {"success": True}
            
#         except Exception as e:
#             logger.error(f"❌ Error adding note: {e}")
#             return {"success": False, "error": str(e)}
    
#     async def add_tags(self, customer_id: str, user_id: str, tags: List[str]) -> Dict[str, Any]:
#         """Add tags to a customer"""
#         try:
#             db = await self.get_db()
            
#             result = await db.customers.update_one(
#                 {"_id": ObjectId(customer_id), "user_id": user_id},
#                 {
#                     "$addToSet": {"tags": {"$each": tags}},
#                     "$set": {"updated_at": datetime.utcnow()}
#                 }
#             )
            
#             if result.modified_count == 0:
#                 return {"success": False, "error": "Customer not found"}
            
#             # Get updated customer
#             customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
            
#             return {
#                 "success": True,
#                 "tags": customer.get("tags", [])
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error adding tags: {e}")
#             return {"success": False, "error": str(e)}
    
#     async def remove_tag(self, customer_id: str, user_id: str, tag: str) -> Dict[str, Any]:
#         """Remove a tag from a customer"""
#         try:
#             db = await self.get_db()
            
#             result = await db.customers.update_one(
#                 {"_id": ObjectId(customer_id), "user_id": user_id},
#                 {
#                     "$pull": {"tags": tag},
#                     "$set": {"updated_at": datetime.utcnow()}
#                 }
#             )
            
#             if result.modified_count == 0:
#                 return {"success": False, "error": "Customer not found or tag not found"}
            
#             return {"success": True}
            
#         except Exception as e:
#             logger.error(f"❌ Error removing tag: {e}")
#             return {"success": False, "error": str(e)}
    
#     async def export_csv(self, user_id: str, search: Optional[str] = None, tags: Optional[str] = None) -> bytes:
#         """Export customers to CSV"""
#         try:
#             db = await self.get_db()
            
#             # Build query
#             query = {"user_id": user_id}
            
#             if search:
#                 query["$or"] = [
#                     {"name": {"$regex": search, "$options": "i"}},
#                     {"email": {"$regex": search, "$options": "i"}},
#                     {"phone": {"$regex": search, "$options": "i"}}
#                 ]
            
#             if tags:
#                 tag_list = [t.strip() for t in tags.split(",") if t.strip()]
#                 if tag_list:
#                     query["tags"] = {"$in": tag_list}
            
#             # Get customers
#             cursor = db.customers.find(query).sort("created_at", -1)
#             customers = await cursor.to_list(length=10000)
            
#             # Create CSV
#             output = io.StringIO()
#             writer = csv.writer(output)
            
#             # Write header
#             writer.writerow([
#                 "Name", "Email", "Phone", "Company", "Address",
#                 "Tags", "Status", "Total Appointments", "Total Calls",
#                 "Created At", "Last Contact"
#             ])
            
#             # Write data
#             for customer in customers:
#                 writer.writerow([
#                     customer.get("name", ""),
#                     customer.get("email", ""),
#                     customer.get("phone", ""),
#                     customer.get("company", ""),
#                     customer.get("address", ""),
#                     ", ".join(customer.get("tags", [])),
#                     customer.get("status", "active"),
#                     customer.get("total_appointments", 0),
#                     customer.get("total_calls", 0),
#                     customer.get("created_at", ""),
#                     customer.get("last_contact_at", "")
#                 ])
            
#             return output.getvalue().encode('utf-8')
            
#         except Exception as e:
#             logger.error(f"❌ Error exporting CSV: {e}")
#             return b""
    
#     async def find_or_create_customer(
#         self,
#         user_id: str,
#         name: str,
#         email: str,
#         phone: str
#     ) -> Dict[str, Any]:
#         """
#         Find existing customer or create new one
#         Used by AI agents when creating appointments
#         """
#         try:
#             db = await self.get_db()
            
#             # Try to find by email first
#             customer = await db.customers.find_one({
#                 "user_id": user_id,
#                 "email": email.lower()
#             })
            
#             if customer:
#                 # Update last contact
#                 await db.customers.update_one(
#                     {"_id": customer["_id"]},
#                     {"$set": {"last_contact_at": datetime.utcnow()}}
#                 )
#                 return {
#                     "success": True,
#                     "customer": self._format_customer(customer),
#                     "created": False
#                 }
            
#             # Create new customer
#             result = await self.create_customer(
#                 user_id=user_id,
#                 name=name,
#                 email=email,
#                 phone=phone
#             )
            
#             if result.get("success"):
#                 result["created"] = True
            
#             return result
            
#         except Exception as e:
#             logger.error(f"❌ Error in find_or_create_customer: {e}")
#             return {"success": False, "error": str(e)}
    
#     def _format_customer(self, customer: dict) -> dict:
#         """Format customer document for response"""
#         return {
#             "id": str(customer["_id"]),
#             "name": customer.get("name", ""),
#             "email": customer.get("email", ""),
#             "phone": customer.get("phone", ""),
#             "company": customer.get("company"),
#             "address": customer.get("address"),
#             "tags": customer.get("tags", []),
#             "notes": customer.get("notes"),
#             "total_appointments": customer.get("total_appointments", 0),
#             "total_calls": customer.get("total_calls", 0),
#             "total_interactions": customer.get("total_interactions", 0),
#             "status": customer.get("status", "active"),
#             "user_id": customer.get("user_id", ""),
#             "created_at": customer.get("created_at"),
#             "updated_at": customer.get("updated_at"),
#             "last_contact_at": customer.get("last_contact_at")
#         }


# # Create singleton instance
# customer_service = CustomerService()


# backend/app/services/customer.py
"""
Customer Service - Business logic for customer operations
"""

from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from bson import ObjectId
import logging
import csv
import io

from app.database import get_database

logger = logging.getLogger(__name__)


class CustomerService:
    """Service for managing customers"""
    
    def __init__(self):
        self.db = None
    
    async def get_db(self):
        """Get database connection"""
        if self.db is None:
            self.db = await get_database()
        return self.db
    
    async def create_customer(
        self,
        user_id: str,
        name: str,
        email: str,
        phone: str,
        company: Optional[str] = None,
        address: Optional[str] = None,
        tags: List[str] = None,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new customer
        
        Args:
            user_id: Owner user ID
            name: Customer name
            email: Customer email
            phone: Customer phone
            company: Company name
            address: Address
            tags: List of tags
            notes: Notes
            
        Returns:
            Dict with customer details
        """
        try:
            db = await self.get_db()
            
            # Check if customer with email already exists for this user
            existing = await db.customers.find_one({
                "user_id": user_id,
                "email": email.lower()
            })
            
            if existing:
                logger.warning(f"Customer with email {email} already exists")
                return {
                    "success": False,
                    "error": "Customer with this email already exists"
                }
            
            # Create customer document
            customer_doc = {
                "name": name,
                "email": email.lower(),
                "phone": phone,
                "company": company,
                "address": address,
                "tags": tags or [],
                "notes": notes,
                "total_appointments": 0,
                "total_calls": 0,
                "total_interactions": 0,
                "status": "active",
                "user_id": user_id,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "last_contact_at": None
            }
            
            # Insert into database
            result = await db.customers.insert_one(customer_doc)
            customer_doc["_id"] = result.inserted_id
            
            logger.info(f"✅ Customer created: {name} ({email})")
            
            return {
                "success": True,
                "customer": self._format_customer(customer_doc)
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating customer: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_customer(self, customer_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a single customer by ID"""
        try:
            db = await self.get_db()
            
            customer = await db.customers.find_one({
                "_id": ObjectId(customer_id),
                "user_id": user_id
            })
            
            if not customer:
                return None
            
            return self._format_customer(customer)
            
        except Exception as e:
            logger.error(f"❌ Error getting customer: {e}")
            return None
    
    async def get_customers(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        tags: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        """
        Get paginated list of customers
        
        Args:
            user_id: Owner user ID
            page: Page number
            limit: Items per page
            search: Search term
            tags: Comma-separated tags
            sort_by: Sort field
            sort_order: Sort direction (asc/desc)
            
        Returns:
            Dict with customers and pagination info
        """
        try:
            db = await self.get_db()
            
            # Build query
            query = {"user_id": user_id}
            
            # Add search filter
            if search:
                query["$or"] = [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"email": {"$regex": search, "$options": "i"}},
                    {"phone": {"$regex": search, "$options": "i"}},
                    {"company": {"$regex": search, "$options": "i"}}
                ]
            
            # Add tags filter
            if tags:
                tag_list = [t.strip() for t in tags.split(",") if t.strip()]
                if tag_list:
                    query["tags"] = {"$in": tag_list}
            
            # Get total count
            total = await db.customers.count_documents(query)
            
            # Calculate pagination
            skip = (page - 1) * limit
            total_pages = (total + limit - 1) // limit
            
            # Sort direction
            sort_dir = -1 if sort_order == "desc" else 1
            
            # Get customers
            cursor = db.customers.find(query).sort(sort_by, sort_dir).skip(skip).limit(limit)
            customers = await cursor.to_list(length=limit)
            
            return {
                "customers": [self._format_customer(c) for c in customers],
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": total_pages
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting customers: {e}")
            return {
                "customers": [],
                "total": 0,
                "page": page,
                "limit": limit,
                "total_pages": 0
            }
    
    async def update_customer(
        self,
        customer_id: str,
        user_id: str,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update a customer"""
        try:
            db = await self.get_db()
            
            # Remove None values
            update_data = {k: v for k, v in update_data.items() if v is not None}
            
            if not update_data:
                return {"success": False, "error": "No data to update"}
            
            # Add updated_at
            update_data["updated_at"] = datetime.utcnow()
            
            # Update customer
            result = await db.customers.update_one(
                {"_id": ObjectId(customer_id), "user_id": user_id},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                return {"success": False, "error": "Customer not found or no changes made"}
            
            # Get updated customer
            customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
            
            logger.info(f"✅ Customer updated: {customer_id}")
            
            return {
                "success": True,
                "customer": self._format_customer(customer)
            }
            
        except Exception as e:
            logger.error(f"❌ Error updating customer: {e}")
            return {"success": False, "error": str(e)}
    
    async def delete_customer(self, customer_id: str, user_id: str) -> Dict[str, Any]:
        """Delete a customer"""
        try:
            db = await self.get_db()
            
            result = await db.customers.delete_one({
                "_id": ObjectId(customer_id),
                "user_id": user_id
            })
            
            if result.deleted_count == 0:
                return {"success": False, "error": "Customer not found"}
            
            logger.info(f"✅ Customer deleted: {customer_id}")
            
            return {"success": True}
            
        except Exception as e:
            logger.error(f"❌ Error deleting customer: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_stats(self, user_id: str) -> Dict[str, Any]:
        """Get customer statistics"""
        try:
            db = await self.get_db()
            
            # Total customers
            total_customers = await db.customers.count_documents({"user_id": user_id})
            
            # Active customers
            active_customers = await db.customers.count_documents({
                "user_id": user_id,
                "status": "active"
            })
            
            # New this month
            start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            new_this_month = await db.customers.count_documents({
                "user_id": user_id,
                "created_at": {"$gte": start_of_month}
            })
            
            # Total appointments
            total_appointments = await db.appointments.count_documents({"user_id": user_id})
            
            # Upcoming appointments
            upcoming_appointments = await db.appointments.count_documents({
                "user_id": user_id,
                "appointment_date": {"$gte": datetime.utcnow()},
                "status": {"$in": ["scheduled", "confirmed"]}
            })
            
            # Completed appointments
            completed_appointments = await db.appointments.count_documents({
                "user_id": user_id,
                "status": "completed"
            })
            
            # Total interactions (calls + appointments + emails + sms)
            total_calls = await db.calls.count_documents({"user_id": user_id})
            total_interactions = total_calls + total_appointments
            
            # Average interactions per customer
            avg_interactions = total_interactions / total_customers if total_customers > 0 else 0
            
            return {
                "total_customers": total_customers,
                "new_this_month": new_this_month,
                "active_customers": active_customers,
                "total_appointments": total_appointments,
                "upcoming_appointments": upcoming_appointments,
                "completed_appointments": completed_appointments,
                "total_interactions": total_interactions,
                "avg_interactions": round(avg_interactions, 1)
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting stats: {e}")
            return {
                "total_customers": 0,
                "new_this_month": 0,
                "active_customers": 0,
                "total_appointments": 0,
                "upcoming_appointments": 0,
                "completed_appointments": 0,
                "total_interactions": 0,
                "avg_interactions": 0
            }
    
    async def get_customer_appointments(self, customer_id: str, user_id: str) -> Dict[str, Any]:
        """Get appointments for a customer - matched by email"""
        try:
            db = await self.get_db()
            
            # Get customer to verify ownership
            customer = await db.customers.find_one({
                "_id": ObjectId(customer_id),
                "user_id": user_id
            })
            
            if not customer:
                return {"appointments": [], "error": "Customer not found"}
            
            # Get appointments by customer email (case-insensitive)
            customer_email = customer.get("email", "").lower()
            
            cursor = db.appointments.find({
                "user_id": user_id,
                "$or": [
                    {"customer_email": customer_email},
                    {"customer_email": {"$regex": f"^{customer_email}$", "$options": "i"}}
                ]
            }).sort("appointment_date", -1)
            
            appointments = await cursor.to_list(length=100)
            
            # Format appointments
            formatted = []
            for apt in appointments:
                formatted.append({
                    "id": str(apt["_id"]),
                    "customer_name": apt.get("customer_name", ""),
                    "customer_email": apt.get("customer_email", ""),
                    "customer_phone": apt.get("customer_phone", ""),
                    "appointment_date": apt.get("appointment_date"),
                    "appointment_time": apt.get("appointment_time", ""),
                    "service_type": apt.get("service_type", "General"),
                    "status": apt.get("status", "scheduled"),
                    "notes": apt.get("notes"),
                    "duration_minutes": apt.get("duration_minutes", 60),
                    "google_calendar_event_id": apt.get("google_calendar_event_id"),
                    "google_calendar_link": apt.get("google_calendar_link"),
                    "created_at": apt.get("created_at"),
                    "updated_at": apt.get("updated_at")
                })
            
            # Update customer's total_appointments count
            if len(formatted) > 0:
                await db.customers.update_one(
                    {"_id": ObjectId(customer_id)},
                    {"$set": {"total_appointments": len(formatted)}}
                )
            
            return {"appointments": formatted, "total": len(formatted)}
            
        except Exception as e:
            logger.error(f"❌ Error getting customer appointments: {e}")
            import traceback
            traceback.print_exc()
            return {"appointments": [], "total": 0}
    
    async def get_customer_calls(self, customer_id: str, user_id: str) -> Dict[str, Any]:
        """Get call history for a customer - matched by phone number"""
        try:
            db = await self.get_db()
            
            # Get customer
            customer = await db.customers.find_one({
                "_id": ObjectId(customer_id),
                "user_id": user_id
            })
            
            if not customer:
                return {"calls": [], "total": 0}
            
            # Get phone number and normalize it (remove non-digits for matching)
            customer_phone = customer.get("phone", "")
            phone_digits = ''.join(filter(str.isdigit, customer_phone))
            
            # Build query to match phone numbers
            # Match both the exact phone and normalized versions
            phone_queries = [
                {"phone_number": customer_phone},
            ]
            
            # Add regex match if we have enough digits
            if len(phone_digits) >= 10:
                phone_queries.append(
                    {"phone_number": {"$regex": phone_digits[-10:]}}
                )
            elif phone_digits:
                phone_queries.append(
                    {"phone_number": {"$regex": phone_digits}}
                )
            
            # Query calls
            cursor = db.calls.find({
                "user_id": user_id,
                "$or": phone_queries
            }).sort("created_at", -1)
            
            calls = await cursor.to_list(length=100)
            
            # Format calls - Convert ALL ObjectId fields to strings
            formatted = []
            for call in calls:
                # Convert _id to string
                call_id = call.get("_id")
                if call_id:
                    call_id = str(call_id)
                
                # Convert agent_id to string if it's an ObjectId
                agent_id = call.get("agent_id")
                if agent_id and hasattr(agent_id, '__str__'):
                    agent_id = str(agent_id)
                
                # Convert created_at and ended_at to ISO format strings
                created_at = call.get("created_at")
                if created_at and hasattr(created_at, 'isoformat'):
                    created_at = created_at.isoformat()
                
                ended_at = call.get("ended_at")
                if ended_at and hasattr(ended_at, 'isoformat'):
                    ended_at = ended_at.isoformat()
                
                formatted.append({
                    "id": call_id,
                    "phone_number": call.get("phone_number", ""),
                    "direction": call.get("direction", "outbound"),
                    "status": call.get("status", "completed"),
                    "duration": call.get("duration", 0),
                    "outcome": call.get("outcome"),
                    "recording_url": call.get("recording_url"),
                    "transcript": call.get("transcript"),
                    "ai_summary": call.get("ai_summary"),
                    "agent_id": agent_id,
                    "created_at": created_at,
                    "ended_at": ended_at
                })
            
            # Update customer's total_calls count
            if len(formatted) > 0:
                await db.customers.update_one(
                    {"_id": ObjectId(customer_id)},
                    {"$set": {"total_calls": len(formatted)}}
                )
            
            return {"calls": formatted, "total": len(formatted)}
            
        except Exception as e:
            logger.error(f"❌ Error getting customer calls: {e}")
            import traceback
            traceback.print_exc()
            return {"calls": [], "total": 0}
    
    async def get_customer_timeline(self, customer_id: str, user_id: str) -> Dict[str, Any]:
        """Get interaction timeline for a customer - includes calls, appointments, SMS, emails"""
        try:
            db = await self.get_db()
            
            # Get customer
            customer = await db.customers.find_one({
                "_id": ObjectId(customer_id),
                "user_id": user_id
            })
            
            if not customer:
                return {"timeline": [], "total": 0}
            
            timeline = []
            
            # Get phone number and normalize
            customer_phone = customer.get("phone", "")
            phone_digits = ''.join(filter(str.isdigit, customer_phone))
            customer_email = customer.get("email", "").lower()
            
            # 1. Get calls by phone number
            calls = await db.calls.find({
                "user_id": user_id,
                "$or": [
                    {"phone_number": customer_phone},
                    {"phone_number": {"$regex": phone_digits[-10:] if len(phone_digits) >= 10 else phone_digits}}
                ]
            }).to_list(length=50)
            
            for call in calls:
                timeline.append({
                    "id": str(call["_id"]),
                    "type": "call",
                    "title": f"{call.get('direction', 'Outbound').title()} Call",
                    "description": f"Duration: {call.get('duration', 0)}s - Status: {call.get('status', 'completed')}",
                    "timestamp": call.get("created_at"),
                    "metadata": {
                        "call_id": str(call["_id"]),
                        "duration": call.get("duration", 0),
                        "status": call.get("status"),
                        "direction": call.get("direction")
                    }
                })
            
            # 2. Get appointments by email
            appointments = await db.appointments.find({
                "user_id": user_id,
                "$or": [
                    {"customer_email": customer_email},
                    {"customer_email": {"$regex": f"^{customer_email}$", "$options": "i"}}
                ]
            }).to_list(length=50)
            
            for apt in appointments:
                apt_date = apt.get("appointment_date")
                date_str = apt_date.strftime("%b %d, %Y at %I:%M %p") if apt_date else "N/A"
                timeline.append({
                    "id": str(apt["_id"]),
                    "type": "appointment",
                    "title": f"Appointment: {apt.get('service_type', 'General')}",
                    "description": f"Scheduled for {date_str} - Status: {apt.get('status', 'scheduled')}",
                    "timestamp": apt.get("created_at"),
                    "metadata": {
                        "appointment_id": str(apt["_id"]),
                        "service_type": apt.get("service_type"),
                        "status": apt.get("status"),
                        "appointment_date": apt_date
                    }
                })
            
            # 3. Get SMS by phone number
            sms_query = {
                "user_id": user_id,
                "$or": [
                    {"to_number": customer_phone},
                    {"to_number": {"$regex": phone_digits[-10:] if len(phone_digits) >= 10 else phone_digits}},
                    {"from_number": customer_phone},
                    {"from_number": {"$regex": phone_digits[-10:] if len(phone_digits) >= 10 else phone_digits}}
                ]
            }
            
            sms_logs = await db.sms_logs.find(sms_query).to_list(length=50)
            
            for sms in sms_logs:
                direction = sms.get("direction", "outbound")
                timeline.append({
                    "id": str(sms["_id"]),
                    "type": "sms",
                    "title": f"SMS {'Sent' if direction == 'outbound' else 'Received'}",
                    "description": sms.get("message", "")[:100] + ("..." if len(sms.get("message", "")) > 100 else ""),
                    "timestamp": sms.get("created_at"),
                    "metadata": {
                        "sms_id": str(sms["_id"]),
                        "direction": direction,
                        "status": sms.get("status"),
                        "to_number": sms.get("to_number"),
                        "from_number": sms.get("from_number")
                    }
                })
            
            # 4. Get emails by email address
            email_logs = await db.email_logs.find({
                "user_id": user_id,
                "$or": [
                    {"to_email": customer_email},
                    {"to_email": {"$regex": f"^{customer_email}$", "$options": "i"}}
                ]
            }).to_list(length=50)
            
            for email in email_logs:
                timeline.append({
                    "id": str(email["_id"]),
                    "type": "email",
                    "title": f"Email: {email.get('subject', 'No Subject')[:50]}",
                    "description": f"Status: {email.get('status', 'sent')}",
                    "timestamp": email.get("created_at"),
                    "metadata": {
                        "email_id": str(email["_id"]),
                        "subject": email.get("subject"),
                        "status": email.get("status")
                    }
                })
            
            # Sort by timestamp (most recent first)
            timeline.sort(
                key=lambda x: x["timestamp"] if x["timestamp"] else datetime.min, 
                reverse=True
            )
            
            # Update total interactions count
            total_interactions = len(timeline)
            if total_interactions > 0:
                await db.customers.update_one(
                    {"_id": ObjectId(customer_id)},
                    {"$set": {"total_interactions": total_interactions}}
                )
            
            return {"timeline": timeline[:100], "total": len(timeline)}
            
        except Exception as e:
            logger.error(f"❌ Error getting customer timeline: {e}")
            import traceback
            traceback.print_exc()
            return {"timeline": [], "total": 0}
    
    async def add_note(self, customer_id: str, user_id: str, note: str) -> Dict[str, Any]:
        """Add or update note for a customer"""
        try:
            db = await self.get_db()
            
            result = await db.customers.update_one(
                {"_id": ObjectId(customer_id), "user_id": user_id},
                {
                    "$set": {
                        "notes": note,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count == 0:
                return {"success": False, "error": "Customer not found"}
            
            return {"success": True}
            
        except Exception as e:
            logger.error(f"❌ Error adding note: {e}")
            return {"success": False, "error": str(e)}
    
    async def add_tags(self, customer_id: str, user_id: str, tags: List[str]) -> Dict[str, Any]:
        """Add tags to a customer"""
        try:
            db = await self.get_db()
            
            result = await db.customers.update_one(
                {"_id": ObjectId(customer_id), "user_id": user_id},
                {
                    "$addToSet": {"tags": {"$each": tags}},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.modified_count == 0:
                return {"success": False, "error": "Customer not found"}
            
            # Get updated customer
            customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
            
            return {
                "success": True,
                "tags": customer.get("tags", [])
            }
            
        except Exception as e:
            logger.error(f"❌ Error adding tags: {e}")
            return {"success": False, "error": str(e)}
    
    async def remove_tag(self, customer_id: str, user_id: str, tag: str) -> Dict[str, Any]:
        """Remove a tag from a customer"""
        try:
            db = await self.get_db()
            
            result = await db.customers.update_one(
                {"_id": ObjectId(customer_id), "user_id": user_id},
                {
                    "$pull": {"tags": tag},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.modified_count == 0:
                return {"success": False, "error": "Customer not found or tag not found"}
            
            return {"success": True}
            
        except Exception as e:
            logger.error(f"❌ Error removing tag: {e}")
            return {"success": False, "error": str(e)}
    
    async def export_csv(self, user_id: str, search: Optional[str] = None, tags: Optional[str] = None) -> bytes:
        """Export customers to CSV"""
        try:
            db = await self.get_db()
            
            # Build query
            query = {"user_id": user_id}
            
            if search:
                query["$or"] = [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"email": {"$regex": search, "$options": "i"}},
                    {"phone": {"$regex": search, "$options": "i"}}
                ]
            
            if tags:
                tag_list = [t.strip() for t in tags.split(",") if t.strip()]
                if tag_list:
                    query["tags"] = {"$in": tag_list}
            
            # Get customers
            cursor = db.customers.find(query).sort("created_at", -1)
            customers = await cursor.to_list(length=10000)
            
            # Create CSV
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow([
                "Name", "Email", "Phone", "Company", "Address",
                "Tags", "Status", "Total Appointments", "Total Calls",
                "Created At", "Last Contact"
            ])
            
            # Write data
            for customer in customers:
                writer.writerow([
                    customer.get("name", ""),
                    customer.get("email", ""),
                    customer.get("phone", ""),
                    customer.get("company", ""),
                    customer.get("address", ""),
                    ", ".join(customer.get("tags", [])),
                    customer.get("status", "active"),
                    customer.get("total_appointments", 0),
                    customer.get("total_calls", 0),
                    customer.get("created_at", ""),
                    customer.get("last_contact_at", "")
                ])
            
            return output.getvalue().encode('utf-8')
            
        except Exception as e:
            logger.error(f"❌ Error exporting CSV: {e}")
            return b""
    
    async def find_or_create_customer(
        self,
        user_id: str,
        name: str,
        email: str,
        phone: str
    ) -> Dict[str, Any]:
        """
        Find existing customer or create new one
        Used by AI agents when creating appointments
        """
        try:
            db = await self.get_db()
            
            # Try to find by email first
            customer = await db.customers.find_one({
                "user_id": user_id,
                "email": email.lower()
            })
            
            if customer:
                # Update last contact
                await db.customers.update_one(
                    {"_id": customer["_id"]},
                    {"$set": {"last_contact_at": datetime.utcnow()}}
                )
                return {
                    "success": True,
                    "customer": self._format_customer(customer),
                    "created": False
                }
            
            # Create new customer
            result = await self.create_customer(
                user_id=user_id,
                name=name,
                email=email,
                phone=phone
            )
            
            if result.get("success"):
                result["created"] = True
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Error in find_or_create_customer: {e}")
            return {"success": False, "error": str(e)}
    
    def _format_customer(self, customer: dict) -> dict:
        """Format customer document for response"""
        return {
            "id": str(customer["_id"]),
            "name": customer.get("name", ""),
            "email": customer.get("email", ""),
            "phone": customer.get("phone", ""),
            "company": customer.get("company"),
            "address": customer.get("address"),
            "tags": customer.get("tags", []),
            "notes": customer.get("notes"),
            "total_appointments": customer.get("total_appointments", 0),
            "total_calls": customer.get("total_calls", 0),
            "total_interactions": customer.get("total_interactions", 0),
            "status": customer.get("status", "active"),
            "user_id": customer.get("user_id", ""),
            "created_at": customer.get("created_at"),
            "updated_at": customer.get("updated_at"),
            "last_contact_at": customer.get("last_contact_at")
        }


# Create singleton instance
customer_service = CustomerService()