// // src/utils/helpers.js
// // ===========================================
// export const formatCurrency = (amount, currency = 'USD') => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency,
//   }).format(amount)
// }

// export const formatDate = (date, options = {}) => {
//   const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' }
//   return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date))
// }

// export const formatDateTime = (date) => {
//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
//   }).format(new Date(date))
// }

// export const formatRelativeTime = (date) => {
//   const now = new Date()
//   const target = new Date(date)
//   const diffInMinutes = Math.floor((now - target) / (1000 * 60))

//   if (diffInMinutes < 1) return 'Just now'
//   if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  
//   const diffInHours = Math.floor(diffInMinutes / 60)
//   if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
//   const diffInDays = Math.floor(diffInHours / 24)
//   if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
//   return formatDate(date)
// }

// export const formatPhoneNumber = (phoneNumber) => {
//   const cleaned = phoneNumber.replace(/\D/g, '')
//   const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
//   if (match) {
//     return `(${match[1]}) ${match[2]}-${match[3]}`
//   }
//   return phoneNumber
// }

// export const formatDuration = (seconds) => {
//   const minutes = Math.floor(seconds / 60)
//   const remainingSeconds = seconds % 60
//   return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
// }

// export const formatFileSize = (bytes) => {
//   if (bytes === 0) return '0 Bytes'
//   const k = 1024
//   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
// }

// export const generateId = () => {
//   return Math.random().toString(36).substr(2, 9)
// }

// export const debounce = (func, wait) => {
//   let timeout
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout)
//       func(...args)
//     }
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//   }
// }

// export const throttle = (func, limit) => {
//   let inThrottle
//   return function() {
//     const args = arguments
//     const context = this
//     if (!inThrottle) {
//       func.apply(context, args)
//       inThrottle = true
//       setTimeout(() => inThrottle = false, limit)
//     }
//   }
// }

// export const deepClone = (obj) => {
//   return JSON.parse(JSON.stringify(obj))
// }

// export const isEmpty = (obj) => {
//   return Object.keys(obj).length === 0
// }

// export const capitalize = (str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// }

// export const snakeToTitle = (str) => {
//   return str.split('_').map(word => capitalize(word)).join(' ')
// }

// export const generateAvatarUrl = (name, size = 40) => {
//   const initials = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
//   return `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=3B82F6&color=fff&bold=true`
// }

// export const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   return emailRegex.test(email)
// }

// export const isValidPhone = (phone) => {
//   const phoneRegex = /^\+?[\d\s\-\(\)]+$/
//   return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
// }

// export const validatePasswordStrength = (password) => {
//   const minLength = 8
//   const hasUppercase = /[A-Z]/.test(password)
//   const hasLowercase = /[a-z]/.test(password)
//   const hasNumbers = /\d/.test(password)
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
//   const score = [password.length >= minLength, hasUppercase, hasLowercase, hasNumbers, hasSpecialChar].filter(Boolean).length
  
//   return {
//     score,
//     strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
//     isValid: score >= 3
//   }
// }

// export const copyToClipboard = async (text) => {
//   try {
//     await navigator.clipboard.writeText(text)
//     return true
//   } catch (err) {
//     console.error('Failed to copy:', err)
//     return false
//   }
// }

// export const downloadFile = (data, filename, type = 'text/plain') => {
//   const blob = new Blob([data], { type })
//   const url = window.URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = filename
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   window.URL.revokeObjectURL(url)
// }

// export const getContrastColor = (hexColor) => {
//   const r = parseInt(hexColor.substr(1, 2), 16)
//   const g = parseInt(hexColor.substr(3, 2), 16)
//   const b = parseInt(hexColor.substr(5, 2), 16)
//   const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
//   return brightness > 128 ? '#000000' : '#FFFFFF'
// }

// export const sleep = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

// export default {
//   formatCurrency, formatDate, formatDateTime, formatRelativeTime, formatPhoneNumber,
//   formatDuration, formatFileSize, generateId, debounce, throttle, deepClone, isEmpty,
//   capitalize, snakeToTitle, generateAvatarUrl, isValidEmail, isValidPhone,
//   validatePasswordStrength, copyToClipboard, downloadFile, getContrastColor, sleep,
// }


// frontend/src/utils/helpers.js

/**
 * Format date to readable string
 * @param {string|Date} dateString - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date with time
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid Date';
  }
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-digit characters
  const cleaned = phone.toString().replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length > 10) {
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
  
  return phone;
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} dateString - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown';
  }
};

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generate avatar URL
 * @param {string} name - User's name
 * @param {string} email - User's email (optional)
 * @returns {string} Avatar URL
 */
export const generateAvatarUrl = (name, email = null) => {
  if (email) {
    // Use Gravatar
    const hash = email.toLowerCase().trim();
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }
  
  // Use UI Avatars
  const initials = name
    ? name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : 'U';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=40`;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get status color class
 * @param {string} status - Status string
 * @returns {string} CSS class for the status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-gray-600 bg-gray-100',
    pending: 'text-yellow-600 bg-yellow-100',
    completed: 'text-blue-600 bg-blue-100',
    cancelled: 'text-red-600 bg-red-100',
    failed: 'text-red-600 bg-red-100',
    success: 'text-green-600 bg-green-100'
  };
  
  return statusColors[status?.toLowerCase()] || 'text-gray-600 bg-gray-100';
};

export default {
  formatDate,
  formatDateTime,
  formatPhone,
  formatRelativeTime,
  formatDuration,
  generateAvatarUrl,
  formatCurrency,
  formatNumber,
  truncateText,
  capitalize,
  getStatusColor
};