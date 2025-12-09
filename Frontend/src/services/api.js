// // frontend/src/services/api.js 
// import axios from "axios"
// import config from "./config"
// import { formatDateForAPI } from "../utils/dateUtils"
// import { automationAPI, smsAPI, emailAPI } from './automation';
// import workflowAPI from './workflow';

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: config.API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor to add auth token and format dates
// api.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem('access_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     // Format date parameters in query params
//     if (config.params) {
//       Object.keys(config.params).forEach(key => {
//         if (key.includes('date') || key.includes('time')) {
//           const value = config.params[key]
//           if (value instanceof Date || (typeof value === 'string' && value.length > 0)) {
//             config.params[key] = formatDateForAPI(value)
//           }
//         }
//       })
//     }

//     console.log('🚀 API Request:', {
//       method: config.method?.toUpperCase(),
//       url: config.url,
//       params: config.params,
//       data: config.data
//     })

//     return config
//   },
//   (error) => {
//     console.error('❌ API Request Error:', error)
//     return Promise.reject(error)
//   }
// )

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => {
//     console.log('✅ API Response:', {
//       status: response.status,
//       url: response.config.url,
//       data: response.data
//     })
//     return response
//   },
//   (error) => {
//     console.log('❌ API Response Error:', {
//       status: error.response?.status,
//       url: error.config?.url,
//       message: error.message,
//       data: error.response?.data
//     })

//     // Handle specific error cases
//     if (error.response?.status === 401) {
//       // Unauthorized - clear token and redirect to login
//       localStorage.removeItem('access_token')
//       localStorage.removeItem('refresh_token')
      
//       // Only redirect if not already on auth pages
//       if (!window.location.pathname.includes('/auth/')) {
//         window.location.href = '/auth/login'
//       }
//     }

//     return Promise.reject(error)
//   }
// )

// // Auth API calls
// export const authAPI = {
//   login: (credentials) => api.post('/auth/login', credentials),
//   signup: (userData) => api.post('/auth/signup', userData),
//   logout: () => api.post('/auth/logout'),
//   refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
//   forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
//   resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
//   verifyEmail: (token) => api.post('/auth/verify-email', { token }),
// }

// // User API calls  
// export const userAPI = {
//   getProfile: () => api.get('/users/me'),
//   updateProfile: (userData) => api.patch('/users/me', userData),
//   deleteAccount: () => api.delete('/users/me'),
//   uploadAvatar: (formData) => api.post('/users/me/avatar', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
// }

// // Demo booking API
// export const demoAPI = {
//   create: (demoData) => api.post('/demo', demoData),
//   getAll: (params = {}) => api.get('/demo', { params }),
//   getById: (id) => api.get(`/demo/${id}`),
//   update: (id, data) => api.patch(`/demo/${id}`, data),
//   delete: (id) => api.delete(`/demo/${id}`),
// }

// // Admin API calls
// export const adminAPI = {
//   getUsers: (params = {}) => api.get('/admin/users', { params }),
//   getUserById: (id) => api.get(`/admin/users/${id}`),
//   updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
//   deleteUser: (id) => api.delete(`/admin/users/${id}`),
//   getDemoBookings: (params = {}) => api.get('/admin/demo-bookings', { params }),
//   updateDemoBooking: (id, data) => api.patch(`/admin/demo-bookings/${id}`, data),
//   deleteDemoBooking: (id) => api.delete(`/admin/demo-bookings/${id}`),
//   getSystemStats: () => api.get('/admin/stats'),
// }

// // Call API calls (Milestone 2)
// export const callAPI = {
//   // Get calls with proper date formatting
//   getCalls: (params = {}) => {
//     const formattedParams = { ...params }
    
//     // Ensure date parameters are properly formatted
//     if (formattedParams.from_date) {
//       formattedParams.from_date = formatDateForAPI(formattedParams.from_date)
//     }
//     if (formattedParams.to_date) {
//       formattedParams.to_date = formatDateForAPI(formattedParams.to_date)
//     }
    
//     return api.get('/calls', { params: formattedParams })
//   },
  
//   createCall: (callData) => api.post('/calls', callData),
//   getCall: (id) => api.get(`/calls/${id}`),
//   updateCall: (id, data) => api.patch(`/calls/${id}`, data),
//   deleteCall: (id) => api.delete(`/calls/${id}`),
//   getCallStats: () => api.get('/calls/stats'),
  
//   // Call logs
//   getCallLogs: (params = {}) => api.get('/calls/logs', { params }),
//   getCallLog: (id) => api.get(`/calls/logs/${id}`),
// }

// // Voice API calls (Milestone 2)
// export const voiceAPI = {
//   // Voice agents
//   getAgents: (params = {}) => api.get('/voice/agents', { params }),
//   createAgent: (agentData) => api.post('/voice/agents', agentData),
//   getAgent: (id) => api.get(`/voice/agents/${id}`),
//   updateAgent: (id, data) => api.patch(`/voice/agents/${id}`, data),
//   deleteAgent: (id) => api.delete(`/voice/agents/${id}`),
//   testAgent: (id, message) => api.post(`/voice/agents/${id}/test`, { message }),
  
//   // Voice settings
//   getVoices: () => api.get('/voice/voices'),
//   getVoiceSettings: () => api.get('/voice/settings'),
//   updateVoiceSettings: (settings) => api.patch('/voice/settings', settings),
// }

// // Conversations API (Milestone 2)  
// export const conversationAPI = {
//   getConversations: (params = {}) => api.get('/conversations', { params }),
//   getConversation: (id) => api.get(`/conversations/${id}`),
//   createConversation: (data) => api.post('/conversations', data),
//   updateConversation: (id, data) => api.patch(`/conversations/${id}`, data),
//   deleteConversation: (id) => api.delete(`/conversations/${id}`),
// }

// // Analytics API (Future milestones)
// export const analyticsAPI = {
//   getCallAnalytics: (params = {}) => {
//     const formattedParams = { ...params }
//     if (formattedParams.from_date) {
//       formattedParams.from_date = formatDateForAPI(formattedParams.from_date)
//     }
//     if (formattedParams.to_date) {
//       formattedParams.to_date = formatDateForAPI(formattedParams.to_date)
//     }
//     return api.get('/analytics/calls', { params: formattedParams })
//   },
//   getDashboardStats: () => api.get('/analytics/dashboard'),
//   getReports: (params = {}) => api.get('/analytics/reports', { params }),
// }

// // Error handling helper
// export const handleAPIError = (error) => {
//   if (error.response) {
//     // Server responded with error status
//     const { status, data } = error.response
    
//     switch (status) {
//       case 400:
//         return { 
//           type: 'validation', 
//           message: data.detail || 'Invalid request data',
//           errors: data.errors || {}
//         }
//       case 401:
//         return { 
//           type: 'auth', 
//           message: 'Please log in to continue' 
//         }
//       case 403:
//         return { 
//           type: 'permission', 
//           message: 'You do not have permission to perform this action' 
//         }
//       case 404:
//         return { 
//           type: 'not_found', 
//           message: 'The requested resource was not found' 
//         }
//       case 422:
//         return { 
//           type: 'validation', 
//           message: 'Validation error',
//           errors: data.detail || {}
//         }
//       case 429:
//         return { 
//           type: 'rate_limit', 
//           message: 'Too many requests. Please try again later.' 
//         }
//       case 500:
//         return { 
//           type: 'server', 
//           message: 'Internal server error. Please try again later.' 
//         }
//       default:
//         return { 
//           type: 'unknown', 
//           message: data.detail || 'An unexpected error occurred' 
//         }
//     }
//   } else if (error.request) {
//     // Network error
//     return { 
//       type: 'network', 
//       message: 'Network error. Please check your connection.' 
//     }
//   } else {
//     // Other error
//     return { 
//       type: 'unknown', 
//       message: error.message || 'An unexpected error occurred' 
//     }
//   }
// }

// export const automation = {
//   getAll: (params) => automationAPI.getAutomations(params),
//   getOne: (id) => automationAPI.getAutomation(id),
//   create: (data) => automationAPI.createAutomation(data),
//   update: (id, data) => automationAPI.updateAutomation(id, data),
//   delete: (id) => automationAPI.deleteAutomation(id),
//   trigger: (id, data) => automationAPI.triggerAutomation(id, data),
//   test: (id, data) => automationAPI.testAutomation(id, data),
//   stats: () => automationAPI.getAutomationStats(),
//   toggle: (id, isActive) => automationAPI.toggleAutomation(id, isActive),
//   getLogs: (id, params) => automationAPI.getAutomationLogs(id, params)
// };

// export const sms = {
//   send: (data) => smsAPI.sendSMS(data),
//   sendBulk: (data) => smsAPI.sendBulkSMS(data),
//   getAll: (params) => smsAPI.getSMSMessages(params),
//   getOne: (id) => smsAPI.getSMS(id),
//   stats: () => smsAPI.getSMSStats(),
//   delete: (id) => smsAPI.deleteSMS(id)
// };

// export const email = {
//   createCampaign: (data) => emailAPI.createCampaign(data),
//   getCampaigns: (params) => emailAPI.getCampaigns(params),
//   getCampaign: (id) => emailAPI.getCampaign(id),
//   updateCampaign: (id, data) => emailAPI.updateCampaign(id, data),
//   deleteCampaign: (id) => emailAPI.deleteCampaign(id),
//   sendCampaign: (id) => emailAPI.sendCampaign(id),
//   sendEmail: (data) => emailAPI.sendEmail(data),
//   createTemplate: (data) => emailAPI.createTemplate(data),
//   getTemplates: (params) => emailAPI.getTemplates(params)
// };

// export const workflow = {
//   getAll: (params) => workflowAPI.getWorkflows(params),
//   getOne: (id) => workflowAPI.getWorkflow(id),
//   create: (data) => workflowAPI.createWorkflow(data),
//   update: (id, data) => workflowAPI.updateWorkflow(id, data),
//   delete: (id) => workflowAPI.deleteWorkflow(id),
//   execute: (id, data) => workflowAPI.executeWorkflow(id, data),
//   getExecutions: (id, params) => workflowAPI.getWorkflowExecutions(id, params)
// };

// // Export automation APIs for direct import
// export { automationAPI, smsAPI, emailAPI, workflowAPI };
// export default api




// frontend/src/services/api.js 
import axios from "axios"
import config from "./config"
import { formatDateForAPI } from "../utils/dateUtils"
import { automationAPI, smsAPI, emailAPI } from './automation';
import workflowAPI from './workflow';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token and format dates
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Format date parameters in query params
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        if (key.includes('date') || key.includes('time')) {
          const value = config.params[key]
          if (value instanceof Date || (typeof value === 'string' && value.length > 0)) {
            config.params[key] = formatDateForAPI(value)
          }
        }
      })
    }

    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data
    })

    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.log('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    })

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/auth/')) {
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
}

