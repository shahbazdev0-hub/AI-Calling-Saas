// // import { useTranslation } from "react-i18next"
// // import { motion } from "framer-motion"
// // import { Phone, MessageSquare, MessageCircle, Globe, Link } from "lucide-react"

// // const features = [
// //   { key: 'voice', icon: Phone, description: 'voiceDesc' },
// //   { key: 'messaging', icon: MessageSquare, description: 'messagingDesc' },
// //   { key: 'chatbot', icon: MessageCircle, description: 'chatbotDesc' },
// //   { key: 'integrations', icon: Link, description: 'integrationsDesc' },
// //   { key: 'multilingual', icon: Globe, description: 'multilingualDesc' },
// // ]

// // const KeyFeatures = ({ id }) => {
// //   const { t } = useTranslation()

// //   return (
// //     <section id={id} className="py-16 bg-gray-100 relative z-10">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">{t('features.title')}</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //           {features.map((feat, index) => (
// //             <motion.div
// //               key={feat.key}
// //               initial={{ opacity: 0, scale: 0.9 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.5, delay: index * 0.2 }}
// //               className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl"
// //             >
// //               <feat.icon className="h-8 w-8 text-blue-600 mb-4" aria-hidden="true" />
// //               <h3 className="text-lg font-semibold mb-2">{t(`features.${feat.key}`)}</h3>
// //               <p className="text-gray-700">{t(`features.${feat.description}`)}</p>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default KeyFeatures

// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"
// import { Phone, MessageSquare, MessagesSquare, Link, Globe } from "lucide-react"

// const features = [
//   {
//     icon: Phone,
//     key: 'voice',
//     title: 'features.voice',
//     description: 'features.voiceDesc',
//   },
//   {
//     icon: MessageSquare,
//     key: 'messaging',
//     title: 'features.messaging',
//     description: 'features.messagingDesc',
//   },
//   {
//     icon: MessagesSquare,
//     key: 'chatbot',
//     title: 'features.chatbot',
//     description: 'features.chatbotDesc',
//   },
//   {
//     icon: Link,
//     key: 'integrations',
//     title: 'features.integrations',
//     description: 'features.integrationsDesc',
//   },
//   {
//     icon: Globe,
//     key: 'multilingual',
//     title: 'features.multilingual',
//     description: 'features.multilingualDesc',
//   },
// ]

// const Features = ({ id }) => {
//   const { t } = useTranslation()

//   return (
//     <section id="features"  className="py-16 bg-gray-50 relative z-10 font-poppins border-t-2 border-blue-600 p-2">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Title */}
//         <motion.h2
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8"
//         >
//           {t('features.title')}
//         </motion.h2>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.key}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md  hover:border-purple-900 border border-black "
//             >
//               <feature.icon className="h-8 w-8 text-blue-600 mb-4" aria-hidden="true" />
//               <h3 className="text-lg font-semibold text-black mb-2 ">{t(feature.title)}</h3>
//               <p className="text-base text-black">{t(feature.description)}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Features

// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"
// import { Phone, MessageSquare, MessagesSquare, Link, Globe } from "lucide-react"

// // --- START: Dependency Fix ---
// // This function replaces the imported 'useTranslation' hook. 
// // It ensures the component compiles correctly in this environment by returning 
// // the translation key itself, which preserves your original text placeholders (e.g., 'features.title').
// const t = (key) => {
//   return key; 
// };
// // --- END: Dependency Fix ---

// const features = [
//   {
//     icon: Phone,
//     key: 'voice',
//     title: 'features.voice',
//     description: 'features.voiceDesc',
//   },
//   {
//     icon: MessageSquare,
//     key: 'messaging',
//     title: 'features.messaging',
//     description: 'features.messagingDesc',
//   },
//   {
//     icon: MessagesSquare,
//     key: 'chatbot',
//     title: 'features.chatbot',
//     description: 'features.chatbotDesc',
//   },
//   {
//     icon: Link,
//     key: 'integrations',
//     title: 'features.integrations',
//     description: 'features.integrationsDesc',
//   },
//   {
//     icon: Globe,
//     key: 'multilingual',
//     title: 'features.multilingual',
//     description: 'features.multilingualDesc',
//   },
// ]

