// // import { useForm } from "react-hook-form"
// // import { yupResolver } from "@hookform/resolvers/yup"
// // import * as yup from "yup"
// // import { useTranslation } from "react-i18next"

// // const schema = yup.object({
// //   name: yup.string().required('nameRequired'),
// //   businessName: yup.string().required('businessNameRequired'),
// //   email: yup.string().email('emailInvalid').required('emailRequired'),
// //   phone: yup.string().required('phoneRequired'),
// //   description: yup.string().required('descriptionRequired'),
// // }).required()

// // const DemoForm = () => {
// //   const { t } = useTranslation()
// //   const { register, handleSubmit, formState: { errors } } = useForm({
// //     resolver: yupResolver(schema)
// //   })

// //   const onSubmit = (data) => {
// //     console.log('Demo form submitted:', data)
// //     // Mock AI call simulation
// //     setTimeout(() => {
// //       console.log(`Simulating AI call to ${data.phone} with personalized agent for ${data.name}`)
// //     }, 2000)
// //   }

// //   return (
// //     <section className="py-16 bg-white relative z-10">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">{t('demoForm.title')}</h2>
// //         <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
// //           <div>
// //             <input
// //               {...register('name')}
// //               placeholder={t('demoForm.name')}
// //               className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
// //               aria-invalid={errors.name ? 'true' : 'false'}
// //             />
// //             {errors.name && <p className="text-red-500 text-sm mt-1">{t(`demoForm.${errors.name.message}`)}</p>}
// //           </div>
// //           <div>
// //             <input
// //               {...register('businessName')}
// //               placeholder={t('demoForm.businessName')}
// //               className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
// //               aria-invalid={errors.businessName ? 'true' : 'false'}
// //             />
// //             {errors.businessName && <p className="text-red-500 text-sm mt-1">{t(`demoForm.${errors.businessName.message}`)}</p>}
// //           </div>
// //           <div>
// //             <input
// //               {...register('email')}
// //               placeholder={t('demoForm.email')}
// //               className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
// //               aria-invalid={errors.email ? 'true' : 'false'}
// //             />
// //             {errors.email && <p className="text-red-500 text-sm mt-1">{t(`demoForm.${errors.email.message}`)}</p>}
// //           </div>
// //           <div>
// //             <input
// //               {...register('phone')}
// //               placeholder={t('demoForm.phone')}
// //               className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
// //               aria-invalid={errors.phone ? 'true' : 'false'}
// //             />
// //             {errors.phone && <p className="text-red-500 text-sm mt-1">{t(`demoForm.${errors.phone.message}`)}</p>}
// //           </div>
// //           <div>
// //             <textarea
// //               {...register('description')}
// //               placeholder={t('demoForm.description')}
// //               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
// //               rows="4"
// //               aria-invalid={errors.description ? 'true' : 'false'}
// //             />
// //             {errors.description && <p className="text-red-500 text-sm mt-1">{t(`demoForm.${errors.description.message}`)}</p>}
// //           </div>
// //           <button
// //             type="submit"
// //             className="w-full bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
// //             aria-label={t('demoForm.submit')}
// //           >
// //             {t('demoForm.submit')}
// //           </button>
// //         </form>
// //       </div>
// //     </section>
// //   )
// // }

// // export default DemoForm


// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"
// import { useState } from "react"

// const DemoBooking = ({ id }) => {
//   const { t } = useTranslation()
//   const [formData, setFormData] = useState({
//     name: '',
//     businessName: '',
//     email: '',
//     phone: '',
//     businessDescription: '',
//   })
//   const [errors, setErrors] = useState({})
//   const [submitted, setSubmitted] = useState(false)

