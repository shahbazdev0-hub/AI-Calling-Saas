// frontend/src/Pages/website/Contact.jsx - COMPLETE WORKING VERSION
import { motion } from "framer-motion"
import { useState } from "react"
import { Phone, Mail, MapPin } from "lucide-react"
import api from "../../services/api"

const useTranslation = () => ({
  t: (key) => {
    const translations = {
      'contact.title': 'Get in Touch',
      'Full Name': 'Full Name *',
      'Email Address': 'Email Address *',
      'Phone Number': 'Phone Number',
      'Company': 'Company',
      'Subject': 'Subject *',
      'Message': 'Message *',
      'Enter Name': 'Full Name is required.',
      'Enter Email': 'Please enter a valid email address.',
      'Enter Subject': 'Subject is required.',
      'Enter Message': 'Message is required.',
      'Send Message': 'Send Message',
      'Success': 'Message Sent!',
      'Your message has been sent': 'Thank you! We have received your message and will get back to you soon.',
      'Close': 'Close',
      'Call Us': 'Call Us',
      'Email Us': 'Email Us',
      'Visit Us': 'Visit Us',
    }
    return translations[key] || key
  },
})

const Contact = () => {
  const { t } = useTranslation()
  const primaryColor = 'blue-600'
  const primaryHoverColor = 'blue-700'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) 
      newErrors.name = t('Enter Name')
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('Enter Email')
    if (!formData.subject.trim())
      newErrors.subject = t('Enter Subject')
    if (!formData.message.trim())
      newErrors.message = t('Enter Message')
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    setApiError('')
    
    // Validate form
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // ✅ ACTUAL API CALL TO BACKEND
      const response = await api.post('/contact/send', formData)
      
      console.log('✅ Contact message sent:', response.data)
      
      // Show success message
      setSubmitted(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
      
    } catch (error) {
      console.error('❌ Contact form submission failed:', error)
      
      // Show error message
      if (error.response?.data?.detail) {
        setApiError(error.response.data.detail)
      } else {
        setApiError('Failed to send message. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <section id="Contact" className="py-16 bg-white relative z-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
        >
          {t('contact.title')}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className={`bg-${primaryColor} p-4 rounded-full`}>
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('Call Us')}</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-gray-600">Monday - Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`bg-${primaryColor} p-4 rounded-full`}>
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('Email Us')}</h3>
                <p className="text-gray-600">support@callcentersaas.com</p>
                <p className="text-gray-600">sales@callcentersaas.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className={`bg-${primaryColor} p-4 rounded-full`}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('Visit Us')}</h3>
                <p className="text-gray-600">123 Business Ave, Suite 100</p>
                <p className="text-gray-600">New York, NY 10001</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-8 rounded-xl shadow-lg"
          >
            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 bg-green-50 border-2 border-green-500 rounded-xl text-center"
              >
                <div className="text-green-600 font-bold text-xl mb-2">
                  ✅ {t('Success')}
                </div>
                <p className="text-green-700">
                  {t('Your message has been sent')}
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 bg-red-50 border-2 border-red-500 rounded-xl text-center"
              >
                <div className="text-red-600 font-bold text-xl mb-2">
                  ❌ Error
                </div>
                <p className="text-red-700">{apiError}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Full Name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Email Address')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Phone Number')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="+1 234 567 8900"
                  disabled={isSubmitting}
                />
              </div>

              {/* Company Field (Optional) */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Acme Corporation"
                  disabled={isSubmitting}
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="How can we help?"
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us more about your inquiry..."
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-${primaryColor} hover:bg-${primaryHoverColor} text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  t('Send Message')
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact