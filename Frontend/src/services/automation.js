// frontend/src/services/automation.js - Milestone 3

import api from './api';

// ============================================
// AUTOMATION API
// ============================================

export const automationAPI = {
  // Get all automations
  getAutomations: (params = {}) => {
    return api.get('/automation', { params });
  },

  // Get single automation
  getAutomation: (id) => {
    return api.get(`/automation/${id}`);
  },

  // Create automation
  createAutomation: (data) => {
    return api.post('/automation', data);
  },

  // Update automation
  updateAutomation: (id, data) => {
    return api.patch(`/automation/${id}`, data);
  },

  // Delete automation
  deleteAutomation: (id) => {
    return api.delete(`/automation/${id}`);
  },

  // Trigger automation manually
  triggerAutomation: (id, data) => {
    return api.post(`/automation/${id}/trigger`, data);
  },

  // Test automation
  testAutomation: (id, data) => {
    return api.post(`/automation/${id}/test`, data);
  },

  // Toggle automation active status
  toggleAutomation: (id, isActive) => {
    return api.post(`/automation/${id}/toggle`, null, {
      params: { is_active: isActive }
    });
  },

  // Get automation logs
  getAutomationLogs: (id, params = {}) => {
    return api.get(`/automation/${id}/logs`, { params });
  },

  // Get automation statistics
  getAutomationStats: () => {
    return api.get('/automation/stats');
  }
};

// ============================================
// SMS API
// ============================================

export const smsAPI = {
  // Send single SMS
  sendSMS: (data) => {
    return api.post('/sms/send', data);
  },

  // Send bulk SMS
  sendBulkSMS: (data) => {
    return api.post('/sms/bulk', data);
  },

  // Get SMS messages
  getSMSMessages: (params = {}) => {
    return api.get('/sms', { params });
  },

  // Get single SMS
  getSMS: (id) => {
    return api.get(`/sms/${id}`);
  },

  // Get SMS stats
  getSMSStats: () => {
    return api.get('/sms/stats');
  },

  // Delete SMS
  deleteSMS: (id) => {
    return api.delete(`/sms/${id}`);
  }
};

// ============================================
// EMAIL API
// ============================================

export const emailAPI = {
  // Create campaign
  createCampaign: (data) => {
    return api.post('/email/campaigns', data);
  },

  // Get campaigns
  getCampaigns: (params = {}) => {
    return api.get('/email/campaigns', { params });
  },

  // Get single campaign
  getCampaign: (id) => {
    return api.get(`/email/campaigns/${id}`);
  },

  // Update campaign
  updateCampaign: (id, data) => {
    return api.patch(`/email/campaigns/${id}`, data);
  },

  // Delete campaign
  deleteCampaign: (id) => {
    return api.delete(`/email/campaigns/${id}`);
  },

  // Send campaign
  sendCampaign: (id) => {
    return api.post(`/email/campaigns/${id}/send`);
  },

  // Send single email
  sendEmail: (data) => {
    return api.post('/email/send', data);
  },

  // Create template
  createTemplate: (data) => {
    return api.post('/email/templates', data);
  },

  // Get templates
  getTemplates: (params = {}) => {
    return api.get('/email/templates', { params });
  }
};

// Export all as default
export default {
  automation: automationAPI,
  sms: smsAPI,
  email: emailAPI
};