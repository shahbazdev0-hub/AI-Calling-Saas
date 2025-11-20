// // src/utils/validation.js
// // ===========================================
// export const required = (value) => {
//   if (!value || (typeof value === 'string' && !value.trim())) {
//     return 'This field is required'
//   }
//   return null
// }

// export const email = (value) => {
//   if (!value) return null
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   return emailRegex.test(value) ? null : 'Please enter a valid email address'
// }

// export const minLength = (min) => (value) => {
//   if (!value) return null
//   return value.length >= min ? null : `Must be at least ${min} characters`
// }

// export const maxLength = (max) => (value) => {
//   if (!value) return null
//   return value.length <= max ? null : `Must be no more than ${max} characters`
// }

// export const phone = (value) => {
//   if (!value) return null
//   const phoneRegex = /^\+?[\d\s\-\(\)]+$/
//   const digitsOnly = value.replace(/\D/g, '')
//   return phoneRegex.test(value) && digitsOnly.length >= 10 ? null : 'Please enter a valid phone number'
// }

// export const url = (value) => {
//   if (!value) return null
//   try {
//     new URL(value)
//     return null
//   } catch {
//     return 'Please enter a valid URL'
//   }
// }

// export const password = (value) => {
//   if (!value) return null
  
//   if (value.length < 8) {
//     return 'Password must be at least 8 characters'
//   }
  
//   const hasUppercase = /[A-Z]/.test(value)
//   const hasLowercase = /[a-z]/.test(value)
//   const hasNumbers = /\d/.test(value)
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  
//   if (!(hasUppercase && hasLowercase && hasNumbers && hasSpecialChar)) {
//     return 'Password must contain uppercase, lowercase, number and special character'
//   }
  
//   return null
// }

// export const confirmPassword = (originalPassword) => (value) => {
//   if (!value) return null
//   return value === originalPassword ? null : 'Passwords do not match'
// }

// export const loginSchema = {
//   email: [required, email],
//   password: [required],
// }

// export const registerSchema = {
//   first_name: [required, maxLength(50)],
//   last_name: [required, maxLength(50)],
//   email: [required, email],
//   phone: [phone],
//   password: [required, password],
//   confirm_password: [],
//   company_name: [maxLength(100)],
//   terms_accepted: [(value) => value ? null : 'You must accept the terms and conditions'],
// }

// export const forgotPasswordSchema = {
//   email: [required, email],
// }

// export const resetPasswordSchema = {
//   password: [required, password],
//   confirm_password: [],
// }

// export const profileSchema = {
//   first_name: [required, maxLength(50)],
//   last_name: [required, maxLength(50)],
//   email: [required, email],
//   phone: [phone],
//   company_name: [maxLength(100)],
//   bio: [maxLength(500)],
// }

// export const demoBookingSchema = {
//   first_name: [required, maxLength(50)],
//   last_name: [required, maxLength(50)],
//   email: [required, email],
//   phone: [phone],
//   company_name: [required, maxLength(100)],
//   company_size: [required],
//   preferred_date: [required],
//   preferred_time: [required],
//   message: [maxLength(1000)],
// }

// export const contactSchema = {
//   name: [required, maxLength(100)],
//   email: [required, email],
//   subject: [required, maxLength(200)],
//   message: [required, maxLength(2000)],
// }

// export const changePasswordSchema = {
//   current_password: [required],
//   new_password: [required, password],
//   confirm_password: [],
// }

// export const validateField = (value, validators) => {
//   for (const validator of validators) {
//     const error = validator(value)
//     if (error) return error
//   }
//   return null
// }

// export const validateForm = (data, schema) => {
//   const errors = {}
  
//   for (const [field, validators] of Object.entries(schema)) {
//     const error = validateField(data[field], validators)
//     if (error) {
//       errors[field] = error
//     }
//   }
  
//   return {
//     errors,
//     isValid: Object.keys(errors).length === 0
//   }
// }

