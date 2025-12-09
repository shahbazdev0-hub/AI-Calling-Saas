// // frontend/src/services/voice.js - COMPLETE WITH BULK & RAG SUPPORT

// import api from "./api";

// export const voiceService = {
//   // ============================================
//   // VOICE AGENT CRUD
//   // ============================================
  
//   /**
//    * Create new voice agent
//    * @param {Object} agentData - Agent configuration
//    * @returns {Promise<Object>} Created agent data
//    */
//   createAgent: async (agentData) => {
//     try {
//       console.log('📤 Creating agent:', agentData);
//       const response = await api.post('/voice/agents', agentData);
//       console.log('✅ Agent created:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to create agent:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get all agents for current user
//    * @param {Object} params - Query parameters
//    * @returns {Promise<Object>} List of agents
//    */
//   getAgents: async (params = {}) => {
//     try {
//       const response = await api.get('/voice/agents', { params });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch agents:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get single agent by ID
//    * @param {string} agentId - Agent ID
//    * @returns {Promise<Object>} Agent data
//    */
//   getAgent: async (agentId) => {
//     try {
//       const response = await api.get(`/voice/agents/${agentId}`);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch agent:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update agent configuration
//    * @param {string} agentId - Agent ID
//    * @param {Object} updateData - Fields to update
//    * @returns {Promise<Object>} Updated agent data
//    */
//   updateAgent: async (agentId, updateData) => {
//     try {
//       console.log('📝 Updating agent:', agentId, updateData);
//       const response = await api.patch(`/voice/agents/${agentId}`, updateData);
//       console.log('✅ Agent updated:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to update agent:', error);
//       throw error;
//     }
//   },

//   /**
//    * Delete agent
//    * @param {string} agentId - Agent ID
//    * @returns {Promise<void>}
//    */
//   deleteAgent: async (agentId) => {
//     try {
//       console.log('🗑️ Deleting agent:', agentId);
//       await api.delete(`/voice/agents/${agentId}`);
//       console.log('✅ Agent deleted');
//     } catch (error) {
//       console.error('❌ Failed to delete agent:', error);
//       throw error;
//     }
//   },

//   // ============================================
//   // BULK CAMPAIGN EXECUTION
//   // ============================================

//   /**
//    * Execute bulk calling campaign
//    * @param {string} agentId - Agent ID to use
//    * @returns {Promise<Object>} Campaign results
//    */
//   executeBulkCampaign: async (agentId) => {
//     try {
//       console.log('🚀 Starting bulk campaign for agent:', agentId);
      
//       // ✅ FIXED: Send empty object as body (agent already has contacts in DB)
//       const response = await api.post(
//         `/voice/agents/${agentId}/execute-campaign`,
//         {}  // ✅ Empty body - backend will fetch contacts from agent
//       );
      
//       console.log('✅ Campaign completed:', response.data);
//       return response.data;
      
//     } catch (error) {
//       console.error('❌ Campaign failed:', error);
//       throw error;
//     }
//   },

//   // ============================================
//   // DOCUMENT UPLOAD & MANAGEMENT (RAG)
//   // ============================================

//   /**
//    * Upload training document for agent
//    * @param {string} agentId - Agent ID
//    * @param {File} file - Document file (PDF, DOCX, TXT)
//    * @returns {Promise<Object>} Upload result with document ID
//    */
//   uploadDocument: async (agentId, file) => {
//     try {
//       console.log('📄 Uploading document:', file.name, 'for agent:', agentId);
      
//       // Create FormData
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Upload with multipart/form-data
//       const response = await api.post(
//         `/voice/agents/${agentId}/documents`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           },
//           // Track upload progress
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             console.log(`Upload progress: ${percentCompleted}%`);
//           }
//         }
//       );
      
//       console.log('✅ Document uploaded:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to upload document:', error);
      
//       // Extract error message
//       const errorMessage = error.response?.data?.detail || 
//                           error.response?.data?.error || 
//                           'Failed to upload document';
      
//       throw new Error(errorMessage);
//     }
//   },

//   /**
//    * Get all training documents for agent
//    * @param {string} agentId - Agent ID
//    * @returns {Promise<Object>} List of documents
//    */
//   getDocuments: async (agentId) => {
//     try {
//       const response = await api.get(`/voice/agents/${agentId}/documents`);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch documents:', error);
//       throw error;
//     }
//   },

