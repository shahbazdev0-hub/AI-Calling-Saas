// / src/Pages/auth/ForgotPassword.jsx
// ===========================================
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useApi } from "../../hooks/useApi"
import Input from "../../Components/ui/Input"
import Button from "../../Components/ui/Button"
import { validateForm, forgotPasswordSchema } from "../../utils/validation"
import toast from "react-hot-toast"

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { post } = useApi()
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { errors: validationErrors, isValid } = validateForm(formData, forgotPasswordSchema)
    
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      await post('/auth/forgot-password', formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Forgot password failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-8">We've sent a password reset link to <strong>{formData.email}</strong></p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">Didn't receive the email? Check your spam folder or try again.</p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" fullWidth>Try different email</Button>
              <div className="text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500 inline-flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />Back to sign in
                </Link>
              </div>
            </div>
          </div>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} leftIcon={<Mail className="h-5 w-5" />} placeholder="Enter your email address" autoComplete="email" required />
            <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>Send reset link</Button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-4">
          <div className="text-center">
            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500 inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />Back to sign in
            </Link>
          </div>
          <p className="text-sm text-gray-600">Don't have an account? <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">Sign up here</Link></p>
        </div>

        <div className="mt-8 text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-4">Need help?</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact Support</Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword