
// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"

// const Hero = ({ id }) => {
//   const { t } = useTranslation()

//   const handleBookDemo = () => {
//     console.log('Initiating Book a Demo action') // Mock action
//   }

//   const handleGetStarted = () => {
//     console.log('Initiating Get Started action') // Mock action
//   }

//   return (
//     <section
//       id={id}
//       className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative z-10 font-inter"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <motion.h1
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-6"
//         >
//           {t('hero.headline')}
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
//         >
//           {t('hero.subheadline')}
//         </motion.p>
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
//         >
//         <a href="#DemoBooking">
//           <button
//             onClick={handleBookDemo}
//             className="h-12 px-6 rounded-full bg-blue-600 text-white font-semibold text-base shadow-md hover:bg-blue-700 hover:shadow-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
//             aria-label={t('hero.bookDemo')}
//           >
//             {t('hero.bookDemo')}
//           </button>
//           </a>  
//           <a href="#DemoBooking">
//           <button
//             onClick={handleGetStarted} 
//             className="h-12 px-6 rounded-full bg-gray-100 text-gray-900 font-semibold text-base shadow-md hover:bg-gray-200 hover:shadow-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
//             aria-label={t('hero.getStarted')}
//           >
//             {t('hero.getStarted')}
//           </button>
//           </a>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default Hero



// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"
// import { ArrowRight } from "lucide-react"

// const Hero = ({ id }) => {
//   const { t } = useTranslation()

//   const handleBookDemo = () => {
//     console.log('Initiating Book a Demo action') // Mock action
//   }

//   const handleGetStarted = () => {
//     console.log('Initiating Get Started action') // Mock action
//   }

//   return (
//     <section
//       id="hero"
   
//       className=" py-36 bg-purple-200 relative z-10 font-poppins border-b-2 border-blue-600 p-2 "
//     >
//       <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
//         <motion.h1
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           className="text-5xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
//         >
//           {t('hero.headline')}
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg md:text-xl text-black mb-8 max-w-3xl mx-auto"
//         >
//           {t('hero.subheadline')}
//         </motion.p>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="flex flex-col sm:flex-row justify-center gap-4"
//         >
//           <a href="#DemoBooking">
//             <button
//               onClick={handleBookDemo}
//               className="h-12 px-8 rounded-full bg-purple-600 text-white font-semibold text-base shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 flex items-center justify-center"
//               aria-label={t('hero.bookDemo')}
//             >
//               {t('hero.bookDemo')}
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </button>
//           </a>
//           <a href="#pricing">
//             <button
//               onClick={handleGetStarted}
//               className="h-12 px-8 rounded-full bg-white text-purple-600 font-semibold text-base border border-purple-600 shadow-md hover:bg-purple-50 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
//               aria-label={t('hero.getStarted')}
//             >
//               {t('hero.getStarted')}
//             </button>
//           </a>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default Hero


// import { motion } from "framer-motion"
// import { ArrowRight } from "lucide-react"

// // --- START: Mock dependencies to resolve build errors (i18n) ---
// // Mock translation function since 'react-i18next' is not available
// const t = (key) => {
//   const translations = {
//     'hero.headline': 'Generate Perfect AI Voices for Any Project Instantly',
//     'hero.subheadline': 'Our platform offers hyper-realistic speech synthesis, emotional depth, and multi-language support to bring your content to life.',
//     'hero.bookDemo': 'Book a Demo',
//     'hero.getStarted': 'Get Started Free',
//   };
//   return translations[key] || key;
// };
// // --- END: Mock dependencies ---

// const Hero = ({ id }) => {
//   // const { t } = useTranslation() // Mocked above

//   const handleBookDemo = () => {
//     console.log('Initiating Book a Demo action') // Mock action
//   }

//   const handleGetStarted = () => {
//     console.log('Initiating Get Started action') // Mock action
//   }

