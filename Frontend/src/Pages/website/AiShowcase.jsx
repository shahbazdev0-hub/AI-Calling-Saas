// // import { useTranslation } from "react-i18next"
// // import { motion } from "framer-motion"
// // import { MessageCircle, Mail, Smartphone, Globe } from "lucide-react"

// // const AiShowcase = () => {
// //   const { t, i18n } = useTranslation()
// //   const audioSrc = i18n.language === 'en' ? '/sample-audio-en.mp3' : '/sample-audio-fr.mp3'

// //   return (
// //     <section className="py-16 bg-white relative z-10">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">{t('showcase.title')}</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //           <motion.div
// //             initial={{ opacity: 0, scale: 0.9 }}
// //             whileInView={{ opacity: 1, scale: 1 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.5 }}
// //             className="p-6 border rounded-lg shadow-lg bg-white z-10"
// //           >
// //             <audio controls src={audioSrc} className="w-full mb-4" aria-label="AI voice sample">
// //               Your browser does not support the audio element.
// //             </audio>
// //             <button
// //               aria-label={t('showcase.playAudio')}
// //               className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
// //             >
// //               {t('showcase.playAudio')}
// //             </button>
// //           </motion.div>
// //           <div className="flex flex-col justify-center z-10">
// //             <p className="text-lg mb-4 text-gray-900">{t('showcase.channels')}</p>
// //             <div className="flex space-x-6 justify-center">
// //               <Smartphone className="h-10 w-10 text-blue-600" aria-hidden="true" />
// //               <Mail className="h-10 w-10 text-blue-600" aria-hidden="true" />
// //               <MessageCircle className="h-10 w-10 text-blue-600" aria-hidden="true" />
// //               <Globe className="h-10 w-10 text-blue-600" aria-hidden="true" />
// //             </div>
// //             <div className="mt-4 border rounded-lg p-4 bg-gray-50 text-gray-900 text-center">
// //               {t('showcase.chatWidget')}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default AiShowcase

// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"
// import { Phone, MessageSquare, Mail, MessagesSquare, Globe, PlayCircle, PauseCircle } from "lucide-react"
// import { useState, useRef } from "react"

// const channels = [
//   { icon: Phone, label: 'Phone', key: 'phone' },
//   { icon: MessageSquare, label: 'SMS', key: 'sms' },
//   { icon: Mail, label: 'Email', key: 'email' },
//   { icon: MessagesSquare, label: 'Chat Widget', key: 'chatWidget' },
//   { icon: Globe, label: 'Social Media', key: 'social' },
// ]

// const audioSamples = [
//   { id: 'sample1', title: 'Voice Call Sample 1', src: '/audio/sample1.mp3' },
//   { id: 'sample2', title: 'Voice Call Sample 2', src: '/audio/sample2.mp3' },
// ]

// const Showcase = ({ id }) => {
//   const { t } = useTranslation()
//   const [playing, setPlaying] = useState({})
//   const audioRefs = useRef({})

//   const toggleAudio = (id) => {
//     const audio = audioRefs.current[id]
//     if (playing[id]) {
//       audio.pause()
//       setPlaying((prev) => ({ ...prev, [id]: false }))
//     } else {
//       audio.play()
//       setPlaying((prev) => ({ ...prev, [id]: true }))
//       console.log(`Playing audio: ${id}`) // Mock interaction
//     }
//   }

//   return (
//     <section id={id} className="py-16 bg-gray-50 relative z-10 font-inter">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Title and Subheading */}
//         <motion.h2
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4"
//         >
//           {t('showcase.title')}
//         </motion.h2>
//         <motion.p
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto"
//         >
//           {t('showcase.channels')}
//         </motion.p>

//         {/* Live Preview */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="mb-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto"
//         >
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('showcase.chatWidget')}</h3>
//           <div className="bg-gray-50 p-4 rounded-md space-y-4">
//             <p className="text-left text-gray-800 text-base font-semibold">
//               AI Agent: Hello! How can I assist you today?
//             </p>
//             <p className="text-right text-gray-400 text-base italic">
//               User: I’d like to schedule a demo.
//             </p>
//           </div>
//         </motion.div>

//         {/* Audio Samples */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.6 }}
//           className="mb-12"
//         >
//           <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">{t('showcase.playAudio')}</h3>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             {audioSamples.map((sample) => (
//               <div key={sample.id} className="flex items-center gap-2">
//                 <button
//                   onClick={() => toggleAudio(sample.id)}
//                   className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
//                   aria-label={playing[sample.id] ? `Pause ${sample.title}` : `Play ${sample.title}`}
//                 >
//                   {playing[sample.id] ? (
//                     <PauseCircle className="h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <PlayCircle className="h-6 w-6" aria-hidden="true" />
//                   )}
//                 </button>
//                 <span className="text-gray-700 text-base">{sample.title}</span>
//                 <audio ref={(el) => (audioRefs.current[sample.id] = el)} src={sample.src} />
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Multi-Channel Visuals */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6"
//         >
//           {channels.map((channel, index) => (
//             <div
//               key={channel.key}
//               className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 text-center"
//             >
//               <channel.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" aria-hidden="true" />
//               <p className="text-base font-semibold text-gray-900">{channel.label}</p>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default Showcase

// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import { Phone, MessageSquare, Mail, Globe, Twitter, Facebook } from "lucide-react"

// const USE_CASES = [
//   {
//     key: "realEstate",
//     label: "Real Estate",
//     script: [
//       { speaker: "Agent", text: "Hello, are you looking to buy or sell a property?" },
//       { speaker: "Buyer", text: "Yes, I’d like a 3-bedroom home near downtown." },
//     ],
//     prompt: "You are an AI real estate assistant helping clients schedule tours.",
//     audio: "/audio/realestate.mp3",
//   },
//   {
//     key: "ecommerce",
//     label: "E-Commerce",
//     script: [
//       { speaker: "Agent", text: "Hi! Can I help you track your recent order?" },
//       { speaker: "Customer", text: "Yes, I need the status of my delivery." },
//     ],
//     prompt: "You are an AI agent handling e-commerce support queries.",
//     audio: "/audio/ecommerce.mp3",
//   },
//   {
//     key: "healthcare",
//     label: "Healthcare",
//     script: [
//       { speaker: "Agent", text: "Hello, would you like to schedule an appointment?" },
//       { speaker: "Patient", text: "Yes, I need a check-up next week." },
//     ],
//     prompt: "You are an AI healthcare assistant scheduling patient appointments.",
//     audio: "/audio/healthcare.mp3",
//   },
// ]

// const CHANNELS = [
//   { icon: Phone, label: "Voice" },
//   { icon: MessageSquare, label: "SMS" },
//   { icon: Mail, label: "Email" },
//   { icon: Globe, label: "Chat" },
//   { icon: Twitter, label: "Twitter" },
//   { icon: Facebook, label: "Facebook" },
// ]

// export default function AIShowcase() {
//   const [activeCase, setActiveCase] = useState("realEstate")
//   const [view, setView] = useState("flow")
//   const [playing, setPlaying] = useState(false)

//   const useCase = USE_CASES.find((c) => c.key === activeCase)

//   const playAudio = () => {
//     const audio = new Audio(useCase.audio)
//     audio.play()
//     setPlaying(true)
//     audio.onended = () => setPlaying(false)
//   }

//   return (
//     <section className="bg-gray-50 py-20">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         {/* Title */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-extrabold text-gray-900">
//             AI Agent Showcase
//           </h2>
//           <p className="mt-4 text-lg text-gray-600">
//             Watch how AI agents handle real conversations across industries.
//           </p>
//         </div>

//         {/* Use Case Tabs */}
//         <div className="flex justify-center gap-4 mb-8">
//           {USE_CASES.map((uc) => (
//             <button
//               key={uc.key}
//               onClick={() => setActiveCase(uc.key)}
//               className={`px-5 py-2 rounded-full transition font-medium ${
//                 activeCase === uc.key
//                   ? "bg-blue-600 text-white"
//                   : "bg-white text-gray-700 border border-gray-300"
//               }`}
//             >
//               {uc.label}
//             </button>
//           ))}
//         </div>

//         {/* View Mode Toggle */}
//         <div className="flex justify-center gap-3 mb-12">
//           <button
//             onClick={() => setView("flow")}
//             className={`px-4 py-2 rounded-lg ${
//               view === "flow" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Flow View
//           </button>
//           <button
//             onClick={() => setView("prompt")}
//             className={`px-4 py-2 rounded-lg ${
//               view === "prompt" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Prompt View
//           </button>
//         </div>

