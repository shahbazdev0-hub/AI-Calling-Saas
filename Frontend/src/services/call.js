// // frontend/src/services/call.js - ✅ FINAL FIXED VERSION

// import api from "./api";

// export const callService = {
//   // ✅ FIXED: Create a new call with proper payload and response handling
//   createCall: async (callData) => {
//     // ✅ FIX: Build payload that exactly matches backend CallCreate schema
//     const backendData = {
//       phone_number: callData.phone_number || callData.phoneNumber,
//       direction: callData.direction || "outbound"
//     };
    
//     // ✅ FIX: Only add agent_id if it's provided and not null/empty
//     const agentId = callData.agent_id || callData.agentId;
//     if (agentId && agentId !== null && agentId !== '' && agentId !== 'null') {
//       backendData.agent_id = agentId;
//     }

//     console.log('📤 Sending call creation request:', backendData);
    
//     try {
//       const response = await api.post('/calls', backendData);
//       console.log('✅ Call creation response:', response.data);
      
//       // ✅ FIX: Backend returns { success: true, message: "...", call_id: "...", call: {...} }
//       // Return the call object from the nested 'call' property
//       if (response.data && response.data.call) {
//         return response.data.call;
//       }
      
//       // Fallback if structure is different
//       return response.data;
//     } catch (error) {
//       console.error('❌ Call creation error:', error.response?.data || error);
//       throw error;
//     }
//   },

//   // ✅ Get calls with proper parameter mapping
//   getCalls: async (params = {}) => {
//     // Map frontend parameters to backend expectations
//     const backendParams = {
//       skip: params.skip || 0,
//       limit: params.limit || 50,
//       status: params.status || '',
//       direction: params.direction || '',
//       from_date: params.from_date || '',
//       to_date: params.to_date || ''
//     };

//     // Remove empty parameters
//     Object.keys(backendParams).forEach(key => {
//       if (backendParams[key] === '' || backendParams[key] === null || backendParams[key] === undefined) {
//         delete backendParams[key];
//       }
//     });

//     console.log('📊 Sending call request with params:', backendParams);

//     const response = await api.get('/calls', { params: backendParams });
    
//     // ✅ Backend returns { success: true, calls: [...], total: X }
//     return response.data.calls || response.data;
//   },

//   // Get single call
//   getCall: async (callId) => {
//     const response = await api.get(`/calls/${callId}`);
    
//     // ✅ Backend returns { success: true, call: {...} }
//     return response.data.call || response.data;
//   },

//   // Update call
//   updateCall: async (callId, updateData) => {
//     const response = await api.patch(`/calls/${callId}`, updateData);
    
//     // ✅ Backend returns { success: true, message: "...", call: {...} }
//     return response.data.call || response.data;
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

//   // ✅ FIXED: Get call recording with proper error handling
//   getCallRecording: async (callId) => {
//     try {
//       const response = await api.get(`/calls/${callId}/recording`);
//       return response.data;
//     } catch (error) {
//       // If 404, it means no recording exists (old call or recording not ready)
//       if (error.response?.status === 404) {
//         console.log(`ℹ️ No recording available for call ${callId}`);
//         return { success: false, recordings: [] };
//       }
//       // For other errors, throw
//       throw error;
//     }
//   },

//   // ✅ NEW: Download recording from Twilio to backend server
//   downloadRecording: async (callId) => {
//     try {
//       console.log(`📥 Downloading recording for call ${callId}...`);
//       const response = await api.post(`/calls/${callId}/recording/download`);
//       console.log(`✅ Recording download response:`, response.data);
//       return response.data;
//     } catch (error) {
//       console.error(`❌ Error downloading recording for call ${callId}:`, error);
//       throw error;
//     }
//   },

//   // ✅ FIXED: Get local recording play URL with authentication token
//   getRecordingPlayUrl: (callId) => {
//     const baseURL = api.defaults.baseURL || 'http://localhost:8000/api/v1';
    
//     // ✅ FIXED: Use 'access_token' not 'token'
//     const token = localStorage.getItem('access_token');
    
//     // Include token as query parameter for audio streaming
//     const playUrl = `${baseURL}/calls/${callId}/recording/play?token=${token}`;
    
//     console.log(`🎵 Generated play URL with auth token`);
//     return playUrl;
//   },