//   /**
//    * Delete training document
//    * @param {string} agentId - Agent ID
//    * @param {string} documentId - Document ID
//    * @returns {Promise<void>}
//    */
//   deleteDocument: async (agentId, documentId) => {
//     try {
//       console.log('🗑️ Deleting document:', documentId);
//       await api.delete(`/voice/agents/${agentId}/documents/${documentId}`);
//       console.log('✅ Document deleted');
//     } catch (error) {
//       console.error('❌ Failed to delete document:', error);
//       throw error;
//     }
//   },

//   // ============================================
//   // VOICE TESTING
//   // ============================================

//   /**
//    * Get available ElevenLabs voices
//    * @returns {Promise<Object>} List of voices
//    */
//   getAvailableVoices: async () => {
//     try {
//       const response = await api.get('/voice/available-voices');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch voices:', error);
//       throw error;
//     }
//   },

//   /**
//    * Test a voice by generating sample audio
//    * @param {string} voiceId - Voice ID to test
//    * @param {string} text - Text to synthesize (optional)
//    * @returns {Promise<Object>} Audio URL
//    */
//   testVoice: async (voiceId, text = "Hello! This is a test of the voice synthesis.") => {
//     try {
//       console.log('🎵 Testing voice:', voiceId);
      
//       const response = await api.post('/voice/test-voice', {
//         voice_id: voiceId,
//         text: text
//       });
      
//       console.log('✅ Voice test response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to test voice:', error);
//       throw error;
//     }
//   },

//   // ============================================
//   // LEGACY METHODS (Keep for backward compatibility)
//   // ============================================

//   /**
//    * Test agent with a message
//    * @deprecated Use agent executor through call flow instead
//    */
//   testAgent: async (agentId, message) => {
//     try {
//       const response = await api.post(
//         `/ai-agents/agents/${agentId}/test`,
//         null,
//         { params: { test_message: message } }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to test agent:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get agent performance metrics
//    * @deprecated Will be replaced with analytics endpoint
//    */
//   getAgentPerformance: async (agentId) => {
//     try {
//       const response = await api.get(`/ai-agents/agents/${agentId}/performance`);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch performance:', error);
//       throw error;
//     }
//   },

//   /**
//    * Clone agent
//    * @deprecated Not implemented in new system
//    */
//   cloneAgent: async (agentId, newName) => {
//     try {
//       const response = await api.post(
//         `/ai-agents/agents/${agentId}/clone`,
//         null,
//         { params: { new_name: newName } }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to clone agent:', error);
//       throw error;
//     }
//   }
// };

// export default voiceService;


// frontend/src/services/voice.js - COMPLETE WITH BULK & RAG SUPPORT

import api from "./api";

export const voiceService = {
  // ============================================
  // VOICE AGENT CRUD
  // ============================================
  
  /**
   * Create new voice agent
   * @param {Object} agentData - Agent configuration
   * @returns {Promise<Object>} Created agent data
   */
  createAgent: async (agentData) => {
    try {
      console.log('📤 Creating agent:', agentData);
      const response = await api.post('/voice/agents', agentData);
      console.log('✅ Agent created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create agent:', error);
      throw error;
    }
  },

  /**
   * Get all agents for current user
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of agents
   */
  getAgents: async (params = {}) => {
    try {
      const response = await api.get('/voice/agents', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch agents:', error);
      throw error;
    }
  },

  /**
   * Get single agent by ID
   * @param {string} agentId - Agent ID
   * @returns {Promise<Object>} Agent data
   */
  getAgent: async (agentId) => {
    try {
      const response = await api.get(`/voice/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch agent:', error);
      throw error;
    }
  },

  /**
   * Update agent configuration
   * @param {string} agentId - Agent ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated agent data
   */
  updateAgent: async (agentId, updateData) => {
    try {
      console.log('📝 Updating agent:', agentId, updateData);
      const response = await api.patch(`/voice/agents/${agentId}`, updateData);
      console.log('✅ Agent updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update agent:', error);
      throw error;
    }
  },

  /**
   * Delete agent
   * @param {string} agentId - Agent ID
   * @returns {Promise<void>}
   */
  deleteAgent: async (agentId) => {
    try {
      console.log('🗑️ Deleting agent:', agentId);
      await api.delete(`/voice/agents/${agentId}`);
      console.log('✅ Agent deleted');
    } catch (error) {
      console.error('❌ Failed to delete agent:', error);
      throw error;
    }
  },

  // ============================================
  // BULK CAMPAIGN EXECUTION
  // ============================================

  /**
   * Execute bulk calling campaign
   * @param {string} agentId - Agent ID to use
   * @returns {Promise<Object>} Campaign results
   */
  executeBulkCampaign: async (agentId) => {
    try {
      console.log('🚀 Starting bulk campaign for agent:', agentId);
      
      // ✅ FIXED: Send empty object as body (agent already has contacts in DB)
      const response = await api.post(
        `/voice/agents/${agentId}/execute-campaign`,
        {}  // ✅ Empty body - backend will fetch contacts from agent
      );
      
      console.log('✅ Campaign completed:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Campaign failed:', error);
      throw error;
    }
  },

  // ============================================
  // DOCUMENT UPLOAD & MANAGEMENT (RAG)
  // ============================================

  /**
   * Upload training document for agent
   * @param {string} agentId - Agent ID
   * @param {File} file - Document file (PDF, DOCX, TXT)
   * @returns {Promise<Object>} Upload result with document ID
   */
  uploadDocument: async (agentId, file) => {
    try {
      console.log('📄 Uploading document:', file.name, 'for agent:', agentId);
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // ✅ FIXED: Correct endpoint
      const response = await api.post(
        `/voice/agents/${agentId}/upload-training-doc`,  // ✅ Changed from /documents
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      );
      
      console.log('✅ Document uploaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload document:', error);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to upload document';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Get training documents for agent
   * @param {string} agentId - Agent ID
   * @returns {Promise<Object>} List of documents
   */
  getDocuments: async (agentId) => {
    try {
      console.log('📚 Fetching documents for agent:', agentId);
      const response = await api.get(`/voice/agents/${agentId}/training-docs`);
      console.log('✅ Documents loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch documents:', error);
      throw error;
    }
  },

  /**
   * Delete training document
   * @param {string} agentId - Agent ID
   * @param {string} docId - Document ID
   * @returns {Promise<Object>} Deletion result
   */
  deleteDocument: async (agentId, docId) => {
    try {
      console.log('🗑️ Deleting document:', docId);
      const response = await api.delete(`/voice/agents/${agentId}/training-docs/${docId}`);
      console.log('✅ Document deleted');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw error;
    }
  },

  // ============================================
  // VOICE TESTING
  // ============================================

  /**
   * Get available ElevenLabs voices
   * @returns {Promise<Object>} List of voices
   */
  getAvailableVoices: async () => {
    try {
      const response = await api.get('/voice/available-voices');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch voices:', error);
      throw error;
    }
  },

  /**
   * Test a voice by generating sample audio
   * @param {string} voiceId - Voice ID to test
   * @param {string} text - Text to synthesize (optional)
   * @returns {Promise<Object>} Audio URL
   */
  testVoice: async (voiceId, text = "Hello! This is a test of the voice synthesis.") => {
    try {
      console.log('🎵 Testing voice:', voiceId);
      
      const response = await api.post('/voice/test-voice', {
        voice_id: voiceId,
        text: text
      });
      
      console.log('✅ Voice test response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to test voice:', error);
      throw error;
    }
  },

  // ============================================
  // LEGACY METHODS (Keep for backward compatibility)
  // ============================================

  /**
   * Test agent with a message
   * @deprecated Use agent executor through call flow instead
   */
  testAgent: async (agentId, message) => {
    try {
      const response = await api.post(
        `/ai-agents/agents/${agentId}/test`,
        null,
        { params: { test_message: message } }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to test agent:', error);
      throw error;
    }
  },

  /**
   * Get agent performance metrics
   * @deprecated Will be replaced with analytics endpoint
   */
  getAgentPerformance: async (agentId) => {
    try {
      const response = await api.get(`/ai-agents/agents/${agentId}/performance`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch performance:', error);
      throw error;
    }
  },

  /**
   * Clone agent
   * @deprecated Not implemented in new system
   */
  cloneAgent: async (agentId, newName) => {
    try {
      const response = await api.post(
        `/ai-agents/agents/${agentId}/clone`,
        null,
        { params: { new_name: newName } }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to clone agent:', error);
      throw error;
    }
  }
};

export default voiceService;