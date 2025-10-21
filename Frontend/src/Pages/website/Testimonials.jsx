// // import { useTranslation } from "react-i18next"
// // import { motion } from "framer-motion"

// // const testimonials = [
// //   { name: 'Leander De Laporte', title: 'CEO & Co-Founder, Medbelle', quote: 'testimonials.medbelle' },
// //   { name: 'Daniel Lefanov', title: 'Implementation Manager, Smartcat', quote: 'testimonials.smartcat' },
// //   { name: 'Collins W.', title: 'Mortgage Protection Specialist', quote: 'testimonials.collins' },
// // ]

// // const clientLogos = [
// //   'Krisp', 'Medbelle', 'Smartcat', '10Web', 'Zenjob', 'GoTiger',
// //   'Aizee', 'Peak Demand', 'Europaper', 'MineralAnswers.com', 'Comparewise'
// // ]

// // const Testimonials = ({ id }) => {
// //   const { t } = useTranslation()

// //   return (
// //     <section id={id} className="py-16 bg-gray-100 relative z-10">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">{t('testimonials.title')}</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
// //           {testimonials.map((test, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 50 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.5, delay: index * 0.2 }}
// //               className="p-6 bg-white rounded-lg shadow-lg"
// //             >
// //               <p className="text-gray-700 mb-4">"{t(test.quote)}"</p>
// //               <p className="font-semibold text-blue-600">{test.name}</p>
// //               <p className="text-gray-500 text-sm">{test.title}</p>
// //             </motion.div>
// //           ))}
// //         </div>
// //         <div className="flex flex-wrap justify-center gap-4">
// //           {clientLogos.map((logo, index) => (
// //             <div key={index} className="text-gray-600 font-semibold text-center p-2">
// //               {logo}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default Testimonials


// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"

// const caseStudies = [
//   {
//     key: 'case1',
//     title: 'testimonials.case1.title',
//     client: 'testimonials.case1.client',
//     quote: 'testimonials.case1.quote',
//     result: 'testimonials.case1.result',
//   },
//   {
//     key: 'case2',
//     title: 'testimonials.case2.title',
//     client: 'testimonials.case2.client',
//     quote: 'testimonials.case2.quote',
//     result: 'testimonials.case2.result',
//   },
//   {
//     key: 'case3',
//     title: 'testimonials.case3.title',
//     client: 'testimonials.case3.client',
//     quote: 'testimonials.case3.quote',
//     result: 'testimonials.case3.result',
//   },
// ]

// const logos = [
//   { key: 'logo1', src: '/logos/client1.png', alt: 'Client 1' },
//   { key: 'logo2', src: '/logos/client2.png', alt: 'Client 2' },
//   { key: 'logo3', src: '/logos/client3.png', alt: 'Client 3' },
//   { key: 'logo4', src: '/logos/client4.png', alt: 'Client 4' },
// ]

// const Testimonials = ({ id }) => {
//   const { t } = useTranslation()

//   return (
//     <section id={id} className="py-16 bg-gray-50 relative z-10 font-inter">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Title */}
//         <motion.h2
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8"
//         >
//           {t('testimonials.title')}
//         </motion.h2>

//         {/* Case Studies */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
//         >
//           {caseStudies.map((caseStudy, index) => (
//             <div
//               key={caseStudy.key}
//               className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200"
//             >
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(caseStudy.title)}</h3>
//               <p className="text-base text-gray-700 italic mb-2">{t(caseStudy.quote)}</p>
//               <p className="text-sm text-gray-600 mb-2">{t(caseStudy.client)}</p>
//               <p className="text-base text-blue-600 font-semibold">{t(caseStudy.result)}</p>
//             </div>
//           ))}
//         </motion.div>

//         {/* Logos */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="flex justify-center items-center gap-8 overflow-x-auto"
//         >
//           {logos.map((logo) => (
//             <img
//               key={logo.key}
//               src={logo.src}
//               alt={logo.alt}
//               className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-200"
//               aria-hidden="true"
//             />
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default Testimonials


// // import { motion } from "framer-motion"

// // const testimonials = [
// //   {
// //     key: 'andre',
// //     headline: 'Provides the flexibility and ease of use to create AI Voice agents in minimal time.',
// //     quote: 'Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.',
// //     name: 'Andre F.',
// //     role: 'Business Owner',
// //   },
// //   {
// //     key: 'marco',
// //     headline: 'The future is here',
// //     quote: "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
// //     name: 'Marco B.',
// //     role: 'Business Owner',
// //   },
// //   {
// //     key: 'sadeeke',
// //     headline: 'The best AI Outbound agent, really.',
// //     quote: "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
// //     name: 'Sadeeke M.',
// //     role: 'CEO',
// //   },
// // ]

