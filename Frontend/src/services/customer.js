// frontend/src/services/customer.js
import api from './api';

const customerService = {
  // Get all customers with pagination and filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const response = await api.get(`/customers?${queryParams.toString()}`);
    return response.data;
  },

  // Get single customer by ID
  getById: async (customerId) => {
    const response = await api.get(`/customers/${customerId}`);
    return response.data;
  },

  // Create new customer
  create: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  update: async (customerId, customerData) => {
    const response = await api.put(`/customers/${customerId}`, customerData);
    return response.data;
  },

  // Delete customer
  delete: async (customerId) => {
    const response = await api.delete(`/customers/${customerId}`);
    return response.data;
  },

  // Get customer's appointments
  getAppointments: async (customerId) => {
    const response = await api.get(`/customers/${customerId}/appointments`);
    return response.data;
  },

  // Get customer's call history
  getCallHistory: async (customerId) => {
    const response = await api.get(`/customers/${customerId}/calls`);
    return response.data;
  },

  // Get customer's interaction timeline
  getTimeline: async (customerId) => {
    const response = await api.get(`/customers/${customerId}/timeline`);
    return response.data;
  },

  // Add note to customer
  addNote: async (customerId, note) => {
    const response = await api.post(`/customers/${customerId}/notes`, { note });
    return response.data;
  },

  // Add tags to customer
  addTags: async (customerId, tags) => {
    const response = await api.post(`/customers/${customerId}/tags`, { tags });
    return response.data;
  },

  // Remove tag from customer
  removeTag: async (customerId, tag) => {
    const response = await api.delete(`/customers/${customerId}/tags/${tag}`);
    return response.data;
  },

  // Get customer statistics
  getStats: async () => {
    const response = await api.get('/customers/stats');
    return response.data;
  },

  // Export customers to CSV
  exportCSV: async (params = {}) => {
    const response = await api.get('/customers/export/csv', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Search customers
  search: async (query) => {
    const response = await api.get(`/customers/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default customerService; 