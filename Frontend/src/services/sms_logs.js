// frontend/src/services/sms_logs.js - CORRECTED FILE

import api from './api';

export const smsLogsService = {
  /**
   * Get SMS logs with filtering and pagination
   */
  getSMSLogs: async (params = {}) => {
    try {
      const response = await api.get('/sms-logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific SMS log
   */
  getSMSLogDetail: async (smsId) => {
    try {
      const response = await api.get(`/sms-logs/${smsId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS log detail:', error);
      throw error;
    }
  },

  /**
   * Reply to an SMS message
   */
  replySMS: async (replyData) => {
    try {
      const response = await api.post('/sms-logs/reply', replyData);
      return response.data;
    } catch (error) {
      console.error('Error sending SMS reply:', error);
      throw error;
    }
  },

  /**
   * Get SMS statistics summary
   */
  getStats: async () => {
    try {
      const response = await api.get('/sms-logs/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS stats:', error);
      throw error;
    }
  }
};