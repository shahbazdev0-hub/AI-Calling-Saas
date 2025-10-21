// frontend/src/services/workflow.js - Milestone 3

import api from './api';

const workflowAPI = {
  // Get all workflows
  getWorkflows: (params = {}) => {
    return api.get('/workflows', { params });
  },

  // Get single workflow
  getWorkflow: (id) => {
    return api.get(`/workflows/${id}`);
  },

  // Create workflow
  createWorkflow: (data) => {
    return api.post('/workflows', data);
  },

  // Update workflow
  updateWorkflow: (id, data) => {
    return api.patch(`/workflows/${id}`, data);
  },

  // Delete workflow
  deleteWorkflow: (id) => {
    return api.delete(`/workflows/${id}`);
  },

  // Execute workflow
  executeWorkflow: (id, data) => {
    return api.post(`/workflows/${id}/execute`, data);
  },

  // Get workflow executions
  getWorkflowExecutions: (id, params = {}) => {
    return api.get(`/workflows/${id}/executions`, { params });
  }
};

export default workflowAPI;