//   // ✅ Get call log for specific call
//   getCallLog: async (callId) => {
//     const response = await api.get(`/calls/${callId}/log`);
//     return response.data;
//   },

//   // ✅ Get all call logs with filtering
//   getCallLogs: async (params = {}) => {
//     const backendParams = {
//       skip: params.skip || 0,
//       limit: params.limit || 50,
//       outcome: params.outcome || '',
//       sentiment: params.sentiment || '',
//       from_date: params.dateFrom || '',
//       to_date: params.dateTo || '',
//       search: params.search || ''
//     };

//     // Remove empty parameters
//     Object.keys(backendParams).forEach(key => {
//       if (backendParams[key] === '' || backendParams[key] === null || backendParams[key] === undefined) {
//         delete backendParams[key];
//       }
//     });

//     console.log('📋 Sending call logs request with params:', backendParams);

//     const response = await api.get('/calls/logs/all', { params: backendParams });
//     return response.data;
//   },

//   // Get call statistics
//   getCallStats: async () => {
//     const response = await api.get('/calls/stats/summary');
    
//     // ✅ Backend returns { success: true, stats: {...} }
//     return response.data.stats || response.data;
//   }
// };

// export default callService;



// frontend/src/services/call.js - ✅ FINAL FIXED VERSION

import api from "./api";

export const callService = {
  // ✅ FIXED: Create a new call with proper payload and response handling
  createCall: async (callData) => {
    // ✅ FIX: Build payload that exactly matches backend CallCreate schema
    const backendData = {
      phone_number: callData.phone_number || callData.phoneNumber,
      direction: callData.direction || "outbound"
    };
    
    // ✅ FIX: Only add agent_id if it's provided and not null/empty
    const agentId = callData.agent_id || callData.agentId;
    if (agentId && agentId !== null && agentId !== '' && agentId !== 'null') {
      backendData.agent_id = agentId;
    }

    console.log('📤 Sending call creation request:', backendData);
    
    try {
      const response = await api.post('/calls', backendData);
      console.log('✅ Call creation response:', response.data);
      
      // ✅ FIX: Backend returns { success: true, message: "...", call_id: "...", call: {...} }
      // Return the call object from the nested 'call' property
      if (response.data && response.data.call) {
        return response.data.call;
      }
      
      // Fallback if structure is different
      return response.data;
    } catch (error) {
      console.error('❌ Call creation error:', error.response?.data || error);
      throw error;
    }
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
    
    // ✅ Backend returns { success: true, calls: [...], total: X }
    return response.data.calls || response.data;
  },

  // Get single call
  getCall: async (callId) => {
    const response = await api.get(`/calls/${callId}`);
    
    // ✅ Backend returns { success: true, call: {...} }
    return response.data.call || response.data;
  },

  // Update call
  updateCall: async (callId, updateData) => {
    const response = await api.patch(`/calls/${callId}`, updateData);
    
    // ✅ Backend returns { success: true, message: "...", call: {...} }
    return response.data.call || response.data;
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

  // ✅ NEW: Download recording from Twilio to backend server
  downloadRecording: async (callId) => {
    try {
      console.log(`📥 Downloading recording for call ${callId}...`);
      const response = await api.post(`/calls/${callId}/recording/download`);
      console.log(`✅ Recording download response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error downloading recording for call ${callId}:`, error);
      throw error;
    }
  },

  // ✅ FIXED: Get local recording play URL with authentication token
  getRecordingPlayUrl: (callId) => {
    const baseURL = api.defaults.baseURL || 'http://localhost:8000/api/v1';
    
    // ✅ FIXED: Use 'access_token' not 'token'
    const token = localStorage.getItem('access_token');
    
    // Include token as query parameter for audio streaming
    const playUrl = `${baseURL}/calls/${callId}/recording/play?token=${token}`;
    
    console.log(`🎵 Generated play URL with auth token`);
    return playUrl;
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
    
    // ✅ FIX: Return logs array directly (backend sends { logs: [...] })
    return response.data.logs || [];
  },

  // Get call statistics
  getCallStats: async () => {
    const response = await api.get('/calls/stats/summary');
    
    // ✅ Backend returns { success: true, stats: {...} }
    return response.data.stats || response.data;
  }
};

export default callService;