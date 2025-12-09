// frontend/src/services/bulkCampaign.js 

import api from './api';

export const bulkCampaignService = {
  // Create campaign
  async createCampaign(data) {
    const response = await api.post('/bulk-campaigns', data);
    return response.data;
  },

  // Upload CSV
  async uploadCSV(campaignId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/bulk-campaigns/${campaignId}/upload-csv`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  // Add manual recipients
  async addManualRecipients(campaignId, recipients) {
    const response = await api.post(
      `/bulk-campaigns/${campaignId}/add-manual`,
      { recipients }
    );
    return response.data;
  },

  // Start campaign
  async startCampaign(campaignId, maxConcurrent = 1) {
    const response = await api.post(
      `/bulk-campaigns/${campaignId}/start`,
      { campaign_id: campaignId, max_concurrent_calls: maxConcurrent }
    );
    return response.data;
  },

  // Pause campaign
  async pauseCampaign(campaignId) {
    const response = await api.post(`/bulk-campaigns/${campaignId}/pause`);
    return response.data;
  },

  // Get campaign status
  async getCampaignStatus(campaignId) {
    const response = await api.get(`/bulk-campaigns/${campaignId}/status`);
    return response.data;
  },

  // Get recipients
  async getRecipients(campaignId, skip = 0, limit = 50) {
    const response = await api.get(
      `/bulk-campaigns/${campaignId}/recipients?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  // ✅ FIX: Add getCampaigns method (was listCampaigns)
  async getCampaigns(skip = 0, limit = 20) {
    const response = await api.get(`/bulk-campaigns?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // ✅ ALSO keep listCampaigns for backwards compatibility
  async listCampaigns(skip = 0, limit = 20) {
    return this.getCampaigns(skip, limit);
  },

  // Get single campaign
  async getCampaign(campaignId) {
    const response = await api.get(`/bulk-campaigns/${campaignId}`);
    return response.data;
  },

  // Delete campaign
  async deleteCampaign(campaignId) {
    const response = await api.delete(`/bulk-campaigns/${campaignId}`);
    return response.data;
  },

  // Download template
  async downloadTemplate() {
    const response = await api.get('/bulk-campaigns/download-template', {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default bulkCampaignService;