// // const logos = [
// //   { key: 'logo1', src: '/logos/client1.png', alt: 'Client 1' },
// //   { key: 'logo2', src: '/logos/client2.png', alt: 'Client 2' },
// //   { key: 'logo3', src: '/logos/client3.png', alt: 'Client 3' },
// //   { key: 'logo4', src: '/logos/client4.png', alt: 'Client 4' },
// // ]

// // export default function Testimonials({ id }) {
// //   return (
// //     <section id={id} className="relative py-20 bg-white font-inter">
// //       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// //         {/* Section Title */}
// //         <motion.h2
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6 }}
// //           className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12"
// //         >
// //           What Our Customers Say
// //         </motion.h2>

// //         {/* Testimonials */}
// //         <div className="space-y-20">
// //           {testimonials.map((t, idx) => (
// //             <motion.div
// //               key={t.key}
// //               initial={{ opacity: 0, y: 40 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.6, delay: idx * 0.2 }}
// //               className="max-w-3xl mx-auto"
// //             >
// //               <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
// //                 {t.headline}
// //               </h3>
// //               <p className="text-lg text-gray-700 italic mb-6">
// //                 “{t.quote}”
// //               </p>
// //               <div className="flex flex-col items-center">
// //                 <h4 className="text-lg font-medium text-gray-900">{t.name}</h4>
// //                 <p className="text-sm text-gray-600">{t.role}</p>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Logo Wall */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6, delay: 0.4 }}
// //           className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center"
// //         >
// //           {logos.map((logo) => (
// //             <img
// //               key={logo.key}
// //               src={logo.src}
// //               alt={logo.alt}
// //               className="h-12 w-auto grayscale hover:grayscale-0 transition duration-300"
// //             />
// //           ))}
// //         </motion.div>
// //       </div>
// //     </section>
// //   )
// // }

// import { motion } from "framer-motion"
// import { useState, useEffect } from "react"

// const testimonials = [
//   {
//     key: 'andre',
//     headline: 'Provides the flexibility and ease of use to create AI Voice agents in minimal time.',
//     quote: 'Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.',
//     name: 'Andre F.',
//     role: 'Business Owner',
//   },
//   {
//     key: 'marco',
//     headline: 'The future is here',
//     quote: "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
//     name: 'Marco B.',
//     role: 'Business Owner',
//   },
//   {
//     key: 'sadeeke',
//     headline: 'The best AI Outbound agent, really.',
//     quote: "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
//     name: 'Sadeeke M.',
//     role: 'CEO',
//   },
// ]

// const logos = [
//   { key: 'logo1', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWBuB632p-BzikvlVaPUTEubUuieUuoFM2TQ&s', alt: 'Client 1' },
//   { key: 'logo2', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWkbHs_lSRlg4On42BauYgPpO70JBWzJeyJ1lYcjiwZTFCuXLj6PRDuoMG7vgtqJyWUoU&usqp=CAU', alt: 'Client 2' },
//   { key: 'logo3', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHcxMYDVSL3r9P5hL-9DCo9nQDWljoTBhVLJP7mZaz7ILxXJzjISi3m5pcs7S_cXZf-X4&usqp=CAU', alt: 'Client 3' },
//   { key: 'logo4', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd0d-7Z-KJtD13yyXtRkD1Mait576pPuEKXh6B1jks6UKNAMHqCr3iNMLYW3PHg8AGYwE&usqp=CAU', alt: 'Client 4' },
//   { key: 'logo5', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHcxMYDVSL3r9P5hL-9DCo9nQDWljoTBhVLJP7mZaz7ILxXJzjISi3m5pcs7S_cXZf-X4&usqp=CAU', alt: 'Client 5' },
// ]

// export default function Testimonials({ id }) {
//   const [active, setActive] = useState(0)

//   // Autoplay every 6s
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActive((prev) => (prev + 1) % testimonials.length)
//     }, 6000)
//     return () => clearInterval(timer)
//   }, [])

//   return (
//     <section id={id} className="relative py-20 bg-white font-inter">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         {/* Section Title */}
//         <motion.h2
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
//         >
//           Loved by Business Owners & Teams
//         </motion.h2>
//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
//         >
//           See how companies are scaling sales and support with AI agents.
//         </motion.p>

//         {/* Testimonial Carousel */}
//         <div className="relative overflow-hidden">
//           <motion.div
//             key={testimonials[active].key}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.6 }}
//             className="p-8 bg-gray-50 rounded-2xl shadow-md mx-auto max-w-3xl"
//           >
//             <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
//               {testimonials[active].headline}
//             </h3>
//             <p className="text-lg text-gray-700 italic mb-6">
//               “{testimonials[active].quote}”
//             </p>
//             <div className="flex flex-col items-center">
//               <h4 className="text-lg font-medium text-gray-900">{testimonials[active].name}</h4>
//               <p className="text-sm text-gray-600">{testimonials[active].role}</p>
//             </div>
//           </motion.div>

//           {/* Dots */}
//           <div className="flex justify-center gap-3 mt-6">
//             {testimonials.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setActive(idx)}
//                 className={`w-3 h-3 rounded-full transition-all ${
//                   active === idx ? 'bg-blue-600' : 'bg-gray-300'
//                 }`}
//                 aria-label={`Go to testimonial ${idx + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Logo Wall */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center"
//         >
//           {logos.map((logo) => (
//             <img
//               key={logo.key}
//               src={logo.src}
//               alt={logo.alt}
//               className="h-12 w-auto grayscale hover:grayscale-0 transition duration-300"
//             />
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// import { motion } from "framer-motion"
// import { useState, useEffect } from "react"

// const testimonials = [
//   {
//     key: 'andre',
//     headline: 'Provides the flexibility and ease of use to create AI Voice agents in minimal time.',
//     quote: 'Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.',
//     name: 'Andre F.',
//     role: 'Business Owner',
//     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//   },
//   {
//     key: 'marco',
//     headline: 'The future is here',
//     quote: "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
//     name: 'Marco B.',
//     role: 'Business Owner',
//     avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
//   },
//   {
//     key: 'sadeeke',
//     headline: 'The best AI Outbound agent, really.',
//     quote: "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
//     name: 'Sadeeke M.',
//     role: 'CEO',
//     avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
//   },
// ]

// const logos = [
//   { key: 'logo1', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo-NIKE.svg', alt: 'Nike' },
//   { key: 'logo2', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', alt: 'Netflix' },
//   { key: 'logo3', src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', alt: 'IBM' },
//   { key: 'logo4', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Apple' },
//   { key: 'logo5', src: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', alt: 'Adidas' },
// ]

// export default function Testimonials({ id }) {
//   const [active, setActive] = useState(0)

//   // Autoplay every 6s
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActive((prev) => (prev + 1) % testimonials.length)
//     }, 6000)
//     return () => clearInterval(timer)
//   }, [])

//   return (
//     <section id="REVIEWS" className="relative py-20 bg-white font-poppins border-t-2 border-blue-600 p-2">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         {/* Section Title */}
//         <motion.h2
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl font-extrabold text-black mb-6"
//         >
//           Loved by Business Owners & Teams
//         </motion.h2>
//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg text-black mb-12 max-w-2xl mx-auto"
//         >
//           See how companies are scaling sales and support with AI agents.
//         </motion.p>

//         {/* Testimonial Carousel */}
//         <div className="relative overflow-hidden">
//           <motion.div
//             key={testimonials[active].key}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.6 }}
//             className="p-8 bg-gray-50 rounded-2xl shadow-md mx-auto max-w-3xl border border-black"
//           >
//             <h3 className="text-2xl md:text-3xl font-semibold text-black mb-4 border border-black">
//               {testimonials[active].headline}
//             </h3>
//             <p className="text-lg text-black italic mb-6">
//               “{testimonials[active].quote}”
//             </p>
//             <div className="flex flex-col items-center">
//               <img
//                 src={testimonials[active].avatar}
//                 alt={testimonials[active].name}
//                 className="w-14 h-14 rounded-full mb-3 shadow-md"
//               />
//               <h4 className="text-lg font-medium text-gray-900">{testimonials[active].name}</h4>
//               <p className="text-xl text-black">{testimonials[active].role}</p>
//             </div>
//           </motion.div>

//           {/* Dots */}
//           <div className="flex justify-center gap-3 mt-6">
//             {testimonials.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setActive(idx)}
//                 className={`w-3 h-3 rounded-full transition-all ${
//                   active === idx ? 'bg-blue-600' : 'bg-gray-300'
//                 }`}
//                 aria-label={`Go to testimonial ${idx + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Logo Wall with Scroll Animation */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="mt-20 overflow-hidden relative"
//         >
//           <div className="flex gap-16 animate-scroll">
//             {logos.concat(logos).map((logo, idx) => (
//               <img
//                 key={`${logo.key}-${idx}`}
//                 src={logo.src}
//                 alt={logo.alt}
//                 className="h-12 w-auto grayscale hover:grayscale-0 transition duration-300"
//               />
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }
// // import { motion } from "framer-motion"
// // import { useState, useEffect } from "react"