//   return (
//     <section
//       id="hero"
//       // Updated background to the light secondary color (secondary-200) for a soft hero backdrop
//       // Updated border color to the main primary accent (primary-600)
//       className="h-screen py-60 bg-primary-700 relative z-10 font-poppins border-b-2"
//     >
//       <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
//         <motion.h1
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           className="text-5xl md:text-5xl lg:text-5xl font-bold text-white leading-tight mb-6"
//         >
//           {t('hero.headline')}
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg md:text-xl text-black mb-8 max-w-3xl mx-auto"
//         >
//           {t('hero.subheadline')}
//         </motion.p>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="flex flex-col sm:flex-row justify-center gap-4"
//         >
//           <a href="#DemoBooking">
//             <button
//               onClick={handleBookDemo}
//               // Primary button: Updated to primary-600 (Dark Teal) and hover to primary-700
//               className="h-12 px-8 rounded-full bg-primary-600 text-white font-semibold text-base shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 flex items-center justify-center hover:text-black border border-white"
//               aria-label={t('hero.bookDemo')}
//             >
//               {t('hero.bookDemo')}
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </button>
//           </a>
//           <a href="#pricing">
//             <button
//               onClick={handleGetStarted}
//               // Secondary button: Updated text and border to primary-600, hover background to secondary-100
//               className="h-12 px-8 rounded-full bg-white text-primary-900 font-semibold text-base border border-primary-600 shadow-md hover:bg-black hover:shadow-lg transi6ion-all duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 hover:text-white hover:border-white"
//               aria-label={t('hero.getStarted')}
//             >
//               {t('hero.getStarted')}
//             </button>
//           </a>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default Hero
// import { motion } from "framer-motion"
// import { ArrowRight, Zap, Volume2 } from "lucide-react"
// import { useState } from "react"

// // --- START: Mock dependencies to resolve build errors (i18n) ---
// const t = (key) => {
//   const translations = {
//     'hero.headline': 'Generate Hyper-Realistic AI Voices Instantly.',
//     'hero.subheadline': 'Our platform offers emotional depth, flawless delivery, and multi-language support to bring any digital content to life.',
//     'hero.bookDemo': 'Book a Demo',
//     'hero.getStarted': 'Get Started',
//   };
//   return translations[key] || key;
// };
// // --- END: Mock dependencies ---

// // Abstract waveform component to add visual interest, mimicking a product showcase
// const AiWaveformVisual = () => {
//   const [isPlaying, setIsPlaying] = useState(false);

//   return (
//     <div className="mt-16 w-full max-w-4xl mx-auto p-4 rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm border border-primary-700/50">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center space-x-2">
//           <Zap className="h-5 w-5 text-yellow-400" />
//           <span className="text-white text-sm font-medium">AI Synthesized Audio</span>
//         </div>
//         <button 
//           onClick={() => setIsPlaying(!isPlaying)}
//           className="flex items-center px-3 py-1 bg-primary-600 rounded-full text-white text-sm hover:bg-primary-700 transition-colors"
//         >
//           {isPlaying ? 'Pause' : 'Play Sample'}
//           <Volume2 className="ml-1 h-4 w-4" />
//         </button>
//       </div>

//       {/* Mock Waveform Display */}
//       <div className="h-20 flex items-center justify-between space-x-0.5 overflow-hidden">
//         {Array.from({ length: 120 }).map((_, i) => {
//           // Dynamic height generation based on index for a natural look
//           const height = isPlaying 
//             ? Math.max(1, Math.random() * 70 + 5) // Active, higher peaks
//             : Math.max(1, Math.sin(i * 0.1) * 20 + 30); // Static, lower peaks
          
//           return (
//             <motion.div
//               key={i}
//               className={`w-0.5 rounded-full ${isPlaying ? 'bg-primary-500' : 'bg-primary-800'}`}
//               initial={{ height: '0%' }}
//               animate={{ height: `${height}%` }}
//               transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i * 0.01, type: 'spring', stiffness: 50 }}
//             />
//           );
//         })}
//       </div>
//       <div className="mt-2 text-xs text-gray-400">
//         <span className="font-mono">0:00:03 / 0:00:15</span>
//       </div>
//     </div>
//   );
// };

// const Hero = ({ id }) => {
//   const handleBookDemo = () => {
//     console.log('Initiating Book a Demo action')
//   }

//   const handleGetStarted = () => {
//     console.log('Initiating Get Started action')
//   }


//   return (
//     <section
//       id="hero"
//       className="h-screen relative z-10 font-poppins border-b-2 border-primary-600 flex items-center justify-center overflow-hidden bg-gray-900"
//       style={{
      
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Radial Gradient Overlay for .s Atmospheric Look */}
//       <div className="absolute inset-0 z-20" 
//            style={{ background: 'radial-gradient(circle at center, rgba(15, 118, 110, 0.2) 0%, rgba(17, 24, 39, 0.9) 65%, rgba(17, 24, 39, 1) 100%)' }}>
//       </div>

