// components/forms/LoginForm.jsx - FIXED
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Mail, Lock } from "lucide-react"
import toast from "react-hot-toast" // ✅ ADDED - Missing import
import { useAuth } from "../../contexts/AuthContext"
import Input from "../ui/Input"
import Button from "../ui/Button"

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const validateForm = (data) => {
    const newErrors = {}

    if (!data.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!data.password) {
      newErrors.password = 'Password is required'
    }

    return {
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🔐 Form submitted with:', formData) // Enhanced debug log
    
    // Validate form
    const { errors: validationErrors, isValid } = validateForm(formData)
    
    if (!isValid) {
      console.log('❌ Form validation failed:', validationErrors)
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    console.log('🚀 Starting login process...')
    
    try {
      console.log('📞 Calling login function...')
      const result = await login(formData)
      console.log('✅ Login successful:', result)
      
      toast.success('Login successful! Redirecting to dashboard...')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('❌ Login failed in form:', error)
      
      // Set form-level error
      setErrors({ 
        general: error.message || 'Login failed. Please try again.' 
      })
      
      // Show toast error if not already shown by AuthContext
      if (!error.message?.includes('Cannot connect to server')) {
        toast.error(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ ADDED - Show form-level errors */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        leftIcon={<Mail className="h-5 w-5" />}
        placeholder="Enter your email"
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        leftIcon={<Lock className="h-5 w-5" />}
        placeholder="Enter your password"
        autoComplete="current-password"
        showPasswordToggle
        onPasswordToggle={() => setShowPassword(!showPassword)}
        required
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up here
          </Link>
        </span>
      </div>
    </form>
  )
}

export default LoginForm