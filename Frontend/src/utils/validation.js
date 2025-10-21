// src/utils/validation.js
// ===========================================
export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required'
  }
  return null
}

export const email = (value) => {
  if (!value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) ? null : 'Please enter a valid email address'
}

export const minLength = (min) => (value) => {
  if (!value) return null
  return value.length >= min ? null : `Must be at least ${min} characters`
}

export const maxLength = (max) => (value) => {
  if (!value) return null
  return value.length <= max ? null : `Must be no more than ${max} characters`
}

export const phone = (value) => {
  if (!value) return null
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  const digitsOnly = value.replace(/\D/g, '')
  return phoneRegex.test(value) && digitsOnly.length >= 10 ? null : 'Please enter a valid phone number'
}

export const url = (value) => {
  if (!value) return null
  try {
    new URL(value)
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

export const password = (value) => {
  if (!value) return null
  
  if (value.length < 8) {
    return 'Password must be at least 8 characters'
  }
  
  const hasUppercase = /[A-Z]/.test(value)
  const hasLowercase = /[a-z]/.test(value)
  const hasNumbers = /\d/.test(value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  
  if (!(hasUppercase && hasLowercase && hasNumbers && hasSpecialChar)) {
    return 'Password must contain uppercase, lowercase, number and special character'
  }
  
  return null
}

export const confirmPassword = (originalPassword) => (value) => {
  if (!value) return null
  return value === originalPassword ? null : 'Passwords do not match'
}

export const loginSchema = {
  email: [required, email],
  password: [required],
}

export const registerSchema = {
  first_name: [required, maxLength(50)],
  last_name: [required, maxLength(50)],
  email: [required, email],
  phone: [phone],
  password: [required, password],
  confirm_password: [],
  company_name: [maxLength(100)],
  terms_accepted: [(value) => value ? null : 'You must accept the terms and conditions'],
}

export const forgotPasswordSchema = {
  email: [required, email],
}

export const resetPasswordSchema = {
  password: [required, password],
  confirm_password: [],
}

export const profileSchema = {
  first_name: [required, maxLength(50)],
  last_name: [required, maxLength(50)],
  email: [required, email],
  phone: [phone],
  company_name: [maxLength(100)],
  bio: [maxLength(500)],
}

export const demoBookingSchema = {
  first_name: [required, maxLength(50)],
  last_name: [required, maxLength(50)],
  email: [required, email],
  phone: [phone],
  company_name: [required, maxLength(100)],
  company_size: [required],
  preferred_date: [required],
  preferred_time: [required],
  message: [maxLength(1000)],
}

export const contactSchema = {
  name: [required, maxLength(100)],
  email: [required, email],
  subject: [required, maxLength(200)],
  message: [required, maxLength(2000)],
}

export const changePasswordSchema = {
  current_password: [required],
  new_password: [required, password],
  confirm_password: [],
}

export const validateField = (value, validators) => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

export const validateForm = (data, schema) => {
  const errors = {}
  
  for (const [field, validators] of Object.entries(schema)) {
    const error = validateField(data[field], validators)
    if (error) {
      errors[field] = error
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

export const useFormValidation = (schema) => {
  const validate = (data) => {
    if (schema.confirm_password && data.password) {
      schema.confirm_password = [confirmPassword(data.password)]
    }
    
    if (schema.confirm_password && data.new_password) {
      schema.confirm_password = [confirmPassword(data.new_password)]
    }
    
    return validateForm(data, schema)
  }
  
  return { validate }
}

export default {
  required, email, minLength, maxLength, phone, url, password, confirmPassword,
  loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema,
  profileSchema, demoBookingSchema, contactSchema, changePasswordSchema,
  validateField, validateForm, useFormValidation,
}