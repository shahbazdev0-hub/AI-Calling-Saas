// frontend/src/utils/dateUtils.js

/**
 * Format a Date object or date string to ISO string for API calls
 * Ensures consistent format across the application
 * 
 * @param {Date|string|null} date - The date to format
 * @returns {string|null} - ISO formatted date string or null
 */
export const formatDateForAPI = (date) => {
  if (!date) return null
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to formatDateForAPI:', date)
      return null
    }
    
    // Return ISO string (includes Z suffix for UTC)
    return dateObj.toISOString()
  } catch (error) {
    console.error('Error formatting date for API:', error)
    return null
  }
}

/**
 * Get date from a week ago for default date filtering
 * @returns {string} - ISO formatted date string
 */
export const getDateWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return formatDateForAPI(date)
}

/**
 * Get current date in ISO format
 * @returns {string} - ISO formatted date string
 */
export const getCurrentDate = () => {
  return formatDateForAPI(new Date())
}

/**
 * Parse date string safely
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const parseDateSafely = (dateString) => {
  if (!dateString) return null
  
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch (error) {
    console.error('Error parsing date:', error)
    return null
  }
}

/**
 * Format duration in seconds to human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration (e.g., "2m 30s", "1h 15m")
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`)
  
  return parts.join(' ')
}

/**
 * Format date for display in UI
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDisplayDate = (date, options = {}) => {
  if (!date) return 'N/A'
  
  const dateObj = parseDateSafely(date)
  if (!dateObj) return 'Invalid Date'
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  try {
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj)
  } catch (error) {
    console.error('Error formatting display date:', error)
    return dateObj.toLocaleDateString()
  }
}

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
  const dateObj = parseDateSafely(date)
  if (!dateObj) return false
  
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  const dateObj = parseDateSafely(date)
  if (!dateObj) return 'Unknown'
  
  const now = new Date()
  const diffMs = now - dateObj
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return formatDisplayDate(dateObj, { month: 'short', day: 'numeric' })
}