// // const testimonials = [
// //   {
// //     key: 'andre',
// //     headline: 'Provides the flexibility and ease of use to create AI Voice agents in minimal time.',
// //     quote: 'Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.',
// //     name: 'Andre F.',
// //     role: 'Business Owner',
// //     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
// //   },
// //   {
// //     key: 'marco',
// //     headline: 'The future is here',
// //     quote: "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
// //     name: 'Marco B.',
// //     role: 'Business Owner',
// //     avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
// //   },
// //   {
// //     key: 'sadeeke',
// //     headline: 'The best AI Outbound agent, really.',
// //     quote: "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
// //     name: 'Sadeeke M.',
// //     role: 'CEO',
// //     avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
// //   },
// // ]

// // const logos = [
// //   { key: 'logo1', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo-NIKE.svg', alt: 'Nike' },
// //   { key: 'logo2', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', alt: 'Netflix' },
// //   { key: 'logo3', src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', alt: 'IBM' },
// //   { key: 'logo4', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Apple' },
// //   { key: 'logo5', src: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', alt: 'Adidas' },
// // ]

// // export default function Testimonials({ id }) {
// //   const [active, setActive] = useState(0)
// //   const primaryColor = 'primary-600'; // Dark Teal
// //   const primaryLightColor = 'primary-50'; // Very light teal for background contrast

// //   // Autoplay every 6s
// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setActive((prev) => (prev + 1) % testimonials.length)
// //     }, 6000)
// //     return () => clearInterval(timer)
// //   }, [])

// //   return (
// //     <>
// //       {/* Custom CSS for the infinite logo scroll animation */}
// //       <style>
// //         {`
// //           @keyframes scroll {
// //             0% { transform: translateX(0); }
// //             100% { transform: translateX(-50%); }
// //           }
// //           .animate-scroll {
// //             /* We duplicate the content (logos.concat(logos)) and then scroll exactly 50% of the container width to loop */
// //             animation: scroll 30s linear infinite;
// //             width: 200%; /* Important: needs to be double to contain duplicated logos */
// //           }
// //         `}
// //       </style>
      
// //       <section id="REVIEWS" className={`relative py-20 bg-white font-poppins`}>
// //         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// //           {/* Section Title */}
// //           <motion.h2
// //             initial={{ opacity: 0, y: 30 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.6 }}
// //             className="text-4xl md:text-5xl  text-gray-900 mb-6"
// //           >
// //             Loved by Business Owners & Teams
// //           </motion.h2>
// //           <motion.p
// //             initial={{ opacity: 0, y: 30 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.6, delay: 0.2 }}
// //             className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto"
// //           >
// //             See how companies are scaling sales and support with AI agents.
// //           </motion.p>

// //           {/* Testimonial Carousel */}
// //           <div className="relative overflow-hidden">
// //             <motion.div
// //               key={testimonials[active].key}
// //               initial={{ opacity: 0, scale: 0.9 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               transition={{ duration: 0.5, ease: "easeOut" }}
// //               className={`p-8 bg-${primaryLightColor} rounded-2xl shadow-xl mx-auto max-w-3xl border-b-4 border-${primaryColor} min-h-[300px] flex flex-col justify-center`}
// //             >
// //               <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
// //                 {testimonials[active].headline}
// //               </h3>
// //               <p className="text-xl text-gray-700 italic mb-6">
// //                 “{testimonials[active].quote}”
// //               </p>
// //               <div className="flex justify-center items-center mt-4">
// //                 <img
// //                   src={testimonials[active].avatar}
// //                   alt={testimonials[active].name}
// //                   onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/56x56/34d399/ffffff?text=User" }}
// //                   className="w-14 h-14 rounded-full mr-4 shadow-md object-cover"
// //                 />
// //                 <div className="text-left">
// //                     <h4 className="text-lg font-bold text-gray-900">{testimonials[active].name}</h4>
// //                     <p className="text-sm text-gray-600">{testimonials[active].role}</p>
// //                 </div>
// //               </div>
// //             </motion.div>

// //             {/* Dots */}
// //             <div className="flex justify-center gap-3 mt-6">
// //               {testimonials.map((_, idx) => (
// //                 <button
// //                   key={idx}
// //                   onClick={() => setActive(idx)}
// //                   className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-${primaryColor}/50 ${
// //                     active === idx ? `bg-${primaryColor} w-6` : 'bg-gray-300 w-3'
// //                   }`}
// //                   aria-label={`Go to testimonial ${idx + 1}`}
// //                 />
// //               ))}
// //             </div>
// //           </div>

