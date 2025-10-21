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
// website/DemoForm.jsx
import { motion } from "framer-motion"
import { useState } from "react"
import { demoAPI } from "../../services/api"
import toast from "react-hot-toast"

const useTranslation = () => ({
  t: (key) => {
    const translations = {
      'Booking': 'Book A Demo',
      'Name': 'Your Name',
      'Business Name': 'Business Name',
      'Booking Email': 'Email Address',
      'Booking Phone': 'Phone Number',
      'Booking Business Description': 'Tell us about your business',
      'Confirm Booking': 'Confirm Booking',
      'Enter Name': 'Please enter your name.',
      'Enter Booking Business Name': 'Please enter your business name.',
      'Enter Booking email': 'Please enter a valid email address.',
      'Enter Booking Phone': 'Please enter a valid phone number.',
      'Enter Booking Business Description': 'Please describe your business.',
    }
    return translations[key] || key
  },
})

const DemoForm = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    businessDescription: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = t('Enter Name')
    if (!formData.businessName.trim())
      newErrors.businessName = t('Enter Booking Business Name')
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('Enter Booking email')
    if (!formData.phone.trim() || !/^\+?[\d\s-]{10,}$/.test(formData.phone))
      newErrors.phone = t('Enter Booking Phone')
    if (!formData.businessDescription.trim())
      newErrors.businessDescription = t('Enter Booking Business Description')
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setIsSubmitting(true)

    try {
      // ✅ CALL BACKEND API
      const response = await demoAPI.create({
        name: formData.name,
        business_name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        business_description: formData.businessDescription
      })

      console.log('Demo booking response:', response.data)
      
      // Show success
      setSubmitted(true)
      toast.success('Demo booked successfully! We\'ll contact you soon.')
      
      // Reset form
      setFormData({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        businessDescription: '',
      })

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
      
    } catch (error) {
      console.error('Demo booking failed:', error)
      toast.error(error.response?.data?.detail || 'Failed to book demo. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return (
    <section id="DemoBooking" className="py-16 bg-gray-50 relative z-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl text-center text-gray-900 mb-12"
        >
          {t('Booking')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-150 placeholder-gray-400 ${
                  errors.name ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Business Name')}
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-150 placeholder-gray-400 ${
                  errors.businessName ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="Your Company"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Booking Email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-150 placeholder-gray-400 ${
                  errors.email ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Booking Phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-150 placeholder-gray-400 ${
                  errors.phone ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Booking Business Description')}
              </label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                rows="4"
                value={formData.businessDescription}
                onChange={handleInputChange}
                className={`mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-150 placeholder-gray-400 ${
                  errors.businessDescription ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="Tell us about your business..."
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : t('Confirm Booking')}
            </button>
          </form>
        </motion.div>

        {/* Success Modal */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Confirmed!
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                A specialist will contact you shortly to confirm details.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default DemoForm