// frontend/src/services/flow.js - NEW SERVICE FOR AI CAMPAIGN WORKFLOWS

import api from "./api";

export const flowService = {
  // Get all flows/workflows
  getFlows: async (params = {}) => {
    const response = await api.get('/flows', { params });
    return response.data;
  },

  // Get single flow
  getFlow: async (flowId) => {
    const response = await api.get(`/flows/${flowId}`);
    return response.data;
  },

  // Create new flow
  createFlow: async (flowData) => {
    const response = await api.post('/flows', flowData);
    return response.data;
  },

  // Update flow
  updateFlow: async (flowId, flowData) => {
    const response = await api.put(`/flows/${flowId}`, flowData);
    return response.data;
  },

  // Delete flow
  deleteFlow: async (flowId) => {
    await api.delete(`/flows/${flowId}`);
  }
};

export default flowService;