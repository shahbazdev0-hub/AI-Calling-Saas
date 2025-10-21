// utils/constants.js
// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
}

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
}

// Call Status
export const CALL_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
}

// Call Outcomes
export const CALL_OUTCOMES = {
  SALE: 'sale',
  APPOINTMENT: 'appointment',
  NO_ANSWER: 'no_answer',
  BUSY: 'busy',
  DECLINED: 'declined',
  CALLBACK: 'callback',
}

// Demo Booking Status
export const DEMO_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Navigation Links
export const NAV_LINKS = [
  { name: 'Home', href: '/', public: true },
  { name: 'Features', href: '/features', public: true },
  { name: 'Pricing', href: '/pricing', public: true },
  { name: 'Contact', href: '/contact', public: true },
  { name: 'Demo', href: '/demo', public: true },
]

// Dashboard Navigation
export const DASHBOARD_NAV = [
  { name: 'Overview', href: '/dashboard/overview', icon: 'BarChart3' },
  { name: 'Profile', href: '/dashboard/profile', icon: 'User' },
  { name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
]

// Admin Navigation
export const ADMIN_NAV = [
  { name: 'Admin Panel', href: '/dashboard/admin', icon: 'Shield' },
  { name: 'User Management', href: '/dashboard/admin/users', icon: 'Users' },
  { name: 'Account Settings', href: '/dashboard/admin/settings', icon: 'Settings' },
]

// Pricing Plans
export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 49,
    period: 'month',
    description: 'Perfect for small businesses getting started',
    features: [
      'Up to 500 calls per month',
      'Basic AI voice agents',
      'Email support',
      'Call recording',
      'Basic analytics',
    ],
    buttonText: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: 149,
    period: 'month',
    description: 'Ideal for growing businesses',
    features: [
      'Up to 2,500 calls per month',
      'Advanced AI voice agents',
      'Priority support',
      'Call recording & transcription',
      'Advanced analytics',
      'CRM integration',
      'Custom workflows',
    ],
    buttonText: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited calls',
      'Custom AI voice agents',
      'Dedicated support',
      'Advanced integrations',
      'Custom reporting',
      'White-label options',
      'SLA guarantee',
    ],
    buttonText: 'Contact Sales',
    popular: false,
  },
]

// Feature Categories
export const FEATURE_CATEGORIES = {
  VOICE_AI: 'voice_ai',
  AUTOMATION: 'automation',
  INTEGRATION: 'integration',
  ANALYTICS: 'analytics',
}

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
  },
  DEMO: {
    BOOK: '/demo/book',
    LIST: '/demo',
  },
  ADMIN: {
    USERS: '/admin/users',
    STATS: '/admin/stats',
    SETTINGS: '/admin/settings',
  },
}

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN: 'Password must be at least 8 characters',
  PASSWORD_COMPLEXITY: 'Password must contain uppercase, lowercase, number and special character',
  PHONE: 'Please enter a valid phone number',
  URL: 'Please enter a valid URL',
  CONFIRM_PASSWORD: 'Passwords do not match',
}

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
}

export default {
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  CALL_STATUS,
  CALL_OUTCOMES,
  DEMO_STATUS,
  NAV_LINKS,
  DASHBOARD_NAV,
  ADMIN_NAV,
  PRICING_PLANS,
  FEATURE_CATEGORIES,
  THEME_COLORS,
  API_ENDPOINTS,
  VALIDATION_MESSAGES,
  STORAGE_KEYS,
}