// frontend/src/services/analytics.js - NEW FILE

import api from "./api"

const analyticsService = {
  // Admin Analytics
  getAdminOverview: async (params = {}) => {
    try {
      const response = await api.get('/analytics/admin/overview', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching admin analytics overview:', error)
      throw error
    }
  },

  getUserAnalytics: async (userId) => {
    try {
      const response = await api.get(`/analytics/admin/user-analytics/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      throw error
    }
  },

  getCallDetails: async (params = {}) => {
    try {
      const response = await api.get('/analytics/admin/call-details', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching call details:', error)
      throw error
    }
  },

  exportAnalytics: async (format = 'json', params = {}) => {
    try {
      const response = await api.get('/analytics/admin/export', {
        params: { ...params, format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting analytics:', error)
      throw error
    }
  }
}

export default analyticsService