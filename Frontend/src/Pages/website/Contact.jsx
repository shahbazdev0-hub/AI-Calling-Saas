// frontend/src/Pages/website/Contact.jsx - FIXED WITH API (YOUR ORIGINAL UI PRESERVED)
import { motion } from "framer-motion"
import { useState } from "react"
import { Phone, Mail, MapPin } from "lucide-react"
import api from "../../services/api" // ✅ ONLY NEW LINE - Import API

const useTranslation = () => ({
  t: (key) => {
    const translations = {
      'contact.title': 'Schedule Your Inspection',
      'Full Name': 'Full Name *',
      'Business Name': 'Business Name *',
      'Email Address': 'Email Address *',
      'Phone Number': 'Phone Number *',
      'Preferred Date': 'Preferred Date',
      'Business Description': 'Business Description *',
      'Enter Name': 'Full Name is required.',
      'Enter Business Name': 'Business Name is required.',
      'Enter Email': 'Please enter a valid email address.',
      'Enter Phone': 'Please enter a valid phone number.',
      'Enter Business Description': 'Please provide a description of your business.',
      'Schedule Inspection': 'Schedule Inspection',
      'Call Instead': 'Call Instead',
      'Required Fields Note': '* Required fields. We\'ll contact you within 4 hours to confirm your appointment.',
      'Call Us Now': 'Call Us Now',
      'Email Address Contact': 'Email Address',
      'Our Location': 'Our Location',
      'Primary Phone': '(+1) 734-668-7928',
      'Secondary Phone': '(+1) 734-668-7908',
      'Inspection Email': 'mail@inspection.com',
      'Location Address': '1984 S Industrial Hwy, Michigan, 48104, United States',
      'Success': 'Appointment Requested!',
      'Your request has been submitted': 'Thank you! We have received your request and will contact you within 4 hours to confirm the date and details.',
      'Close': 'Close',
    }
    return translations[key] || key
  },
})

const Contact = () => {
  const { t } = useTranslation()
  const primaryColor = 'red-600'
  const primaryHoverColor = 'red-700'

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    preferredDate: '',
    businessDescription: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // ✅ NEW: Loading state

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = t('Enter Name')
    if (!formData.businessName.trim()) newErrors.businessName = t('Enter Business Name')
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('Enter Email')
    if (!formData.phone.trim() || !/^\+?[\d\s()-]{10,}$/.test(formData.phone))
      newErrors.phone = t('Enter Phone')
    if (!formData.businessDescription.trim()) 
      newErrors.businessDescription = t('Enter Business Description')
    return newErrors
  }

  // ✅ MODIFIED: handleSubmit with actual API call
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setIsSubmitting(true) // ✅ Start loading

    try {
      // ✅ MAP YOUR FIELDS TO BACKEND SCHEMA
      const backendData = {
        name: formData.fullName,
        email: formData.email,
        subject: `Inspection Request - ${formData.businessName}`,
        message: `Business: ${formData.businessName}\nPhone: ${formData.phone}\nPreferred Date: ${formData.preferredDate || 'Not specified'}\n\nDescription:\n${formData.businessDescription}`,
        phone: formData.phone,
        company: formData.businessName
      }

      console.log('📤 Sending contact form:', backendData)

      // ✅ ACTUAL API CALL
      const response = await api.post('/contact/send', backendData)
      
      console.log('✅ Email sent successfully:', response.data)

      // Show success modal
      setSubmitted(true)
      
      // Reset form
      setFormData({
        fullName: '',
        businessName: '',
        email: '',
        phone: '',
        preferredDate: '',
        businessDescription: '',
      })

      // Hide modal after 4 seconds (your original timing)
      setTimeout(() => {
        setSubmitted(false)
      }, 4000)

    } catch (error) {
      console.error('❌ Failed to send email:', error)
      alert('Failed to send message. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false) // ✅ Stop loading
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const inputBaseClass =
    'w-full p-3 border-2 border-red-600 rounded-lg bg-gray-50/60 transition-all duration-150 focus:outline-none focus:ring-0 font-poppins'
  const inputFocusClass = ''
  const inputErrorClass = (name) => (errors[name] ? 'border-red-500' : 'border-gray-300')

  const Sidebar = () => (
    <div className="border-l-2 border-t-2 border-b-2 border-white md:w-[330px] h-full bg-background rounded-2xl shadow-xl p-6 text-white font-poppins">
      <div className="bg-red-900/40 rounded-lg p-4 mb-6">
        <h3 className="text-lg text-white font-semibold color-black mb-3">{t('Call Us Now')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-300" /> {t('Primary Phone')}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-300" /> {t('Secondary Phone')}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg text-white font-semibold mb-2">{t('Email Address Contact')}</h3>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-red-300" /> {t('Inspection Email')}
          </div>
        </div>

        <div>
          <h3 className="text-lg text-white font-semibold mb-2">{t('Our Location')}</h3>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-red-300 mt-1" />
            <p className='text-white'>{t('Location Address')}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const InputField = ({ labelKey, name, type = 'text', placeholder }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-black mb-1 font-poppins">
        {t(labelKey)}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`${inputBaseClass} ${inputFocusClass} ${inputErrorClass(name)}`}
        placeholder={placeholder}
        disabled={isSubmitting} // ✅ Disable during submission
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  )

  return (
    <section id="contact" className="py-20 bg-background font-poppins">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sidebar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-grow p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6 border-2 border-red-600 p-10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField labelKey="Full Name" name="fullName" placeholder="John Smith" />
                <InputField labelKey="Business Name" name="businessName" placeholder="Acme Corp." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField labelKey="Email Address" name="email" type="email" placeholder="john@example.com" />
                <InputField labelKey="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" />
              </div>

              <InputField labelKey="Preferred Date" name="preferredDate" type="date" />

              <InputField labelKey="Business Description" name="businessDescription" placeholder="Describe your business..." />

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting} // ✅ Disable button during submission
                  className="flex-1 h-12 rounded-lg bg-red-600 text-white font-semibold text-base hover:bg-black transition duration-200 shadow-md font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : t('Schedule Inspection')} {/* ✅ Show loading text */}
                </button>
              </div>

              <p className="text-xm text-red-900 mt-2 font-poppins">{t('Required Fields Note')}</p>
            </form>
          </motion.div>
        </div>

        {/* ✅ YOUR ORIGINAL SUCCESS MODAL (UNCHANGED) */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white p-8 rounded-xl text-center shadow-2xl max-w-sm font-poppins"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('Success')}</h3>
              <p className="text-gray-700 mb-6">{t('Your request has been submitted')}</p>
              <button
                onClick={() => setSubmitted(false)}
                className={`h-10 px-6 rounded-lg bg-${primaryColor} text-white font-semibold hover:bg-${primaryHoverColor} transition font-poppins`}
              >
                {t('Close')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Contact