//       {/* Content Container */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-30 pt-10">
//         <motion.h1
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           // Massive text size for impact (. aesthetic)
//           className="text-6xl sm:text-7xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight"
//         >
//           {t('hero.headline')}
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           // Wider max-width for better sub-headline wrapping
//           className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto"
//         >
//           {t('hero.subheadline')}
//         </motion.p>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className=" pt-40 flex flex-col sm:flex-row justify-center gap-4"
//         >
//           <a href="#pricing">
//             <button
//               onClick={handleGetStarted}
//               // Primary button: Prominent call to action (. style)
//               className="h-14 px-10 rounded-full bg-primary-600 text-white font-bold text-lg shadow-xl hover:bg-primary-700 transition-all duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 flex items-center justify-center ring-offset-gray-900"
//               aria-label={t('hero.getStarted')}
//             >
//               {t('hero.getStarted')}
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </button>
//           </a>
//           <a href="#DemoBooking">
//             <button
//               onClick={handleBookDemo}
//               // Secondary button: White outline, less visual weight
//               className="h-14 px-10 rounded-full bg-transparent text-white font-medium text-lg border-2 border-primary-600 shadow-md hover:bg-primary-600/10 transition-all duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ring-offset-gray-900"
//               aria-label={t('hero.bookDemo')}
//             >
//               {t('hero.bookDemo')}
//             </button>
//           </a>
//         </motion.div>

//         {/* The new Mock Product Visual */}
//         <AiWaveformVisual />
//       </div>
//     </section>
//   )
// }

// export default Hero

// // import { motion } from "framer-motion"
// // import { ArrowRight, Zap, Volume2 } from "lucide-react"
// // import { useState } from "react"

// // // --- START: Mock dependencies to resolve build errors (i18n) ---
// // const t = (key) => {
// //   const translations = {
// //     'hero.headline': 'Generate Hyper-Realistic AI Voices Instantly.',
// //     'hero.subheadline': 'Our platform offers emotional depth, flawless delivery, and multi-language support to bring any digital content to life.',
// //     'hero.bookDemo': 'Book a Demo',
// //     'hero.getStarted': 'Get Started',
// //   };
// //   return translations[key] || key;
// // };
// // // --- END: Mock dependencies ---

// // // Abstract waveform component to add visual interest, mimicking a product showcase
// // const AiWaveformVisual = () => {
// //   const [isPlaying, setIsPlaying] = useState(false);

// //   return (
// //     <motion.div 
// //       className="mt-16 w-full max-w-4xl mx-auto p-4 rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm border border-primary-700/50 cursor-pointer transform hover:scale-[1.01] transition-transform duration-300"
// //       onClick={() => setIsPlaying(!isPlaying)}
// //       initial={{ opacity: 0, y: 30 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.6, delay: 0.6 }}
// //     >
// //       <div className="flex justify-between items-center mb-4">
// //         <div className="flex items-center space-x-2">
// //           {/* Updated icon color for vibrancy */}
// //           <Zap className="h-5 w-5 text-cyan-400" />
// //           <span className="text-white text-sm font-medium">AI Synthesized Audio</span>
// //         </div>
// //         <button 
// //           // Prevent click from propagating to parent div which controls isPlaying
// //           onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} 
// //           className="flex items-center px-3 py-1 bg-primary-600 rounded-full text-white text-sm hover:bg-primary-700 transition-colors shadow-lg"
// //         >
// //           {isPlaying ? 'Pause' : 'Play Sample'}
// //           <Volume2 className="ml-1 h-4 w-4" />
// //         </button>
// //       </div>

// //       {/* Mock Waveform Display */}
// //       <div className="h-20 flex items-center justify-between space-x-0.5 overflow-hidden">
// //         {Array.from({ length: 120 }).map((_, i) => {
// //           // Dynamic height generation based on index for a natural look
// //           const height = isPlaying 
// //             ? Math.max(1, Math.random() * 70 + 5) // Active, higher peaks
// //             : Math.max(1, Math.sin(i * 0.1) * 20 + 30); // Static, lower peaks
// //           
// //           return (
// //             <motion.div
// //               key={i}
// //               // Updated colors for high-tech look: active is bright cyan, static is dark primary
// //               className={`w-0.5 rounded-full ${isPlaying ? 'bg-cyan-400' : 'bg-primary-800'}`}
// //               initial={{ height: '0%' }}
// //               animate={{ height: `${height}%` }}
// //               transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i * 0.01, type: 'spring', stiffness: 50 }}
// //             />
// //           );
// //         })}
// //       </div>
// //       <div className="mt-2 text-xs text-gray-400">
// //         <span className="font-mono">0:00:03 / 0:00:15</span>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // const Hero = ({ id }) => {
// //   const handleBookDemo = () => {
// //     console.log('Initiating Book a Demo action')
// //   }