// //           {/* Logo Wall with Scroll Animation */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 30 }}
// //             whileInView={{ opacity: 1, y: 0 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.6, delay: 0.4 }}
// //             className="mt-20 overflow-hidden relative"
// //           >
// //             <h3 className="text-xl font-semibold text-gray-500 uppercase tracking-wider mb-6">
// //                 Trusted by Companies
// //             </h3>
// //             <div className="flex animate-scroll h-12">
// //               {/* Duplicating the list ensures a continuous loop */}
// //               {logos.concat(logos).map((logo, idx) => (
// //                 <img
// //                   key={`${logo.key}-${idx}`}
// //                   src={logo.src}
// //                   alt={logo.alt}
// //                   onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/f3f4f6/000000?text=Logo" }}
// //                   className="h-12 w-auto mx-8 flex-shrink-0 grayscale opacity-70 hover:opacity-100 transition duration-300 object-contain"
// //                 />
// //               ))}
// //             </div>
// //           </motion.div>
// //         </div>
// //       </section>
// //     </>
// //   )
// // }
// // import { motion } from "framer-motion";
// // import { useState, useEffect } from "react";

// // const testimonials = [
// //   {
// //     key: "andre",
// //     headline:
// //       "Provides the flexibility and ease of use to create AI Voice agents in minimal time.",
// //     quote:
// //       "Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.",
// //     name: "Andre F.",
// //     role: "Business Owner",
// //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
// //   },
// //   {
// //     key: "marco",
// //     headline: "The future is here",
// //     quote:
// //       "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
// //     name: "Marco B.",
// //     role: "Business Owner",
// //     avatar: "https://randomuser.me/api/portraits/men/75.jpg",
// //   },
// //   {
// //     key: "sadeeke",
// //     headline: "The best AI Outbound agent, really.",
// //     quote:
// //       "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
// //     name: "Sadeeke M.",
// //     role: "CEO",
// //     avatar: "https://randomuser.me/api/portraits/men/12.jpg",
// //   },
// // ];

// // // ✅ Reliable Clearbit logo API
// // const domains = [
// //   "apple.com",
// //   "microsoft.com",
// //   "google.com",
// //   "amazon.com",
// //   "netflix.com",
// //   "spotify.com",
// //   "ibm.com",
// //   "tesla.com",
// //   "intel.com",
// //   "meta.com",
// //   "twitter.com",
// //   "linkedin.com",
// //   "zoom.us",
// //   "slack.com",
// //   "figma.com",
// //   "canva.com",
// //   "discord.com",
// //   "openai.com",
// //   "paypal.com",
// //   "stripe.com",
// //   "airbnb.com",
// //   "uber.com",
// //   "dropbox.com",
// //   "nvidia.com",
// //   "samsung.com",
// //   "nike.com",
// //   "adidas.com",
// //   "coca-cola.com",
// //   "pepsi.com",
// //   "starbucks.com",
// //   "hubspot.com",
// //   "salesforce.com",
// //   "adobe.com",
// //   "oracle.com",
// //   "miro.com",
// //   "shopify.com",
// //   "asana.com",
// //   "atlassian.com",
// //   "bitbucket.org",
// //   "dell.com",
// //   "lenovo.com",
// //   "hp.com",
// //   "zoominfo.com",
// //   "notion.so",
// //   "figma.com",
// //   "medium.com",
// //   "reddit.com",
// //   "pinterest.com",
// //   "tiktok.com",
// //   "snapchat.com",
// // ];

// // const logos = domains.map((domain) => `https://logo.clearbit.com/${domain}`);

// // function Testimonials({ id }) {
// //   const [active, setActive] = useState(0);

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setActive((prev) => (prev + 1) % testimonials.length);
// //     }, 6000);
// //     return () => clearInterval(timer);
// //   }, []);

// //   return (
// //     <section
// //       id={id || "reviews"}
// //       className="relative py-20 bg-white font-poppins overflow-hidden"
// //     >
// //       <style>{`
// //         @keyframes logoScroll {
// //           0% { transform: translateX(0); }
// //           100% { transform: translateX(-50%); }
// //         }
// //         .logo-track {
// //           display: flex;
// //           align-items: center;
// //           width: 200%;
// //           animation: logoScroll 35s linear infinite;
// //         }
// //       `}</style>

