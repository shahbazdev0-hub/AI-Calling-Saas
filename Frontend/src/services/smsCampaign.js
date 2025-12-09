// frontend/src/services/smsCampaign.js - NEW FILE

import api from './api';

const smsCampaignService = {
  // ============================================
  // CREATE CAMPAIGN
  // ============================================
  
  async createCampaign(data) {
    try {
      const response = await api.post('/sms-campaigns/create', data);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // ============================================
  // UPLOAD CSV
  // ============================================
  
  async uploadCSV(campaignId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(
        `/sms-campaigns/upload-csv/${campaignId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error uploading CSV:', error);
      throw error;
    }
  },

  // ============================================
  // ADD MANUAL RECIPIENTS
  // ============================================
  
  async addRecipients(campaignId, recipients) {
    try {
      const response = await api.post(
        `/sms-campaigns/add-recipients/${campaignId}`,
        recipients
      );
      return response.data;
    } catch (error) {
      console.error('Error adding recipients:', error);
      throw error;
    }
  },

  // ============================================
  // START CAMPAIGN
  // ============================================
  
  async startCampaign(campaignId) {
    try {
      const response = await api.post(`/sms-campaigns/start/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error starting campaign:', error);
      throw error;
    }
  },

  // ============================================
  // GET CAMPAIGN STATUS
  // ============================================
  
  async getCampaignStatus(campaignId) {
    try {
      const response = await api.get(`/sms-campaigns/status/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting campaign status:', error);
      throw error;
    }
  },

  // ============================================
  // GET CAMPAIGN DETAILS
  // ============================================
  
  async getCampaign(campaignId) {
    try {
      const response = await api.get(`/sms-campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting campaign:', error);
      throw error;
    }
  },

  // ============================================
  // LIST CAMPAIGNS
  // ============================================
  
  async listCampaigns(params = {}) {
    try {
      const response = await api.get('/sms-campaigns/', { params });
      return response.data;
    } catch (error) {
      console.error('Error listing campaigns:', error);
      throw error;
    }
  },

  // ============================================
  // DELETE CAMPAIGN
  // ============================================
  
  async deleteCampaign(campaignId) {
    try {
      const response = await api.delete(`/sms-campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // ============================================
  // PARSE CSV CLIENT-SIDE (PREVIEW)
  // ============================================
  
  parseCSVPreview(fileContent) {
    try {
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return { success: false, error: 'Empty file' };
      }
      
      // Parse header
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Find phone column
      const phoneIndex = headers.findIndex(h => 
        ['phone', 'phone_number', 'mobile', 'cell', 'number'].includes(h.toLowerCase())
      );
      
      // Find name column
      const nameIndex = headers.findIndex(h =>
        ['name', 'customer_name', 'full_name'].includes(h.toLowerCase())
      );
      
      const recipients = [];
      
      for (let i = 1; i < Math.min(lines.length, 101); i++) { // Preview first 100
        const values = lines[i].split(',').map(v => v.trim());
        
        const phone = values[phoneIndex >= 0 ? phoneIndex : 0];
        const name = nameIndex >= 0 ? values[nameIndex] : null;
        
        if (phone) {
          recipients.push({ phone_number: phone, name });
        }
      }
      
      return {
        success: true,
        recipients,
        total: recipients.length,
        has_more: lines.length > 101
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default smsCampaignService;