//         {/* Showcase Grid */}
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left: Conversation/Prompt Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="bg-white rounded-2xl shadow-lg p-6 h-[400px] flex flex-col"
//           >
//             {view === "flow" ? (
//               <div className="space-y-4 overflow-auto">
//                 {useCase.script.map((line, i) => (
//                   <div
//                     key={i}
//                     className={`max-w-[75%] px-4 py-2 rounded-xl ${
//                       line.speaker === "Agent"
//                         ? "bg-blue-100 text-blue-900 self-start"
//                         : "bg-gray-100 text-gray-900 self-end"
//                     }`}
//                   >
//                     <strong>{line.speaker}:</strong> {line.text}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="italic text-gray-700">{useCase.prompt}</p>
//             )}

//             {/* Footer */}
//             <div className="mt-auto pt-4 flex justify-between items-center text-sm text-gray-500">
//               <span>Live Preview</span>
//               <span className="text-green-600 font-semibold animate-pulse">
//                 ● Active
//               </span>
//             </div>
//           </motion.div>

//           {/* Right: Voice + Channels */}
//           <motion.div
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="space-y-10"
//           >
//             {/* Voice Sample */}
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Voice Sample
//               </h3>
//               <button
//                 onClick={playAudio}
//                 className={`px-5 py-3 rounded-lg border flex items-center gap-2 transition ${
//                   playing
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-white text-gray-700 hover:bg-blue-50"
//                 }`}
//               >
//                 🔊 Play {useCase.label} Sample
//               </button>
//             </div>

//             {/* Multi-channel icons */}
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Multi-Channel Support
//               </h3>
//               <div className="flex flex-wrap gap-6 text-3xl text-gray-600">
//                 {CHANNELS.map(({ icon: Icon, label }) => (
//                   <div
//                     key={label}
//                     className="hover:text-blue-600 transition cursor-pointer"
//                   >
//                     <Icon />
//                     <span className="sr-only">{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }
// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import {
//   PhoneCall,
//   PhoneIncoming,
//   Mail,
//   MessageSquare,
//   Globe,
//   Bot,
//   Database,
//   Languages,
// } from "lucide-react"

// const USE_CASES = [
//   {
//     key: "inbound",
//     label: "Inbound Calls",
//     script: [
//       { speaker: "Agent", text: "Hello! Thanks for calling. How can I help you today?" },
//       { speaker: "Customer", text: "I want to check my order status." },
//     ],
//     prompt: "You are an AI inbound call agent handling customer queries.",
//     audio: "/audio/inbound.mp3",
//   },
//   {
//     key: "outbound",
//     label: "Outbound Calls",
//     script: [
//       { speaker: "Agent", text: "Hi! We’re offering new promotions this week." },
//       { speaker: "Prospect", text: "Sounds good, tell me more." },
//     ],
//     prompt: "You are an AI outbound sales agent making proactive calls.",
//     audio: "/audio/outbound.mp3",
//   },
// ]

// const CAPABILITIES = [
//   {
//     icon: PhoneCall,
//     label: "Voice AI",
//     desc: "Inbound & outbound AI-powered calls with natural conversations.",
//   },
//   {
//     icon: Mail,
//     label: "Text & Email",
//     desc: "Automated follow-ups via SMS and email.",
//   },
//   {
//     icon: Bot,
//     label: "Chatbot Widget",
//     desc: "Website messenger for real-time customer support.",
//   },
//   {
//     icon: Database,
//     label: "CRM Integrations",
//     desc: "Jobber, Salesforce, and extensible APIs.",
//   },
//   {
//     icon: Languages,
//     label: "Multi-Language",
//     desc: "Supports English & French at launch.",
//   },
// ]

// export default function AIShowcase() {
//   const [activeCase, setActiveCase] = useState("inbound")
//   const [view, setView] = useState("flow")
//   const [playing, setPlaying] = useState(false)

//   const useCase = USE_CASES.find((c) => c.key === activeCase)

//   const playAudio = () => {
//     const audio = new Audio(useCase.audio)
//     audio.play()
//     setPlaying(true)
//     audio.onended = () => setPlaying(false)
//   }

//   return (
//     <section className="bg-gray-50 py-20">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         {/* Title */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-extrabold text-gray-900">
//             AI Agent Showcase
//           </h2>
//           <p className="mt-4 text-lg text-gray-600">
//             Experience AI agents handling calls, messages, and chats—seamlessly integrated with your workflows.
//           </p>
//         </div>

//         {/* Use Case Tabs */}
//         <div className="flex justify-center gap-4 mb-8">
//           {USE_CASES.map((uc) => (
//             <button
//               key={uc.key}
//               onClick={() => setActiveCase(uc.key)}
//               className={`px-5 py-2 rounded-full transition font-medium ${
//                 activeCase === uc.key
//                   ? "bg-blue-600 text-white"
//                   : "bg-white text-gray-700 border border-gray-300"
//               }`}
//             >
//               {uc.label}
//             </button>
//           ))}
//         </div>

//         {/* View Toggle */}
//         <div className="flex justify-center gap-3 mb-12">
//           <button
//             onClick={() => setView("flow")}
//             className={`px-4 py-2 rounded-lg ${
//               view === "flow" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Flow View
//           </button>
//           <button
//             onClick={() => setView("prompt")}
//             className={`px-4 py-2 rounded-lg ${
//               view === "prompt" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             Prompt View
//           </button>
//         </div>

//         {/* Showcase Grid */}
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="bg-white rounded-2xl shadow-lg p-6 h-[400px] flex flex-col"
//           >
//             {view === "flow" ? (
//               <div className="space-y-4 overflow-auto">
//                 {useCase.script.map((line, i) => (
//                   <div
//                     key={i}
//                     className={`max-w-[75%] px-4 py-2 rounded-xl ${
//                       line.speaker === "Agent"
//                         ? "bg-blue-100 text-blue-900 self-start"
//                         : "bg-gray-100 text-gray-900 self-end"
//                     }`}
//                   >
//                     <strong>{line.speaker}:</strong> {line.text}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="italic text-gray-700">{useCase.prompt}</p>
//             )}

//             <div className="mt-auto pt-4 flex justify-between items-center text-sm text-gray-500">
//               <span>Live Preview</span>
//               <span className="text-green-600 font-semibold animate-pulse">
//                 ● Active
//               </span>
//             </div>
//           </motion.div>

//           {/* Right Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="space-y-10"
//           >
//             {/* Voice Sample */}
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Voice Sample
//               </h3>
//               <button
//                 onClick={playAudio}
//                 className={`px-5 py-3 rounded-lg border flex items-center gap-2 transition ${
//                   playing
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-white text-gray-700 hover:bg-blue-50"
//                 }`}
//               >
//                 🔊 Play {useCase.label} Sample
//               </button>
//             </div>

//             {/* Capabilities */}
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-6">
//                 Key Capabilities
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-6">
//                 {CAPABILITIES.map(({ icon: Icon, label, desc }) => (
//                   <div
//                     key={label}
//                     className="flex gap-3 items-start bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition"
//                   >
//                     <Icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
//                     <div>
//                       <p className="font-semibold text-gray-900">{label}</p>
//                       <p className="text-sm text-gray-600">{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }
// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import {
//   PhoneCall,
//   PhoneIncoming,
//   Mail,
//   MessageSquare,
//   Bot,
//   Database,
//   Languages,
// } from "lucide-react"

// const USE_CASES = [
//   {
//     key: "inbound",
//     label: "Inbound Calls",
//     script: [
//       { speaker: "Agent", text: "Hello! Thanks for calling. How can I help you today?" },
//       { speaker: "Customer", text: "I want to check my order status." },
//     ],
//     prompt: "You are an AI inbound call agent handling customer queries.",
//     audio: "/audio/inbound.mp3",
//   },
//   {
//     key: "outbound",
//     label: "Outbound Calls",
//     script: [
//       { speaker: "Agent", text: "Hi! We’re offering new promotions this week." },
//       { speaker: "Prospect", text: "Sounds good, tell me more." },
//     ],
//     prompt: "You are an AI outbound sales agent making proactive calls.",
//     audio: "/audio/outbound.mp3",
//   },
//   {
//     key: "messaging",
//     label: "Text & Email Messaging",
//     script: [
//       { speaker: "Agent", text: "Hello! Just following up on your inquiry via email." },
//       { speaker: "Customer", text: "Thanks, I’d like to schedule a demo." },
//     ],
//     prompt: "You are an AI agent managing SMS and email conversations.",
//     audio: "/audio/messaging.mp3",
//   },
//   {
//     key: "chatbot",
//     label: "Chatbot Widget",
//     script: [
//       { speaker: "Visitor", text: "Do you offer 24/7 support?" },
//       { speaker: "AI Chatbot", text: "Yes! Our AI agents are available anytime." },
//     ],
//     prompt: "You are an AI chatbot widget embedded on a business website.",
//     audio: "/audio/chatbot.mp3",
//   },
//   {
//     key: "crm",
//     label: "CRM Integrations",
//     script: [
//       { speaker: "Agent", text: "I’ve synced your new lead into Salesforce." },
//       { speaker: "System", text: "Jobber integration complete." },
//     ],
//     prompt: "You are an AI that integrates seamlessly with Salesforce, Jobber, and other CRMs.",
//     audio: "/audio/crm.mp3",
//   },
//   {
//     key: "language",
//     label: "Multi-Language Support",
//     script: [
//       { speaker: "AI Agent (FR)", text: "Bonjour! Comment puis-je vous aider aujourd'hui?" },
//       { speaker: "Customer", text: "Merci, je veux vérifier ma réservation." },
//     ],
//     prompt: "You are an AI agent that can switch between English and French seamlessly.",
//     audio: "/audio/french.mp3",
//   },
// ]