// //       <div className="max-w-6xl mx-auto px-4 text-center">
// //         <motion.h2
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6 }}
// //           className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6"
// //         >
// //           Loved by Business Owners & Teams
// //         </motion.h2>

// //         <motion.p
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, delay: 0.2 }}
// //           className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto"
// //         >
// //           See how companies are scaling sales and support with AI agents.
// //         </motion.p>

// //         {/* ✅ Testimonial Card */}
// //         <div className="relative overflow-hidden">
// //           <motion.div
// //             key={testimonials[active].key}
// //             initial={{ opacity: 0, scale: 0.9 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             transition={{ duration: 0.5 }}
// //             className="p-8 bg-teal-50 rounded-2xl shadow-xl mx-auto max-w-3xl border-b-4 border-teal-600 min-h-[300px]"
// //           >
// //             <h3 className="text-2xl font-semibold text-gray-900 mb-4">
// //               {testimonials[active].headline}
// //             </h3>
// //             <p className="text-xl text-gray-700 italic mb-6">
// //               “{testimonials[active].quote}”
// //             </p>
// //             <div className="flex justify-center items-center mt-4">
// //               <img
// //                 src={testimonials[active].avatar}
// //                 alt={testimonials[active].name}
// //                 className="w-14 h-14 rounded-full mr-4 shadow-md object-cover"
// //               />
// //               <div className="text-left">
// //                 <h4 className="text-lg font-bold text-gray-900">
// //                   {testimonials[active].name}
// //                 </h4>
// //                 <p className="text-sm text-gray-600">
// //                   {testimonials[active].role}
// //                 </p>
// //               </div>
// //             </div>
// //           </motion.div>

// //           {/* Dots */}
// //           <div className="flex justify-center gap-3 mt-6">
// //             {testimonials.map((_, idx) => (
// //               <button
// //                 key={idx}
// //                 onClick={() => setActive(idx)}
// //                 className={`w-3 h-3 rounded-full ${
// //                   active === idx ? "bg-teal-600 w-6" : "bg-gray-300"
// //                 } transition-all duration-300`}
// //               />
// //             ))}
// //           </div>
// //         </div>

// //         {/* ✅ FULL-WIDTH, SMOOTH LOGO SCROLL */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 30 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, delay: 0.3 }}
// //           className="mt-20 w-screen overflow-hidden"
// //         >
// //           <h3 className="text-xl font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
// //             Trusted by Companies Worldwide
// //           </h3>

// //           <div className="w-full overflow-hidden">
// //             <div className="logo-track">
// //               {[...logos, ...logos].map((src, i) => (
// //                 <div
// //                   key={i}
// //                   className="flex items-center justify-center h-20 md:h-24 flex-shrink-0 px-6"
// //                 >
// //                   <img
// //                     src={src}
// //                     alt="Company Logo"
// //                     onError={(e) => {
// //                       e.target.onerror = null;
// //                       e.target.src =
// //                         "https://placehold.co/120x40/f3f4f6/f3f4f6";
// //                     }}
// //                     className="h-12 md:h-16 w-auto object-contain grayscale opacity-80 hover:opacity-100 transition duration-300"
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </section>
// //   );
// // }

// // export default Testimonials;
// // // import { motion } from "framer-motion";
// // // import { useState, useEffect } from "react";

// // // const testimonials = [
// // //   {
// // //     key: "andre",
// // //     headline:
// // //       "Provides the flexibility and ease of use to create AI Voice agents in minimal time.",
// // //     quote:
// // //       "Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.",
// // //     name: "Andre F.",
// // //     role: "Business Owner",
// // //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
// // //   },
// // //   {
// // //     key: "marco",
// // //     headline: "The future is here",
// // //     quote:
// // //       "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
// // //     name: "Marco B.",
// // //     role: "Business Owner",
// // //     avatar: "https://randomuser.me/api/portraits/men/75.jpg",
// // //   },
// // //   {
// // //     key: "sadeeke",
// // //     headline: "The best AI Outbound agent, really.",
// // //     quote:
// // //       "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
// // //     name: "Sadeeke M.",
// // //     role: "CEO",
// // //     avatar: "https://randomuser.me/api/portraits/men/12.jpg",
// // //   },
// // // ];

