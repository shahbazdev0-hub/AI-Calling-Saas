// frontend/src/utils/workflowUtils.js

/**
 * Generate unique node ID
 */
export const generateNodeId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate workflow structure
 */
export const validateWorkflow = (workflow) => {
  const errors = [];

  if (!workflow.name || workflow.name.trim() === '') {
    errors.push('Workflow name is required');
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  // Check for trigger node
  const hasTrigger = workflow.nodes.some(node => node.type === 'trigger');
  if (!hasTrigger) {
    errors.push('Workflow must have a trigger node');
  }

  // Check for orphaned nodes
  const connectedNodes = new Set();
  workflow.nodes.forEach(node => {
    if (node.next_nodes) {
      node.next_nodes.forEach(nextId => connectedNodes.add(nextId));
    }
  });

  const trigger = workflow.nodes.find(n => n.type === 'trigger');
  if (trigger) {
    connectedNodes.add(trigger.id);
  }

  const orphanedNodes = workflow.nodes.filter(
    node => node.type !== 'trigger' && !connectedNodes.has(node.id)
  );

  if (orphanedNodes.length > 0) {
    errors.push(`${orphanedNodes.length} orphaned node(s) found`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get node type icon
 */
export const getNodeIcon = (nodeType) => {
  const icons = {
    trigger: '⚡',
    action: '🎯',
    condition: '🔀',
    delay: '⏱️',
    webhook: '🌐',
    email: '📧',
    sms: '📱',
    api_call: '🔌',
    data_transform: '🔄',
    loop: '🔁',
    end: '🏁',
  };
  return icons[nodeType] || '📦';
};

/**
 * Get node type color
 */
export const getNodeColor = (nodeType) => {
  const colors = {
    trigger: 'bg-green-100 text-green-800 border-green-300',
    action: 'bg-blue-100 text-blue-800 border-blue-300',
    condition: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    delay: 'bg-purple-100 text-purple-800 border-purple-300',
    webhook: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    email: 'bg-pink-100 text-pink-800 border-pink-300',
    sms: 'bg-orange-100 text-orange-800 border-orange-300',
    api_call: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    data_transform: 'bg-teal-100 text-teal-800 border-teal-300',
    loop: 'bg-red-100 text-red-800 border-red-300',
    end: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[nodeType] || 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Format workflow execution time
 */
export const formatExecutionTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
};

/**
 * Get trigger type label
 */
export const getTriggerTypeLabel = (triggerType) => {
  const labels = {
    manual: 'Manual Trigger',
    webhook: 'Webhook',
    schedule: 'Scheduled',
    event: 'Event-Based',
    call_completed: 'Call Completed',
    form_submitted: 'Form Submitted',
    demo_booked: 'Demo Booked',
  };
  return labels[triggerType] || triggerType;
};

/**
 * Get action type label
 */
export const getActionTypeLabel = (actionType) => {
  const labels = {
    send_email: 'Send Email',
    send_sms: 'Send SMS',
    make_call: 'Make Call',
    create_contact: 'Create Contact',
    update_contact: 'Update Contact',
    update_crm: 'Update CRM',
    run_workflow: 'Run Workflow',
    webhook: 'Call Webhook',
    wait: 'Wait/Delay',
  };
  return labels[actionType] || actionType;
};

/**
 * Calculate workflow statistics
 */
export const calculateWorkflowStats = (workflows) => {
  const total = workflows.length;
  const active = workflows.filter(w => w.is_active).length;
  const paused = workflows.filter(w => !w.is_active).length;
  
  const totalExecutions = workflows.reduce((sum, w) => sum + w.total_executions, 0);
  const successfulExecutions = workflows.reduce((sum, w) => sum + w.successful_executions, 0);
  const failedExecutions = workflows.reduce((sum, w) => sum + w.failed_executions, 0);
  
  const avgSuccessRate = total > 0
    ? workflows.reduce((sum, w) => sum + w.success_rate, 0) / total
    : 0;

  return {
    total,
    active,
    paused,
    totalExecutions,
    successfulExecutions,
    failedExecutions,
    avgSuccessRate: avgSuccessRate.toFixed(2),
  };
};

/**
 * Export workflow as JSON
 */
export const exportWorkflow = (workflow) => {
  const exportData = {
    name: workflow.name,
    description: workflow.description,
    nodes: workflow.nodes,
    connections: workflow.connections,
    trigger_type: workflow.trigger_type,
    trigger_config: workflow.trigger_config,
    exported_at: new Date().toISOString(),
    version: workflow.version || 1,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `workflow_${workflow.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

/**
 * Import workflow from JSON
 */
export const importWorkflow = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target.result);
        
        // Validate imported data
        if (!workflowData.name || !workflowData.nodes) {
          reject(new Error('Invalid workflow file'));
          return;
        }
        
        resolve(workflowData);
      } catch (error) {
        reject(new Error('Failed to parse workflow file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read workflow file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Clone workflow
 */
export const cloneWorkflow = (workflow) => {
  return {
    ...workflow,
    id: undefined,
    name: `${workflow.name} (Copy)`,
    created_at: undefined,
    updated_at: undefined,
    total_executions: 0,
    successful_executions: 0,
    failed_executions: 0,
    success_rate: 0,
    executions: [],
  };
};

/**
 * Format automation trigger conditions
 */
export const formatTriggerConditions = (conditions) => {
  if (!conditions || Object.keys(conditions).length === 0) {
    return 'No conditions';
  }

  return Object.entries(conditions)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const [operator, operatorValue] = Object.entries(value)[0];
        return `${key} ${operator} ${operatorValue}`;
      }
      return `${key} = ${value}`;
    })
    .join(', ');
};

/**
 * Get status badge color
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    running: 'bg-indigo-100 text-indigo-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Calculate success rate color
 */
export const getSuccessRateColor = (rate) => {
  if (rate >= 90) return 'text-green-600';
  if (rate >= 70) return 'text-yellow-600';
  if (rate >= 50) return 'text-orange-600';
  return 'text-red-600';
};

export default {
  generateNodeId,
  validateWorkflow,
  getNodeIcon,
  getNodeColor,
  formatExecutionTime,
  getTriggerTypeLabel,
  getActionTypeLabel,
  calculateWorkflowStats,
  exportWorkflow,
  importWorkflow,
  cloneWorkflow,
  formatTriggerConditions,
  getStatusBadgeColor,
  getSuccessRateColor,
};