// User API calls  
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.patch('/users/me', userData),
  deleteAccount: () => api.delete('/users/me'),
  uploadAvatar: (formData) => api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Demo booking API
export const demoAPI = {
  create: (demoData) => api.post('/demo', demoData),
  getAll: (params = {}) => api.get('/demo', { params }),
  getById: (id) => api.get(`/demo/${id}`),
  update: (id, data) => api.patch(`/demo/${id}`, data),
  delete: (id) => api.delete(`/demo/${id}`),
}

// Admin API calls
export const adminAPI = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getDemoBookings: (params = {}) => api.get('/admin/demo-bookings', { params }),
  updateDemoBooking: (id, data) => api.patch(`/admin/demo-bookings/${id}`, data),
  deleteDemoBooking: (id) => api.delete(`/admin/demo-bookings/${id}`),
  getSystemStats: () => api.get('/admin/stats'),
}

// Call API calls (Milestone 2)
export const callAPI = {
  // Get calls with proper date formatting
  getCalls: (params = {}) => {
    const formattedParams = { ...params }
    
    // Ensure date parameters are properly formatted
    if (formattedParams.from_date) {
      formattedParams.from_date = formatDateForAPI(formattedParams.from_date)
    }
    if (formattedParams.to_date) {
      formattedParams.to_date = formatDateForAPI(formattedParams.to_date)
    }
    
    return api.get('/calls', { params: formattedParams })
  },
  
  createCall: (callData) => api.post('/calls', callData),
  getCall: (id) => api.get(`/calls/${id}`),
  updateCall: (id, data) => api.patch(`/calls/${id}`, data),
  deleteCall: (id) => api.delete(`/calls/${id}`),
  getCallStats: () => api.get('/calls/stats'),
  
  // Call logs
  getCallLogs: (params = {}) => api.get('/calls/logs', { params }),
  getCallLog: (id) => api.get(`/calls/logs/${id}`),
}