// // // // ✅ Logo sources
// // // const domains = [
// // //   "apple.com",
// // //   "microsoft.com",
// // //   "google.com",
// // //   "amazon.com",
// // //   "netflix.com",
// // //   "spotify.com",
// // //   "ibm.com",
// // //   "tesla.com",
// // //   "intel.com",
// // //   "meta.com",
// // //   "twitter.com",
// // //   "linkedin.com",
// // //   "zoom.us",
// // //   "slack.com",
// // //   "figma.com",
// // //   "canva.com",
// // //   "discord.com",
// // //   "openai.com",
// // //   "paypal.com",
// // //   "stripe.com",
// // //   "airbnb.com",
// // //   "uber.com",
// // //   "dropbox.com",
// // //   "nvidia.com",
// // //   "samsung.com",
// // //   "nike.com",
// // //   "adidas.com",
// // //   "coca-cola.com",
// // //   "pepsi.com",
// // //   "starbucks.com",
// // //   "hubspot.com",
// // //   "salesforce.com",
// // //   "adobe.com",
// // //   "oracle.com",
// // //   "miro.com",
// // //   "shopify.com",
// // //   "asana.com",
// // //   "atlassian.com",
// // //   "dell.com",
// // //   "lenovo.com",
// // //   "hp.com",
// // //   "zoominfo.com",
// // //   "notion.so",
// // //   "medium.com",
// // //   "reddit.com",
// // //   "pinterest.com",
// // //   "tiktok.com",
// // //   "snapchat.com",
// // // ];

// // // const logos = domains.map((domain) => `https://logo.clearbit.com/${domain}`);

// // // function Testimonials({ id }) {
// // //   const [active, setActive] = useState(0);

// // //   useEffect(() => {
// // //     const timer = setInterval(() => {
// // //       setActive((prev) => (prev + 1) % testimonials.length);
// // //     }, 6000);
// // //     return () => clearInterval(timer);
// // //   }, []);

// // //   return (
// // //     <section
// // //       id={id || "reviews"}
// // //       className="relative py-16 md:py-20 bg-white font-poppins overflow-hidden"
// // //     >
// // //       <style>{`
// // //         @keyframes logoScroll {
// // //           0% { transform: translateX(0); }
// // //           100% { transform: translateX(-50%); }
// // //         }
// // //         .logo-track {
// // //           display: flex;
// // //           align-items: center;
// // //           width: 200%;
// // //           animation: logoScroll 35s linear infinite;
// // //         }
// // //       `}</style>

// // //       <div className="max-w-6xl mx-auto px-4 text-center">
// // //         {/* --- Heading --- */}
// // //         <motion.h2
// // //           initial={{ opacity: 0, y: 25 }}
// // //           whileInView={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.5 }}
// // //           className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
// // //         >
// // //           Loved by Business Owners & Teams
// // //         </motion.h2>

// // //         <motion.p
// // //           initial={{ opacity: 0, y: 25 }}
// // //           whileInView={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.5, delay: 0.2 }}
// // //           className="text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
// // //         >
// // //           See how companies are scaling sales and support with AI agents.
// // //         </motion.p>

// // //         {/* --- Testimonial Card --- */}
// // //         <div className="relative overflow-hidden">
// // //           <motion.div
// // //             key={testimonials[active].key}
// // //             initial={{ opacity: 0, scale: 0.92 }}
// // //             animate={{ opacity: 1, scale: 1 }}
// // //             transition={{ duration: 0.5 }}
// // //             className="p-8 md:p-10 bg-teal-50 rounded-2xl shadow-lg mx-auto max-w-3xl border-b-4 border-teal-600"
// // //           >
// // //             <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
// // //               {testimonials[active].headline}
// // //             </h3>
// // //             <p className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
// // //               “{testimonials[active].quote}”
// // //             </p>
// // //             <div className="flex justify-center items-center mt-2">
// // //               <img
// // //                 src={testimonials[active].avatar}
// // //                 alt={testimonials[active].name}
// // //                 className="w-14 h-14 rounded-full mr-4 shadow-md object-cover"
// // //               />
// // //               <div className="text-left">
// // //                 <h4 className="text-base md:text-lg font-bold text-gray-900">
// // //                   {testimonials[active].name}
// // //                 </h4>
// // //                 <p className="text-sm text-gray-600">
// // //                   {testimonials[active].role}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </motion.div>

// // //           {/* --- Dots --- */}
// // //           <div className="flex justify-center gap-3 mt-6">
// // //             {testimonials.map((_, idx) => (
// // //               <button
// // //                 key={idx}
// // //                 onClick={() => setActive(idx)}
// // //                 className={`w-3 h-3 rounded-full ${
// // //                   active === idx ? "bg-teal-600 w-6" : "bg-gray-300"
// // //                 } transition-all duration-300`}
// // //               />
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* --- Logo Scroll --- */}
// // //         {/* <motion.div
// // //           initial={{ opacity: 0, y: 25 }}
// // //           whileInView={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.5, delay: 0.3 }}
// // //           className="mt-16 md:mt-20 w-screen overflow-hidden"
// // //         >
// // //           <h3 className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-widest mb-6 text-center">
// // //             Trusted by Companies Worldwide
// // //           </h3>

