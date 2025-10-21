// services/config.js
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  
  // App Configuration
  APP_NAME: 'CallCenter Pro',
  APP_DESCRIPTION: 'AI-Powered Call Center Solutions',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  
  // Auth Configuration
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_DAYS: 7,
  
  // Feature Flags
  FEATURES: {
    DEMO_BOOKING: true,
    NEWSLETTER: true,
    ANALYTICS: true,
    SUPPORT_CHAT: false,
  },
  
  // Contact Information
  CONTACT: {
    EMAIL: 'support@callcenterpro.com',
    PHONE: '+1 (555) 123-4567',
    ADDRESS: '123 Business Ave, Suite 100, City, State 12345',
  },
  
  // Social Links
  SOCIAL: {
    TWITTER: 'https://twitter.com/callcenterpro',
    LINKEDIN: 'https://linkedin.com/company/callcenterpro',
    GITHUB: 'https://github.com/callcenterpro',
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  
  // Validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // Demo Data (for Milestone 1)
  DEMO: {
    STATS: {
      CALLS_TODAY: 247,
      SUCCESS_RATE: 87.5,
      REVENUE_TODAY: 15420,
      ACTIVE_CAMPAIGNS: 12,
    },
    RECENT_CALLS: [
      {
        id: 1,
        contact: 'John Smith',
        phone: '+1-555-0123',
        status: 'Completed',
        duration: '5:23',
        outcome: 'Sale',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: 2,
        contact: 'Sarah Johnson',
        phone: '+1-555-0456',
        status: 'Completed',
        duration: '3:45',
        outcome: 'Appointment',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        id: 3,
        contact: 'Mike Wilson',
        phone: '+1-555-0789',
        status: 'Failed',
        duration: '0:12',
        outcome: 'No Answer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
      },
    ],
  },
}

export default config