// const CAPABILITIES = [
//   { icon: PhoneCall, label: "Inbound & Outbound Calls" },
//   { icon: Mail, label: "Text & Email Messaging" },
//   { icon: Bot, label: "Website Chatbot Widget" },
//   { icon: Database, label: "CRM Integrations" },
//   { icon: Languages, label: "Multi-Language Support" },
// ]

// export default function AIShowcase() {
//   const [activeCase, setActiveCase] = useState("inbound")
//   const [view, setView] = useState("flow")
//   const [playing, setPlaying] = useState(false)

//   const useCase = USE_CASES.find((c) => c.key === activeCase)

//   const playAudio = () => {
//     const audio = new Audio(useCase.audio)
//     audio.play()
//     setPlaying(true)
//     audio.onended = () => setPlaying(false)
//   }

//   return (
//     <section id="Showcase" className="bg-gray-50 py-20">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         {/* Title */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-extrabold text-black">
//             AI Agent Showcase
//           </h2>
//           <p className="mt-4 text-lg text-black">
//             See how AI agents handle calls, messages, and chats across multiple channels.
//           </p>
//         </div>

//         {/* Use Case Tabs */}
//         <div className="flex flex-wrap justify-center gap-3 mb-10  text-black">
//           {USE_CASES.map((uc) => (
//             <button
//               key={uc.key}
//               onClick={() => setActiveCase(uc.key)}
//               className={`px-5 py-2 rounded-full transition font-medium ${
//                 activeCase === uc.key
//                   ? "bg-blue-600 text-white"
//                   : "bg-white text-black border border-black hover:bg-gray-100"
//               }`}
//             >
//               {uc.label}
//             </button>
//           ))}
//         </div>

//         {/* View Toggle */}
//         <div className="flex justify-center gap-3 mb-12">
//           <button
//             onClick={() => setView("flow")}
//             className={`px-4 py-2 rounded-lg ${
//               view === "flow" ? "bg-blue-600 text-white" : "bg-gray-200 text-black border border-black"
//             }`}
//           >
//             Flow View
//           </button>
//           <button
//             onClick={() => setView("prompt")}
//             className={`px-4 py-2 rounded-lg ${
//               view === "prompt" ? "bg-blue-600 text-white" : "bg-gray-200 text-black border border-black"
//             }`}
//           >
//             Prompt View
//           </button>
//         </div>

//         {/* Showcase Grid */}
//         <div className="grid lg:grid-cols-2 gap-12 items-center ">
//           {/* Left Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="bg-white rounded-2xl shadow-lg p-6 h-[400px] flex flex-col border border-black"
//           >
//             {view === "flow" ? (
//               <div className="space-y-4 overflow-auto">
//                 {useCase.script.map((line, i) => (
//                   <div
//                     key={i}
//                     className={`max-w-[75%] px-4 py-2 rounded-xl ${
//                       line.speaker.includes("Agent") || line.speaker.includes("AI")
//                         ? "bg-blue-100 text-blue-900 self-start"
//                         : "bg-gray-100 text-black self-end"
//                     }`}
//                   >
//                     <strong>{line.speaker}:</strong> {line.text}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="italic text-black">{useCase.prompt}</p>
//             )}

//             <div className="mt-auto pt-4 flex justify-between items-center text-sm text-black">
//               <span>Live Preview</span>
//               <span className="text-green-600 font-semibold animate-pulse">
//                 ● Active
//               </span>
//             </div>
//           </motion.div>

//           {/* Right Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="space-y-10"
//           >
//             {/* Voice Sample */}
//             <div>
//               <h3 className="text-xl font-semibold text-black mb-4">
//                 Voice Sample
//               </h3>
//               <button
//                 onClick={playAudio}
//                 className={`px-5 py-3 rounded-lg border flex items-center gap-2 transition ${
//                   playing
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-white text-black hover:bg-blue-50 border border-black"
//                 }`}
//               >
//                 🔊 Play {useCase.label} Sample
//               </button>
//             </div>

//             {/* Capabilities */}
//             <div>
//               <h3 className="text-xl font-semibold text-black mb-6">
//                 Key Capabilities
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-6">
//                 {CAPABILITIES.map(({ icon: Icon, label }) => (
//                   <div
//                     key={label}
//                     className="flex gap-3 items-start bg-white shadow-sm rounded-lg p-4 hover:shadow-xl transition border border-black"
//                   >
//                     <Icon className="h-6 w-6 text-blue-600 flex-shrink-0" />
//                     <p className="text-gray-900 font-medium">{label}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }

// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import {
//   PhoneCall,
//   PhoneIncoming,
//   Mail,
//   MessageSquare,
//   Bot,
//   Database,
//   Languages,
// } from "lucide-react"

// const USE_CASES = [
//   {
//     key: "inbound",
//     label: "Inbound Calls",
//     script: [
//       { speaker: "Agent", text: "Hello! Thanks for calling. How can I help you today?" },
//       { speaker: "Customer", text: "I want to check my order status." },
//     ],
//     prompt: "You are an AI inbound call agent handling customer queries.",
//     audio: "/audio/inbound.mp3",
//   },
//   {
//     key: "outbound",
//     label: "Outbound Calls",
//     script: [
//       { speaker: "Agent", text: "Hi! We’re offering new promotions this week." },
//       { speaker: "Prospect", text: "Sounds good, tell me more." },
//     ],
//     prompt: "You are an AI outbound sales agent making proactive calls.",
//     audio: "/audio/outbound.mp3",
//   },
//   {
//     key: "messaging",
//     label: "Text & Email Messaging",
//     script: [
//       { speaker: "Agent", text: "Hello! Just following up on your inquiry via email." },
//       { speaker: "Customer", text: "Thanks, I’d like to schedule a demo." },
//     ],
//     prompt: "You are an AI agent managing SMS and email conversations.",
//     audio: "/audio/messaging.mp3",
//   },
//   {
//     key: "chatbot",
//     label: "Chatbot Widget",
//     script: [
//       { speaker: "Visitor", text: "Do you offer 24/7 support?" },
//       { speaker: "AI Chatbot", text: "Yes! Our AI agents are available anytime." },
//     ],
//     prompt: "You are an AI chatbot widget embedded on a business website.",
//     audio: "/audio/chatbot.mp3",
//   },
//   {
//     key: "crm",
//     label: "CRM Integrations",
//     script: [
//       { speaker: "Agent", text: "I’ve synced your new lead into Salesforce." },
//       { speaker: "System", text: "Jobber integration complete." },
//     ],
//     prompt: "You are an AI that integrates seamlessly with Salesforce, Jobber, and other CRMs.",
//     audio: "/audio/crm.mp3",
//   },
//   {
//     key: "language",
//     label: "Multi-Language Support",
//     script: [
//       { speaker: "AI Agent (FR)", text: "Bonjour! Comment puis-je vous aider aujourd'hui?" },
//       { speaker: "Customer", text: "Merci, je veux vérifier ma réservation." },
//     ],
//     prompt: "You are an AI agent that can switch between English and French seamlessly.",
//     audio: "/audio/french.mp3",
//   },
// ]

// const CAPABILITIES = [
//   { icon: PhoneCall, label: "Inbound & Outbound Calls" },
//   { icon: Mail, label: "Text & Email Messaging" },
//   { icon: Bot, label: "Website Chatbot Widget" },
//   { icon: Database, label: "CRM Integrations" },
//   { icon: Languages, label: "Multi-Language Support" },
// ]

// export default function AIShowcase() {
//   const [activeCase, setActiveCase] = useState("inbound")
//   const [view, setView] = useState("flow")
//   const [playing, setPlaying] = useState(false)

//   const useCase = USE_CASES.find((c) => c.key === activeCase)

//   // Mock audio playing function since external files aren't available
//   const playAudio = () => {
//     // const audio = new Audio(useCase.audio)
//     // audio.play()
//     setPlaying(true)
//     setTimeout(() => setPlaying(false), 2000); // Simulate 2 second play time
//     console.log(`Playing audio sample for: ${useCase.label}`);
//     // audio.onended = () => setPlaying(false)
//   }

//   return (
//     <section id="Showcase" className="bg-background py-20">
//       <div className="max-w-8xl mx-auto px-6 lg:px-8">
//         {/* Title */}
//         <div className="text-center mb-12">
//           <h2 className="text-5xl  text-gray-900">
//             AI Agent Showcase
//           </h2>
//           <p className="mt-4 text-lg text-gray-700">
//             See how AI agents handle calls, messages, and chats across multiple channels.
//           </p>
//         </div>

//         {/* Use Case Tabs */}
//         <div className="flex flex-wrap justify-center gap-3 mb-10 text-gray-900">
//           {USE_CASES.map((uc) => (
//             <button
//               key={uc.key}
//               onClick={() => setActiveCase(uc.key)}
//               className={`px-5 py-2 rounded-full transition font-medium ${
//                 activeCase === uc.key
//                   // Active state uses the main Dark Teal accent color
//                   ? "bg-primary-600 text-white shadow-md"
//                   // Inactive state uses white background with Dark Teal border/hover
//                   : "bg-white text-gray-900 border border-gray-300 hover:bg-secondary-100"
//               }`}
//             >
//               {uc.label}
//             </button>
//           ))}
//         </div>

//         {/* View Toggle */}
//         <div className="flex justify-center gap-3 mb-12">
//           <button
//             onClick={() => setView("flow")}
//             className={`px-4 py-2 rounded-lg transition-colors ${
//               // Active state uses the main Dark Teal accent color
//               view === "flow" ? "bg-primary-600 text-white shadow-md" : "bg-white text-gray-900 border border-gray-300 hover:bg-secondary-100"
//             }`}
//           >
//             Flow View
//           </button>
//           <button
//             onClick={() => setView("prompt")}
//             className={`px-4 py-2 rounded-lg transition-colors ${
//               // Active state uses the main Dark Teal accent color
//               view === "prompt" ? "bg-primary-600 text-white shadow-md" : "bg-white text-gray-900 border border-gray-300 hover:bg-secondary-100"
//             }`}
//           >
//             Prompt View
//           </button>
//         </div>

//         {/* Showcase Grid */}
//         <div className="grid lg:grid-cols-2 gap-12 items-center ">
//           {/* Left Panel (Script/Prompt Display) */}
//           <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="bg-white rounded-2xl shadow-xl p-6 h-[400px] flex flex-col border border-gray-200"
//           >
//             {view === "flow" ? (
//               <div className="space-y-4 overflow-auto pr-2">
//                 {useCase.script.map((line, i) => (
//                   <div
//                     key={i}
//                     className={`max-w-[85%] px-4 py-3 rounded-xl transition-all ${
//                       // AI/Agent lines use a light accent background (secondary-100) and dark text
//                       line.speaker.includes("Agent") || line.speaker.includes("AI") || line.speaker.includes("System")
//                         ? "bg-secondary-100 text-primary-900 self-start rounded-tl-lg rounded-br-lg"
//                         // Customer/Visitor lines use a subtle off-white background and normal text
//                         : "bg-gray-100 text-gray-800 self-end rounded-tr-lg rounded-bl-lg"
//                     }`}
//                   >
//                     <strong>{line.speaker}:</strong> {line.text}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="italic text-gray-700 p-4 bg-gray-50 rounded-lg">{useCase.prompt}</p>
//             )}

//             <div className="mt-auto pt-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100">
//               <span className="font-semibold text-gray-700">{useCase.label} Live Preview</span>
//               {/* Keeping the active indicator green for standard "active" status color */}
//               <span className="text-green-600 font-semibold animate-pulse">
//                 ● Active
//               </span>
//             </div>
//           </motion.div>

//           {/* Right Panel */}
//           {/* <motion.div
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="space-y-10"
//           > */}
//             {/* Voice Sample */}
//             {/* <div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Voice Sample
//               </h3>
//               <button
//                 onClick={playAudio}
//                 className={`px-6 py-3 rounded-full border flex items-center gap-2 transition-all font-semibold ${
//                   // Playing state uses the main Dark Teal accent color
//                   playing
//                     ? "bg-primary-600 text-white border-primary-600 shadow-lg"
//                     // Default state uses white/light background with Dark Teal text on hover
//                     : "bg-white text-primary-600 hover:bg-secondary-100 border-primary-600 hover:shadow-md"
//                 }`}
//               >
//                 🔊 {playing ? 'Playing...' : `Play ${useCase.label} Sample`}
//               </button>
//             </div> */}

//             {/* Capabilities */}
//             {/* <div>
//               <h3 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Key Capabilities
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-6">
//                 {CAPABILITIES.map(({ icon: Icon, label }) => (
//                   <div
//                     key={label}
//                     // Border and icon color updated to Dark Teal
//                     className="flex gap-3 items-start bg-white shadow-sm rounded-lg p-4 hover:shadow-xl transition border border-primary-200"
//                   >
//                     <Icon className="h-6 w-6 text-primary-600 flex-shrink-0" />
//                     <p className="text-gray-900 font-medium">{label}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div> */}
//         </div>
//       </div>
//     </section>
//   )
// }

// // import React, { useState } from "react"
// // import { motion } from "framer-motion"
// // import {
// //   PhoneCall,
// //   Mail,
// //   Bot,
// //   Database,
// //   Languages,
// // } from "lucide-react"

// // const USE_CASES = [
// //   {
// //     key: "inbound",
// //     label: "Inbound Calls",
// //     script: [
// //       { speaker: "Agent", text: "Hello! Thanks for calling. How can I help you today?" },
// //       { speaker: "Customer", text: "Hi, I’d like to check the status of my order." },
// //       { speaker: "Agent", text: "Sure! Could you please provide your order number?" },
// //       { speaker: "Customer", text: "Yes, it’s #48291." },
// //       { speaker: "Agent", text: "Got it. Your order is out for delivery and should arrive today." },
// //       { speaker: "Customer", text: "Perfect, thank you so much for your help!" },
// //     ],
// //     audio: "/audio/inbound.mp3",
// //   },
// //   {
// //     key: "outbound",
// //     label: "Outbound Calls",
// //     script: [
// //       { speaker: "Agent", text: "Hi! This is Ava from BrightTel. How are you today?" },
// //       { speaker: "Prospect", text: "I’m good, thank you. What’s this about?" },
// //       { speaker: "Agent", text: "We’re offering a new promotion on business phone plans this week." },
// //       { speaker: "Prospect", text: "Interesting. What kind of discount are we talking about?" },
// //       { speaker: "Agent", text: "You can save up to 25% for the first six months if you switch now." },
// //       { speaker: "Prospect", text: "That sounds great. Please send me the details via email." },
// //     ],
// //     audio: "/audio/outbound.mp3",
// //   },
// //   {
// //     key: "messaging",
// //     label: "Text & Email Messaging",
// //     script: [
// //       { speaker: "Agent", text: "Hi Alex! This is Nova from CloudPro. How’s your onboarding going?" },
// //       { speaker: "Customer", text: "Hey Nova, it’s going well, but I’m having trouble connecting my domain." },
// //       { speaker: "Agent", text: "No problem! I can walk you through the steps or share our setup guide." },
// //       { speaker: "Customer", text: "Please send the guide, that’d be great." },
// //       { speaker: "Agent", text: "Just emailed it to you — check your inbox for 'CloudPro Setup Guide'." },
// //       { speaker: "Customer", text: "Got it! Thanks for the quick response." },
// //     ],
// //     audio: "/audio/messaging.mp3",
// //   },
// //   {
// //     key: "chatbot",
// //     label: "Chatbot Widget",
// //     script: [
// //       { speaker: "Visitor", text: "Do you offer 24/7 support?" },
// //       { speaker: "AI Chatbot", text: "Yes! Our AI agents are available anytime." },
// //       { speaker: "Visitor", text: "That’s awesome. Can you help me set up a demo?" },
// //       { speaker: "AI Chatbot", text: "Absolutely! I can schedule one for you right now." },
// //       { speaker: "Visitor", text: "Perfect, how can I get started?" },
// //       { speaker: "AI Chatbot", text: "Just share your email, and I’ll send over the booking link!" },
// //     ],
// //     audio: "/audio/chatbot.mp3",
// //   },
// //   {
// //     key: "crm",
// //     label: "CRM Integrations",
// //     script: [
// //       { speaker: "Agent", text: "I’ve just synced your new leads into Salesforce." },
// //       { speaker: "User", text: "Great, did the Jobber integration also run?" },
// //       { speaker: "Agent", text: "Yes, it’s complete and verified." },
// //       { speaker: "User", text: "Can you also update the contact records for this week?" },
// //       { speaker: "Agent", text: "Done! Contacts synced and tagged with 'October Update'." },
// //       { speaker: "User", text: "Perfect, thanks for the update!" },
// //     ],
// //     audio: "/audio/crm.mp3",
// //   },
// //   {
// //     key: "language",
// //     label: "Multi-Language Support",
// //     script: [
// //       { speaker: "AI Agent (FR)", text: "Bonjour! Comment puis-je vous aider aujourd'hui?" },
// //       { speaker: "Customer", text: "Merci, je veux vérifier ma réservation." },
// //       { speaker: "AI Agent (EN)", text: "Of course! May I have your booking number?" },
// //       { speaker: "Customer", text: "Oui, c’est le 32987." },
// //       { speaker: "AI Agent (FR)", text: "Parfait, votre réservation est confirmée pour demain à 10h." },
// //       { speaker: "Customer", text: "Merci beaucoup pour votre aide!" },
// //     ],
// //     audio: "/audio/french.mp3",
// //   },
// // ]