// // //           <div className="w-full overflow-hidden">
// // //             <div className="logo-track">
// // //               {[...logos, ...logos].map((src, i) => (
// // //                 <div
// // //                   key={i}
// // //                   className="flex items-center justify-center h-16 md:h-20 flex-shrink-0 px-5"
// // //                 >
// // //                   <img
// // //                     src={src}
// // //                     alt="Company Logo"
// // //                     onError={(e) => {
// // //                       e.target.onerror = null;
// // //                       e.target.src = "https://placehold.co/120x40/f3f4f6/f3f4f6";
// // //                     }}
// // //                     className="h-10 md:h-12 w-auto object-contain grayscale opacity-80 hover:opacity-100 transition duration-300"
// // //                   />
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </motion.div> */}
// // //       </div>
// // //     </section>
// // //   );
// // // }

// // // export default Testimonials;
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    key: "andre",
    headline:
      "Provides the flexibility and ease of use to create AI Voice agents in minimal time.",
    quote:
      "Ease of use for configuring the voice agents. The easy integration with my CRM and Twilio makes it simple to implement the additional features I need.",
    name: "Andre F.",
    role: "Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    key: "marco",
    headline: "The future is here",
    quote:
      "We are on hold daily because companies don't have enough or unqualified people. With Synthflow you can solve that problem. It's better to speak with an AI than with someone who is not motivated.",
    name: "Marco B.",
    role: "Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    key: "sadeeke",
    headline: "The best AI Outbound agent, really.",
    quote:
      "It's very knowledgeable. It knows how to freestyle around questions without deviating from the primary topic, a professional of the highest caliber.",
    name: "Sadeeke M.",
    role: "CEO",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

const domains = [
  "apple.com",
  "microsoft.com",
  "google.com",
  "amazon.com",
  "netflix.com",
  "spotify.com",
  "ibm.com",
  "tesla.com",
  "intel.com",
  "meta.com",
  "zoom.us",
  "slack.com",
  "figma.com",
  "openai.com",
  "paypal.com",
  "stripe.com",
  "airbnb.com",
  "uber.com",
  "dropbox.com",
  "nvidia.com",
];
const logos = domains.map((domain) => `https://logo.clearbit.com/${domain}`);

function Testimonials({ id }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id={id || "reviews"}
      className="relative py-16 md:py-20 bg-background font-poppins overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{
  __html: `
    @keyframes logoScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .logo-track {
      display: flex;
      align-items: center;
      width: 200%;
      animation: logoScroll 35s linear infinite;
    }
  `
}} />

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* --- Heading --- */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl  text-white mb-4"
        >
          Loved by Business Owners & Teams
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-white mb-10 max-w-2xl mx-auto"
        >
          See how companies are scaling sales and support with AI agents.
        </motion.p>

        {/* --- Testimonial Card --- */}
        <div className="relative overflow-hidden">
          <motion.div
            key={testimonials[active].key}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-10 bg-secondary-100 rounded-2xl shadow-lg mx-auto max-w-3xl border-b-4 border-primary-600"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              {testimonials[active].headline}
            </h3>
            <p className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
              “{testimonials[active].quote}”
            </p>
            <div className="flex justify-center items-center mt-2">
              <img
                src={testimonials[active].avatar}
                alt={testimonials[active].name}
                className="w-14 h-14 rounded-full mr-4 shadow-md object-cover"
              />
              <div className="text-left">
                <h4 className="text-base md:text-lg font-bold text-gray-900">
                  {testimonials[active].name}
                </h4>
                <p className="text-sm text-gray-600">
                  {testimonials[active].role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- Dots --- */}
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  active === idx ? "bg-primary-600 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* --- Logo Scroll Section --- */}
        {/* <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 md:mt-20 w-screen overflow-hidden"
        >
          <h3 className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-widest mb-6 text-center">
            Trusted by Companies Worldwide
          </h3>

          <div className="w-full overflow-hidden">
            <div className="logo-track">
              {[...logos, ...logos].map((src, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center h-16 md:h-20 flex-shrink-0 px-5"
                >
                  <img
                    src={src}
                    alt="Company Logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/120x40/F8F8F8/F8F8F8";
                    }}
                    className="h-10 md:h-12 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}

export default Testimonials;
