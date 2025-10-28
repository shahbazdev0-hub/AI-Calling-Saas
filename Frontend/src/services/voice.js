// // services without campaign builder 
// import api from "./api";

// export const voiceService = {
//   // Voice Agents
//   createAgent: async (agentData) => {
//     const response = await api.post('/voice/agents', agentData);
//     return response.data;
//   },

//   getAgents: async (params = {}) => {
//     const response = await api.get('/voice/agents', { params });
//     return response.data;
//   },

//   getAgent: async (agentId) => {
//     const response = await api.get(`/voice/agents/${agentId}`);
//     return response.data;
//   },

//   updateAgent: async (agentId, updateData) => {
//     const response = await api.patch(`/voice/agents/${agentId}`, updateData);
//     return response.data;
//   },

//   deleteAgent: async (agentId) => {
//     await api.delete(`/voice/agents/${agentId}`);
//   },

//   // Test voice
//   testVoice: async (testData) => {
//     const response = await api.post('/voice/test', testData);
//     return response.data;
//   },

//   // Get available voices
//   getAvailableVoices: async () => {
//     const response = await api.get('/voice/voices');
//     return response.data;
//   },

//   // Test agent
//   testAgent: async (agentId, message) => {
//     const response = await api.post(`/ai-agents/agents/${agentId}/test`, null, {
//       params: { test_message: message }
//     });
//     return response.data;
//   },

//   // Get agent performance
//   getAgentPerformance: async (agentId) => {
//     const response = await api.get(`/ai-agents/agents/${agentId}/performance`);
//     return response.data;
//   },

//   // Clone agent
//   cloneAgent: async (agentId, newName) => {
//     const response = await api.post(`/ai-agents/agents/${agentId}/clone`, null, {
//       params: { new_name: newName }
//     });
//     return response.data;
//   }
// };

// export default voiceService;



// frontend/src/services/voice.js - with campaign builder 

import api from "./api";

export const voiceService = {
  // Voice Agents
  createAgent: async (agentData) => {
    const response = await api.post('/voice/agents', agentData);
    return response.data;
  },

  getAgents: async (params = {}) => {
    const response = await api.get('/voice/agents', { params });
    return response.data;
  },

  getAgent: async (agentId) => {
    const response = await api.get(`/voice/agents/${agentId}`);
    return response.data;
  },

  updateAgent: async (agentId, updateData) => {
    const response = await api.patch(`/voice/agents/${agentId}`, updateData);
    return response.data;
  },

  deleteAgent: async (agentId) => {
    await api.delete(`/voice/agents/${agentId}`);
  },

  // ✅ FIXED: Correct endpoint for available voices
  getAvailableVoices: async () => {
    const response = await api.get('/voice/available-voices');
    return response.data;
  },

  // Test voice
  testVoice: async (testData) => {
    const response = await api.post('/voice/test-voice', testData);
    return response.data;
  },

  // Test agent
  testAgent: async (agentId, message) => {
    const response = await api.post(`/ai-agents/agents/${agentId}/test`, null, {
      params: { test_message: message }
    });
    return response.data;
  },

  // Get agent performance
  getAgentPerformance: async (agentId) => {
    const response = await api.get(`/ai-agents/agents/${agentId}/performance`);
    return response.data;
  },

  // Clone agent
  cloneAgent: async (agentId, newName) => {
    const response = await api.post(`/ai-agents/agents/${agentId}/clone`, null, {
      params: { new_name: newName }
    });
    return response.data;
  }
};

export default voiceService;