// //   const handleGetStarted = () => {
// //     console.log('Initiating Get Started action')
// //   }


// //   return (
// //     <section
// //       id="hero"
// //       className="h-screen relative z-10 font-poppins border-b-2 border-primary-600 flex items-start justify-center overflow-hidden bg-gray-900 "
// //       style={{
// //       
// //         backgroundSize: 'cover',
// //         backgroundPosition: 'center',
// //       }}
// //     >
// //       
// //       {/* Animated Background Glow Blob (New) */}
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.5 }}
// //         animate={{ opacity: 1, scale: 1 }}
// //         transition={{ duration: 3, delay: 0.5, type: "tween" }}
// //         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-primary-500/30 rounded-full blur-[150px] z-10 hidden lg:block"
// //       ></motion.div>

// //       {/* Radial Gradient Overlay for Atmospheric Look */}
// //       <div className="absolute inset-0 z-20" 
// //            style={{ background: 'radial-gradient(circle at center, rgba(15, 118, 110, 0.2) 0%, rgba(17, 24, 39, 0.9) 65%, rgba(17, 24, 39, 1) 100%)' }}>
// //       </div>

// //       {/* Content Container */}
// //       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-30">
// //         <motion.h1
// //           initial={{ opacity: 0, scale: 0.95 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           transition={{ duration: 0.8, ease: 'easeOut' }}
// //           // Increased size and added subtle glow/shadow for impact
// //           className="text-3xl sm:text-5xl lg:text-6xl  text-white leading-tight mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(15,118,110,0.5)]"
// //         >
// //           {t('hero.headline')}
// //         </motion.h1>
// //         <motion.p
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, delay: 0.2 }}
// //           // Wider max-width for better sub-headline wrapping
// //           className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto"
// //         >
// //           {t('hero.subheadline')}
// //         </motion.p>
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6, delay: 0.4 }}
// //           className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
// //         >
// //           <a href="#pricing">
// //             <button
// //               onClick={handleGetStarted}
// //               // Added transform and hover:scale for interaction polish
// //               className="h-14 px-10 rounded-full bg-primary-600 text-white font-medium text-lg shadow-xl hover:bg-primary-700 transition-all duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 flex items-center justify-center ring-offset-gray-900 transform hover:scale-[1.03]"
// //               aria-label={t('hero.getStarted')}
// //             >
// //               {t('hero.getStarted')}
// //               <ArrowRight className="ml-2 h-5 w-5" />
// //             </button>
// //           </a>
// //           <a href="#DemoBooking">
// //             <button
// //               onClick={handleBookDemo}
// //               // Added transform and hover:scale for interaction polish
// //               className="h-14 px-10 rounded-full bg-transparent text-white font-medium text-lg border-2 border-primary-600 shadow-md hover:bg-primary-600/10 transition-all duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ring-offset-gray-900 transform hover:scale-[1.03]"
// //               aria-label={t('hero.bookDemo')}
// //             >
// //               {t('hero.bookDemo')}
// //             </button>
// //           </a>
// //         </motion.div>

// //         {/* The new Mock Product Visual */}
// //       </div>
// //     </section>
// //   )
// // }

// // export default Hero

// // // import { motion } from "framer-motion"
// // // import { ArrowRight } from "lucide-react"

// // // const t = (key) => {
// // //   const translations = {
// // //     "hero.headline": "Generate Hyper-Realistic AI Voices Instantly.",
// // //     "hero.subheadline":
// // //       "Our platform offers emotional depth, flawless delivery, and multi-language support to bring any digital content to life.",
// // //     "hero.getStarted": "Get Started",
// // //     "hero.bookDemo": "Book a Demo",
// // //   }
// // //   return translations[key] || key
// // // }

// // // const Hero = () => {
// // //   const logos = [
// // //     "Answers.com",
// // //     "Comparewise",
// // //     "Krisp",
// // //     "Medbelle",
// // //     "Smartcat",
// // //     "10Web",
// // //     "Zenjob",
// // //     "GoTiger",
// // //     "Aizee",
// // //   ]