//   const validateForm = () => {
//     const newErrors = {}
//     if (!formData.name.trim()) newErrors.name = t('Enter Name')
//     if (!formData.businessName.trim()) newErrors.businessName = t('Enter Booking Business Name')
//     if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       newErrors.email = t('Enter Booking email')
//     if (!formData.phone.trim() || !/^\+?[\d\s-]{10,}$/.test(formData.phone))
//       newErrors.phone = t('Enter Booking Phone')
//     if (!formData.businessDescription.trim())
//       newErrors.businessDescription = t('Enter Booking Business Description')
//     return newErrors
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const newErrors = validateForm()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }
//     setErrors({})
//     try {
//       // Mock API call to trigger AI agent call
//       console.log('Submitting form:', formData)
//       // In production, replace with:
//       // const response = await fetch('/api/book-demo', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(formData)
//       // })
//       // await response.json()
//       setSubmitted(true)
//       setFormData({
//         name: '',
//         businessName: '',
//         email: '',
//         phone: '',
//         businessDescription: '',
//       })
//       setTimeout(() => setSubmitted(false), 5000) // Hide success message after 5s
//     } catch (error) {
//       console.error('Submission failed:', error)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
//   }

//   return (
//     <section id="DemoBooking" className="py-16 bg-gray-50 relative z-10 font-poppins border-t-2 border-blue-600 p-2">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
//         {/* Title */}
//         <motion.h2
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-3xl font-extrabold text-center text-gray-900 mb-8"
//         >
//           {t('Booking')}
//         </motion.h2>

//         {/* Form */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-black"
//         >
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="name" className="block text-xl font-medium text-black">
//                 {t('Name')}
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className={`mt-1 w-full p-2 border rounded-md  focus:border-blue-600 ${
//                   errors.name ? 'border-red-600' : 'border-black'
//                 }`}
//                 aria-label={t('demoBooking.name')}
//                 placeholder={t('')}
//               />
//               {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//             </div>
//             <div>
//               <label htmlFor="businessName" className="block text-xl font-medium text-gray-900">
//                 {t('Business Name')}
//               </label>
//               <input
//                 type="text"
//                 id="businessName"
//                 name="businessName"
//                 value={formData.businessName}
//                 onChange={handleInputChange}
//                 className={`mt-1 w-full p-2 border rounded-md  focus:border-blue-600 ${
//                   errors.businessName ? 'border-red-600' : 'border-black'
//                 }`}
//                 aria-label={t('demoBooking.businessName')}
//                 placeholder={t('')}
//               />
//               {errors.businessName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-xl font-medium text-gray-900">
//                 {t('Booking Email')}
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className={`mt-1 w-full p-2 border rounded-md  focus:border-blue-600 ${
//                   errors.email ? 'border-red-600' : 'border-black'
//                 }`}
//                 aria-label={t('demoBooking.email')}
//                 placeholder={t('')}
//               />
//               {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-xl font-medium text-gray-900">
//                 {t('Booking Phone')}
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className={`mt-1 w-full p-2 border rounded-md  focus:border-blue-600 ${
//                   errors.phone ? 'border-red-600' : 'border-black'
//                 }`}
//                 aria-label={t('demoBooking.phone')}
//                 placeholder={t('')}
//               />
//               {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
//             </div>
//             <div>
//               <label htmlFor="businessDescription" className="block text-xl font-medium text-gray-900">
//                 {t('Booking Business Description')}
//               </label>
//               <textarea
//                 id="businessDescription"
//                 name="businessDescription"
//                 value={formData.businessDescription}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className={`mt-1 w-full p-2 border rounded-md  focus:border-blue-600 ${
//                   errors.businessDescription ? 'border-red-600' : 'border-black'
//                 }`}
//                 aria-label={t('demoBooking.businessDescription')}
//                 placeholder={t('')}
//               />
//               {errors.businessDescription && (
//                 <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="w-full h-12 rounded-full bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
//               aria-label={t('demoBooking.submit')}
//             >
//               {t('Confirm Booking')}
//             </button>
//           </form>
//         </motion.div>

