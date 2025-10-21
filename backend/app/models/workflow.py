# backend/app/models/workflow.py

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId


class Workflow(BaseModel):
    """Workflow Model"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    name: str
    description: Optional[str] = None
    
    # Workflow definition
    nodes: List[Dict[str, Any]] = []  # Workflow nodes
    edges: List[Dict[str, Any]] = []  # Connections between nodes
    
    # Status
    is_active: bool = True
    version: int = 1
    
    # Stats
    execution_count: int = 0
    success_count: int = 0
    failure_count: int = 0
    
    # Settings
    max_nodes: int = 50
    execution_timeout: int = 600  # seconds
    
    # Metadata
    metadata: Optional[Dict[str, Any]] = {}
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}


class WorkflowExecution(BaseModel):
    """Workflow Execution Log"""
    id: Optional[str] = Field(None, alias="_id")
    workflow_id: str
    user_id: str
    
    status: str  # running, completed, failed
    input_data: Dict[str, Any] = {}
    output_data: Optional[Dict[str, Any]] = None
    
    nodes_executed: List[str] = []
    error_message: Optional[str] = None
    
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}