// // //   return (
// // //     <section
// // //       id="hero"
// // //       className="relative overflow-hidden flex flex-col items-center justify-center text-center py-32 md:py-40 px-4 bg-[#0A0621]" // Updated background color based on the image
// // //     >
// // //       {/* Background Layers */}
// // //       <div className="absolute inset-0">
// // //         <div className="absolute inset-0 bg-gradient-to-b from-[#1C0A3B] via-[#0A0621] to-black opacity-90"></div> 

// // //         {/* Pulsing Radial Glow */}
// // //         <motion.div
// // //           className="absolute top-1/2 left-1/2 h-[600px] w-[600px] bg-purple-600/30 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"
// // //           animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
// // //           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
// // //         />

// // //         {/* Animated Subtle Dots Pattern */}
// // //         <div
// // //           className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" // Changed to radial gradient for dots
// // //           style={{
// // //             backgroundSize: "40px 40px",
// // //             animation: "moveDots 30s linear infinite", // Changed animation name
// // //           }}
// // //         />
// // //       </div>

// // //       {/* Text Content */}
// // //       <motion.div
// // //         initial={{ opacity: 0, y: 30 }}
// // //         animate={{ opacity: 1, y: 0 }}
// // //         transition={{ duration: 0.8 }}
// // //         className="relative z-10 max-w-4xl mx-auto"
// // //       >
// // //         <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]">
// // //           {t("hero.headline")}
// // //         </h1>
// // //         <p className="text-lg md:text-xl text-gray-300 mb-10">
// // //           {t("hero.subheadline")}
// // //         </p>

// // //         {/* CTA Buttons */}
// // //         <div className="flex flex-col sm:flex-row justify-center gap-4">
// // //           <a href="#pricing">
// // //             <button className="h-14 px-10 rounded-full bg-purple-600 text-white font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-200 focus:ring-2 focus:ring-purple-400 transform hover:scale-[1.03] flex items-center justify-center">
// // //               {t("hero.getStarted")}
// // //               <ArrowRight className="ml-2 h-5 w-5" />
// // //             </button>
// // //           </a>
// // //           {/* <a href="#DemoBooking">
// // //             <button className="h-14 px-10 rounded-full border-2 border-purple-500 text-white font-medium text-lg hover:bg-purple-600/10 transition-all duration-200 focus:ring-2 focus:ring-purple-400 transform hover:scale-[1.03]">
// // //               {t("hero.bookDemo")}
// // //             </button>
// // //           </a> */}
// // //         </div>
// // //       </motion.div>

// // //       {/* Scrolling Logos Row */}
// // //       <div className="relative z-10 mt-20 w-full overflow-hidden">
// // //         <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#0A0621] via-transparent to-[#0A0621] pointer-events-none"></div> 

// // //         <motion.div
// // //           className="flex space-x-16 whitespace-nowrap"
// // //           animate={{ x: ["0%", "-50%"] }}
// // //           transition={{
// // //             ease: "linear",
// // //             duration: 30,
// // //             repeat: Infinity,
// // //           }}
// // //         >
// // //           {[...logos, ...logos].map((logo, i) => (
// // //             <span
// // //               key={i}
// // //               className="text-gray-400 text-base md:text-lg font-medium tracking-wide"
// // //             >
// // //               {logo}
// // //             </span>
// // //           ))}
// // //         </motion.div>
// // //       </div>

// // //       {/* Background dots animation */}
// // //       <style jsx>{`
// // //         @keyframes moveDots {
// // //           0% {
// // //             background-position: 0 0;
// // //           }
// // //           100% {
// // //             background-position: 40px 40px;
// // //           }
// // //         }
// // //       `}</style>
// // //     </section>
// // //   )
// // // }

// // // export default Hero

// // import { motion } from "framer-motion";
// // import { ArrowRight } from "lucide-react";

// // const t = (key) => {
// //   const translations = {
// //     "hero.headline": "Generate Hyper-Realistic AI Voices Instantly.",
// //     "hero.subheadline":
// //       "Our platform delivers natural emotion, flawless speech, and multilingual voice synthesis — redefining the future of human-AI communication.",
// //     "hero.getStarted": "Get Started",
// //     "hero.bookDemo": "Book a Demo",
// //   };
// //   return translations[key] || key;
// // };

