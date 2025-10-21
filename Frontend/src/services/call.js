// // frontend/src/services/call.js
// import api from "./api";

// export const callService = {
//   // Create a new call - FIXED field mapping
//   createCall: async (callData) => {
//     // Map frontend fields to backend fields
//     const backendData = {
//       phone_number: callData.phoneNumber || callData.phone_number,
//       agent_id: callData.agentId || callData.agent_id || null,
//       direction: "outbound"
//     };
    
//     const response = await api.post('/calls', backendData);
//     return response.data;
//   },

//   // Get all calls
//   getCalls: async (params = {}) => {
//     const response = await api.get('/calls', { params });
//     return response.data;
//   },

//   // Get single call
//   getCall: async (callId) => {
//     const response = await api.get(`/calls/${callId}`);
//     return response.data;
//   },

//   // Update call
//   updateCall: async (callId, updateData) => {
//     const response = await api.patch(`/calls/${callId}`, updateData);
//     return response.data;
//   },

//   // Delete call
//   deleteCall: async (callId) => {
//     await api.delete(`/calls/${callId}`);
//   },

//   // Hangup call
//   hangupCall: async (callId) => {
//     const response = await api.post(`/calls/${callId}/hangup`);
//     return response.data;
//   },

//   // Get call recording
//   getCallRecording: async (callId) => {
//     const response = await api.get(`/calls/${callId}/recording`);
//     return response.data;
//   },

//   // Get call log
//   getCallLog: async (callId) => {
//     const response = await api.get(`/calls/${callId}/log`);
//     return response.data;
//   },

//   // Get call statistics - FIXED endpoint
//   getCallStats: async () => {
//     const response = await api.get('/calls/stats');
//     return response.data;
//   }
// };

// export default callService;





// frontend/src/services/call.js - FIXED API calls
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

  // ✅ FIXED: Get calls with proper parameter mapping
  getCalls: async (params = {}) => {
    // Map frontend parameters to backend expectations
    const backendParams = {
      skip: params.skip || 0,
      limit: params.limit || 50,
      status: params.status || '',  // ✅ FIXED: Use 'status' not 'status_filter'
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

  // Get call recording
  getCallRecording: async (callId) => {
    const response = await api.get(`/calls/${callId}/recording`);
    return response.data;
  },

  // ✅ FIXED: Get call log for specific call
  getCallLog: async (callId) => {
    const response = await api.get(`/calls/${callId}/log`);
    return response.data;
  },

  // ✅ NEW: Get all call logs with filtering
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