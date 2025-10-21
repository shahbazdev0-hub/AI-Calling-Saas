// components/forms/SignupForm.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, User, Phone, Building } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Input from "../../Components/ui/Input"
import Button from "../../Components/ui/Button"
import toast from "react-hot-toast"

const SignupForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    company_name: '',
    terms_accepted: false
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validateForm = (data) => {
    const newErrors = {}

    if (!data.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    if (!data.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    if (!data.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!data.password) {
      newErrors.password = 'Password is required'
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character'
    }
    if (!data.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (data.password !== data.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }
    if (!data.terms_accepted) {
      newErrors.terms_accepted = 'You must accept the terms and conditions'
    }

    return {
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // ✅ UPDATED: Handle auto-login and redirect to dashboard
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Registration form submitted with:', formData)
    
    // Validate form
    const { errors: validationErrors, isValid } = validateForm(formData)
    
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Transform form data to match backend schema
      const backendData = {
        email: formData.email,
        password: formData.password,
        full_name: `${formData.first_name.trim()} ${formData.last_name.trim()}`, // Combine names
        company: formData.company_name || null, // Map company_name to company
        phone: formData.phone || null
      }
      
      console.log('Sending to backend:', backendData)
      
      // ✅ CHANGED: Get the result from register function
      const result = await register(backendData)
      
      // ✅ NEW: Check if user was auto-logged in
      if (result && result.autoLogin) {
        // User is already logged in, redirect to dashboard
        console.log('✅ Auto-login successful, redirecting to dashboard')
        navigate('/dashboard', { 
          replace: true 
        })
      } else {
        // Old flow - redirect to login (fallback)
        console.log('📧 Email verification required, redirecting to login')
        navigate('/login', { 
          state: { message: 'Registration successful! Please check your email for verification.' }
        })
      }
    } catch (error) {
      console.error('Registration failed:', error)
      
      // Handle backend validation errors
      if (error?.response?.status === 422 && error?.response?.data?.detail) {
        const backendErrors = error.response.data.detail
        if (Array.isArray(backendErrors)) {
          const fieldErrors = {}
          backendErrors.forEach(err => {
            const fieldName = err.loc?.[err.loc.length - 1]
            if (fieldName) {
              fieldErrors[fieldName] = err.msg
            }
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: 'Registration failed. Please check your information.' })
        }
      } else if (error?.response?.data?.detail) {
        setErrors({ general: error.response.data.detail })
      } else {
        setErrors({ general: 'Registration failed. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Show general errors */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="First Name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={errors.first_name}
          leftIcon={<User className="h-5 w-5" />}
          placeholder="John"
          autoComplete="given-name"
          required
        />

        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={errors.last_name}
          leftIcon={<User className="h-5 w-5" />}
          placeholder="Doe"
          autoComplete="family-name"
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email || errors.email}
        leftIcon={<Mail className="h-5 w-5" />}
        placeholder="john@example.com"
        autoComplete="email"
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        leftIcon={<Phone className="h-5 w-5" />}
        placeholder="+1 (555) 123-4567"
        autoComplete="tel"
      />

      <Input
        label="Company Name"
        type="text"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        error={errors.company_name || errors.company}
        leftIcon={<Building className="h-5 w-5" />}
        placeholder="Your Company Inc."
        autoComplete="organization"
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        leftIcon={<Lock className="h-5 w-5" />}
        placeholder="Create a strong password"
        autoComplete="new-password"
        showPasswordToggle
        onPasswordToggle={() => setShowPassword(!showPassword)}
        helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
        required
      />

      <Input
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        name="confirm_password"
        value={formData.confirm_password}
        onChange={handleChange}
        error={errors.confirm_password}
        leftIcon={<Lock className="h-5 w-5" />}
        placeholder="Confirm your password"
        autoComplete="new-password"
        showPasswordToggle
        onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        required
      />

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms_accepted"
            name="terms_accepted"
            type="checkbox"
            checked={formData.terms_accepted}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            required
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms_accepted" className="text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
            </Link>
          </label>
          {errors.terms_accepted && (
            <p className="mt-1 text-red-600 text-sm">{errors.terms_accepted}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in here
          </Link>
        </span>
      </div>
    </form>
  )
}

export default SignupForm

