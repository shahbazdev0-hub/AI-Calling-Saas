// // frontend/src/services/email_logs.js - CORRECTED FILE

// import api from './api';

// export const emailLogsService = {
//   /**
//    * Get email logs with filtering and pagination
//    */
//   getEmailLogs: async (params = {}) => {
//     try {
//       const response = await api.get('/email-logs/', { params });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching email logs:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get detailed information about a specific email log
//    */
//   getEmailLogDetail: async (emailId) => {
//     try {
//       const response = await api.get(`/email-logs/${emailId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching email log detail:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get email statistics summary
//    */
//   getStats: async () => {
//     try {
//       const response = await api.get('/email-logs/stats/summary');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching email stats:', error);
//       throw error;
//     }
//   }
// };


// frontend/src/services/email_logs.js - âœ… UPDATED WITH REPLY FUNCTION

import api from './api';

export const emailLogsService = {
  /**
   * Get email logs with filtering and pagination
   */
  getEmailLogs: async (params = {}) => {
    try {
      const response = await api.get('/email-logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching email logs:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific email log
   */
  getEmailLogDetail: async (emailId) => {
    try {
      const response = await api.get(`/email-logs/${emailId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email log detail:', error);
      throw error;
    }
  },

  /**
   * âœ… NEW - Reply to an email
   */
  replyToEmail: async (replyData) => {
    try {
      const response = await api.post('/email-logs/reply', replyData);
      return response.data;
    } catch (error) {
      console.error('Error sending email reply:', error);
      throw error;
    }
  },

  /**
   * Get email statistics summary
   */
  getStats: async () => {
    try {
      const response = await api.get('/email-logs/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching email stats:', error);
      throw error;
    }
  }
};