// const Features = ({ id }) => {
//    const { t } = useTranslation() // This original line is commented out/removed as 't' is defined above

//   return (
//     <section 
//       id="features" 
//       // Color update: bg-gray-50 -> bg-background, border-blue-600 -> border-primary-600 (Dark Teal)
//       className="py-16 bg-background relative z-10 font-poppins border-t-2 border-primary-600 p-2"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Title */}
//         <motion.h2
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl  text-center text-gray-900 mb-12"
//         >
//           {t('features.title')}
//         </motion.h2>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.key}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               // Color update: hover:border-purple-900 -> hover:border-primary-600. Added text-center.
//               className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-600 border border-gray-200 text-center"
//             >
//               {/* Icon color update: text-blue-600 -> text-primary-600. Added mx-auto to center icon. */}
//               <feature.icon className="h-10 w-10 text-primary-600 mb-4 mx-auto" aria-hidden="true" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2 ">{t(feature.title)}</h3>
//               <p className="text-base text-gray-700">{t(feature.description)}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Features
// // import { motion } from "framer-motion"
// // import { Phone, MessageSquare, MessagesSquare, Link, Globe } from "lucide-react"

// // // --- START: Restored Mock Translation Function with Descriptive Content ---
// // const t = (key) => {
// //   const translations = {
// //     'features.title': 'Core Features of Our Voice AI Platform',
// //     'features.voice': 'Voice AI for Calls',
// //     'features.voiceDesc': 'Handle inbound and outbound calls with <500ms latency.',
// //     'features.messaging': 'AI-Powered Messaging',
// //     'features.messagingDesc': 'Automate text and email communications.',
// //     'features.chatbot': 'Website Chatbot',
// //     'features.chatbotDesc': 'Engage visitors with an AI-powered chat widget.',
// //     'features.integrations': 'CRM Integrations',
// //     'features.integrationsDesc': 'Seamless integration with Jobber, Salesforce, and more.',
// //     'features.multilingual': 'Multi-Lingual Support',
// //     'features.multilingualDesc': 'Support for English, French.',
// //   };
// //   return translations[key] || key; 
// // };
// // // --- END: Restored Mock Translation Function with Descriptive Content ---

// // const features = [
// //   {
// //     icon: Phone,
// //     key: 'voice',
// //     title: 'features.voice',
// //     description: 'features.voiceDesc',
// //   },
// //   {
// //     icon: MessageSquare,
// //     key: 'messaging',
// //     title: 'features.messaging', 
// //     description: 'features.messagingDesc',
// //   },
// //   {
// //     icon: MessagesSquare,
// //     key: 'chatbot',
// //     title: 'features.chatbot',
// //     description: 'features.chatbotDesc',
// //   },
// //   {
// //     icon: Link,
// //     key: 'integrations',
// //     title: 'features.integrations',
// //     description: 'features.integrationsDesc',
// //   },
// //   {
// //     icon: Globe,
// //     key: 'multilingual',
// //     title: 'features.multilingual',
// //     description: 'features.multilingualDesc',
// //   },
// // ]

// // const Features = ({ id }) => {
// //   // Relying on the mock `t` function defined above for content.

// //   // Helper component for the feature card to reduce repetition
// //   const FeatureCard = ({ feature, indexOffset }) => (
// //     <motion.div
// //       key={feature.key}
// //       initial={{ opacity: 0, y: 50 }}
// //       whileInView={{ opacity: 1, y: 0 }}
// //       viewport={{ once: true }}
// //       transition={{ duration: 0.6, delay: indexOffset * 0.1 }}
// //       className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-600 border border-gray-200 text-center"
// //     >
// //       <feature.icon className="h-10 w-10 text-primary-600 mb-4 mx-auto" aria-hidden="true" />
// //       <h3 className="text-xl font-bold text-gray-900 mb-2 ">{t(feature.title)}</h3>
// //       <p className="text-base text-gray-700">{t(feature.description)}</p>
// //     </motion.div>
// //   );

