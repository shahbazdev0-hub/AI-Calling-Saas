// src/utils/helpers.js
// ===========================================
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date, options = {}) => {
  const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date))
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export const formatRelativeTime = (date) => {
  const now = new Date()
  const target = new Date(date)
  const diffInMinutes = Math.floor((now - target) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return formatDate(date)
}

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phoneNumber
}

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const snakeToTitle = (str) => {
  return str.split('_').map(word => capitalize(word)).join(' ')
}

export const generateAvatarUrl = (name, size = 40) => {
  const initials = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
  return `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=3B82F6&color=fff&bold=true`
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const validatePasswordStrength = (password) => {
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const score = [password.length >= minLength, hasUppercase, hasLowercase, hasNumbers, hasSpecialChar].filter(Boolean).length
  
  return {
    score,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
    isValid: score >= 3
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  formatCurrency, formatDate, formatDateTime, formatRelativeTime, formatPhoneNumber,
  formatDuration, formatFileSize, generateId, debounce, throttle, deepClone, isEmpty,
  capitalize, snakeToTitle, generateAvatarUrl, isValidEmail, isValidPhone,
  validatePasswordStrength, copyToClipboard, downloadFile, getContrastColor, sleep,
}