// // const Hero = () => {
// //   const logos = [
// //     "Answers.com",
// //     "Comparewise",
// //     "Krisp",
// //     "Medbelle",
// //     "Smartcat",
// //     "10Web",
// //     "Zenjob",
// //     "GoTiger",
// //     "Aizee",
// //   ];

// //   return (
// //     <section
// //       id="hero"
// //       className="relative overflow-hidden flex flex-col items-center justify-center text-center py-32 md:py-40 px-4 bg-black font-poppins"
// //     >
// //       {/* Background Layers */}
// //       <div className="absolute inset-0">
// //         {/* Dark gradient overlay with slight red tint */}
// //         <div className="absolute inset-0 bg-gradient-to-b from-[#1A0000] via-[#000000] to-[#0A0A0A] opacity-95"></div>

// //         {/* Pulsing Red Glow */}
// //         <motion.div
// //           className="absolute top-1/2 left-1/2 h-[600px] w-[600px] bg-[#FF1E1E]/25 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"
// //           animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
// //           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
// //         />

// //         {/* Moving Dots Pattern */}
// //         <div
// //           className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)]"
// //           style={{
// //             backgroundSize: "40px 40px",
// //             animation: "moveDots 30s linear infinite",
// //           }}
// //         />
// //       </div>

// //       {/* Text Content */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 30 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.8 }}
// //         className="relative z-10 max-w-4xl mx-auto"
// //       >
// //         <h1 className="text-3xl md:text-6xl  text-white leading-tight mb-6 drop-shadow-[0_0_12px_rgba(255,30,30,0.35)]">
// //           {t("hero.headline")}
// //         </h1>
// //         <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
// //           {t("hero.subheadline")}
// //         </p>

// //         {/* CTA Buttons */}
// //         <div className="flex flex-col sm:flex-row justify-center gap-4">
// //           <a href="#pricing">
// //             <button className="h-14 px-10 rounded-full bg-[#FF1E1E] text-white font-medium text-lg shadow-lg hover:bg-[#E60000] transition-all duration-200 focus:ring-2 focus:ring-[#FF1E1E]/40 transform hover:scale-[1.04] flex items-center justify-center">
// //               {t("hero.getStarted")}
// //               <ArrowRight className="ml-2 h-5 w-5" />
// //             </button>
// //           </a>
// //           {/* Uncomment this if you want the secondary button */}
// //           {/* <a href="#DemoBooking">
// //             <button className="h-14 px-10 rounded-full border-2 border-[#FF1E1E] text-white font-medium text-lg hover:bg-[#FF1E1E]/10 transition-all duration-200 focus:ring-2 focus:ring-[#FF1E1E]/40 transform hover:scale-[1.03]">
// //               {t("hero.bookDemo")}
// //             </button>
// //           </a> */}
// //         </div>
// //       </motion.div>

// //       {/* Scrolling Logos Row */}
// //       <div className="relative z-10 mt-20 w-full overflow-hidden">
// //         <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>

// //         <motion.div
// //           className="flex space-x-16 whitespace-nowrap"
// //           animate={{ x: ["0%", "-50%"] }}
// //           transition={{
// //             ease: "linear",
// //             duration: 30,
// //             repeat: Infinity,
// //           }}
// //         >
// //           {[...logos, ...logos].map((logo, i) => (
// //             <span
// //               key={i}
// //               className="text-gray-400 text-base md:text-lg font-medium tracking-wide"
// //             >
// //               {logo}
// //             </span>
// //           ))}
// //         </motion.div>
// //       </div>

// //       {/* Dots Animation */}
// //       <style jsx>{`
// //         @keyframes moveDots {
// //           0% {
// //             background-position: 0 0;
// //           }
// //           100% {
// //             background-position: 40px 40px;
// //           }
// //         }
// //       `}</style>
// //     </section>
// //   );
// // };

// // frontend/src/Pages/website/Hero.jsx
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";  // ✅ ADD THIS LINE
// import styles from "./Hero.module.css";

// const t = (key) => {
//   const translations = {
//     "hero.headline": "Generate Hyper-Realistic AI Voices Instantly",
//     "hero.subheadline": "Our platform delivers natural emotion, flawless speech, and multilingual voice synthesis — redefining the future of human-AI communication.",
//     "hero.getStarted": "Get Started",
//     "hero.bookDemo": "Book a Demo"
//   };
//   return translations[key] || key;
// };