// Voice API calls (Milestone 2)
export const voiceAPI = {
  // Voice agents
  getAgents: (params = {}) => api.get('/voice/agents', { params }),
  createAgent: (agentData) => api.post('/voice/agents', agentData),
  getAgent: (id) => api.get(`/voice/agents/${id}`),
  updateAgent: (id, data) => api.patch(`/voice/agents/${id}`, data),
  deleteAgent: (id) => api.delete(`/voice/agents/${id}`),
  testAgent: (id, message) => api.post(`/voice/agents/${id}/test`, { message }),
  
  // Voice settings
  getVoices: () => api.get('/voice/voices'),
  getVoiceSettings: () => api.get('/voice/settings'),
  updateVoiceSettings: (settings) => api.patch('/voice/settings', settings),
}

// Conversations API (Milestone 2)  
export const conversationAPI = {
  getConversations: (params = {}) => api.get('/conversations', { params }),
  getConversation: (id) => api.get(`/conversations/${id}`),
  createConversation: (data) => api.post('/conversations', data),
  updateConversation: (id, data) => api.patch(`/conversations/${id}`, data),
  deleteConversation: (id) => api.delete(`/conversations/${id}`),
}

// ✅ Customer API calls (Milestone 4 - CRM) - REMOVED "export" keyword
const customerAPI = {
  // Get all customers with pagination and filters
  getAll: (params = {}) => api.get('/customers', { params }),
  
  // Get single customer by ID
  getById: (customerId) => api.get(`/customers/${customerId}`),
  
  // Create new customer
  create: (customerData) => api.post('/customers', customerData),
  
  // Update customer
  update: (customerId, customerData) => api.put(`/customers/${customerId}`, customerData),
  
  // Delete customer
  delete: (customerId) => api.delete(`/customers/${customerId}`),
  
  // Get customer's appointments
  getAppointments: (customerId) => api.get(`/customers/${customerId}/appointments`),
  
  // Get customer's call history
  getCallHistory: (customerId) => api.get(`/customers/${customerId}/calls`),
  
  // Get customer's interaction timeline
  getTimeline: (customerId) => api.get(`/customers/${customerId}/timeline`),
  
  // Add note to customer
  addNote: (customerId, note) => api.post(`/customers/${customerId}/notes`, { note }),
  
  // Add tags to customer
  addTags: (customerId, tags) => api.post(`/customers/${customerId}/tags`, { tags }),
  
  // Remove tag from customer
  removeTag: (customerId, tag) => api.delete(`/customers/${customerId}/tags/${tag}`),
  
  // Get customer statistics
  getStats: () => api.get('/customers/stats'),
  
  // Export customers to CSV
  exportCSV: (params = {}) => api.get('/customers/export/csv', {
    params,
    responseType: 'blob'
  }),
  
  // Search customers
  search: (query) => api.get(`/customers/search?q=${encodeURIComponent(query)}`),
}

