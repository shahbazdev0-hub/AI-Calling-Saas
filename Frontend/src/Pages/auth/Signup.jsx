// auth Signup.jsx 
import { Link } from "react-router-dom"
import SignupForm from "../../Components/forms/SignupForm"
import config from "../../services/config"
import { CheckCircle } from "lucide-react"

const Signup = () => {
  const benefits = [
    "14-day free trial with no credit card required",
    "Full access to all Professional features",
    "Dedicated onboarding support",
    "Integration assistance with your existing tools"
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="max-w-md mx-auto w-full">
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Start your free trial and transform your business today
              </p>
            </div>

            {/* Form */}
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <SignupForm />
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="lg:pl-8">
            <div className="bg-primary-50 rounded-2xl p-8 h-full flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose {config.APP_NAME}?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of businesses that have already transformed their 
                  sales process with our AI-powered call center platform.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">10M+</div>
                  <div className="text-sm text-gray-600">Calls Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">300%</div>
                  <div className="text-sm text-gray-600">ROI Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Availability</div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                    <div className="text-sm text-gray-500">CEO, TechStart Inc.</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "CallCenter Pro transformed our sales process completely. We went from 
                  20 calls per day to 200+ automated calls, and our conversion rate 
                  actually improved. It's like having a team of perfect sales reps."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-12 text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Our team is here to assist you.
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

export default Signup