// const Hero = () => {
//   const navigate = useNavigate();  // ✅ ADD THIS LINE

//   const handleBookDemo = () => {
//     navigate('/demo');  // ✅ CHANGE: Navigate to demo page instead of scrolling
//   };

//   const handleGetStarted = () => {
//     navigate('/signup');  // ✅ CHANGE: Navigate to signup page instead of scrolling
//   };

//   const logos = [
//     "Answers.com",
//     "Comparewise",
//     "Krisp",
//     "Medbelle",
//     "Smartcat",
//     "10Web",
//     "Zenjob",
//     "GoTiger",
//     "Aizee",
//   ];

//   return (
//     <section
//       id="hero"
//       className="relative overflow-hidden flex flex-col items-center justify-center text-center py-16 md:py-20 px-4 font-poppins"
//     >
//       {/* Background Layers with optional dots animation */}
//       <div className={`absolute inset-0 ${styles.dotsBackground}`}>
//         {/* Dark overlay for contrast */}
//         <div className="absolute inset-0 bg-black opacity-80"></div>
//       </div>

//       {/* Text Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative z-10 max-w-4xl mx-auto"
//       >
//         <h1 className="text-3xl md:text-6xl text-white leading-tight mb-6 drop-shadow-lg font-bold">
//           {t("hero.headline")}
//         </h1>
//         <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
//           {t("hero.subheadline")}
//         </p>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <button 
//             onClick={handleGetStarted}
//             className="h-14 px-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 transform hover:scale-105 flex items-center justify-center"
//           >
//             {t("hero.getStarted")}
//             <ArrowRight className="ml-2 h-5 w-5" />
//           </button>
          
//           <button 
//             onClick={handleBookDemo}
//             className="h-14 px-10 rounded-full bg-transparent border-2 border-white text-white font-medium text-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
//           >
//             {t("hero.bookDemo")}
//           </button>
//         </div>
//       </motion.div>

//       {/* Scrolling Logos Row */}
//       <div className="relative z-10 mt-20 w-full overflow-hidden">
//         <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>

//         <motion.div
//           className="flex space-x-16 whitespace-nowrap"
//           animate={{ x: ["0%", "-50%"] }}
//           transition={{
//             ease: "linear",
//             duration: 30,
//             repeat: Infinity,
//           }}
//         >
//           {[...logos, ...logos].map((logo, i) => (
//             <span
//               key={i}
//               className="text-gray-400 text-base md:text-lg font-medium tracking-wide"
//             >
//               {logo}
//             </span>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

// hero.jsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBgImage from '../../assets/1.jpg';

const t = (key) => {
  const translations = {
    "hero.headline": "Generate Hyper-Realistic AI Voices Instantly.",
    "hero.subheadline":
      "Our platform delivers natural emotion, flawless speech, and multilingual voice synthesis — redefining the future of human-AI communication.",
    "hero.getStarted": "Get Started",
    "hero.bookDemo": "Book a Demo",
  };
  return translations[key] || key;
};

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const logos = [
    "Answers.com",
    "Comparewise",
    "Krisp",
    "Medbelle",
    "Smartcat",
    "10Web",
    "Zenjob",
    "GoTiger",
    "Aizee",
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex flex-col items-center justify-center text-center py-16 md:py-20 px-4 font-poppins"
    >
      {/* Background Layers - NOW IMAGE */}
      <div className="absolute inset-0">
        {/* Background Image Element */}
        <img
          src={heroBgImage}
          alt="AI Voice platform background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for contrast over the image */}
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-6xl text-white leading-tight mb-6 drop-shadow-[0_0_12px_rgba(255,30,30,0.35)]">
          {t("hero.headline")}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          {t("hero.subheadline")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={handleGetStarted}
            className="h-14 px-10 rounded-full bg-[#FF1E1E] text-white font-medium text-lg shadow-lg hover:bg-[#E60000] transition-all duration-200 focus:ring-2 focus:ring-[#FF1E1E]/40 transform hover:scale-[1.04] flex items-center justify-center"
          >
            {t("hero.getStarted")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Scrolling Logos Row */}
      <div className="relative z-10 mt-20 w-full overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>

        <motion.div
          className="flex space-x-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              className="text-gray-400 text-base md:text-lg font-medium tracking-wide"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Dots Animation */}
      <style jsx>{`
        @keyframes moveDots {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;