// export const useFormValidation = (schema) => {
//   const validate = (data) => {
//     if (schema.confirm_password && data.password) {
//       schema.confirm_password = [confirmPassword(data.password)]
//     }
    
//     if (schema.confirm_password && data.new_password) {
//       schema.confirm_password = [confirmPassword(data.new_password)]
//     }
    
//     return validateForm(data, schema)
//   }
  
//   return { validate }
// }

// export default {
//   required, email, minLength, maxLength, phone, url, password, confirmPassword,
//   loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema,
//   profileSchema, demoBookingSchema, contactSchema, changePasswordSchema,
//   validateField, validateForm, useFormValidation,
// }



// frontend/src/utils/validation.js

// ============================================
// VALIDATION SCHEMAS - Used with validateForm()
// ============================================

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = {
  email: {
    required: true,
    email: true,
    label: 'Email'
  }
};

/**
 * Login Schema
 */
export const loginSchema = {
  email: {
    required: true,
    email: true,
    label: 'Email'
  },
  password: {
    required: true,
    minLength: 1,
    label: 'Password'
  }
};

/**
 * Signup Schema
 */
export const signupSchema = {
  email: {
    required: true,
    email: true,
    label: 'Email'
  },
  password: {
    required: true,
    minLength: 8,
    label: 'Password'
  },
  full_name: {
    required: true,
    minLength: 2,
    label: 'Full Name'
  }
};

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = {
  password: {
    required: true,
    minLength: 8,
    label: 'Password'
  },
  confirm_password: {
    required: true,
    label: 'Confirm Password'
  }
};

/**
 * Contact Form Schema
 */
export const contactSchema = {
  name: {
    required: true,
    minLength: 2,
    label: 'Name'
  },
  email: {
    required: true,
    email: true,
    label: 'Email'
  },
  message: {
    required: true,
    minLength: 10,
    label: 'Message'
  }
};

/**
 * Demo Booking Schema
 */
export const demoBookingSchema = {
  full_name: {
    required: true,
    minLength: 2,
    label: 'Full Name'
  },
  email: {
    required: true,
    email: true,
    label: 'Email'
  },
  company: {
    required: false,
    label: 'Company'
  },
  phone: {
    required: false,
    phone: true,
    label: 'Phone'
  }
};

/**
 * Customer Form Schema
 */
export const customerSchema = {
  name: {
    required: true,
    minLength: 2,
    label: 'Name'
  },
  email: {
    required: true,
    email: true,
    label: 'Email'
  },
  phone: {
    required: false,
    phone: true,
    label: 'Phone'
  }
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone is valid
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is often optional
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {boolean} Whether value exists
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum length required
 * @returns {boolean} Whether value meets minimum length
 */
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} Whether value is within maximum length
 */
export const validateMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
export const validateUrl = (url) => {
  if (!url) return true; // URLs are often optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate form data against a schema
 * @param {object} data - Form data object
 * @param {object} rules - Validation rules/schema
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];
    
    // Required validation
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${fieldRules.label || field} is required`;
      return; // Skip other validations if required fails
    }
    
    // Only validate other rules if value exists
    if (value) {
      // Email validation
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = 'Please enter a valid email address';
      }
      // Phone validation
      else if (fieldRules.phone && !validatePhone(value)) {
        errors[field] = 'Please enter a valid phone number';
      }
      // Min length validation
      else if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
        errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
      }
      // Max length validation
      else if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
        errors[field] = `${fieldRules.label || field} must be no more than ${fieldRules.maxLength} characters`;
      }
      // URL validation
      else if (fieldRules.url && !validateUrl(value)) {
        errors[field] = 'Please enter a valid URL';
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  // Schemas
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  contactSchema,
  demoBookingSchema,
  customerSchema,
  
  // Functions
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePassword,
  validateUrl,
  validateForm
};