// Analytics API (Future milestones)
export const analyticsAPI = {
  getCallAnalytics: (params = {}) => {
    const formattedParams = { ...params }
    if (formattedParams.from_date) {
      formattedParams.from_date = formatDateForAPI(formattedParams.from_date)
    }
    if (formattedParams.to_date) {
      formattedParams.to_date = formatDateForAPI(formattedParams.to_date)
    }
    return api.get('/analytics/calls', { params: formattedParams })
  },
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getReports: (params = {}) => api.get('/analytics/reports', { params }),
}

// Error handling helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return { 
          type: 'validation', 
          message: data.detail || 'Invalid request data',
          errors: data.errors || {}
        }
      case 401:
        return { 
          type: 'auth', 
          message: 'Please log in to continue' 
        }
      case 403:
        return { 
          type: 'permission', 
          message: 'You do not have permission to perform this action' 
        }
      case 404:
        return { 
          type: 'not_found', 
          message: 'The requested resource was not found' 
        }
      case 422:
        return { 
          type: 'validation', 
          message: 'Validation error',
          errors: data.detail || {}
        }
      case 429:
        return { 
          type: 'rate_limit', 
          message: 'Too many requests. Please try again later.' 
        }
      case 500:
        return { 
          type: 'server', 
          message: 'Internal server error. Please try again later.' 
        }
      default:
        return { 
          type: 'unknown', 
          message: data.detail || 'An unexpected error occurred' 
        }
    }
  } else if (error.request) {
    // Network error
    return { 
      type: 'network', 
      message: 'Network error. Please check your connection.' 
    }
  } else {
    // Other error
    return { 
      type: 'unknown', 
      message: error.message || 'An unexpected error occurred' 
    }
  }
}

export const automation = {
  getAll: (params) => automationAPI.getAutomations(params),
  getOne: (id) => automationAPI.getAutomation(id),
  create: (data) => automationAPI.createAutomation(data),
  update: (id, data) => automationAPI.updateAutomation(id, data),
  delete: (id) => automationAPI.deleteAutomation(id),
  trigger: (id, data) => automationAPI.triggerAutomation(id, data),
  test: (id, data) => automationAPI.testAutomation(id, data),
  stats: () => automationAPI.getAutomationStats(),
  toggle: (id, isActive) => automationAPI.toggleAutomation(id, isActive),
  getLogs: (id, params) => automationAPI.getAutomationLogs(id, params)
};

export const sms = {
  send: (data) => smsAPI.sendSMS(data),
  sendBulk: (data) => smsAPI.sendBulkSMS(data),
  getAll: (params) => smsAPI.getSMSMessages(params),
  getOne: (id) => smsAPI.getSMS(id),
  stats: () => smsAPI.getSMSStats(),
  delete: (id) => smsAPI.deleteSMS(id)
};

export const email = {
  createCampaign: (data) => emailAPI.createCampaign(data),
  getCampaigns: (params) => emailAPI.getCampaigns(params),
  getCampaign: (id) => emailAPI.getCampaign(id),
  updateCampaign: (id, data) => emailAPI.updateCampaign(id, data),
  deleteCampaign: (id) => emailAPI.deleteCampaign(id),
  sendCampaign: (id) => emailAPI.sendCampaign(id),
  sendEmail: (data) => emailAPI.sendEmail(data),
  createTemplate: (data) => emailAPI.createTemplate(data),
  getTemplates: (params) => emailAPI.getTemplates(params)
};

export const workflow = {
  getAll: (params) => workflowAPI.getWorkflows(params),
  getOne: (id) => workflowAPI.getWorkflow(id),
  create: (data) => workflowAPI.createWorkflow(data),
  update: (id, data) => workflowAPI.updateWorkflow(id, data),
  delete: (id) => workflowAPI.deleteWorkflow(id),
  execute: (id, data) => workflowAPI.executeWorkflow(id, data),
  getExecutions: (id, params) => workflowAPI.getWorkflowExecutions(id, params)
};

// ✅ Customer API shorthand (Milestone 4 - CRM)
export const customer = {
  getAll: (params) => customerAPI.getAll(params),
  getOne: (id) => customerAPI.getById(id),
  create: (data) => customerAPI.create(data),
  update: (id, data) => customerAPI.update(id, data),
  delete: (id) => customerAPI.delete(id),
  getAppointments: (id) => customerAPI.getAppointments(id),
  getCallHistory: (id) => customerAPI.getCallHistory(id),
  getTimeline: (id) => customerAPI.getTimeline(id),
  addNote: (id, note) => customerAPI.addNote(id, note),
  addTags: (id, tags) => customerAPI.addTags(id, tags),
  removeTag: (id, tag) => customerAPI.removeTag(id, tag),
  getStats: () => customerAPI.getStats(),
  exportCSV: (params) => customerAPI.exportCSV(params),
  search: (query) => customerAPI.search(query)
};

// ✅ FIXED: Export customerAPI only ONCE at the end
export { automationAPI, smsAPI, emailAPI, workflowAPI, customerAPI };
export default api