//         {/* Success Modal */}
//         {submitted && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             transition={{ duration: 0.4 }}
//             className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50"
//             role="dialog"
//             aria-label={t('demoBooking.successTitle')}
//           >
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto text-center">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 {t('demoBooking.successTitle')}
//               </h3>
//               <p className="text-base text-gray-700 mb-4">{t('demoBooking.successMessage')}</p>
//               <button
//                 onClick={() => setSubmitted(false)}
//                 className="h-10 px-4 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
//                 aria-label={t('demoBooking.close')}
//               >
//                 {t('demoBooking.close')}
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </section>
//   )
// }

// export default DemoBooking

// frontend/src/Pages/website/DemoForm.jsx - COMPLETE WORKING VERSION
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { useState } from "react"
import api from "../../services/api"

const DemoForm = () => {
  const { t } = useTranslation()
  const primaryColor = 'blue-600'
  
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    business_description: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) 
      newErrors.name = t('Enter Name') || 'Name is required'
    if (!formData.business_name.trim()) 
      newErrors.business_name = t('Enter Booking Business Name') || 'Business name is required'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('Enter Booking email') || 'Valid email is required'
    if (!formData.phone.trim() || !/^\+?[\d\s-]{10,}$/.test(formData.phone))
      newErrors.phone = t('Enter Booking Phone') || 'Valid phone number is required'
    if (!formData.business_description.trim())
      newErrors.business_description = t('Enter Booking Business Description') || 'Business description is required'
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
      const response = await api.post('/demo/book', formData)
      
      console.log('✅ Demo booking successful:', response.data)
      
      // Show success message
      setSubmitted(true)
      
      // Reset form
      setFormData({
        name: '',
        business_name: '',
        email: '',
        phone: '',
        business_description: '',
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
      
    } catch (error) {
      console.error('❌ Demo booking failed:', error)
      
      // Show error message
      if (error.response?.data?.detail) {
        setApiError(error.response.data.detail)
      } else {
        setApiError('Failed to submit demo request. Please try again.')
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
    <section id="DemoBooking" className="py-16 bg-gray-50 relative z-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
        >
          {t('Booking') || 'Book a Demo'}
        </motion.h2>

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto mb-8 p-6 bg-green-50 border-2 border-green-500 rounded-xl text-center"
          >
            <div className="text-green-600 font-bold text-xl mb-2">
              ✅ Booking Confirmed!
            </div>
            <p className="text-green-700">
              A specialist will contact you shortly to confirm details.
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto mb-8 p-6 bg-red-50 border-2 border-red-500 rounded-xl text-center"
          >
            <div className="text-red-600 font-bold text-xl mb-2">
              ❌ Error
            </div>
            <p className="text-red-700">{apiError}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Name') || 'Name'} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} transition-colors duration-150 placeholder-gray-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Business Name Field */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Business Name') || 'Business Name'} *
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} transition-colors duration-150 placeholder-gray-400 ${
                  errors.business_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Acme Corporation"
                disabled={isSubmitting}
              />
              {errors.business_name && (
                <p className="text-red-500 text-sm mt-1">{errors.business_name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Email') || 'Email'} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} transition-colors duration-150 placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Phone') || 'Phone'} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} transition-colors duration-150 placeholder-gray-400 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 234 567 8900"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Business Description Field */}
            <div>
              <label htmlFor="business_description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Business Description') || 'Business Description'} *
              </label>
              <textarea
                id="business_description"
                name="business_description"
                value={formData.business_description}
                onChange={handleInputChange}
                rows="4"
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} transition-colors duration-150 placeholder-gray-400 resize-none ${
                  errors.business_description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us about your business and what you're looking for..."
                disabled={isSubmitting}
              />
              {errors.business_description && (
                <p className="text-red-500 text-sm mt-1">{errors.business_description}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-${primaryColor} text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                t('Book Demo') || 'Book a Demo'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default DemoForm