// //   return (
// //     <section 
// //       id="features" 
// //      //className="py-16 bg-background relative z-10 font-poppins border-t-2 border-primary-600 p-2"
// //       className="py-16 bg-background relative z-10 font-poppins "
// //     >
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Title */}
// //         <motion.h2
// //           initial={{ opacity: 0, y: 50 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6 }}
// //           className="text-4xl md:text-5xl text-center text-gray-900 mb-12"
// //         >
// //           {t('features.title')}
// //         </motion.h2>

// //         {/* Feature Cards - Top 3 (Fills the three-column layout) */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
// //           {features.slice(0, 3).map((feature, index) => (
// //             <FeatureCard key={feature.key} feature={feature} indexOffset={index} />
// //           ))}
// //         </div>

// //         {/* Feature Cards - Bottom 2 (Perfectly Centered) */}
// //         <div className="flex justify-center mt-6">
// //           {/* Constrain the inner grid wrapper to visually center the two cards as a block */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full lg:max-w-4xl"> 
// //             {features.slice(3, 5).map((feature, index) => (
// //               // Start delay from index 3 (index 0 for this slice is the 4th overall card)
// //               <FeatureCard key={feature.key} feature={feature} indexOffset={3 + index} />
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default Features

// // // import { motion } from "framer-motion"
// // // import { Phone, MessageSquare, MessagesSquare, Link, Globe } from "lucide-react"

// // // // --- Mock Translation Function ---
// // // const t = (key) => {
// // //   const translations = {
// // //     'features.title': 'Core Features of Our Voice AI Platform',
// // //     'features.voice': 'Voice AI for Calls',
// // //     'features.voiceDesc': 'Handle inbound and outbound calls with <500ms latency.',
// // //     'features.messaging': 'AI-Powered Messaging',
// // //     'features.messagingDesc': 'Automate text and email communications.',
// // //     'features.chatbot': 'Website Chatbot',
// // //     'features.chatbotDesc': 'Engage visitors with an AI-powered chat widget.',
// // //     'features.integrations': 'CRM Integrations',
// // //     'features.integrationsDesc': 'Seamless integration with Jobber, Salesforce, and more.',
// // //     'features.multilingual': 'Multi-Lingual Support',
// // //     'features.multilingualDesc': 'Support for English, French.',
// // //   }
// // //   return translations[key] || key
// // // }

// // // const features = [
// // //   { icon: Phone, key: 'voice', title: 'features.voice', description: 'features.voiceDesc' },
// // //   { icon: MessageSquare, key: 'messaging', title: 'features.messaging', description: 'features.messagingDesc' },
// // //   { icon: MessagesSquare, key: 'chatbot', title: 'features.chatbot', description: 'features.chatbotDesc' },
// // //   { icon: Link, key: 'integrations', title: 'features.integrations', description: 'features.integrationsDesc' },
// // //   { icon: Globe, key: 'multilingual', title: 'features.multilingual', description: 'features.multilingualDesc' },
// // // ]

// // // const Features = ({ id }) => {
// // //   const FeatureCard = ({ feature, indexOffset }) => (
// // //     <motion.div
// // //       key={feature.key}
// // //       initial={{ opacity: 0, y: 50 }}
// // //       whileInView={{ opacity: 1, y: 0 }}
// // //       viewport={{ once: true }}
// // //       transition={{ duration: 0.6, delay: indexOffset * 0.1 }}
// // //       className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-600 border border-gray-200 text-center font-poppins"
// // //     >
// // //       <feature.icon className="h-10 w-10 text-primary-600 mb-4 mx-auto" aria-hidden="true" />
// // //       <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(feature.title)}</h3>
// // //       <p className="text-base text-gray-700">{t(feature.description)}</p>
// // //     </motion.div>
// // //   )

