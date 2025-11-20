// frontend/src/services/call.js - ✅ COMPLETE FIXED VERSION
import api from "./api";

export const callService = {
  // Create a new call
  createCall: async (callData) => {
    const backendData = {
      phone_number: callData.phoneNumber || callData.phone_number,
      agent_id: callData.agentId || callData.agent_id || null,
      direction: "outbound"
    };
    
    const response = await api.post('/calls', backendData);
    return response.data;
  },

  // ✅ Get calls with proper parameter mapping
  getCalls: async (params = {}) => {
    // Map frontend parameters to backend expectations
    const backendParams = {
      skip: params.skip || 0,
      limit: params.limit || 50,
      status: params.status || '',
      direction: params.direction || '',
      from_date: params.from_date || '',
      to_date: params.to_date || ''
    };

    // Remove empty parameters
    Object.keys(backendParams).forEach(key => {
      if (backendParams[key] === '' || backendParams[key] === null || backendParams[key] === undefined) {
        delete backendParams[key];
      }
    });

    console.log('📊 Sending call request with params:', backendParams);

    const response = await api.get('/calls', { params: backendParams });
    return response.data;
  },

  // Get single call
  getCall: async (callId) => {
    const response = await api.get(`/calls/${callId}`);
    return response.data;
  },

  // Update call
  updateCall: async (callId, updateData) => {
    const response = await api.patch(`/calls/${callId}`, updateData);
    return response.data;
  },

  // Delete call
  deleteCall: async (callId) => {
    await api.delete(`/calls/${callId}`);
  },

  // Hangup call
  hangupCall: async (callId) => {
    const response = await api.post(`/calls/${callId}/hangup`);
    return response.data;
  },

  // ✅ FIXED: Get call recording with proper error handling
  getCallRecording: async (callId) => {
    try {
      const response = await api.get(`/calls/${callId}/recording`);
      return response.data;
    } catch (error) {
      // If 404, it means no recording exists (old call or recording not ready)
      if (error.response?.status === 404) {
        console.log(`ℹ️ No recording available for call ${callId}`);
        return { success: false, recordings: [] };
      }
      // For other errors, throw
      throw error;
    }
  },

  // ✅ Get call log for specific call
  getCallLog: async (callId) => {
    const response = await api.get(`/calls/${callId}/log`);
    return response.data;
  },

  // ✅ Get all call logs with filtering
  getCallLogs: async (params = {}) => {
    const backendParams = {
      skip: params.skip || 0,
      limit: params.limit || 50,
      outcome: params.outcome || '',
      sentiment: params.sentiment || '',
      from_date: params.dateFrom || '',
      to_date: params.dateTo || '',
      search: params.search || ''
    };

    // Remove empty parameters
    Object.keys(backendParams).forEach(key => {
      if (backendParams[key] === '' || backendParams[key] === null || backendParams[key] === undefined) {
        delete backendParams[key];
      }
    });

    console.log('📋 Sending call logs request with params:', backendParams);

    const response = await api.get('/calls/logs/all', { params: backendParams });
    return response.data;
  },

  // Get call statistics
  getCallStats: async () => {
    const response = await api.get('/calls/stats/summary');
    return response.data;
  }
};

export default callService;