// // export default function AIShowcase() {
// //   const [activeCase, setActiveCase] = useState("inbound")
// //   const [playing, setPlaying] = useState(false)

// //   const useCase = USE_CASES.find((c) => c.key === activeCase)

// //   const playAudio = () => {
// //     setPlaying(true)
// //     setTimeout(() => setPlaying(false), 2000)
// //     console.log(`Playing audio sample for: ${useCase.label}`)
// //   }

// //   return (
// //     <section id="Showcase" className="bg-background py-20">
// //       <div className="max-w-8xl mx-auto px-6 lg:px-8">
// //         {/* Title */}
// //         <div className="text-center mb-12">
// //           <h2 className="text-5xl text-gray-900">AI Agent Showcase</h2>
// //           <p className="mt-4 text-lg text-gray-700">
// //             See realistic two-way conversations between AI agents and customers.
// //           </p>
// //         </div>

// //         {/* Use Case Tabs */}
// //         <div className="flex flex-wrap justify-center gap-3 mb-10 text-gray-900">
// //           {USE_CASES.map((uc) => (
// //             <button
// //               key={uc.key}
// //               onClick={() => setActiveCase(uc.key)}
// //               className={`px-5 py-2 rounded-full transition font-medium ${
// //                 activeCase === uc.key
// //                   ? "bg-primary-600 text-white shadow-md"
// //                   : "bg-white text-gray-900 border border-gray-300 hover:bg-secondary-100"
// //               }`}
// //             >
// //               {uc.label}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Two Panel (mirrored chat) */}
// //         <div className="grid lg:grid-cols-2 gap-12">
// //           {/* Agent View */}
// //           <motion.div
// //             initial={{ opacity: 0, x: -40 }}
// //             whileInView={{ opacity: 1, x: 0 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.6 }}
// //             className="bg-white rounded-2xl shadow-xl p-6 h-[420px] flex flex-col border border-gray-200"
// //           >
// //             <h3 className="text-xl font-semibold text-primary-700 mb-4">
// //               Agent View
// //             </h3>
// //             <div className="space-y-3 overflow-auto pr-2 no-scrollbar">
// //               {useCase.script.map((line, i) => (
// //                 <div
// //                   key={i}
// //                   className={`max-w-[80%] px-4 py-2 rounded-xl ${
// //                     line.speaker.includes("Agent") || line.speaker.includes("AI")
// //                       ? "bg-secondary-100 text-primary-900 self-start rounded-tl-none"
// //                       : "bg-primary-600 text-white self-end rounded-tr-none"
// //                   }`}
// //                 >
// //                   <strong>{line.speaker}:</strong> {line.text}
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="mt-auto pt-4 flex justify-between text-sm text-gray-500 border-t border-gray-100">
// //               <span className="font-semibold text-gray-700">{useCase.label}</span>
// //               <span className="text-green-600 font-semibold animate-pulse">
// //                 ● Active
// //               </span>
// //             </div>
// //           </motion.div>

// //           {/* User View (mirrored) */}
// //           <motion.div
// //             initial={{ opacity: 0, x: 40 }}
// //             whileInView={{ opacity: 1, x: 0 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.6 }}
// //             className="bg-white rounded-2xl shadow-xl p-6 h-[420px] flex flex-col border border-gray-200"
// //           >
// //             <h3 className="text-xl font-semibold text-gray-800 mb-4">
// //               User / Customer View
// //             </h3>
// //             <div className="space-y-3 overflow-auto pr-2 no-scrollbar">
// //               {useCase.script.map((line, i) => (
// //                 <div
// //                   key={i}
// //                   className={`max-w-[80%] px-4 py-2 rounded-xl ${
// //                     line.speaker.includes("Agent") || line.speaker.includes("AI")
// //                       ? "bg-primary-600 text-white self-end rounded-tr-none"
// //                       : "bg-gray-100 text-gray-800 self-start rounded-tl-none"
// //                   }`}
// //                 >
// //                   <strong>{line.speaker}:</strong> {line.text}
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="mt-auto pt-4 flex justify-between text-sm text-gray-500 border-t border-gray-100">
// //               <span className="font-semibold text-gray-700">Conversation Mirror</span>
// //               <button
// //                 onClick={playAudio}
// //                 className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
// //                   playing
// //                     ? "bg-primary-600 text-white border-primary-600"
// //                     : "bg-white text-primary-600 border-primary-600 hover:bg-secondary-100"
// //                 }`}
// //               >
// //                 🔊 {playing ? "Playing..." : "Play Sample"}
// //               </button>
// //             </div>
// //           </motion.div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }
// // import React, { useState } from "react";
// // import { motion } from "framer-motion";
// // import { User, Bot } from "lucide-react";

// // // =================================================================
// // // Chat Data (User-Initiated Conversation)
// // // =================================================================

// // const useCases = [
// //   {
// //     id: 'sales',
// //     title: 'Sales & Lead Nurturing',
// //     script: [
// //       { sender: 'customer', text: "Hello, I'm interested in the new AI Voice Platform. Can you tell me about the pricing tiers for small businesses?" },
// //       { sender: 'agent', text: "Welcome! Our AI Voice Platform offers three tiers: Starter, Professional, and Enterprise. For small businesses, our Starter tier, at $49/month, is very popular. Would you like a quick overview of what it includes?" },
// //       { sender: 'customer', text: "Yes, please. I'm mainly concerned with call volume and multi-language support." },
// //       { sender: 'agent', text: "The Starter tier includes 5,000 minutes per month and supports our standard 10 languages. It's a great way to pilot the technology. For unlimited minutes or custom language models, we'd recommend Professional." },
// //     ],
// //   },
// //   {
// //     id: 'customer-service',
// //     title: 'Customer Service Automation',
// //     script: [
// //       { sender: 'customer', text: "I need to check the status of my order, but I don't have the order number on hand. My name is Alex Chen." },
// //       { sender: 'agent', text: "Thank you, Alex. I can look up your order using your name and phone number on file. To confirm your identity, can you please state the phone number associated with your account?" },
// //       { sender: 'customer', text: "It's (555) 123-4567. I ordered a 'Pro X' model two weeks ago." },
// //       { sender: 'agent', text: "Thank you for confirming. I see that your Pro X model is scheduled for delivery tomorrow, October 26th. Is there anything else I can assist you with regarding your delivery?" },
// //     ],
// //   },
// //   {
// //     id: 'complex-query',
// //     title: 'Complex Technical Query',
// //     script: [
// //       { sender: 'customer', text: "My API key for the high-fidelity voice model seems to be returning a 403 error, but only for requests originating from the Singapore region. What could be the issue?" },
// //       { sender: 'agent', text: "I understand that's frustrating. A 403 error often indicates an IP restriction or regional policy block. Can you please confirm the exact API endpoint you are hitting? I will cross-reference this with our regional access policies immediately." },
// //       { sender: 'customer', text: "The endpoint is `/v1/voices/hf/generate`. I've checked the firewall, and it's open." },
// //       { sender: 'agent', text: "Thank up. Based on that endpoint and region, it appears your account may require activation for that specific regional server cluster. I'm escalating this to Level 2 support and creating ticket #SF-9876. They will contact you via email within 5 minutes to resolve the server-side access." },
// //     ],
// //   },
// //   {
// //     id: 'soft-skill',
// //     title: 'Soft Skill & Empathy (Appointment Booking)',
// //     script: [
// //       { sender: 'customer', text: "I am having trouble rescheduling my doctor's appointment. The online system keeps crashing, and I really need a slot next week." },
// //       { sender: 'agent', text: "I'm so sorry to hear you're running into technical difficulties, that sounds very stressful. I can handle the rescheduling for you right here. What day next week works best for your appointment?" },
// //       { sender: 'customer', text: "I need to come in on Tuesday or Wednesday morning, before 11 AM." },
// //       { sender: 'agent', text: "Let me check those slots for you... I see an opening with Dr. Smith on Tuesday at 9:30 AM. Would you like me to book that for you?" },
// //     ],
// //   },
// // ];