// // //   return (
// // //     <section
// // //       id="features"
// // //       className="py-24 bg-background relative z-10 font-poppins" // ✅ Full section uses Poppins
// // //     >
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //         {/* Title */}
// // //         <motion.h2
// // //           initial={{ opacity: 0, y: 50 }}
// // //           whileInView={{ opacity: 1, y: 0 }}
// // //           viewport={{ once: true }}
// // //           transition={{ duration: 0.6 }}
// // //           className="text-4xl md:text-5xl text-center text-gray-900 mb-16 font-bold"
// // //         >
// // //           {t('features.title')}
// // //         </motion.h2>

// // //         {/* Top 3 Cards */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
// // //           {features.slice(0, 3).map((feature, index) => (
// // //             <FeatureCard key={feature.key} feature={feature} indexOffset={index} />
// // //           ))}
// // //         </div>

// // //         {/* Bottom 2 Cards (Centered) */}
// // //         <div className="flex justify-center">
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full lg:max-w-4xl">
// // //             {features.slice(3, 5).map((feature, index) => (
// // //               <FeatureCard key={feature.key} feature={feature} indexOffset={3 + index} />
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   )
// // // }

// // // export default Features

import { motion } from "framer-motion"
import { Phone, MessageSquare, MessagesSquare, Link, Globe } from "lucide-react"

// --- Mock Translation Function ---
const t = (key) => {
  const translations = {
    'features.title': 'Core Features of Our Voice AI Platform',
    'features.voice': 'Voice AI for Calls',
    'features.voiceDesc': 'Handle inbound and outbound calls with <500ms latency.',
    'features.messaging': 'AI-Powered Messaging',
    'features.messagingDesc': 'Automate text and email communications.',
    'features.chatbot': 'Website Chatbot',
    'features.chatbotDesc': 'Engage visitors with an AI-powered chat widget.',
    'features.integrations': 'CRM Integrations',
    'features.integrationsDesc': 'Seamless integration with Jobber, Salesforce, and more.',
    'features.multilingual': 'Multi-Lingual Support',
    'features.multilingualDesc': 'Support for English, French.',
  }
  return translations[key] || key
}

const features = [
  { icon: Phone, key: 'voice', title: 'features.voice', description: 'features.voiceDesc' },
  { icon: MessageSquare, key: 'messaging', title: 'features.messaging', description: 'features.messagingDesc' },
  { icon: MessagesSquare, key: 'chatbot', title: 'features.chatbot', description: 'features.chatbotDesc' },
  { icon: Link, key: 'integrations', title: 'features.integrations', description: 'features.integrationsDesc' },
  { icon: Globe, key: 'multilingual', title: 'features.multilingual', description: 'features.multilingualDesc' },
]

const Features = ({ id }) => {
  const FeatureCard = ({ feature, indexOffset }) => (
    <motion.div
      key={feature.key}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: indexOffset * 0.1 }}
      className="p-8 bg-[#141414] rounded-xl border border-[#1F1F1F] shadow-[0_0_15px_rgba(255,30,30,0.08)] hover:shadow-[0_0_25px_rgba(255,30,30,0.25)] transition-all duration-300 text-center font-poppins"
    >
      <feature.icon className="h-10 w-10 text-[#FF1E1E] mb-4 mx-auto" aria-hidden="true" />
      <h3 className="text-xl font-semibold text-white mb-2">{t(feature.title)}</h3>
      <p className="text-base text-gray-300">{t(feature.description)}</p>
    </motion.div>
  )

  return (
    <section
      id="features"
      className="py-24 bg-[#0A0A0A] relative z-10 font-poppins overflow-hidden"
    >
      {/* Subtle background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#FF1E1E]/10 blur-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl text-center text-white mb-16  drop-shadow-[0_0_12px_rgba(255,30,30,0.25)]"
        >
          {t('features.title')}
        </motion.h2>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {features.slice(0, 3).map((feature, index) => (
            <FeatureCard key={feature.key} feature={feature} indexOffset={index} />
          ))}
        </div>

        {/* Bottom 2 Cards (Centered) */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full lg:max-w-4xl">
            {features.slice(3, 5).map((feature, index) => (
              <FeatureCard key={feature.key} feature={feature} indexOffset={3 + index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
