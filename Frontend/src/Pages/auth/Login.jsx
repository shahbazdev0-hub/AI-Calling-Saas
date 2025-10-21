// auth login.jsx
import { Link } from "react-router-dom"
import LoginForm from "../../Components/forms/LoginForm"
import config from "../../services/config"

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CP</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {config.APP_NAME}
          </span>
        </Link>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sign in to your account
          </h2>
          <p className="text-gray-600">
            Welcome back! Please sign in to access your dashboard.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to {config.APP_NAME}?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Need help getting started?
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact Support
              </Link>
              <Link
                to="/demo"
                className="text-gray-600 hover:text-gray-900"
              >
                Book a Demo
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