// // // =================================================================
// // // ChatBubble Component
// // // =================================================================

// // const ChatBubble = ({ sender, text }) => {
// //   const isAgent = sender === 'agent';
// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 10 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.3 }}
// //       className={`max-w-[90%] sm:max-w-[80%] my-2 p-3 text-sm md:text-base rounded-xl shadow-lg ${
// //         isAgent 
// //           ? 'bg-rose-100 text-gray-900 self-start rounded-tl-none border border-rose-200' 
// //           : 'bg-gray-700 text-white self-end rounded-br-none border border-gray-600'
// //       }`}
// //     >
// //       {text}
// //     </motion.div>
// //   );
// // };


// // // =================================================================
// // // AgentShowcase Component (Default Export)
// // // =================================================================

// // const AgentShowcase = () => {
// //   const [activeCaseId, setActiveCaseId] = useState(useCases[0].id);
// //   const activeCase = useCases.find(c => c.id === activeCaseId);

// //   // Component for rendering the buttons
// //   const TabButton = ({ id, title }) => (
// //     <button
// //       onClick={() => setActiveCaseId(id)}
// //       className={`px-4 py-2 text-sm rounded-full transition-all duration-300 whitespace-nowrap 
// //         ${activeCaseId === id 
// //           ? 'bg-rose-600 text-white shadow-xl hover:bg-rose-700' 
// //           : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
// //         }
// //       `}
// //     >
// //       {title}
// //     </button>
// //   );

// //   return (
// //     <section id="showcase" className="bg-white py-16 px-4 md:px-8 font-sans">
// //       <div className="max-w-6xl mx-auto text-center">
// //         <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">AI Agent Showcase</h2>
// //         <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
// //           See real-world conversational flows between AI Agents and customers.
// //         </p>

// //         {/* Tab Navigation */}
// //         <div className="flex flex-wrap justify-center gap-2 mb-12">
// //           {useCases.map(c => (
// //             <TabButton key={c.id} id={c.id} title={c.title} />
// //           ))}
// //         </div>

// //         {/* Conversation Split View */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
// //           {/* Agent View */}
// //           <div className="p-4 md:p-6 rounded-2xl shadow-2xl bg-gray-900 border-2 border-rose-600/50">
// //             <h3 className="text-xl md:text-2xl font-semibold text-rose-400 mb-4 flex items-center justify-center space-x-2">
// //               <Bot className="h-5 w-5" />
// //               <span>Agent View</span>
// //             </h3>
// //             <div className="min-h-[350px] md:h-[420px] overflow-y-auto p-4 md:p-6 rounded-xl bg-gray-800 flex flex-col items-start border border-gray-700">
// //               {activeCase.script.map((message, index) => {
// //                 const isAgent = message.sender === 'agent';
                
// //                 // Only show agent messages on the Agent View side
// //                 return isAgent ? (
// //                   <ChatBubble key={index} sender={message.sender} text={message.text} />
// //                 ) : null;
// //               })}
// //             </div>
// //           </div>

// //           {/* Customer View */}
// //           <div className="p-4 md:p-6 rounded-2xl shadow-2xl bg-white border-2 border-gray-200">
// //             <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center space-x-2">
// //               {/* User Icon Added Here */}
// //               <User className="h-5 w-5 text-rose-600" /> 
// //               <span>Customer View</span>
// //             </h3>
// //             <div className="min-h-[350px] md:h-[420px] overflow-y-auto p-4 md:p-6 rounded-xl bg-gray-100 flex flex-col items-end border border-gray-300">
// //               {activeCase.script.map((message, index) => {
// //                 const isCustomer = message.sender === 'customer';
                
// //                 // Only show customer messages on the Customer View side
// //                 return isCustomer ? (
// //                   <ChatBubble key={index} sender={message.sender} text={message.text} />
// //                 ) : null;
// //               })}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default AgentShowcase;
// // // import React, { useState } from "react";
// // // import { motion } from "framer-motion";
// // // import { User, Bot } from "lucide-react";

// // // // =================================================================
// // // // Chat Data (User-Initiated Conversation)
// // // // =================================================================

// // // const useCases = [
// // //   {
// // //     id: 'sales',
// // //     title: 'Sales & Lead Nurturing',
// // //     script: [
// // //       { sender: 'customer', text: "Hello, I'm interested in the new AI Voice Platform. Can you tell me about the pricing tiers for small businesses?" },
// // //       { sender: 'agent', text: "Welcome! Our AI Voice Platform offers three tiers: Starter, Professional, and Enterprise. For small businesses, our Starter tier, at $49/month, is very popular. Would you like a quick overview of what it includes?" },
// // //       { sender: 'customer', text: "Yes, please. I'm mainly concerned with call volume and multi-language support." },
// // //       { sender: 'agent', text: "The Starter tier includes 5,000 minutes per month and supports our standard 10 languages. It's a great way to pilot the technology. For unlimited minutes or custom language models, we'd recommend Professional." },
// // //     ],
// // //   },
// // //   {
// // //     id: 'customer-service',
// // //     title: 'Customer Service Automation',
// // //     script: [
// // //       { sender: 'customer', text: "I need to check the status of my order, but I don't have the order number on hand. My name is Alex Chen." },
// // //       { sender: 'agent', text: "Thank you, Alex. I can look up your order using your name and phone number on file. To confirm your identity, can you please state the phone number associated with your account?" },
// // //       { sender: 'customer', text: "It's (555) 123-4567. I ordered a 'Pro X' model two weeks ago." },
// // //       { sender: 'agent', text: "Thank you for confirming. I see that your Pro X model is scheduled for delivery tomorrow, October 26th. Is there anything else I can assist you with regarding your delivery?" },
// // //     ],
// // //   },
// // //   {
// // //     id: 'complex-query',
// // //     title: 'Complex Technical Query',
// // //     script: [
// // //       { sender: 'customer', text: "My API key for the high-fidelity voice model seems to be returning a 403 error, but only for requests originating from the Singapore region. What could be the issue?" },
// // //       { sender: 'agent', text: "I understand that's frustrating. A 403 error often indicates an IP restriction or regional policy block. Can you please confirm the exact API endpoint you are hitting? I will cross-reference this with our regional access policies immediately." },
// // //       { sender: 'customer', text: "The endpoint is `/v1/voices/hf/generate`. I've checked the firewall, and it's open." },
// // //       { sender: 'agent', text: "Thank you. Based on that endpoint and region, it appears your account may require activation for that specific regional server cluster. I'm escalating this to Level 2 support and creating ticket #SF-9876. They will contact you via email within 5 minutes to resolve the server-side access." },
// // //     ],
// // //   },
// // //   {
// // //     id: 'soft-skill',
// // //     title: 'Soft Skill & Empathy (Appointment Booking)',
// // //     script: [
// // //       { sender: 'customer', text: "I am having trouble rescheduling my doctor's appointment. The online system keeps crashing, and I really need a slot next week." },
// // //       { sender: 'agent', text: "I'm so sorry to hear you're running into technical difficulties — that sounds stressful. I can handle the rescheduling for you right here. What day next week works best for your appointment?" },
// // //       { sender: 'customer', text: "I need to come in on Tuesday or Wednesday morning, before 11 AM." },
// // //       { sender: 'agent', text: "Let me check those slots for you... I see an opening with Dr. Smith on Tuesday at 9:30 AM. Would you like me to book that for you?" },
// // //     ],
// // //   },
// // // ];

// // // // =================================================================
// // // // ChatBubble Component
// // // // =================================================================

