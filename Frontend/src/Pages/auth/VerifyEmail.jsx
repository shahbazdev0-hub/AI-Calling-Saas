// src/Pages/auth/VerifyEmail.jsx
import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react"
import Button from "../../Components/ui/Button"
import toast from "react-hot-toast"

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading') // 'loading', 'success', 'error', 'invalid'
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setVerificationStatus('invalid')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      console.log('Verifying email with token:', token)
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      console.log('Verification response status:', response.status)
      const responseData = await response.json()
      console.log('Verification response data:', responseData)

      if (response.ok) {
        setVerificationStatus('success')
        setMessage(responseData.message || 'Email verified successfully!')
        toast.success('Email verified successfully!')
      } else {
        setVerificationStatus('error')
        setMessage(responseData.detail || 'Email verification failed. The token may be invalid or expired.')
        toast.error('Email verification failed')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setVerificationStatus('error')
      setMessage('Network error during verification. Please try again.')
      toast.error('Network error during verification')
    }
  }

  const handleResendVerification = async () => {
    // You would need to implement this based on how you store the email
    // For now, we'll redirect to registration to enter email again
    navigate('/signup')
  }

  const renderLoadingScreen = () => (
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
      <p className="text-gray-600">Please wait while we verify your email address.</p>
    </div>
  )

  const renderSuccessScreen = () => (
    <div className="text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
      <p className="text-gray-600 mb-8">{message}</p>
      
      <div className="space-y-4">
        <Button 
          as={Link} 
          to="/login" 
          variant="primary" 
          size="large"
          fullWidth
        >
          Sign In to Your Account
        </Button>
        
        <Link 
          to="/" 
          className="block text-sm text-primary-600 hover:text-primary-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )

  const renderErrorScreen = () => (
    <div className="text-center">
      <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
      <p className="text-gray-600 mb-8">{message}</p>
      
      <div className="space-y-4">
        <Button 
          onClick={handleResendVerification}
          variant="primary" 
          size="large"
          fullWidth
        >
          Request New Verification Email
        </Button>
        
        <Button 
          as={Link} 
          to="/login" 
          variant="outline" 
          size="large"
          fullWidth
        >
          Try Signing In
        </Button>
        
        <Link 
          to="/signup" 
          className="block text-sm text-primary-600 hover:text-primary-500"
        >
          Create New Account
        </Link>
      </div>
    </div>
  )

  const renderInvalidScreen = () => (
    <div className="text-center">
      <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Verification Link</h2>
      <p className="text-gray-600 mb-8">
        This verification link is invalid or malformed. Please check the link in your email or request a new verification email.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={handleResendVerification}
          variant="primary" 
          size="large"
          fullWidth
        >
          Request New Verification Email
        </Button>
        
        <Link 
          to="/login" 
          className="block text-sm text-primary-600 hover:text-primary-500"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CP</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">CallCenter Pro</span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus === 'loading' && renderLoadingScreen()}
          {verificationStatus === 'success' && renderSuccessScreen()}
          {verificationStatus === 'error' && renderErrorScreen()}
          {verificationStatus === 'invalid' && renderInvalidScreen()}
        </div>

        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail