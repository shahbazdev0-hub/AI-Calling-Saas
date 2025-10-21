# backend/app/services/workflow_engine.py
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.database import get_collection
from app.services.n8n import n8n_service
from app.models.workflow import WorkflowExecution
import logging
from bson import ObjectId
import asyncio

logger = logging.getLogger(__name__)

class WorkflowEngine:
    """Engine for executing workflows"""
    
    async def execute_workflow(
        self,
        workflow_id: str,
        input_data: Dict[str, Any],
        dry_run: bool = False
    ) -> Dict[str, Any]:
        """
        Execute a workflow
        
        Args:
            workflow_id: Workflow ID
            input_data: Input data for workflow
            dry_run: If True, simulate execution without running actions
            
        Returns:
            Execution result
        """
        try:
            # Get workflow from database
            workflows_collection = await get_collection("workflows")
            workflow = await workflows_collection.find_one({"_id": ObjectId(workflow_id)})
            
            if not workflow:
                raise Exception(f"Workflow not found: {workflow_id}")
            
            if not workflow.get('is_active'):
                return {
                    "success": False,
                    "message": "Workflow is not active"
                }
            
            # Create execution record
            execution_id = str(ObjectId())
            start_time = datetime.utcnow()
            
            logger.info(f"Starting workflow execution: {execution_id}")
            
            # Check if workflow uses N8N
            if workflow.get('n8n_workflow_id'):
                result = await self._execute_n8n_workflow(
                    workflow.get('n8n_workflow_id'),
                    input_data
                )
            else:
                result = await self._execute_local_workflow(
                    workflow,
                    input_data,
                    dry_run
                )
            
            # Calculate duration
            end_time = datetime.utcnow()
            duration = (end_time - start_time).total_seconds()
            
            # Create execution record
            execution = WorkflowExecution(
                execution_id=execution_id,
                started_at=start_time,
                completed_at=end_time,
                status=result.get('status', 'completed'),
                input_data=input_data,
                output_data=result.get('output_data', {}),
                nodes_executed=result.get('nodes_executed', []),
                nodes_failed=result.get('nodes_failed', []),
                duration_seconds=duration,
                error_message=result.get('error_message')
            )
            
            # Update workflow with execution record
            await workflows_collection.update_one(
                {"_id": ObjectId(workflow_id)},
                {
                    "$push": {"executions": execution.dict()},
                    "$inc": {
                        "total_executions": 1,
                        "successful_executions": 1 if execution.status == "completed" else 0,
                        "failed_executions": 1 if execution.status == "failed" else 0
                    },
                    "$set": {
                        "last_executed": start_time,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            logger.info(f"Workflow execution completed: {execution_id}")
            
            return {
                "success": result.get('success', True),
                "execution_id": execution_id,
                "status": execution.status,
                "output_data": result.get('output_data', {}),
                "nodes_executed": result.get('nodes_executed', []),
                "nodes_failed": result.get('nodes_failed', []),
                "duration_seconds": duration,
                "error_message": result.get('error_message')
            }
            
        except Exception as e:
            logger.error(f"Error executing workflow: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _execute_n8n_workflow(
        self,
        n8n_workflow_id: str,
        input_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute workflow via N8N"""
        try:
            result = await n8n_service.execute_workflow(n8n_workflow_id, input_data)
            
            if result.get('success'):
                return {
                    "success": True,
                    "status": "completed",
                    "output_data": result.get('data', {}),
                    "nodes_executed": ["n8n_workflow"],
                    "nodes_failed": []
                }
            else:
                return {
                    "success": False,
                    "status": "failed",
                    "output_data": {},
                    "nodes_executed": [],
                    "nodes_failed": ["n8n_workflow"],
                    "error_message": result.get('error')
                }
                
        except Exception as e:
            logger.error(f"Error executing N8N workflow: {str(e)}")
            return {
                "success": False,
                "status": "failed",
                "error_message": str(e)
            }
    
    async def _execute_local_workflow(
        self,
        workflow: Dict[str, Any],
        input_data: Dict[str, Any],
        dry_run: bool = False
    ) -> Dict[str, Any]:
        """Execute workflow locally (without N8N)"""
        try:
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            if not nodes:
                return {
                    "success": False,
                    "status": "failed",
                    "error_message": "No nodes in workflow"
                }
            
            # Find trigger node
            trigger_node = next((n for n in nodes if n.get('type') == 'trigger'), None)
            
            if not trigger_node:
                return {
                    "success": False,
                    "status": "failed",
                    "error_message": "No trigger node found"
                }
            
            # Initialize execution state
            execution_state = {
                "data": input_data,
                "nodes_executed": [],
                "nodes_failed": [],
                "output_data": {}
            }
            
            # Execute workflow starting from trigger
            await self._execute_node(
                trigger_node,
                nodes,
                connections,
                execution_state,
                dry_run
            )
            
            # Determine overall status
            if execution_state['nodes_failed']:
                status = "failed" if not execution_state['nodes_executed'] else "partial"
            else:
                status = "completed"
            
            return {
                "success": status in ["completed", "partial"],
                "status": status,
                "output_data": execution_state['output_data'],
                "nodes_executed": execution_state['nodes_executed'],
                "nodes_failed": execution_state['nodes_failed']
            }
            
        except Exception as e:
            logger.error(f"Error executing local workflow: {str(e)}")
            return {
                "success": False,
                "status": "failed",
                "error_message": str(e)
            }
    
    async def _execute_node(
        self,
        node: Dict[str, Any],
        all_nodes: List[Dict[str, Any]],
        connections: Dict[str, Any],
        execution_state: Dict[str, Any],
        dry_run: bool
    ):
        """Execute a single workflow node"""
        node_id = node.get('id')
        node_type = node.get('type')
        node_config = node.get('config', {})
        
        logger.info(f"Executing node: {node_id} ({node_type})")
        
        try:
            if dry_run:
                # Simulate execution
                execution_state['nodes_executed'].append(node_id)
                logger.info(f"Dry run - skipped node: {node_id}")
            else:
                # Execute node based on type
                if node_type == 'trigger':
                    # Trigger node just passes data through
                    execution_state['nodes_executed'].append(node_id)
                
                elif node_type == 'email':
                    await self._execute_email_node(node_config, execution_state)
                    execution_state['nodes_executed'].append(node_id)
                
                elif node_type == 'sms':
                    await self._execute_sms_node(node_config, execution_state)
                    execution_state['nodes_executed'].append(node_id)
                
                elif node_type == 'condition':
                    # Check condition and decide next path
                    result = self._evaluate_condition(node_config, execution_state['data'])
                    execution_state['output_data'][node_id] = result
                    execution_state['nodes_executed'].append(node_id)
                
                elif node_type == 'delay':
                    # Delay execution (in production, use task queue)
                    delay_seconds = node_config.get('seconds', 0)
                    if delay_seconds > 0:
                        await asyncio.sleep(min(delay_seconds, 60))  # Max 60 seconds
                    execution_state['nodes_executed'].append(node_id)
                
                elif node_type == 'webhook':
                    await self._execute_webhook_node(node_config, execution_state)
                    execution_state['nodes_executed'].append(node_id)
                
                elif node_type == 'data_transform':
                    result = self._transform_data(node_config, execution_state['data'])
                    execution_state['data'] = result
                    execution_state['nodes_executed'].append(node_id)
                
                else:
                    logger.warning(f"Unknown node type: {node_type}")
                    execution_state['nodes_executed'].append(node_id)
            
            # Execute next nodes
            next_node_ids = node.get('next_nodes', [])
            for next_id in next_node_ids:
                next_node = next((n for n in all_nodes if n.get('id') == next_id), None)
                if next_node:
                    await self._execute_node(
                        next_node,
                        all_nodes,
                        connections,
                        execution_state,
                        dry_run
                    )
            
        except Exception as e:
            logger.error(f"Error executing node {node_id}: {str(e)}")
            execution_state['nodes_failed'].append(node_id)
    
    async def _execute_email_node(self, config: Dict[str, Any], state: Dict[str, Any]):
        """Execute email node"""
        from app.services.email_automation import email_automation_service
        
        await email_automation_service.send_campaign_email(
            to_email=config.get('to'),
            to_name=config.get('name'),
            subject=config.get('subject'),
            html_content=config.get('html_content')
        )
    
    async def _execute_sms_node(self, config: Dict[str, Any], state: Dict[str, Any]):
        """Execute SMS node"""
        from app.services.sms import sms_service
        
        await sms_service.send_sms(
            to_number=config.get('to'),
            message=config.get('message')
        )
    
    async def _execute_webhook_node(self, config: Dict[str, Any], state: Dict[str, Any]):
        """Execute webhook node"""
        import httpx
        
        url = config.get('url')
        method = config.get('method', 'POST')
        data = config.get('data', state['data'])
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == 'POST':
                response = await client.post(url, json=data)
            else:
                response = await client.get(url)
            
            state['output_data']['webhook_response'] = response.json()
    
    def _evaluate_condition(self, config: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Evaluate condition node"""
        field = config.get('field')
        operator = config.get('operator')
        value = config.get('value')
        
        actual_value = data.get(field)
        
        if operator == 'equals':
            return actual_value == value
        elif operator == 'not_equals':
            return actual_value != value
        elif operator == 'greater_than':
            return actual_value > value
        elif operator == 'less_than':
            return actual_value < value
        elif operator == 'contains':
            return value in str(actual_value)
        else:
            return False
    
    def _transform_data(self, config: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform data based on configuration"""
        transformations = config.get('transformations', [])
        result = data.copy()
        
        for transform in transformations:
            operation = transform.get('operation')
            field = transform.get('field')
            
            if operation == 'rename':
                new_name = transform.get('new_name')
                if field in result:
                    result[new_name] = result.pop(field)
            
            elif operation == 'remove':
                result.pop(field, None)
            
            elif operation == 'set':
                value = transform.get('value')
                result[field] = value
        
        return result


# Create singleton instance
workflow_engine = WorkflowEngine()