// // // const ChatBubble = ({ sender, text }) => {
// // //   const isAgent = sender === 'agent';
// // //   return (
// // //     <motion.div
// // //       initial={{ opacity: 0, y: 10 }}
// // //       animate={{ opacity: 1, y: 0 }}
// // //       transition={{ duration: 0.3 }}
// // //       className={`max-w-[90%] sm:max-w-[80%] my-2 p-3 text-sm md:text-base rounded-xl shadow-lg font-poppins ${
// // //         isAgent
// // //           ? 'bg-rose-100 text-gray-900 self-start rounded-tl-none border border-rose-200'
// // //           : 'bg-gray-700 text-white self-end rounded-br-none border border-gray-600'
// // //       }`}
// // //     >
// // //       {text}
// // //     </motion.div>
// // //   );
// // // };

// // // // =================================================================
// // // // AgentShowcase Component
// // // // =================================================================

// // // const AgentShowcase = () => {
// // //   const [activeCaseId, setActiveCaseId] = useState(useCases[0].id);
// // //   const activeCase = useCases.find((c) => c.id === activeCaseId);

// // //   const TabButton = ({ id, title }) => (
// // //     <button
// // //       onClick={() => setActiveCaseId(id)}
// // //       className={`px-5 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 font-poppins 
// // //         ${
// // //           activeCaseId === id
// // //             ? 'bg-rose-600 text-white shadow-lg hover:bg-rose-700'
// // //             : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
// // //         }`}
// // //     >
// // //       {title}
// // //     </button>
// // //   );

// // //   return (
// // //     <section id="showcase" className="bg-white py-24 px-4 md:px-8 font-poppins">
// // //       <div className="max-w-6xl mx-auto text-center">
// // //         <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
// // //           AI Agent Showcase
// // //         </h2>
// // //         <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-base md:text-lg">
// // //           Explore real-world conversations between AI Agents and customers.
// // //         </p>

// // //         {/* Tabs */}
// // //         <div className="flex flex-wrap justify-center gap-3 mb-16">
// // //           {useCases.map((c) => (
// // //             <TabButton key={c.id} id={c.id} title={c.title} />
// // //           ))}
// // //         </div>

// // //         {/* Two-Column Conversation View */}
// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
// // //           {/* Agent Side */}
// // //           <div className="p-6 md:p-8 rounded-2xl shadow-2xl bg-gray-900 border-2 border-rose-600/50">
// // //             <h3 className="text-2xl font-semibold text-rose-400 mb-5 flex items-center justify-center space-x-2">
// // //               <Bot className="h-5 w-5" />
// // //               <span>Agent View</span>
// // //             </h3>
// // //             <div className="min-h-[360px] md:h-[420px] overflow-y-auto p-4 md:p-6 rounded-xl bg-gray-800 flex flex-col items-start border border-gray-700">
// // //               {activeCase.script.map((msg, i) =>
// // //                 msg.sender === 'agent' ? (
// // //                   <ChatBubble key={i} sender={msg.sender} text={msg.text} />
// // //                 ) : null
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Customer Side */}
// // //           <div className="p-6 md:p-8 rounded-2xl shadow-2xl bg-white border-2 border-gray-200">
// // //             <h3 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center justify-center space-x-2">
// // //               <User className="h-5 w-5 text-rose-600" />
// // //               <span>Customer View</span>
// // //             </h3>
// // //             <div className="min-h-[360px] md:h-[420px] overflow-y-auto p-4 md:p-6 rounded-xl bg-gray-100 flex flex-col items-end border border-gray-300">
// // //               {activeCase.script.map((msg, i) =>
// // //                 msg.sender === 'customer' ? (
// // //                   <ChatBubble key={i} sender={msg.sender} text={msg.text} />
// // //                 ) : null
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default AgentShowcase;


// // import React, { useState } from "react";
// // import { motion } from "framer-motion";
// // import { User, Bot } from "lucide-react";

// // // =================================================================
// // // Chat Data (User-Initiated Conversation)
// // // =================================================================

// // const useCases = [
// //   {
// //     id: 'sales',
// //     title: 'Sales & Lead Nurturing',
// //     script: [
// //       { sender: 'customer', text: "Hello, I'm interested in the new AI Voice Platform. Can you tell me about the pricing tiers for small businesses?" },
// //       { sender: 'agent', text: "Welcome! Our AI Voice Platform offers three tiers: Starter, Professional, and Enterprise. For small businesses, our Starter tier, at $49/month, is very popular. Would you like a quick overview of what it includes?" },
// //       { sender: 'customer', text: "Yes, please. I'm mainly concerned with call volume and multi-language support." },
// //       { sender: 'agent', text: "The Starter tier includes 5,000 minutes per month and supports our standard 10 languages. It's a great way to pilot the technology. For unlimited minutes or custom language models, we'd recommend Professional." },
// //     ],
// //   },
// //   {
// //     id: 'customer-service',
// //     title: 'Customer Service Automation',
// //     script: [
// //       { sender: 'customer', text: "I need to check the status of my order, but I don't have the order number on hand. My name is Alex Chen." },
// //       { sender: 'agent', text: "Thank you, Alex. I can look up your order using your name and phone number on file. To confirm your identity, can you please state the phone number associated with your account?" },
// //       { sender: 'customer', text: "It's (555) 123-4567. I ordered a 'Pro X' model two weeks ago." },
// //       { sender: 'agent', text: "Thank you for confirming. I see that your Pro X model is scheduled for delivery tomorrow, October 26th. Is there anything else I can assist you with regarding your delivery?" },
// //     ],
// //   },
// //   {
// //     id: 'complex-query',
// //     title: 'Complex Technical Query',
// //     script: [
// //       { sender: 'customer', text: "My API key for the high-fidelity voice model seems to be returning a 403 error, but only for requests originating from the Singapore region. What could be the issue?" },
// //       { sender: 'agent', text: "I understand that's frustrating. A 403 error often indicates an IP restriction or regional policy block. Can you please confirm the exact API endpoint you are hitting? I will cross-reference this with our regional access policies immediately." },
// //       { sender: 'customer', text: "The endpoint is `/v1/voices/hf/generate`. I've checked the firewall, and it's open." },
// //       { sender: 'agent', text: "Thank you. Based on that endpoint and region, it appears your account may require activation for that specific regional server cluster. I'm escalating this to Level 2 support and creating ticket #SF-9876. They will contact you via email within 5 minutes to resolve the server-side access." },
// //     ],
// //   },
// //   {
// //     id: 'soft-skill',
// //     title: 'Appointment Booking',
// //     script: [
// //       { sender: 'customer', text: "I am having trouble rescheduling my doctor's appointment. The online system keeps crashing, and I really need a slot next week." },
// //       { sender: 'agent', text: "I'm so sorry to hear you're running into technical difficulties — that sounds stressful. I can handle the rescheduling for you right here. What day next week works best for your appointment?" },
// //       { sender: 'customer', text: "I need to come in on Tuesday or Wednesday morning, before 11 AM." },
// //       { sender: 'agent', text: "Let me check those slots for you... I see an opening with Dr. Smith on Tuesday at 9:30 AM. Would you like me to book that for you?" },
// //     ],
// //   },
// // ];

// // // =================================================================
// // // ChatBubble Component
// // // =================================================================

// // const ChatBubble = ({ sender, text }) => {
// //   const isAgent = sender === 'agent';
// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 10 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.3 }}
// //       className={`max-w-[90%] sm:max-w-[80%] my-2 p-3 text-sm md:text-base rounded-xl shadow-md font-poppins ${
// //         isAgent
// //           ? 'bg-[#1F1F1F] text-white self-start rounded-tl-none border border-[#FF1E1E]/40'
// //           : 'bg-[#FF1E1E] text-white self-end rounded-br-none border border-[#FF1E1E]'
// //       }`}
// //     >
// //       {text}
// //     </motion.div>
// //   );
// // };

// // // =================================================================
// // // AgentShowcase Component
// // // =================================================================

// // const AgentShowcase = () => {
// //   const [activeCaseId, setActiveCaseId] = useState(useCases[0].id);
// //   const activeCase = useCases.find((c) => c.id === activeCaseId);

// //   const TabButton = ({ id, title }) => (
// //     <button
// //       onClick={() => setActiveCaseId(id)}
// //       className={`px-5 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 font-poppins ${
// //         activeCaseId === id
// //           ? 'bg-[#FF1E1E] text-white shadow-[0_0_20px_rgba(255,30,30,0.5)]'
// //           : 'bg-[#1A1A1A] text-gray-300 border border-[#2C2C2C] hover:bg-[#2A2A2A]'
// //       }`}
// //     >
// //       {title}
// //     </button>
// //   );

// //   return (
// //     <section id="showcase" className="relative py-24 px-4 md:px-8 bg-[#0A0A0A] font-poppins overflow-hidden">
// //       {/* Background Glow */}
// //       <motion.div
// //         className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-[#FF1E1E]/10 blur-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
// //         animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
// //         transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
// //       />

// //       <div className="max-w-6xl mx-auto text-center relative z-10">
// //         <h2 className="text-4xl md:text-5xl text-white mb-4 drop-shadow-[0_0_10px_rgba(255,30,30,0.4)]">
// //           AI Agent Showcase
// //         </h2>
// //         <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-base md:text-lg">
// //           Explore real-world conversations between AI Agents and customers.
// //         </p>

// //         {/* Tabs */}
// //         <div className="flex flex-wrap justify-center gap-3 mb-16">
// //           {useCases.map((c) => (
// //             <TabButton key={c.id} id={c.id} title={c.title} />
// //           ))}
// //         </div>

// //         {/* Two-Column Conversation View */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
// //           {/* Agent Side */}
// //           <div className="p-6 md:p-8 rounded-2xl shadow-[0_0_25px_rgba(255,30,30,0.1)] bg-[#141414] border border-[#2A2A2A]">
// //             <h3 className="text-2xl font-semibold text-[#FF1E1E] mb-5 flex items-center justify-center space-x-2">
// //               <Bot className="h-5 w-5" />
// //               <span>Agent View</span>
// //             </h3>
// //             <div className="min-h-[360px] md:h-[420px]  p-4 md:p-6 rounded-xl bg-[#1A1A1A] flex flex-col items-start border border-[#2C2C2C]">
// //               {activeCase.script.map(
// //                 (msg, i) =>
// //                   msg.sender === 'agent' && (
// //                     <ChatBubble key={i} sender={msg.sender} text={msg.text} />
// //                   )
// //               )}
// //             </div>
// //           </div>

// //           {/* Customer Side */}
// //           <div className="p-6 md:p-8 rounded-2xl shadow-[0_0_25px_rgba(255,30,30,0.08)] bg-[#141414] border border-[#2A2A2A]">
// //             <h3 className="text-2xl font-semibold text-white mb-5 flex items-center justify-center space-x-2">
// //               <User className="h-5 w-5 text-[#FF1E1E]" />
// //               <span>Customer View</span>
// //             </h3>
// //             <div className="min-h-[360px] md:h-[420px] overflow-y-auto p-4 md:p-6 rounded-xl bg-[#1A1A1A] flex flex-col items-end border border-[#2C2C2C]">
// //               {activeCase.script.map(
// //                 (msg, i) =>
// //                   msg.sender === 'customer' && (
// //                     <ChatBubble key={i} sender={msg.sender} text={msg.text} />
// //                   )
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default AgentShowcase;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

// =================================================================
// Chat Data (User-Initiated Conversation)
// =================================================================

const useCases = [
  {
    id: 'sales',
    title: 'Sales & Lead Nurturing',
    script: [
      { sender: 'customer', text: "Hello, I'm interested in the new AI Voice Platform. Can you tell me about the pricing tiers for small businesses?" },
      { sender: 'agent', text: "Welcome! Our AI Voice Platform offers three tiers: Starter, Professional, and Enterprise. For small businesses, our Starter tier, at $49/month, is very popular. Would you like a quick overview of what it includes?" },
      { sender: 'customer', text: "Yes, please. I'm mainly concerned with call volume and multi-language support." },
      { sender: 'agent', text: "The Starter tier includes 5,000 minutes per month and supports our standard 10 languages. It's a great way to pilot the technology. For unlimited minutes or custom language models, we'd recommend Professional." },
    ],
  },
  {
    id: 'customer-service',
    title: 'Customer Service Automation',
    script: [
      { sender: 'customer', text: "I need to check the status of my order, but I don't have the order number on hand. My name is Alex Chen." },
      { sender: 'agent', text: "Thank you, Alex. I can look up your order using your name and phone number on file. To confirm your identity, can you please state the phone number associated with your account?" },
      { sender: 'customer', text: "It's (555) 123-4567. I ordered a 'Pro X' model two weeks ago." }, // Corrected sender for this message
      { sender: 'agent', text: "Thank you for confirming. I see that your Pro X model is scheduled for delivery tomorrow, October 26th. Is there anything else I can assist you with regarding your delivery?" },
    ],
  },
  {
    id: 'complex-query',
    title: 'Complex Technical Query',
    script: [
      { sender: 'customer', text: "My API key for the high-fidelity voice model seems to be returning a 403 error, but only for requests originating from the Singapore region. What could be the issue?" },
      { sender: 'agent', text: "I understand that's frustrating. A 403 error often indicates an IP restriction or regional policy block. Can you please confirm the exact API endpoint you are hitting? I will cross-reference this with our regional access policies immediately." },
      { sender: 'customer', text: "The endpoint is `/v1/voices/hf/generate`. I've checked the firewall, and it's open." },
      { sender: 'agent', text: "Thank as you. Based on that endpoint and region, it appears your account may require activation for that specific regional server cluster. I'm escalating this to Level 2 support and creating ticket #SF-9876. They will contact you via email within 5 minutes to resolve the server-side access." },
    ],
  },
  {
    id: 'soft-skill',
    title: 'Appointment Booking',
    script: [
      { sender: 'customer', text: "I am having trouble rescheduling my doctor's appointment. The online system keeps crashing, and I really need a slot next week." },
      { sender: 'agent', text: "I'm so sorry to hear you're running into technical difficulties — that sounds stressful. I can handle the rescheduling for you right here. What day next week works best for your appointment?" },
      { sender: 'customer', text: "I need to come in on Tuesday or Wednesday morning, before 11 AM." },
      { sender: 'agent', text: "Let me check those slots for you... I see an opening with Dr. Smith on Tuesday at 9:30 AM. Would you like me to book that for you?" },
    ],
  },
];

// =================================================================
// ChatBubble Component (Updated for consistent icon display and alignment)
// =================================================================

const ChatBubble = ({ sender, text }) => {
  const isAgent = sender === 'agent';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start my-2 ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
         {isAgent && <Bot className="h-6 w-6 text-[#FF1E1E] mr-2 flex-shrink-0 mt-2" />} {/* Agent icon */}
       <div
        className={`max-w-[85%] sm:max-w-[70%] p-3 text-sm md:text-base rounded-xl shadow-md font-poppins relative group ${
          isAgent
            ? 'bg-[#1F1F1F] text-white rounded-tl-none border border-[#FF1E1E]/40'
            : 'bg-[#FF1E1E] text-white rounded-br-none border border-[#FF1E1E]'
        }`}
      >
        {text}
      </div>
   
       {!isAgent && <User className="h-6 w-6 text-[#FF1E1E] ml-2 flex-shrink-0 mt-2" />} {/* Customer icon */}
     
     
    </motion.div>
  );
};

// =================================================================
// AgentShowcase Component
// =================================================================

const AgentShowcase = () => {
  const [activeCaseId, setActiveCaseId] = useState(useCases[0].id);
  const activeCase = useCases.find((c) => c.id === activeCaseId);

  const TabButton = ({ id, title }) => (
    <button
      onClick={() => setActiveCaseId(id)}
      className={`px-5 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 font-poppins ${
        activeCaseId === id
          ? 'bg-[#FF1E1E] text-white shadow-[0_0_20px_rgba(255,30,30,0.5)]'
          : 'bg-[#1A1A1A] text-gray-300 border border-[#2C2C2C] hover:bg-[#2A2A2A]'
      }`}
    >
      {title}
    </button>
  );

  return (
    <section id="showcase" className="relative py-24 px-4 md:px-8 bg-[#0A0A0A] font-poppins overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-[#FF1E1E]/10 blur-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl text-white mb-4 drop-shadow-[0_0_10px_rgba(255,30,30,0.4)]">
          AI Agent Showcase
        </h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-base md:text-lg">
         Explore real-world conversations between AI Agents and customers.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 w-max mx-auto overflow-x-auto">
          {useCases.map((c) => (
            <TabButton key={c.id} id={c.id} title={c.title} />
          ))}
        </div>

        {/* Single Chat Panel */}
        <div className="p-6 md:p-8 rounded-2xl shadow-[0_0_25px_rgba(255,30,30,0.1)] bg-[#141414] border border-[#2A2A2A] mx-auto max-w-2xl ">
          <h3 className="text-2xl font-semibold text-[#FF1E1E] mb-5 flex items-center justify-center space-x-2">
            <Bot className="h-6 w-6" />
            <span>Conversation Flow</span>
          </h3>
          <div className="no-scrollbar min-h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 rounded-xl bg-[#4A4A4A] flex flex-col space-y-3 border border-[#2C2C2C] scrollbar-hide">
            {activeCase.script.map((msg, i) => (
              <ChatBubble key={i} sender={msg.sender} text={msg.text} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentShowcase;