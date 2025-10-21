// src/Pages/auth/ResetPassword.jsx
import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Lock, CheckCircle } from "lucide-react"
import Input from "../../Components/ui/Input"
import Button from "../../Components/ui/Button"
import toast from "react-hot-toast"

const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: '', confirm_password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isValidToken, setIsValidToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setIsValidToken(false)
    } else {
      setIsValidToken(true)
    }
  }, [token])

  // Basic form validation
  const validateForm = (data) => {
    const newErrors = {}
    
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

    return {
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { errors: validationErrors, isValid } = validateForm(formData)
    
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      console.log('Attempting password reset with token:', token)
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          token, 
          new_password: formData.password 
        })
      })

      console.log('Reset password response status:', response.status)
      const responseData = await response.json()
      console.log('Reset password response data:', responseData)

      if (response.ok) {
        setIsSubmitted(true)
        toast.success('Password reset successfully!')
      } else {
        console.error('Password reset failed:', responseData)
        if (response.status === 400) {
          setIsValidToken(false)
          toast.error('Invalid or expired reset token')
        } else {
          toast.error(responseData.detail || 'Password reset failed')
          setErrors({ general: responseData.detail || 'Password reset failed. Please try again.' })
        }
      }
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('Network error during password reset')
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-8">This password reset link is invalid or has expired. Please request a new one.</p>
          </div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <Button as={Link} to="/forgot-password" variant="primary" fullWidth className="mb-4">
              Request New Reset Link
            </Button>
            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
            <p className="text-gray-600 mb-8">Your password has been successfully reset. You can now sign in with your new password.</p>
          </div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <Button as={Link} to="/login" variant="primary" fullWidth>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CP</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">CallCenter Pro</span>
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Set new password</h2>
          <p className="text-gray-600">Enter your new password below. Make sure it's strong and secure.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show general errors */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <Input 
              label="New Password" 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              error={errors.password} 
              leftIcon={<Lock className="h-5 w-5" />} 
              placeholder="Enter your new password" 
              autoComplete="new-password" 
              showPasswordToggle 
              onPasswordToggle={() => setShowPassword(!showPassword)} 
              helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character" 
              required 
            />

            <Input 
              label="Confirm New Password" 
              type={showConfirmPassword ? 'text' : 'password'} 
              name="confirm_password" 
              value={formData.confirm_password} 
              onChange={handleChange} 
              error={errors.confirm_password} 
              leftIcon={<Lock className="h-5 w-5" />} 
              placeholder="Confirm your new password" 
              autoComplete="new-password" 
              showPasswordToggle 
              onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
              required 
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              fullWidth 
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword