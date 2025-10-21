
// // import { useState } from "react"
// // import { useTranslation } from "react-i18next"
// // import { motion } from "framer-motion"
// // import { CheckCircle, Star } from "lucide-react"

// // const plans = [
// //   {
// //     key: 'starter',
// //     monthlyPrice: '$29',
// //     yearlyPrice: '$29',
// //     period: '/mo',
// //     minutes: '50',
// //     concurrentCalls: '5',
// //     workflows: 'Unlimited',
// //     features: [
// //       'Voice API, LLM, transcriber costs',
// //       'Unlimited Assistants',
// //       'API & Integrations',
// //       'Real-Time Booking, Human Transfer & More Actions',
// //       'Voice AI Courses & Community Support',
// //     ],
// //     cta: 'subscribe',
// //   },
// //   {
// //     key: 'pro',
// //     monthlyPrice: '$450',
// //     yearlyPrice: '$375',
// //     period: '/mo',
// //     minutes: '2,000 mins, then $0.13/min',
// //     concurrentCalls: '25',
// //     workflows: '8,000',
// //     features: [
// //       'Everything in Starter',
// //       'Workflow Builder',
// //       'Team Access',
// //       'Support via Ticketing',
// //     ],
// //     cta: 'tryFree',
// //   },
// //   {
// //     key: 'growth',
// //     monthlyPrice: '$900',
// //     yearlyPrice: '$750',
// //     period: '/mo',
// //     minutes: '4,000 mins, then $0.12/min',
// //     concurrentCalls: '50',
// //     workflows: '42,000',
// //     features: [
// //       'Everything in Pro',
// //       '25 Subaccounts',
// //       'Rebilling',
// //       'Access to New Features',
// //       'Support via Ticketing',
// //     ],
// //     cta: 'tryFree',
// //   },
// //   {
// //     key: 'agency',
// //     monthlyPrice: '$1,400',
// //     yearlyPrice: '$1,250',
// //     period: '/mo',
// //     minutes: '6,000 mins, then $0.12/min',
// //     concurrentCalls: '80',
// //     workflows: '100,000',
// //     features: [
// //       'Everything in Growth',
// //       'Unlimited Subaccounts',
// //       'White Label Platform',
// //       '30-Day Onboarding & Private Slack Channel',
// //       'Support via Ticketing',
// //     ],
// //     cta: 'tryFree',
// //   },
// //   {
// //     key: 'enterprise',
// //     monthlyPrice: 'Custom',
// //     yearlyPrice: 'Custom',
// //     period: '',
// //     minutes: 'Volume-based Price, as low as $0.08/min',
// //     concurrentCalls: '200+',
// //     workflows: 'Custom',
// //     features: [
// //       'SIP Trunk Integration',
// //       'Guaranteed Uptime (SLA)',
// //       'Custom Integrations',
// //       'Compliance (SOC2, HIPAA, GDPR)',
// //       'Solution Architect',
// //       'Enterprise Onboarding, Training, Support',
// //     ],
// //     cta: 'contact',
// //   },
// // ]

// // const introPlans = [
// //   {
// //     key: 'pro',
// //     minutes: '2,000',
// //     workflows: '8,000',
// //     concurrentCalls: '25',
// //     features: ['Workflow Builder', 'Team Access', 'Support via Ticketing'],
// //     costs: ['$0.002/workflow', '$7/concurrent call', '$0.13/min', '$0 Total cost/mo'],
// //   },
// //   {
// //     key: 'growth',
// //     minutes: '4,000',
// //     workflows: '42,000',
// //     concurrentCalls: '50',
// //     features: ['25 Subaccounts', 'Rebilling'],
// //     costs: ['$0.002/workflow', '$7/concurrent call', '$0.12/min', '$0 Total cost/mo'],
// //     discount: '10% Discount',
// //   },
// //   {
// //     key: 'agency',
// //     minutes: '6,000',
// //     workflows: '100,000',
// //     concurrentCalls: '80',
// //     features: ['Unlimited Subaccounts', 'White Label Platform', '30-Days Onboarding'],
// //     costs: ['$0.002/workflow', '$7/concurrent call', '$0.12/min', '$0 Total cost/mo'],
// //     discount: '18% Discount',
// //   },
// //   {
// //     key: 'enterprise',
// //     minutes: 'Custom',
// //     workflows: 'Custom',
// //     concurrentCalls: 'Custom',
// //     features: ['SIP Trunking Integration', 'Guaranteed Uptime (SLA)', 'Solution Architect', 'Enterprise Support', 'Custom Workflows & Concurrent Calls'],
// //     costs: ['As low as $0.08/min'],
// //   },
// // ]

// // const compareFeatures = [
// //   {
// //     category: 'Costs Structure',
// //     items: [
// //       { key: 'minutesIncluded', label: 'Minutes Included', values: ['50', '2,000', '4,000', '6,000', 'Custom'] },
// //       { key: 'extraMinute', label: 'Extra Minute', values: ['', '$0.13', '$0.12', '$0.12', 'Custom'] },
// //       { key: 'conversationalVoice', label: 'Conversational Voice Engine API', values: [true, true, true, true, true] },
// //       { key: 'llmAgent', label: 'LLM Agent', values: [true, true, true, true, true] },
// //       { key: 'transcriber', label: 'Transcriber', values: [true, true, true, true, true] },
// //       { key: 'concurrentCalls', label: 'Concurrent Calls', values: ['5', '25', '50', '80', 'Custom'] },
// //       { key: 'extraCall', label: 'Extra Concurrent Call', values: ['', '$7/call', '$7/call', '$7/call', 'Custom'] },
// //       { key: 'phoneNumber', label: 'New Phone Number', values: ['$1.50', '$1.50', '$1.50', '$1.50', 'Included'] },
// //       { key: 'boostedQueuing', label: 'Boosted Queuing for Calls', values: ['', '$500/mo', '$500/mo', '$500/mo', ''] },
// //     ],
// //   },
// //   {
// //     category: 'Core Capabilities',
// //     items: [
// //       { key: 'unlimitedAssistants', label: 'Unlimited Assistants', values: [true, true, true, true, true] },
// //       { key: 'multilanguage', label: 'Multi-language', values: [true, true, true, true, true] },
// //       { key: 'rebilling', label: 'Rebilling', values: [false, false, true, true, true] },
// //       { key: 'batchCampaigns', label: 'Batch Campaigns', values: [false, true, true, true, true] },
// //       { key: 'teamMembers', label: 'Invite Team Members', values: [false, true, true, true, true] },
// //       { key: 'customWorkflows', label: 'Custom Workflows Included', values: ['', '8,000', '42,000', '100,000', 'Custom'] },
// //       { key: 'extraWorkflow', label: 'Extra Workflow', values: ['', '$0.002', '$0.002', '$0.002', 'Custom'] },
// //       { key: 'sendSMS', label: 'Send SMS', values: [true, true, true, true, true] },
// //       { key: 'realTimeBooking', label: 'Real-time Booking', values: [true, true, true, true, true] },
// //       { key: 'callTransfer', label: 'Call Transfer', values: [true, true, true, true, true] },
// //       { key: 'infoExtractor', label: 'Information Extractor', values: [true, true, true, true, true] },
// //       { key: 'customActions', label: 'Custom Actions', values: [true, true, true, true, true] },
// //       { key: 'whiteLabel', label: 'White Label Platform', values: [false, false, false, true, true] },
// //       { key: 'subaccounts', label: 'Subaccounts', values: ['', '', '25', 'Unlimited', 'Unlimited'] },
// //     ],
// //   },
// //   {
// //     category: 'Integrations',
// //     items: [
// //       { key: 'restAPI', label: 'Rest API', values: [true, true, true, true, true] },
// //       { key: 'existingIntegrations', label: 'All Existing Integrations', values: [true, true, true, true, true] },
// //       { key: 'customIntegrations', label: 'Custom Integrations', values: [false, false, false, false, true] },
// //       { key: 'sipTrunk', label: 'SIP Trunk Integrations', values: [false, false, false, false, true] },
// //     ],
// //   },
// //   {
// //     category: 'Support',
// //     items: [
// //       { key: 'synthflowAcademy', label: 'Synthflow Academy', values: [true, true, true, true, true] },
// //       { key: 'ticketingSupport', label: 'Support via Ticketing System', values: [true, true, true, true, true] },
// //       { key: 'onboardingSlack', label: '30-day Onboarding via Private Slack', values: [false, false, false, true, true] },
// //       { key: 'dedicatedSupport', label: 'Dedicated Support & Slack Channel', values: [false, false, false, '$1,200/mo', '$1,200/mo'] },
// //       { key: 'earlyAccess', label: 'Early Access to New Features', values: [false, false, true, true, true] },
// //       { key: 'solutionArchitect', label: 'Solution Architect', values: [false, false, false, false, true] },
// //     ],
// //   },
// //   {
// //     category: 'Compliance',
// //     items: [
// //       { key: 'uptimeSLA', label: 'Guaranteed Uptime (SLA)', values: [false, false, false, false, true] },
// //       { key: 'hipaa', label: 'HIPAA', values: [false, false, false, false, true] },
// //       { key: 'soc2', label: 'SOC2 Security', values: [false, false, false, false, true] },
// //       { key: 'gdpr', label: 'GDPR', values: [false, false, false, false, true] },
// //     ],
// //   },
// // ]

// // const reviews = [
// //   {
// //     name: 'Andre F.',
// //     title: 'Business Owner',
// //     quote: 'reviews.andre',
// //     stars: 5,
// //   },
// //   {
// //     name: 'Marco B.',
// //     title: 'Business Owner',
// //     quote: 'reviews.marco',
// //     stars: 5,
// //   },
// //   {
// //     name: 'Sadeeke M.',
// //     title: 'CEO',
// //     quote: 'reviews.sadeeke',
// //     stars: 5,
// //   },
// // ]

// // const Pricing = ({ id }) => {
// //   const { t } = useTranslation()
// //   const [isYearly, setIsYearly] = useState(false)
// //   const [selectedPlan, setSelectedPlan] = useState(0)

// //   const handleStripeCheckout = (plan) => {
// //     console.log(`Initiating Stripe checkout for ${plan} plan`) // Mock Stripe integration
// //   }

// //   return (
// //     <section id={id} className="py-16 bg-gray-50 relative z-10">
// //       <div className="max-w-7xl mx-auto px-4">
// //         {/* Intro Section */}
// //         <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
// //           {t('pricing.introTitle')}
// //         </h2>
// //         <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
// //           {t('pricing.introSubheading')}
// //         </p>
// //         <p className="text-lg text-gray-700 text-center mb-8">{t('pricing.minutesQuestion')}</p>
// //         <input
// //           type="range"
// //           min="0"
// //           max={introPlans.length - 1}
// //           value={selectedPlan}
// //           onChange={(e) => setSelectedPlan(parseInt(e.target.value))}
// //           className="w-full max-w-md mx-auto mb-12"
// //           aria-label={t('pricing.selectTier')}
// //         />
// //         <motion.div
// //           initial={{ opacity: 0, y: 50 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.5 }}
// //           className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-12"
// //         >
// //           <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(`pricing.${introPlans[selectedPlan].key}`)}</h3>
// //           <p className="text-gray-700 mb-2">{introPlans[selectedPlan].minutes} min</p>
// //           <p className="text-gray-700 mb-2">{introPlans[selectedPlan].workflows} Workflows</p>
// //           <p className="text-gray-700 mb-4">{introPlans[selectedPlan].concurrentCalls} Concurrent Calls</p>
// //           <ul className="space-y-3 mb-4">
// //             {introPlans[selectedPlan].features.map((feature, idx) => (
// //               <li key={idx} className="flex items-center text-gray-700">
// //                 <CheckCircle className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
// //                 {feature}
// //               </li>
// //             ))}
// //           </ul>
// //           {introPlans[selectedPlan].discount && (
// //             <p className="text-green-600 font-semibold mb-4">{introPlans[selectedPlan].discount}</p>
// //           )}
// //           <ul className="space-y-3 mb-6">
// //             {introPlans[selectedPlan].costs.map((cost, idx) => (
// //               <li key={idx} className="text-gray-700">{cost}</li>
// //             ))}
// //           </ul>
// //         </motion.div>

// //         {/* Pricing Cards */}
// //         <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
// //           {t('pricing.title')}
// //         </h2>
// //         <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
// //           {t('pricing.subheading')}
// //         </p>
// //         <div className="flex justify-center mb-12">
// //           <div className="inline-flex rounded-full bg-gray-200 p-1">
// //             <button
// //               onClick={() => setIsYearly(false)}
// //               className={`px-4 py-2 rounded-full text-sm font-semibold ${!isYearly ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
// //               aria-label={t('pricing.monthly')}
// //             >
// //               {t('pricing.monthly')}
// //             </button>
// //             <button
// //               onClick={() => setIsYearly(true)}
// //               className={`px-4 py-2 rounded-full text-sm font-semibold ${isYearly ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
// //               aria-label={t('pricing.yearly')}
// //             >
// //               {t('pricing.yearly')}
// //             </button>
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
// //           {plans.map((plan, index) => (
// //             <motion.div
// //               key={plan.key}
// //               initial={{ opacity: 0, y: 50 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.5, delay: index * 0.1 }}
// //               className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200"
// //             >
// //               <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(`pricing.${plan.key}`)}</h3>
// //               <p className="text-3xl font-semibold text-gray-900 mb-4">
// //                 {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
// //                 <span className="text-lg font-normal text-gray-500">{plan.period}</span>
// //               </p>
// //               <p className="text-gray-700 mb-4">{plan.minutes}</p>
// //               <p className="text-gray-700 mb-4">{plan.concurrentCalls} Concurrent Calls</p>
// //               <p className="text-gray-700 mb-4">{plan.workflows} Workflows</p>
// //               {plan.key === 'growth' && isYearly && (
// //                 <p className="text-green-600 font-semibold mb-4">10% Discount</p>
// //               )}
// //               {plan.key === 'agency' && isYearly && (
// //                 <p className="text-green-600 font-semibold mb-4">18% Discount</p>
// //               )}
// //               <ul className="space-y-3 mb-6">
// //                 {plan.features.map((feature, idx) => (
// //                   <li key={idx} className="flex items-center text-gray-700">
// //                     <CheckCircle className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
// //                     {feature}
// //                   </li>
// //                 ))}
// //               </ul>
// //               <button
// //                 onClick={() => handleStripeCheckout(plan.key)}
// //                 className={`w-full py-3 rounded-full font-semibold ${
// //                   plan.cta === 'contact'
// //                     ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
// //                     : 'bg-blue-600 text-white hover:bg-blue-700'
// //                 }`}
// //                 aria-label={t(`pricing.${plan.cta}`)}
// //               >
// //                 {t(`pricing.${plan.cta}`)}
// //               </button>
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Compare Plans Table */}
// //         <div className="mb-16">
// //           <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
// //             {t('pricing.compareTitle')}
// //           </h3>
// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr>
// //                   <th className="p-4 text-left text-gray-900 font-semibold"></th>
// //                   {plans.map((plan) => (
// //                     <th key={plan.key} className="p-4 text-center text-gray-900 font-semibold">
// //                       {t(`pricing.${plan.key}`)}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {compareFeatures.map((category, catIdx) => (
// //                   <>
// //                     <tr key={catIdx} className="border-t border-gray-200">
// //                       <td className="p-4 bg-blue-50 text-gray-900 font-semibold">{category.category}</td>
// //                       {plans.map((_, planIdx) => (
// //                         <td key={planIdx} className="p-4"></td>
// //                       ))}
// //                     </tr>
// //                     {category.items.map((item, itemIdx) => (
// //                       <tr key={`${catIdx}-${itemIdx}`} className="border-t border-gray-200">
// //                         <td className="p-4 text-gray-700">{item.label}</td>
// //                         {item.values.map((value, valIdx) => (
// //                           <td key={valIdx} className="p-4 text-center text-gray-700">
// //                             {typeof value === 'boolean' ? (
// //                               value ? (
// //                                 <CheckCircle className="h-5 w-5 text-green-600 mx-auto" aria-hidden="true" />
// //                               ) : (
// //                                 ''
// //                               )
// //                             ) : (
// //                               value
// //                             )}
// //                           </td>
// //                         ))}
// //                       </tr>
// //                     ))}
// //                   </>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* Enterprise Section */}
// //         <div className="py-16 bg-white rounded-lg shadow-lg mb-16">
// //           <div className="max-w-4xl mx-auto px-4">
// //             <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
// //               {t('pricing.enterpriseTitle')}
// //             </h3>
// //             <p className="text-lg text-gray-700 text-center mb-8">
// //               {t('pricing.enterpriseSubheading')}
// //             </p>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               <div>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterprisePricing')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterprisePricingDesc')}</p>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterpriseIntegrations')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterpriseIntegrationsDesc')}</p>
// //               </div>
// //               <div>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterpriseCompliance')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterpriseComplianceDesc')}</p>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterpriseSupport')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterpriseSupportDesc')}</p>
// //               </div>
// //             </div>
// //             <div className="text-center">
// //               <button
// //                 onClick={() => handleStripeCheckout('enterprise')}
// //                 className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
// //                 aria-label={t('pricing.contact')}
// //               >
// //                 {t('pricing.contact')}
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Reviews Section */}
// //         <div className="mb-16">
// //           <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
// //             {t('pricing.reviewsTitle')}
// //           </h3>
// //           <p className="text-lg text-gray-700 text-center mb-8">{t('pricing.reviewsSubheading')}</p>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             {reviews.map((review, index) => (
// //               <motion.div
// //                 key={index}
// //                 initial={{ opacity: 0, y: 50 }}
// //                 whileInView={{ opacity: 1, y: 0 }}
// //                 viewport={{ once: true }}
// //                 transition={{ duration: 0.5, delay: index * 0.1 }}
// //                 className="p-6 bg-white rounded-lg shadow-lg"
// //               >
// //                 <div className="flex mb-4">
// //                   {[...Array(review.stars)].map((_, i) => (
// //                     <Star key={i} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
// //                   ))}
// //                 </div>
// //                 <p className="text-gray-700 mb-4">"{t(review.quote)}"</p>
// //                 <p className="font-semibold text-blue-600">{review.name}</p>
// //                 <p className="text-gray-500 text-sm">{review.title}</p>
// //               </motion.div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Tailored Demo Section */}
// //         <div className="py-16 bg-blue-50 rounded-lg">
// //           <div className="max-w-4xl mx-auto px-4 text-center">
// //             <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('pricing.demoTitle')}</h3>
// //             <p className="text-lg text-gray-700 mb-8">{t('pricing.demoSubheading')}</p>
// //             <button
// //               onClick={() => handleStripeCheckout('demo')}
// //               className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
// //               aria-label={t('pricing.contact')}
// //             >
// //               {t('pricing.contact')}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default Pricing


// // import { useState } from "react"
// // import { useTranslation } from "react-i18next"
// // import { motion } from "framer-motion"
// // import { CheckCircle, Star } from "lucide-react"

// // const plans = [
// //   {
// //     key: 'starter',
// //     monthlyPrice: '$29',
// //     yearlyPrice: '$29',
// //     period: '/mo',
// //     minutes: '50',
// //     concurrentCalls: '5',
// //     workflows: 'Unlimited',
// //     features: [
// //       'Voice API, LLM, transcriber costs',
// //       'Unlimited Assistants',
// //       'API & Integrations',
// //       'Real-Time Booking, Human Transfer & More Actions',
// //       'Voice AI Courses & Community Support',
// //     ],
// //     cta: 'subscribe',
// //   },
// //   {
// //     key: 'pro',
// //     monthlyPrice: '$375',
// //     yearlyPrice: '$375',
// //     period: '/mo',
// //     minutes: '2,000 mins, then $0.13/min',
// //     concurrentCalls: '25',
// //     workflows: '8,000',
// //     features: [
// //       'Everything in Starter',
// //       'Workflow Builder',
// //       'Team Access',
// //       'Support via Ticketing',
// //     ],
// //     cta: 'tryFree',
// //   },
// //   // {
// //   //   key: 'growth',
// //   //   monthlyPrice: '$900',
// //   //   yearlyPrice: '$750',
// //   //   period: '/mo',
// //   //   minutes: '4,000 mins, then $0.12/min',
// //   //   concurrentCalls: '50',
// //   //   workflows: '42,000',
// //   //   features: [
// //   //     'Everything in Pro',
// //   //     '25 Subaccounts',
// //   //     'Rebilling',
// //   //     'Access to New Features',
// //   //     'Support via Ticketing',
// //   //   ],
// //   //   cta: 'tryFree',
// //   // },
// //   // {
// //   //   key: 'agency',
// //   //   monthlyPrice: '$1,400',
// //   //   yearlyPrice: '$1,250',
// //   //   period: '/mo',
// //   //   minutes: '6,000 mins, then $0.12/min',
// //   //   concurrentCalls: '80',
// //   //   workflows: '100,000',
// //   //   features: [
// //   //     'Everything in Growth',
// //   //     'Unlimited Subaccounts',
// //   //     'White Label Platform',
// //   //     '30-Day Onboarding & Private Slack Channel',
// //   //     'Support via Ticketing',
// //   //   ],
// //   //   cta: 'tryFree',
// //   // },
// //   {
// //     key: 'enterprise',
// //     monthlyPrice: 'Custom',
// //     yearlyPrice: 'Custom',
// //     period: '',
// //     minutes: 'Volume-based Price, as low as $0.08/min',
// //     concurrentCalls: '200+',
// //     workflows: 'Custom',
// //     features: [
// //       'SIP Trunk Integration',
// //       'Guaranteed Uptime (SLA)',
// //       'Custom Integrations',
// //       'Compliance (SOC2, HIPAA, GDPR)',
// //       'Solution Architect',
// //       'Enterprise Onboarding, Training, Support',
// //     ],
// //     cta: 'contact',
// //   },
// // ]

// // const introPlans = [
// //   {
// //     key: 'pro',
// //     minutes: '2,000',
// //     workflows: '8,000',
// //     concurrentCalls: '25',
// //     features: ['Workflow Builder', 'Team Access', 'Support via Ticketing'],
// //     costs: ['$0.002/workflow', '$7/concurrent call', '$0.13/min', '$0 Total cost/mo'],
// //   },
// //   {
// //     key: 'growth',
// //     minutes: '4,000',
// //     workflows: '42,000',
// //     concurrentCalls: '50',
// //     features: ['25 Subaccounts', 'Rebilling'],
// //     costs: ['$0.002/workflow', '$7/concurrent call', '$0.12/min', '$0 Total cost/mo'],
// //     discount: '10% Discount',
// //   },
// //   {
// //     key: 'agency',
// //     minutes: '6,000',
// //     workflows: '100,000',
// //     concurrentCalls: '80',
// //     features: ['Unlimited Subaccounts', 'White Label Platform', '30-Days Onboarding'],
// //     costs: ['$0.002/workflow', '$7/concurrent call', '$0.12/min', '$0 Total cost/mo'],
// //     discount: '18% Discount',
// //   },
// //   {
// //     key: 'enterprise',
// //     minutes: 'Custom',
// //     workflows: 'Custom',
// //     concurrentCalls: 'Custom',
// //     features: [
// //       'SIP Trunking Integration',
// //       'Guaranteed Uptime (SLA)',
// //       'Solution Architect',
// //       'Enterprise Support',
// //       'Custom Workflows & Concurrent Calls',
// //     ],
// //     costs: ['As low as $0.08/min'],
// //     bundle: [
// //       'No-code builder, custom workflows & actions',
// //       'Tested voices in 30+ languages',
// //       'OpenAI GPT 4o-based, finetuned for conversations & low latency',
// //       'Deepgram-based, speech-to-text transcription of calls',
// //       'Included for numbers bought via Synthflow',
// //     ],
// //   },
// // ]

// // const compareFeatures = [
// //   {
// //     category: 'Costs Structure',
// //     items: [
// //       { key: 'minutesIncluded', label: 'Minutes Included', values: ['50', '2,000', '4,000', '6,000', 'Custom'] },
// //       { key: 'extraMinute', label: 'Extra Minute', values: ['', '$0.13', '$0.12', '$0.12', 'Custom'] },
// //       { key: 'conversationalVoice', label: 'Conversational Voice Engine API', values: [true, true, true, true, true] },
// //       { key: 'llmAgent', label: 'LLM Agent', values: [true, true, true, true, true] },
// //       { key: 'transcriber', label: 'Transcriber', values: [true, true, true, true, true] },
// //       { key: 'concurrentCalls', label: 'Concurrent Calls', values: ['5', '25', '50', '80', 'Custom'] },
// //       { key: 'extraCall', label: 'Extra Concurrent Call', values: ['', '$7/call', '$7/call', '$7/call', 'Custom'] },
// //       { key: 'phoneNumber', label: 'New Phone Number', values: ['$1.50', '$1.50', '$1.50', '$1.50', 'Included'] },
// //       { key: 'boostedQueuing', label: 'Boosted Queuing for Calls', values: ['', '$500/mo', '$500/mo', '$500/mo', ''] },
// //     ],
// //   },
// //   {
// //     category: 'Core Capabilities',
// //     items: [
// //       { key: 'unlimitedAssistants', label: 'Unlimited Assistants', values: [true, true, true, true, true] },
// //       { key: 'multilanguage', label: 'Multi-language', values: [true, true, true, true, true] },
// //       { key: 'rebilling', label: 'Rebilling', values: [false, false, true, true, true] },
// //       { key: 'batchCampaigns', label: 'Batch Campaigns', values: [false, true, true, true, true] },
// //       { key: 'teamMembers', label: 'Invite Team Members', values: [false, true, true, true, true] },
// //       { key: 'customWorkflows', label: 'Custom Workflows Included', values: ['', '8,000', '42,000', '100,000', 'Custom'] },
// //       { key: 'extraWorkflow', label: 'Extra Workflow', values: ['', '$0.002', '$0.002', '$0.002', 'Custom'] },
// //       { key: 'sendSMS', label: 'Send SMS', values: [true, true, true, true, true] },
// //       { key: 'realTimeBooking', label: 'Real-time Booking', values: [true, true, true, true, true] },
// //       { key: 'callTransfer', label: 'Call Transfer', values: [true, true, true, true, true] },
// //       { key: 'infoExtractor', label: 'Information Extractor', values: [true, true, true, true, true] },
// //       { key: 'customActions', label: 'Custom Actions', values: [true, true, true, true, true] },
// //       { key: 'whiteLabel', label: 'White Label Platform', values: [false, false, false, true, true] },
// //       { key: 'subaccounts', label: 'Subaccounts', values: ['', '', '25', 'Unlimited', 'Unlimited'] },
// //     ],
// //   },
// //   {
// //     category: 'Integrations',
// //     items: [
// //       { key: 'restAPI', label: 'Rest API', values: [true, true, true, true, true] },
// //       { key: 'existingIntegrations', label: 'All Existing Integrations', values: [true, true, true, true, true] },
// //       { key: 'customIntegrations', label: 'Custom Integrations', values: [false, false, false, false, true] },
// //       { key: 'sipTrunk', label: 'SIP Trunk Integrations', values: [false, false, false, false, true] },
// //     ],
// //   },
// //   {
// //     category: 'Support',
// //     items: [
// //       { key: 'synthflowAcademy', label: 'Synthflow Academy', values: [true, true, true, true, true] },
// //       { key: 'ticketingSupport', label: 'Support via Ticketing System', values: [true, true, true, true, true] },
// //       { key: 'onboardingSlack', label: '30-day Onboarding via Private Slack', values: [false, false, false, true, true] },
// //       { key: 'dedicatedSupport', label: 'Dedicated Support & Slack Channel', values: [false, false, false, '$1,200/mo', '$1,200/mo'] },
// //       { key: 'earlyAccess', label: 'Early Access to New Features', values: [false, false, true, true, true] },
// //       { key: 'solutionArchitect', label: 'Solution Architect', values: [false, false, false, false, true] },
// //     ],
// //   },
// //   {
// //     category: 'Compliance',
// //     items: [
// //       { key: 'uptimeSLA', label: 'Guaranteed Uptime (SLA)', values: [false, false, false, false, true] },
// //       { key: 'hipaa', label: 'HIPAA', values: [false, false, false, false, true] },
// //       { key: 'soc2', label: 'SOC2 Security', values: [false, false, false, false, true] },
// //       { key: 'gdpr', label: 'GDPR', values: [false, false, false, false, true] },
// //     ],
// //   },
// // ]

// // const reviews = [
// //   {
// //     name: 'Andre F.',
// //     title: 'Business Owner',
// //     quote: 'reviews.andre',
// //     stars: 5,
// //   },
// //   {
// //     name: 'Marco B.',
// //     title: 'Business Owner',
// //     quote: 'reviews.marco',
// //     stars: 5,
// //   },
// //   {
// //     name: 'Sadeeke M.',
// //     title: 'CEO',
// //     quote: 'reviews.sadeeke',
// //     stars: 5,
// //   },
// // ]

// // const Pricing = ({ id }) => {
// //   const { t } = useTranslation()
// //   const [isYearly, setIsYearly] = useState(false)
// //   const [selectedPlan, setSelectedPlan] = useState(0)

// //   const handleStripeCheckout = (plan) => {
// //     console.log(`Initiating Stripe checkout for ${plan} plan`) // Mock Stripe integration
// //   }

// //   return (
// //     <section id={id} className="py-16 bg-gray-50 relative z-10 font-inter">
// //       <div className="max-w-7xl mx-auto px-4">
// //         {/* Placeholder Text from Document */}
// //         {/* {[...Array(14)].map((_, index) => (
// //           <div key={index} className="text-gray-500 text-sm mb-2">
// //             This is some text inside of a div block.
// //           </div>
// //         ))} */}

// //         {/* Intro Section */}
// //         <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
// //           {t('pricing.introTitle')}
// //         </h2>
// //         <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
// //           {t('pricing.introSubheading')}
// //         </p>
// //         <p className="text-lg font-semibold text-gray-900 text-center mb-8">{t('pricing.minutesQuestion')}</p>
// //         <div className="flex justify-center mb-8">
// //           <div className="inline-flex bg-gray-200 p-1 rounded-full">
// //             {introPlans.map((plan, index) => (
// //               <button
// //                 key={plan.key}
// //                 onClick={() => setSelectedPlan(index)}
// //                 className={`px-4 py-2 text-sm font-semibold rounded-full ${
// //                   selectedPlan === index ? 'bg-blue-600 text-white' : 'text-gray-700'
// //                 }`}
// //                 aria-label={t(`pricing.select${plan.key}`)}
// //               >
// //                 {t(`pricing.${plan.key}`)}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //         <motion.div
// //           initial={{ opacity: 0, y: 50 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.5 }}
// //           className="p-8 bg-white rounded-lg shadow-lg border border-gray-200 mb-12 max-w-2xl mx-auto"
// //         >
// //           <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(`pricing.${introPlans[selectedPlan].key}`)}</h3>
// //           <p className="text-gray-700 mb-2">{introPlans[selectedPlan].minutes} min</p>
// //           <p className="text-gray-700 mb-2">{introPlans[selectedPlan].workflows} Workflows</p>
// //           <p className="text-gray-700 mb-4">{introPlans[selectedPlan].concurrentCalls} Concurrent Calls</p>
// //           <h4 className="text-lg font-semibold text-gray-900 mb-2">Features</h4>
// //           <ul className="space-y-2 mb-4">
// //             {introPlans[selectedPlan].features.map((feature, idx) => (
// //               <li key={idx} className="flex items-center text-gray-700">
// //                 <CheckCircle className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
// //                 {feature}
// //               </li>
// //             ))}
// //           </ul>
// //           {introPlans[selectedPlan].discount && (
// //             <p className="text-green-600 font-semibold mb-4">{introPlans[selectedPlan].discount}</p>
// //           )}
// //           <h4 className="text-lg font-semibold text-gray-900 mb-2">Cost</h4>
// //           <ul className="space-y-2 mb-6">
// //             {introPlans[selectedPlan].costs.map((cost, idx) => (
// //               <li key={idx} className="text-gray-700">{cost}</li>
// //             ))}
// //           </ul>
// //           {introPlans[selectedPlan].key === 'enterprise' && (
// //             <>
// //               <h4 className="text-lg font-semibold text-gray-900 mb-2">Including:</h4>
// //               <ul className="space-y-2 mb-6">
// //                 {introPlans[selectedPlan].bundle.map((item, idx) => (
// //                   <li key={idx} className="flex items-center text-gray-700">
// //                     <CheckCircle className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
// //                     {item}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </>
// //           )}
// //         </motion.div>
// //         <div className="text-center mb-12">
// //           <p className="text-xl font-bold text-gray-900 mb-4">{t('pricing.bundleTitle')}</p>
// //           <p className="text-lg text-gray-700 mb-4">{t('pricing.bundleDesc')}</p>
// //           <p className="text-xl font-bold text-gray-900 mb-4">{t('pricing.plugPlayTitle')}</p>
// //           <p className="text-lg text-gray-700 mb-4">{t('pricing.plugPlayDesc')}</p>
// //           <p className="text-xl font-bold text-gray-900 mb-4">{t('pricing.flexibilityTitle')}</p>
// //           <p className="text-lg text-gray-700 mb-8">{t('pricing.flexibilityDesc')}</p>
// //         </div>

// //         {/* Pricing Cards */}
// //         <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
// //           {t('pricing.title')}
// //         </h2>
// //         <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
// //           {t('pricing.subheading')}
// //         </p>
// //         <div className="flex justify-center mb-12">
// //           <div className="inline-flex rounded-full bg-gray-200 p-1">
// //             <button
// //               onClick={() => setIsYearly(false)}
// //               className={`px-4 py-2 rounded-full text-sm font-semibold ${!isYearly ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
// //               aria-label={t('pricing.monthly')}
// //             >
// //               {t('pricing.monthly')}
// //             </button>
// //             <button
// //               onClick={() => setIsYearly(true)}
// //               className={`px-4 py-2 rounded-full text-sm font-semibold ${isYearly ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
// //               aria-label={t('pricing.yearly')}
// //             >
// //               {t('pricing.yearly')}
// //             </button>
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
// //           {plans.map((plan, index) => (
// //             <motion.div
// //               key={plan.key}
// //               initial={{ opacity: 0, y: 50 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.5, delay: index * 0.1 }}
// //               className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200 relative"
// //             >
// //               <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(`pricing.${plan.key}`)}</h3>
// //               <p className="text-3xl font-semibold text-gray-900 mb-2">
// //                 {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
// //                 <span className="text-lg font-normal text-gray-500">{plan.period}</span>
// //               </p>
// //               {plan.key === 'pro' && isYearly && (
// //                 <p className="text-green-600 font-semibold mb-2 absolute top-4 right-4">17% Discount</p>
// //               )}
// //               {plan.key === 'growth' && isYearly && (
// //                 <p className="text-green-600 font-semibold mb-2 absolute top-4 right-4">10% Discount</p>
// //               )}
// //               {plan.key === 'agency' && isYearly && (
// //                 <p className="text-green-600 font-semibold mb-2 absolute top-4 right-4">18% Discount</p>
// //               )}
// //               <p className="text-gray-700 mb-2">{plan.minutes}</p>
// //               <p className="text-gray-700 mb-2">{plan.concurrentCalls} Concurrent Calls</p>
// //               <p className="text-gray-700 mb-4">{plan.workflows} Workflows</p>
// //               <ul className="space-y-2 mb-6">
// //                 {plan.features.map((feature, idx) => (
// //                   <li key={idx} className="flex items-center text-gray-700">
// //                     <CheckCircle className="h-5 w-5 text-green-600 mr-2" aria-hidden="true" />
// //                     {feature}
// //                   </li>
// //                 ))}
// //               </ul>
// //               <button
// //                 onClick={() => handleStripeCheckout(plan.key)}
// //                 className={`w-full py-3 rounded-full font-semibold text-base ${
// //                   plan.cta === 'contact'
// //                     ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
// //                     : 'bg-blue-600 text-white hover:bg-blue-700'
// //                 }`}
// //                 aria-label={t(`pricing.${plan.cta}`)}
// //               >
// //                 {t(`pricing.${plan.cta}`)}
// //               </button>
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Compare Plans Table */}
// //         <div className="mb-16">
// //           <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
// //             {t('pricing.compareTitle')}
// //           </h3>
// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr>
// //                   <th className="p-4 text-left text-gray-900 font-semibold w-1/4"></th>
// //                   {plans.map((plan) => (
// //                     <th key={plan.key} className="p-4 text-center text-gray-900 font-semibold w-1/5">
// //                       {t(`pricing.${plan.key}`)}
// //                       {plan.key === 'pro' && isYearly && (
// //                         <p className="text-green-600 text-sm mt-1">17% Discount</p>
// //                       )}
// //                       {plan.key === 'growth' && isYearly && (
// //                         <p className="text-green-600 text-sm mt-1">17% Discount</p>
// //                       )}
// //                       {plan.key === 'agency' && isYearly && (
// //                         <p className="text-green-600 text-sm mt-1">17% Discount</p>
// //                       )}
// //                       {plan.key === 'enterprise' && isYearly && (
// //                         <p className="text-green-600 text-sm mt-1">17% Discount</p>
// //                       )}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {compareFeatures.map((category, catIdx) => (
// //                   <>
// //                     <tr key={catIdx} className="border-t border-gray-200">
// //                       <td className="p-4 bg-blue-50 text-gray-900 font-semibold">{category.category}</td>
// //                       {plans.map((_, planIdx) => (
// //                         <td key={planIdx} className="p-4"></td>
// //                       ))}
// //                     </tr>
// //                     {category.items.map((item, itemIdx) => (
// //                       <tr key={`${catIdx}-${itemIdx}`} className="border-t border-gray-200">
// //                         <td className="p-4 text-gray-700">{item.label}</td>
// //                         {item.values.map((value, valIdx) => (
// //                           <td key={valIdx} className="p-4 text-center text-gray-700">
// //                             {typeof value === 'boolean' ? (
// //                               value ? (
// //                                 <CheckCircle className="h-6 w-6 text-green-600 mx-auto" aria-hidden="true" />
// //                               ) : (
// //                                 ''
// //                               )
// //                             ) : (
// //                               value
// //                             )}
// //                           </td>
// //                         ))}
// //                       </tr>
// //                     ))}
// //                   </>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* Enterprise Section */}
// //         <div className="py-16 bg-white rounded-lg shadow-lg mb-16">
// //           <div className="max-w-4xl mx-auto px-4">
// //             <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
// //               {t('pricing.enterpriseTitle')}
// //             </h3>
// //             <p className="text-lg text-gray-700 text-center mb-8">
// //               {t('pricing.enterpriseSubheading')}
// //             </p>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               <div>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterprisePricing')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterprisePricingDesc')}</p>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterpriseIntegrations')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterpriseIntegrationsDesc')}</p>
// //               </div>
// //               <div>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterpriseCompliance')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterpriseComplianceDesc')}</p>
// //                 <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('pricing.enterpriseSupport')}</h4>
// //                 <p className="text-gray-700 mb-4">{t('pricing.enterpriseSupportDesc')}</p>
// //               </div>
// //             </div>
// //             <div className="text-center">
// //               <button
// //                 onClick={() => handleStripeCheckout('enterprise')}
// //                 className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
// //                 aria-label={t('pricing.contact')}
// //               >
// //                 {t('pricing.contact')}
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Reviews Section */}
// //         <div className="mb-16">
// //           <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
// //             {t('pricing.reviewsTitle')}
// //           </h3>
// //           <p className="text-lg text-gray-700 text-center mb-8">{t('pricing.reviewsSubheading')}</p>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             {reviews.map((review, index) => (
// //               <motion.div
// //                 key={index}
// //                 initial={{ opacity: 0, y: 50 }}
// //                 whileInView={{ opacity: 1, y: 0 }}
// //                 viewport={{ once: true }}
// //                 transition={{ duration: 0.5, delay: index * 0.1 }}
// //                 className="p-6 bg-white rounded-lg shadow-lg"
// //               >
// //                 <div className="flex mb-4">
// //                   {[...Array(review.stars)].map((_, i) => (
// //                     <Star key={i} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
// //                   ))}
// //                 </div>
// //                 <p className="text-gray-700 mb-4">"{t(review.quote)}"</p>
// //                 <p className="font-semibold text-blue-600">{review.name}</p>
// //                 <p className="text-gray-500 text-sm">{review.title}</p>
// //               </motion.div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Tailored Demo Section */}
// //         <div className="py-16 bg-blue-50 rounded-lg">
// //           <div className="max-w-4xl mx-auto px-4 text-center">
// //             <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('pricing.demoTitle')}</h3>
// //             <p className="text-lg text-gray-700 mb-8">{t('pricing.demoSubheading')}</p>
// //             <button
// //               onClick={() => handleStripeCheckout('demo')}
// //               className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
// //               aria-label={t('pricing.contact')}
// //             >
// //               {t('pricing.contact')}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// // export default Pricing

// // import { useState } from "react"
// // import { useTranslation } from "react-i18next"
// // import { motion } from "framer-motion"
// // import { Check } from "lucide-react"

// // const tiers = [
// //   {
// //     name: 'starter',
// //     monthlyPrice: 59,
// //     annualPrice: 47, // ~20% discount
// //     perMinute: 0.08,
// //     minutes: 1000,
// //     features: [
// //       '1000 call minutes/month',
// //       '24/7 Voice AI',
// //       'Basic support',
// //       '1 language',
// //       'Zapier integration',
// //     ],
// //     cta: 'pricing.selectStarter',
// //     stripePriceId: 'price_starter_monthly', // Replace with actual Stripe Price ID
// //   },
// //   {
// //     name: 'pro',
// //     monthlyPrice: 149,
// //     annualPrice: 119, // ~20% discount
// //     perMinute: 0.06,
// //     minutes: 5000,
// //     features: [
// //       '5000 call minutes/month',
// //       '24/7 Voice AI',
// //       'Priority support',
// //       '5 languages',
// //       'CRM integrations',
// //       'Custom workflows',
// //     ],
// //     cta: 'pricing.selectPro',
// //     stripePriceId: 'price_pro_monthly', // Replace with actual Stripe Price ID
// //     popular: true,
// //   },
// //   {
// //     name: 'enterprise',
// //     monthlyPrice: 'Contact Sales',
// //     annualPrice: 'Contact Sales',
// //     perMinute: 0.04,
// //     minutes: 'Unlimited',
// //     features: [
// //       'Unlimited call minutes',
// //       'Dedicated support',
// //       '30+ languages',
// //       'Full API access',
// //       'White-labeled agents',
// //       'Custom integrations',
// //     ],
// //     cta: 'pricing.selectEnterprise',
// //     contact: true,
// //   },
// // ]

// // const Pricing = () => {
// //   const { t } = useTranslation()
// //   const [isAnnual, setIsAnnual] = useState(false)
// //   const [callMinutes, setCallMinutes] = useState(1000)

// //   const handleSliderChange = (e) => {
// //     setCallMinutes(Number(e.target.value))
// //   }

// //   const getEstimatedCost = (tier) => {
// //     if (tier.contact) return t('pricing.estimatedCost', { cost: (callMinutes * tier.perMinute).toFixed(2) })
// //     return isAnnual
// //       ? t('pricing.estimatedCost', { cost: (tier.annualPrice + callMinutes * tier.perMinute).toFixed(2) })
// //       : t('pricing.estimatedCost', { cost: (tier.monthlyPrice + callMinutes * tier.perMinute).toFixed(2) })
// //   }

// //   return (
// //     <section className="bg-gray-50 py-20 relative z-10 font-inter" id="pricing">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Title and Subheadline */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 50 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6 }}
// //           className="text-center mb-12"
// //         >
// //           <h2 className="text-4xl font-bold text-gray-900">{t('pricing.title')}</h2>
// //           <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t('pricing.subheadline')}</p>
// //         </motion.div>

// //         {/* Monthly/Annual Toggle */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 50 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6, delay: 0.2 }}
// //           className="flex justify-center mb-12"
// //         >
// //           <div className="inline-flex rounded-full bg-gray-200 p-2">
// //             <button
// //               className={`px-6 py-2 rounded-full text-sm font-medium ${
// //                 !isAnnual ? 'bg-blue-600 text-white' : 'text-gray-600'
// //               }`}
// //               onClick={() => setIsAnnual(false)}
// //               aria-pressed={!isAnnual}
// //             >
// //               {t('pricing.monthly')}
// //             </button>
// //             <button
// //               className={`px-6 py-2 rounded-full text-sm font-medium ${
// //                 isAnnual ? 'bg-blue-600 text-white' : 'text-gray-600'
// //               }`}
// //               onClick={() => setIsAnnual(true)}
// //               aria-pressed={isAnnual}
// //             >
// //               {t('pricing.annual')} <span className="text-xs">({t('pricing.annualDiscount')})</span>
// //             </button>
// //           </div>
// //         </motion.div>

// //         {/* Slider */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 50 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.6, delay: 0.4 }}
// //           className="mb-16"
// //         >
// //           <label htmlFor="callMinutes" className="block text-center text-gray-600 text-lg mb-4">
// //             {t('pricing.callMinutes', { count: callMinutes })}
// //           </label>
// //           <div className="relative">
// //             <input
// //               type="range"
// //               id="callMinutes"
// //               min="100"
// //               max="50000"
// //               step="100"
// //               value={callMinutes}
// //               onChange={handleSliderChange}
// //               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
// //               aria-label={t('pricing.callMinutes', { count: callMinutes })}
// //             />
// //             <div className="flex justify-between text-gray-500 text-sm mt-2">
// //               <span>100</span>
// //               <span>50,000</span>
// //             </div>
// //           </div>
// //         </motion.div>

// //         {/* Tiers */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
// //           {tiers.map((tier, index) => (
// //             <motion.div
// //               key={tier.name}
// //               initial={{ opacity: 0, y: 50 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
// //               className="relative bg-white p-10 rounded-xl shadow-md"
// //             >
// //               {tier.popular && (
// //                 <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
// //                   {t('pricing.mostPopular')}
// //                 </span>
// //               )}
// //               <h3 className="text-2xl font-semibold text-gray-900">{t(`pricing.${tier.name}`)}</h3>
// //               <p className="text-gray-600 text-3xl font-bold mt-4">
// //                 {typeof tier.monthlyPrice === 'number'
// //                   ? `$${isAnnual ? tier.annualPrice : tier.monthlyPrice}`
// //                   : tier.monthlyPrice}
// //                 <span className="text-gray-500 text-base font-normal">
// //                   {typeof tier.monthlyPrice === 'number' ? ` / ${t(isAnnual ? 'pricing.annual' : 'pricing.monthly')}` : ''}
// //                 </span>
// //               </p>
// //               <p className="text-gray-500 text-sm mt-2">{getEstimatedCost(tier)}</p>
// //               <ul className="mt-6 space-y-4">
// //                 {tier.features.map((feature) => (
// //                   <li key={feature} className="flex items-center text-gray-600 text-base">
// //                     <Check className="h-5 w-5 text-blue-600 mr-3" />
// //                     {feature}
// //                   </li>
// //                 ))}
// //               </ul>
// //               {tier.contact ? (
// //                 <a
// //                   href="/contact"
// //                   className="mt-10 block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
// //                   aria-label={t(tier.cta)}
// //                 >
// //                   {t(tier.cta)}
// //                 </a>
// //               ) : (
// //                 <stripe-buy-button
// //                   buy-button-id={`buy_btn_${tier.name}`} // Replace with actual Stripe Buy Button ID
// //                   price-id={isAnnual ? tier.stripePriceId.replace('monthly', 'annual') : tier.stripePriceId}
// //                   publishable-key="pk_test_your_publishable_key" // Replace with your Stripe Publishable Key
// //                   className="mt-10 block w-full"
// //                 >
// //                   <button
// //                     className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
// //                     aria-label={t(tier.cta)}
// //                   >
// //                     {t(tier.cta)}
// //                   </button>
// //                 </stripe-buy-button>
// //               )}
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Stripe Pricing Table Script */}
// //       <script async src="https://js.stripe.com/v3/buy-button.js"></script>
// //     </section>
// //   )
// // }

// // export default Pricing

// import { useState } from "react"
// import { motion } from "framer-motion"

// const TIERS = [
//   { id: "starter", name: "Starter", basePrice: 29, minutesIncluded: 500 },
//   { id: "pro", name: "Pro", basePrice: 149, minutesIncluded: 2000 },
//   { id: "enterprise", name: "Enterprise", basePrice: 499, minutesIncluded: 6000 },
// ]

// const FEATURES = [
//   { name: "AI Voice Agents", starter: true, pro: true, enterprise: true },
//   { name: "CRM Integrations", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
//   { name: "Chat + SMS Channels", starter: false, pro: true, enterprise: true },
//   { name: "Priority Support", starter: false, pro: true, enterprise: true },
//   { name: "Dedicated Success Manager", starter: false, pro: false, enterprise: true },
// ]

// const OverageRate = 0.05
// const YEARLY_DISCOUNT = 0.2

// export default function Pricing() {
//   const [billing, setBilling] = useState("monthly")
//   const [minutes, setMinutes] = useState(1000)

//   const calculatePrice = (tier) => {
//     let base = tier.basePrice
//     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate
//     let total = base + overage
//     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT)
//     return Math.round(total)
//   }

//   return (
//     <section className="bg-white py-16">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg text-gray-600 mb-6">
//             Choose the plan that fits your business. Scale as you grow.
//           </p>

//           {/* Billing Toggle */}
//           <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 billing === "monthly" ? "bg-blue-600 text-white" : "text-gray-700"
//               }`}
//               onClick={() => setBilling("monthly")}
//             >
//               Monthly
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 billing === "yearly" ? "bg-blue-600 text-white" : "text-gray-700"
//               }`}
//               onClick={() => setBilling("yearly")}
//             >
//               Yearly <span className="text-green-600 font-medium">(Save 20%)</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* Pricing Slider Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="mb-16"
//         >
//           <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
//             Estimated Monthly Minutes: <strong>{minutes}</strong>
//           </label>
//           <input
//             type="range"
//             min={0}
//             max={10000}
//             step={100}
//             value={minutes}
//             onChange={(e) => setMinutes(Number(e.target.value))}
//             className="w-full accent-blue-600"
//           />
//         </motion.div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
//           {TIERS.map((tier, idx) => (
//             <motion.div
//               key={tier.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: idx * 0.2 }}
//               className="border rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition"
//             >
//               <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
//               <p className="text-4xl font-bold text-gray-900 mb-4">
//                 ${calculatePrice(tier)}
//                 <span className="text-base font-medium text-gray-600">/mo</span>
//               </p>
//               <p className="text-sm text-gray-600 mb-4">
//                 Includes {tier.minutesIncluded.toLocaleString()} mins
//               </p>
//               <button
//                 onClick={() => alert(`Redirecting to Stripe checkout for ${tier.name}`)}
//                 className="mt-auto py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//               >
//                 Get Started
//               </button>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Comparison Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="overflow-x-auto"
//         >
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr>
//                 <th className="p-4 border-b text-gray-900 font-semibold">Features</th>
//                 {TIERS.map((tier) => (
//                   <th
//                     key={tier.id}
//                     className="p-4 border-b text-gray-900 font-semibold text-center"
//                   >
//                     {tier.name}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {FEATURES.map((feature, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-4 text-gray-700">{feature.name}</td>
//                   {["starter", "pro", "enterprise"].map((tier) => (
//                     <td key={tier} className="p-4 text-center">
//                       {typeof feature[tier] === "boolean" ? (
//                         feature[tier] ? (
//                           <span className="text-green-600">✓</span>
//                         ) : (
//                           <span className="text-gray-400">—</span>
//                         )
//                       ) : (
//                         <span className="text-gray-700">{feature[tier]}</span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </motion.div>

//         <p className="text-xs text-gray-500 mt-6 text-center">
//           * This is a frontend-only demo. Replace mock checkout with real Stripe
//           integration for production.
//         </p>
//       </div>
//     </section>
//   )
// }

// import { useState } from "react"
// import { motion } from "framer-motion"

// const TIERS = [
//   {
//     id: "starter",
//     name: "Starter",
//     basePrice: 54,
//     minutesIncluded: 500,
//     features: [
//       "AI Voice Agents",
//       "Basic CRM Integrations",
//     ],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     basePrice: 149,
//     minutesIncluded: 2000,
//     features: [
//       "AI Voice Agents",
//       "Advanced CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//     ],
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     basePrice: 499,
//     minutesIncluded: 6000,
//     features: [
//       "AI Voice Agents",
//       "Custom CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//       "Dedicated Success Manager",
//     ],
//   },
// ]

// // For table view (row by row comparison)
// const FEATURES = [
//   { name: "AI Voice Agents", starter: true, pro: true, enterprise: true },
//   { name: "CRM Integrations", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
//   { name: "Chat + SMS Channels", starter: false, pro: true, enterprise: true },
//   { name: "Priority Support", starter: false, pro: true, enterprise: true },
//   { name: "Dedicated Success Manager", starter: false, pro: false, enterprise: true },
// ]

// const OverageRate = 0.05
// const YEARLY_DISCOUNT = 0.2

// export default function Pricing() {
//   const [billing, setBilling] = useState("monthly")
//   const [minutes, setMinutes] = useState(1000)

//   const calculatePrice = (tier) => {
//     let base = tier.basePrice
//     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate
//     let total = base + overage
//     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT)
//     return Math.round(total)
//   }

//   return (
//     <section className="bg-white py-16">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg text-gray-600 mb-6">
//             Choose the plan that fits your business. Scale as you grow.
//           </p>

//           {/* Billing Toggle */}
//           <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 billing === "monthly" ? "bg-blue-600 text-white" : "text-gray-700"
//               }`}
//               onClick={() => setBilling("monthly")}
//             >
//               Monthly
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 billing === "yearly" ? "bg-blue-600 text-white" : "text-gray-700"
//               }`}
//               onClick={() => setBilling("yearly")}
//             >
//               Yearly{" "}
//               <span className="text-green-600 font-medium">(Save 20%)</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* Pricing Slider
//         <div className="mb-16">
//           <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
//             Estimated Monthly Minutes: <strong>{minutes}</strong>
//           </label>
//           <input
//             type="range"
//             min={0}
//             max={10000}
//             step={100}
//             value={minutes}
//             onChange={(e) => setMinutes(Number(e.target.value))}
//             className="w-full accent-blue-600"
//           />
//         </div> */}
//         {/* Pricing Slider */}
// <div className="mb-16 relative">
//   <div className="flex justify-between text-sm text-gray-500 mb-2 max-w-xl mx-auto">
//     <span>0</span>
//     <span>500</span>
//     <span>2000</span>
//     <span>6000</span>
//     <span>10000</span>
//   </div>

//   <div className="relative max-w-xl mx-auto">
//     {/* Dynamic bubble above thumb */}
//     <motion.div
//       key={minutes}
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: -30 }}
//       transition={{ duration: 0.3 }}
//       className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded"
//       style={{
//         left: `${(minutes / 10000) * 100}%`,
//       }}
//     >
//       {minutes.toLocaleString()} mins
//     </motion.div>

//     {/* Slider input */}
//     <input
//       type="range"
//       min={0}
//       max={10000}
//       step={100}
//       value={minutes}
//       onChange={(e) => setMinutes(Number(e.target.value))}
//       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
//     />

//     {/* Custom thumb styles */}
//     <style jsx>{`
//       input[type="range"]::-webkit-slider-thumb {
//         appearance: none;
//         height: 20px;
//         width: 20px;
//         border-radius: 9999px;
//         background: #2563eb; /* Tailwind blue-600 */
//         cursor: pointer;
//         border: 2px solid white;
//         box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
//       }
//       input[type="range"]::-moz-range-thumb {
//         height: 20px;
//         width: 20px;
//         border-radius: 9999px;
//         background: #2563eb;
//         cursor: pointer;
//         border: 2px solid white;
//         box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
//       }
//     `}</style>
//   </div>
// </div>


//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
//           {TIERS.map((tier, idx) => (
//             <motion.div
//               key={tier.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: idx * 0.2 }}
//               className="border rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition"
//             >
//               <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
//               <p className="text-4xl font-bold text-gray-900 mb-4">
//                 ${calculatePrice(tier)}
//                 <span className="text-base font-medium text-gray-600">/mo</span>
//               </p>
//               <p className="text-sm text-gray-600 mb-4">
//                 Includes {tier.minutesIncluded.toLocaleString()} mins
//               </p>
//               <ul className="text-left space-y-2 mb-6">
//                 {tier.features.map((f, i) => (
//                   <li key={i} className="flex items-center text-gray-700">
//                     <span className="text-blue-600 mr-2">✓</span> {f}
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 onClick={() => alert(`Redirecting to Stripe checkout for ${tier.name}`)}
//                 className="mt-auto py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//               >
//                 Get Started
//               </button>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Comparison Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="overflow-x-auto"
//         >
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr>
//                 <th className="p-4 border-b text-gray-900 font-semibold">
//                   Features
//                 </th>
//                 {TIERS.map((tier) => (
//                   <th
//                     key={tier.id}
//                     className="p-4 border-b text-gray-900 font-semibold text-center"
//                   >
//                     {tier.name}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {FEATURES.map((feature, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-4 text-gray-700">{feature.name}</td>
//                   {["starter", "pro", "enterprise"].map((tier) => (
//                     <td key={tier} className="p-4 text-center">
//                       {typeof feature[tier] === "boolean" ? (
//                         feature[tier] ? (
//                           <span className="text-green-600">✓</span>
//                         ) : (
//                           <span className="text-gray-400">—</span>
//                         )
//                       ) : (
//                         <span className="text-gray-700">{feature[tier]}</span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </motion.div>

        
//       </div>
//     </section>
//   )
// }

// import { useState } from "react"
// import { motion } from "framer-motion"

// const TIERS = [
//   {
//     id: "starter",
//     name: "Starter",
//     basePrice: 54,
//     minutesIncluded: 500,
//     features: ["AI Voice Agents", "Basic CRM Integrations"],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     basePrice: 149,
//     minutesIncluded: 2000,
//     features: [
//       "AI Voice Agents",
//       "Advanced CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//     ],
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     basePrice: 499,
//     minutesIncluded: 6000,
//     features: [
//       "AI Voice Agents",
//       "Custom CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//       "Dedicated Success Manager",
//     ],
//   },
// ]

// const FEATURES = [
//   { name: "AI Voice Agents", starter: true, pro: true, enterprise: true },
//   { name: "CRM Integrations", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
//   { name: "Chat + SMS Channels", starter: false, pro: true, enterprise: true },
//   { name: "Priority Support", starter: false, pro: true, enterprise: true },
//   { name: "Dedicated Success Manager", starter: false, pro: false, enterprise: true },
// ]

// const OverageRate = 0.05
// const YEARLY_DISCOUNT = 0.2

// export default function Pricing() {
//   const [billing, setBilling] = useState("monthly")
//   const [minutes, setMinutes] = useState(1000)

//   const calculatePrice = (tier) => {
//     let base = tier.basePrice
//     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate
//     let total = base + overage
//     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT)
//     return Math.round(total)
//   }

//   return (
//     <section id="pricing" className="bg-white py-16 border-t-2 border-blue-600 p-2 ">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-5xl font-extrabold text-black mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg text-black mb-6">
//             Choose the plan that fits your business. Scale as you grow.
//           </p>

//           {/* Billing Toggle */}
//           <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 billing === "monthly" ? "bg-blue-600 text-white" : "text-black"
//               }`}
//               onClick={() => setBilling("monthly")}
//             >
//               Monthly
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full ${
//                 billing === "yearly" ? "bg-blue-600 text-white" : "text-black"
//               }`}
//               onClick={() => setBilling("yearly")}
//             >
//               Yearly{" "}
//               <span className="text-green-600 font-medium">(Save 20%)</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* Pricing Slider */}
//         <div className="mb-16 relative max-w-2xl mx-auto">
//           <div className="flex justify-between text-sm text-black mb-3">
//             <span>0</span>
//             <span>500</span>
//             <span>2000</span>
//             <span>6000</span>
//             <span>10000</span>
//           </div>

//           <div className="relative w-full">
//             {/* Filled Track */}
//             <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />
//             <div
//               className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-600 rounded-full"
//               style={{ width: `${(minutes / 10000) * 100}%` }}
//             />

//             {/* Bubble */}
//             <motion.div
//               key={minutes}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: -30 }}
//               transition={{ duration: 0.3 }}
//               className="absolute -top-8 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded transform -translate-x-1/2"
//               style={{
//                 left: `${(minutes / 10000) * 100}%`,
//               }}
//             >
//               {minutes.toLocaleString()} mins
//             </motion.div>

//             {/* Slider */}
//             <input
//               type="range"
//               min={0}
//               max={10000}
//               step={100}
//               value={minutes}
//               onChange={(e) => setMinutes(Number(e.target.value))}
//               className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
//             />

//             {/* Thumb styles */}
//             <style jsx>{`
//               input[type="range"]::-webkit-slider-thumb {
//                 appearance: none;
//                 height: 22px;
//                 width: 22px;
//                 border-radius: 9999px;
//                 background: #2563eb;
//                 cursor: pointer;
//                 border: 2px solid white;
//                 box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
//                 margin-top: -10px;
//               }
//               input[type="range"]::-moz-range-thumb {
//                 height: 22px;
//                 width: 22px;
//                 border-radius: 9999px;
//                 background: #2563eb;
//                 cursor: pointer;
//                 border: 2px solid white;
//                 box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
//               }
//             `}</style>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 ">
//           {TIERS.map((tier, idx) => (
//             <motion.div
//               key={tier.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: idx * 0.2 }}
//               className={`border rounded-2xl p-6 flex flex-col shadow-sm transition hover:shadow-lg hover:border-purple-900 border-black ${
//                 tier.id === "pro" ? "scale-105 border-blue-600 shadow-md" : ""
//               }`}
//             >
//               <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
//               <p className="text-4xl font-bold text-gray-900 mb-4">
//                 ${calculatePrice(tier)}
//                 <span className="text-base font-medium text-black">/mo</span>
//               </p>
//               <p className="text-sm text-black mb-4">
//                 Includes {tier.minutesIncluded.toLocaleString()} mins
//               </p>
//               <ul className="text-left space-y-2 mb-6">
//                 {tier.features.map((f, i) => (
//                   <li key={i} className="flex items-center text-black">
//                     <span className="text-blue-600 mr-2">✓</span> {f}
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 onClick={() =>
//                   alert(`Redirecting to Stripe checkout for ${tier.name}`)
//                 }
//                 className="mt-auto py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//               >
//                 Get Started
//               </button>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Comparison Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="overflow-x-auto"
//         >
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr>
//                 <th className="p-4 border-b text-gray-900 font-semibold">
//                   Features
//                 </th>
//                 {TIERS.map((tier) => (
//                   <th
//                     key={tier.id}
//                     className="p-4 border-b text-gray-900 font-semibold text-center"
//                   >
//                     {tier.name}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {FEATURES.map((feature, i) => (
//                 <tr
//                   key={i}
//                   className={i % 2 === 0 ? "bg-gray-50 border-b" : "border-b"}
//                 >
//                   <td className="p-4 text-black">{feature.name}</td>
//                   {["starter", "pro", "enterprise"].map((tier) => (
//                     <td key={tier} className="p-4 text-center">
//                       {typeof feature[tier] === "boolean" ? (
//                         feature[tier] ? (
//                           <span className="text-green-600">✓</span>
//                         ) : (
//                           <span className="text-black">—</span>
//                         )
//                       ) : (
//                         <span className="text-black">{feature[tier]}</span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// import { useState } from "react"
// import { motion } from "framer-motion"

// // Custom Modal Component for Alert replacement (Required due to environment restrictions)
// const CustomAlert = ({ message, onClose }) => {
//   if (!message) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">Action Required</h3>
//         <p className="text-gray-700 mb-6">{message}</p>
//         <button
//           onClick={onClose}
//           className="w-full py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };


// const TIERS = [
//   {
//     id: "starter",
//     name: "Starter",
//     basePrice: 54,
//     minutesIncluded: 500,
//     features: ["AI Voice Agents", "Basic CRM Integrations"],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     basePrice: 149,
//     minutesIncluded: 2000,
//     features: [
//       "AI Voice Agents",
//       "Advanced CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//     ],
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     basePrice: 499,
//     minutesIncluded: 6000,
//     features: [
//       "AI Voice Agents",
//       "Custom CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//       "Dedicated Success Manager",
//     ],
//   },
// ]

// const FEATURES = [
//   { name: "AI Voice Agents", starter: true, pro: true, enterprise: true },
//   { name: "CRM Integrations", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
//   { name: "Chat + SMS Channels", starter: false, pro: true, enterprise: true },
//   { name: "Priority Support", starter: false, pro: true, enterprise: true },
//   { name: "Dedicated Success Manager", starter: false, pro: false, enterprise: true },
// ]

// const OverageRate = 0.05
// const YEARLY_DISCOUNT = 0.2

// export default function Pricing() {
//   const [billing, setBilling] = useState("monthly")
//   const [minutes, setMinutes] = useState(1000)
//   const [alertMessage, setAlertMessage] = useState(null) // State for custom alert

//   const calculatePrice = (tier) => {
//     let base = tier.basePrice
//     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate
//     let total = base + overage
//     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT)
//     return Math.round(total)
//   }

//   const handleCtaClick = (tierName) => {
//     // Replaced prohibited alert() with custom state/modal
//     setAlertMessage(`Redirecting to Stripe checkout for ${tierName} plan.`);
//   }


//   return (
//     <section id="pricing" className="bg-white py-16  ">
//       <CustomAlert 
//         message={alertMessage} 
//         onClose={() => setAlertMessage(null)} 
//       />
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-5xl  text-gray-900 mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg text-gray-700 mb-6">
//             Choose the plan that fits your business. Scale as you grow.
//           </p>

//           {/* Billing Toggle */}
//           <div className="inline-flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
//             <button
//               className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
//                 billing === "monthly" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900"
//               }`}
//               onClick={() => setBilling("monthly")}
//             >
//               Monthly
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
//                 billing === "yearly" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900"
//               }`}
//               onClick={() => setBilling("yearly")}
//             >
//               Yearly{" "}
//               <span className="text-green-600 font-medium">(Save 20%)</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* Pricing Slider */}
//         <div className="mb-16 relative max-w-2xl mx-auto">
//           <div className="flex justify-between text-sm text-gray-600 mb-3 font-medium">
//             <span>0</span>
//             <span>500</span>
//             <span>2000</span>
//             <span>6000</span>
//             <span>10000+</span>
//           </div>

//           <div className="relative w-full">
//             {/* Filled Track */}
//             <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />
//             <div
//               className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary-600 rounded-full transition-all duration-300"
//               style={{ width: `${(minutes / 10000) * 100}%` }}
//             />

//             {/* Bubble */}
//             <motion.div
//               key={minutes}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: -30 }}
//               transition={{ duration: 0.3 }}
//               className="absolute -top-8 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-lg transform -translate-x-1/2 whitespace-nowrap"
//               style={{
//                 left: `${(minutes / 10000) * 100}%`,
//               }}
//             >
//               {minutes.toLocaleString()} mins
//             </motion.div>

//             {/* Slider */}
//             <input
//               type="range"
//               min={0}
//               max={10000}
//               step={100}
//               value={minutes}
//               onChange={(e) => setMinutes(Number(e.target.value))}
//               className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
//             />

//             {/* Thumb styles - Updated to use primary-600 color */}
//             <style jsx>{`
//               input[type="range"]::-webkit-slider-thumb {
//                 appearance: none;
//                 height: 22px;
//                 width: 22px;
//                 border-radius: 9999px;
//                 background: #008080; /* Equivalent of primary-600 */
//                 cursor: pointer;
//                 border: 2px solid white;
//                 box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
//                 margin-top: -10px;
//               }
//               input[type="range"]::-moz-range-thumb {
//                 height: 22px;
//                 width: 22px;
//                 border-radius: 9999px;
//                 background: #008080; /* Equivalent of primary-600 */
//                 cursor: pointer;
//                 border: 2px solid white;
//                 box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
//               }
//             `}</style>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 ">
//           {TIERS.map((tier, idx) => (
//             <motion.div
//               key={tier.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: idx * 0.2 }}
//               className={`border rounded-2xl p-8 flex flex-col shadow-lg transition hover:shadow-xl border-gray-200 ${
//                 // Highlight the Pro tier using primary-600
//                 tier.id === "pro" ? "scale-105 border-primary-600 shadow-primary-200/50 ring-2 ring-primary-600" : "hover:border-primary-600"
//               }`}
//             >
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">{tier.name}</h3>
//               <p className="text-5xl font-extrabold text-gray-900 mb-2">
//                 ${calculatePrice(tier)}
//                 <span className="text-lg font-medium text-gray-500">/{billing === "monthly" ? 'mo' : 'yr'}</span>
//               </p>
//               <p className="text-sm text-gray-500 mb-6 font-medium">
//                 Includes {tier.minutesIncluded.toLocaleString()} mins
//               </p>
//               <ul className="text-left space-y-3 mb-8 flex-grow">
//                 {tier.features.map((f, i) => (
//                   <li key={i} className="flex items-start text-gray-700">
//                     {/* Primary color checkmark */}
//                     <span className="text-primary-600 mr-2 mt-0.5 text-lg">✓</span> 
//                     <span>{f}</span>
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 onClick={() => handleCtaClick(tier.name)}
//                 className={`mt-auto py-3 rounded-xl font-bold transition-all duration-200 shadow-md ${
//                   // Primary button colors
//                   tier.id === "pro"
//                     ? "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/50"
//                     : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                 }`}
//               >
//                 Get Started
//               </button>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Comparison Table */}
//         {/* <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="overflow-x-auto border border-gray-200 rounded-lg shadow-md"
//         >
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="p-4 border-b border-gray-200 text-gray-900 font-bold min-w-[200px]">
//                   Features
//                 </th>
//                 {TIERS.map((tier) => (
//                   <th
//                     key={tier.id}
//                     className={`p-4 border-b border-gray-200 text-gray-900 font-bold text-center ${
//                       tier.id === "pro" ? "bg-primary-50 text-primary-800" : ""
//                     }`}
//                   >
//                     {tier.name}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {FEATURES.map((feature, i) => (
//                 <tr
//                   key={i}
//                   className="border-b border-gray-100 last:border-b-0"
//                 >
//                   <td className="p-4 text-gray-700 font-medium">{feature.name}</td>
//                   {["starter", "pro", "enterprise"].map((tier) => (
//                     <td key={tier} className={`p-4 text-center ${tier === "pro" ? "bg-primary-50" : ""}`}>
//                       {typeof feature[tier] === "boolean" ? (
//                         feature[tier] ? (
//                           <span className="text-primary-600 font-bold">✓</span>
//                         ) : (
//                           <span className="text-gray-400">—</span>
//                         )
//                       ) : (
//                         <span className="text-gray-700">{feature[tier]}</span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </motion.div> */}
//       </div>
//     </section>
//   )
// }

// // import { useState } from "react";
// // import { motion } from "framer-motion";
// // import { CheckIcon } from "@heroicons/react/20/solid"; // We'll use this for the checkmark

// // // Custom Modal Component for Alert replacement (Required due to environment restrictions)
// // const CustomAlert = ({ message, onClose }) => {
// //   if (!message) return null;

// //   return (
// //     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100">
// //         <h3 className="text-xl font-bold text-gray-900 mb-4">Action Required</h3>
// //         <p className="text-gray-700 mb-6">{message}</p>
// //         <button
// //           onClick={onClose}
// //           className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
// //         >
// //           Close
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- REVERTED TIERS DATA TO ORIGINAL STRUCTURE FOR SLIDER COMPATIBILITY ---
// // const ORIGINAL_TIERS = [
// //   {
// //     id: "starter",
// //     name: "Starter",
// //     tag: "Basic", // Added tag for consistent rendering with new card design
// //     basePrice: 54,
// //     minutesIncluded: 500,
// //     features: ["AI Voice Agents", "Basic CRM Integrations"],
// //     buttonText: "Get Started",
// //     exploreText: "Explore Details",
// //   },
// //   {
// //     id: "pro",
// //     name: "Pro",
// //     tag: "Most Popular", // Added tag for consistent rendering with new card design
// //     basePrice: 149,
// //     minutesIncluded: 2000,
// //     features: [
// //       "AI Voice Agents",
// //       "Advanced CRM Integrations",
// //       "Chat + SMS Channels",
// //       "Priority Support",
// //     ],
// //     buttonText: "Get Started",
// //     exploreText: "Explore Details",
// //   },
// //   {
// //     id: "enterprise",
// //     name: "Enterprise",
// //     tag: "Pro", // Adjusted tag for consistent rendering
// //     basePrice: 499,
// //     minutesIncluded: 6000,
// //     features: [
// //       "AI Voice Agents",
// //       "Custom CRM Integrations",
// //       "Chat + SMS Channels",
// //       "Priority Support",
// //       "Dedicated Success Manager",
// //     ],
// //     buttonText: "Get Started",
// //     exploreText: "Explore Details",
// //   },
// // ];

// // const OverageRate = 0.05;
// // const YEARLY_DISCOUNT = 0.2;

// // export default function Pricing() {
// //   const [billing, setBilling] = useState("monthly");
// //   const [minutes, setMinutes] = useState(1000);
// //   const [alertMessage, setAlertMessage] = useState(null); // State for custom alert

// //   const calculatePrice = (tier) => {
// //     let base = tier.basePrice;
// //     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate;
// //     let total = base + overage;
// //     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT);
// //     return Math.round(total);
// //   };

// //   const handleCtaClick = (tierName) => {
// //     setAlertMessage(`Redirecting to Stripe checkout for ${tierName} plan.`);
// //   };

// //   const handleExploreDetails = (tierName) => {
// //     setAlertMessage(`Exploring details for the ${tierName} package.`);
// //   };


// //   return (
// //     <section id="pricing" className="bg-white py-16 px-4">
// //       <CustomAlert
// //         message={alertMessage}
// //         onClose={() => setAlertMessage(null)}
// //       />
// //       <div className="max-w-6xl mx-auto px-6">
// //         {/* Hero Section (Reverted to original) */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 30 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.6 }}
// //           className="text-center mb-12"
// //         >
// //           <h1 className="text-5xl text-gray-900 mb-4">
// //             Simple, Transparent Pricing
// //           </h1>
// //           <p className="text-lg text-gray-700 mb-6">
// //             Choose the plan that fits your business. Scale as you grow.
// //           </p>

// //           {/* Billing Toggle (Reverted to original) */}
// //           <div className="inline-flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
// //             <button
// //               className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
// //                 billing === "monthly" ? "bg-purple-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900" // Using purple-600 to match previous 'primary-600' intent
// //               }`}
// //               onClick={() => setBilling("monthly")}
// //             >
// //               Monthly
// //             </button>
// //             <button
// //               className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
// //                 billing === "yearly" ? "bg-purple-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900"
// //               }`}
// //               onClick={() => setBilling("yearly")}
// //             >
// //               Yearly{" "}
// //               <span className="text-green-600 font-medium">(Save 20%)</span>
// //             </button>
// //           </div>
// //         </motion.div>

// //         {/* Pricing Slider (Reverted to original) */}
// //         <div className="mb-16 relative max-w-2xl mx-auto">
// //           <div className="flex justify-between text-sm text-gray-600 mb-3 font-medium">
// //             <span>0</span>
// //             <span>500</span>
// //             <span>2000</span>
// //             <span>6000</span>
// //             <span>10000+</span>
// //           </div>

// //           <div className="relative w-full">
// //             {/* Filled Track */}
// //             <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />
// //             <div
// //               className="absolute top-1/2 -translate-y-1/2 h-2 bg-purple-600 rounded-full transition-all duration-300" // Using purple-600
// //               style={{ width: `${(minutes / 10000) * 100}%` }}
// //             />

// //             {/* Bubble */}
// //             <motion.div
// //               key={minutes}
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: -30 }}
// //               transition={{ duration: 0.3 }}
// //               className="absolute -top-8 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-lg transform -translate-x-1/2 whitespace-nowrap" // Using purple-600
// //               style={{
// //                 left: `${(minutes / 10000) * 100}%`,
// //               }}
// //             >
// //               {minutes.toLocaleString()} mins
// //             </motion.div>

// //             {/* Slider */}
// //             <input
// //               type="range"
// //               min={0}
// //               max={10000}
// //               step={100}
// //               value={minutes}
// //               onChange={(e) => setMinutes(Number(e.target.value))}
// //               className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
// //             />

// //             {/* Thumb styles - Updated to use purple-600 color for consistency*/}
// //             <style jsx>{`
// //               input[type="range"]::-webkit-slider-thumb {
// //                 appearance: none;
// //                 height: 22px;
// //                 width: 22px;
// //                 border-radius: 9999px;
// //                 background: #9333ea; /* Equivalent of purple-600 */
// //                 cursor: pointer;
// //                 border: 2px solid white;
// //                 box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
// //                 margin-top: -10px;
// //               }
// //               input[type="range"]::-moz-range-thumb {
// //                 height: 22px;
// //                 width: 22px;
// //                 border-radius: 9999px;
// //                 background: #9333ea; /* Equivalent of purple-600 */
// //                 cursor: pointer;
// //                 border: 2px solid white;
// //                 box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
// //               }
// //             `}</style>
// //           </div>
// //         </div>

// //         {/* Pricing Cards - RETAINING THE NEW DESIGN FROM YOUR IMAGE */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
// //           {ORIGINAL_TIERS.map((tier, idx) => (
// //             <motion.div
// //               key={tier.id}
// //               initial={{ opacity: 0, y: 40 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ duration: 0.6, delay: idx * 0.1 }}
// //               className={`relative border rounded-2xl p-6 flex flex-col w-full max-w-sm
// //                 ${tier.id === "pro" // Highlight "pro" tier as "Most Popular"
// //                   ? "bg-[#042f4c] text-white shadow-2xl scale-105" // Dark blue background for gold
// //                   : "bg-white text-gray-900 border-gray-200 shadow-lg" // Default light background
// //                 }
// //               `}
// //               style={{ minHeight: '580px' }} // Ensure consistent height for all cards
// //             >
// //               {/* Tag (Basic, Most Popular, Pro) */}
// //               <div
// //                 className={`absolute -top-3 px-4 py-1 rounded-full text-xs font-semibold uppercase
// //                   ${tier.id === "pro"
// //                     ? "bg-white text-gray-800" // White tag for gold
// //                     : "bg-purple-100 text-purple-700" // Purple tag for others (or adjusted to match image if needed)
// //                   }
// //                 `}
// //                 style={tier.id === "pro" ? { left: '50%', transform: 'translateX(-50%)' } : { right: '-10px' }}
// //               >
// //                 {tier.tag}
// //               </div>

// //               {/* Package Name */}
// //               <h3
// //                 className={`text-2xl font-semibold mb-2 mt-6
// //                   ${tier.id === "pro" ? "text-white" : "text-gray-900"}
// //                 `}
// //               >
// //                 {tier.name}
// //               </h3>
// //               {/* Price */}
// //               <p
// //                 className={`text-4xl font-extrabold mb-2
// //                   ${tier.id === "pro" ? "text-white" : "text-gray-900"}
// //                 `}
// //               >
// //                 ${calculatePrice(tier)}
// //                 <span className={`text-lg font-medium ${tier.id === "pro" ? "text-gray-300" : "text-gray-500"}`}>
// //                   /{billing === "monthly" ? 'mo' : 'yr'}
// //                 </span>
// //               </p>
// //               {/* Description */}
// //               <p
// //                 className={`text-sm mb-6
// //                   ${tier.id === "pro" ? "text-gray-300" : "text-gray-600"}
// //                 `}
// //               >
// //                 Includes {tier.minutesIncluded.toLocaleString()} mins
// //               </p>

// //               {/* Select Package Button */}
// //               <button
// //                 onClick={() => handleCtaClick(tier.name)}
// //                 className={`w-full py-3 rounded-xl font-bold transition-all duration-200 mb-6
// //                   ${tier.id === "pro"
// //                     ? "bg-white text-[#042f4c] hover:bg-gray-100" // White button with dark blue text for gold
// //                     : "bg-[#042f4c] text-white hover:bg-[#074668]" // Dark blue button with white text for others
// //                   }
// //                 `}
// //               >
// //                 {tier.buttonText}
// //               </button>

// //               {/* Features List */}
// //               <ul className="space-y-3 mb-8 flex-grow">
// //                 {tier.features.map((feature, i) => (
// //                   <li key={i} className="flex items-center">
// //                     <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> {/* Green checkmark */}
// //                     <span
// //                       className={`text-base
// //                         ${tier.id === "pro" ? "text-white" : "text-gray-700"}
// //                       `}
// //                     >
// //                       {feature}
// //                     </span>
// //                   </li>
// //                 ))}
// //               </ul>

// //               {/* Explore Details Link */}
// //               <button
// //                 onClick={() => handleExploreDetails(tier.name)}
// //                 className={`mt-auto text-base font-semibold transition-colors hover:underline
// //                   ${tier.id === "pro" ? "text-white hover:text-gray-300" : "text-[#042f4c] hover:text-[#074668]"}
// //                 `}
// //               >
// //                 {tier.exploreText}
// //               </button>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }
// // // import { useState } from "react";
// // // import { motion } from "framer-motion";
// // // import { CheckIcon } from "@heroicons/react/20/solid";

// // // // ✅ Custom Modal Alert
// // // const CustomAlert = ({ message, onClose }) => {
// // //   if (!message) return null;
// // //   return (
// // //     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
// // //       <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
// // //         <h3 className="text-xl font-bold text-gray-900 mb-4">Action Required</h3>
// // //         <p className="text-gray-700 mb-6">{message}</p>
// // //         <button
// // //           onClick={onClose}
// // //           className="w-full py-2 rounded-lg bg-[#042f4c] text-white font-semibold hover:bg-[#074668] transition"
// // //         >
// // //           Close
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const TIERS = [
// // //   {
// // //     id: "starter",
// // //     name: "Starter",
// // //     tag: "Basic",
// // //     basePrice: 54,
// // //     minutesIncluded: 500,
// // //     features: ["AI Voice Agents", "Basic CRM Integrations"],
// // //     buttonText: "Get Started",
// // //     exploreText: "Explore Details",
// // //   },
// // //   {
// // //     id: "pro",
// // //     name: "Pro",
// // //     tag: "Most Popular",
// // //     basePrice: 149,
// // //     minutesIncluded: 2000,
// // //     features: [
// // //       "AI Voice Agents",
// // //       "Advanced CRM Integrations",
// // //       "Chat + SMS Channels",
// // //       "Priority Support",
// // //     ],
// // //     buttonText: "Get Started",
// // //     exploreText: "Explore Details",
// // //   },
// // //   {
// // //     id: "enterprise",
// // //     name: "Enterprise",
// // //     tag: "Pro",
// // //     basePrice: 499,
// // //     minutesIncluded: 6000,
// // //     features: [
// // //       "AI Voice Agents",
// // //       "Custom CRM Integrations",
// // //       "Chat + SMS Channels",
// // //       "Priority Support",
// // //       "Dedicated Success Manager",
// // //     ],
// // //     buttonText: "Get Started",
// // //     exploreText: "Explore Details",
// // //   },
// // // ];

// // // const OverageRate = 0.05;
// // // const YEARLY_DISCOUNT = 0.2;

// // // export default function Pricing() {
// // //   const [billing, setBilling] = useState("monthly");
// // //   const [minutes, setMinutes] = useState(1000);
// // //   const [alertMessage, setAlertMessage] = useState(null);

// // //   const calculatePrice = (tier) => {
// // //     let base = tier.basePrice;
// // //     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate;
// // //     let total = base + overage;
// // //     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT);
// // //     return Math.round(total);
// // //   };

// // //   const handleCtaClick = (tierName) => {
// // //     setAlertMessage(`Redirecting to Stripe checkout for ${tierName} plan.`);
// // //   };

// // //   const handleExploreDetails = (tierName) => {
// // //     setAlertMessage(`Exploring details for the ${tierName} package.`);
// // //   };

// // //   return (
// // //     <section id="pricing" className="bg-white py-20 px-4 sm:px-6 font-poppins">
// // //       <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />

// // //       <div className="max-w-6xl mx-auto">
// // //         {/* Header */}
// // //         <motion.div
// // //           initial={{ opacity: 0, y: 30 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.6 }}
// // //           className="text-center mb-16"
// // //         >
// // //           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
// // //             Simple, Transparent Pricing
// // //           </h1>
// // //           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// // //             Choose the plan that fits your business. Scale as you grow.
// // //           </p>

// // //           {/* Billing Toggle */}
// // //           <div className="mt-8 inline-flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
// // //             <button
// // //               className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
// // //                 billing === "monthly"
// // //                   ? "bg-[#042f4c] text-white shadow-md"
// // //                   : "text-gray-600 hover:text-gray-900"
// // //               }`}
// // //               onClick={() => setBilling("monthly")}
// // //             >
// // //               Monthly
// // //             </button>
// // //             <button
// // //               className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
// // //                 billing === "yearly"
// // //                   ? "bg-[#042f4c] text-white shadow-md"
// // //                   : "text-gray-600 hover:text-gray-900"
// // //               }`}
// // //               onClick={() => setBilling("yearly")}
// // //             >
// // //               Yearly{" "}
// // //               <span className="text-green-600 font-medium">(Save 20%)</span>
// // //             </button>
// // //           </div>
// // //         </motion.div>

// // //         {/* Slider */}
// // //         <div className="mb-20 max-w-2xl mx-auto">
// // //           <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
// // //             <span>0</span>
// // //             <span>500</span>
// // //             <span>2000</span>
// // //             <span>6000</span>
// // //             <span>10000+</span>
// // //           </div>

// // //           <div className="relative">
// // //             <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />
// // //             <div
// // //               className="absolute top-1/2 -translate-y-1/2 h-2 bg-[#042f4c] rounded-full transition-all duration-300"
// // //               style={{ width: `${(minutes / 10000) * 100}%` }}
// // //             />

// // //             <motion.div
// // //               key={minutes}
// // //               initial={{ opacity: 0, y: -10 }}
// // //               animate={{ opacity: 1, y: -30 }}
// // //               transition={{ duration: 0.3 }}
// // //               className="absolute -top-8 bg-[#042f4c] text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md transform -translate-x-1/2"
// // //               style={{ left: `${(minutes / 10000) * 100}%` }}
// // //             >
// // //               {minutes.toLocaleString()} mins
// // //             </motion.div>

// // //             <input
// // //               type="range"
// // //               min={0}
// // //               max={10000}
// // //               step={100}
// // //               value={minutes}
// // //               onChange={(e) => setMinutes(Number(e.target.value))}
// // //               className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
// // //             />

// // //             <style jsx>{`
// // //               input[type="range"]::-webkit-slider-thumb {
// // //                 appearance: none;
// // //                 height: 20px;
// // //                 width: 20px;
// // //                 border-radius: 9999px;
// // //                 background: #042f4c;
// // //                 border: 2px solid white;
// // //                 box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
// // //               }
// // //               input[type="range"]::-moz-range-thumb {
// // //                 height: 20px;
// // //                 width: 20px;
// // //                 border-radius: 9999px;
// // //                 background: #042f4c;
// // //                 border: 2px solid white;
// // //               }
// // //             `}</style>
// // //           </div>
// // //         </div>

// // //         {/* Pricing Cards */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
// // //           {TIERS.map((tier, idx) => (
// // //             <motion.div
// // //               key={tier.id}
// // //               initial={{ opacity: 0, y: 40 }}
// // //               whileInView={{ opacity: 1, y: 0 }}
// // //               viewport={{ once: true }}
// // //               transition={{ duration: 0.6, delay: idx * 0.1 }}
// // //               className={`relative border rounded-2xl p-8 flex flex-col w-full max-w-sm
// // //                 ${
// // //                   tier.id === "pro"
// // //                     ? "bg-[#042f4c] text-white shadow-2xl scale-105"
// // //                     : "bg-white text-gray-900 border-gray-200 shadow-lg"
// // //                 }`}
// // //             >
// // //               {/* Tag */}
// // //               <div
// // //                 className={`absolute -top-3 px-4 py-1 rounded-full text-xs font-semibold uppercase ${
// // //                   tier.id === "pro"
// // //                     ? "bg-white text-gray-800"
// // //                     : "bg-teal-100 text-teal-700"
// // //                 }`}
// // //                 style={
// // //                   tier.id === "pro"
// // //                     ? { left: "50%", transform: "translateX(-50%)" }
// // //                     : { right: "-10px" }
// // //                 }
// // //               >
// // //                 {tier.tag}
// // //               </div>

// // //               <h3
// // //                 className={`text-2xl font-semibold mb-2 mt-6 ${
// // //                   tier.id === "pro" ? "text-white" : "text-gray-900"
// // //                 }`}
// // //               >
// // //                 {tier.name}
// // //               </h3>

// // //               <p
// // //                 className={`text-4xl font-extrabold mb-2 ${
// // //                   tier.id === "pro" ? "text-white" : "text-gray-900"
// // //                 }`}
// // //               >
// // //                 ${calculatePrice(tier)}
// // //                 <span
// // //                   className={`text-lg font-medium ${
// // //                     tier.id === "pro" ? "text-gray-300" : "text-gray-500"
// // //                   }`}
// // //                 >
// // //                   /{billing === "monthly" ? "mo" : "yr"}
// // //                 </span>
// // //               </p>

// // //               <p
// // //                 className={`text-sm mb-6 ${
// // //                   tier.id === "pro" ? "text-gray-300" : "text-gray-600"
// // //                 }`}
// // //               >
// // //                 Includes {tier.minutesIncluded.toLocaleString()} mins
// // //               </p>

// // //               <button
// // //                 onClick={() => handleCtaClick(tier.name)}
// // //                 className={`w-full py-3 rounded-xl font-bold transition-all duration-200 mb-6 ${
// // //                   tier.id === "pro"
// // //                     ? "bg-white text-[#042f4c] hover:bg-gray-100"
// // //                     : "bg-[#042f4c] text-white hover:bg-[#074668]"
// // //                 }`}
// // //               >
// // //                 {tier.buttonText}
// // //               </button>

// // //               <ul className="space-y-3 mb-8 flex-grow">
// // //                 {tier.features.map((feature, i) => (
// // //                   <li key={i} className="flex items-center">
// // //                     <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
// // //                     <span
// // //                       className={`text-base ${
// // //                         tier.id === "pro" ? "text-white" : "text-gray-700"
// // //                       }`}
// // //                     >
// // //                       {feature}
// // //                     </span>
// // //                   </li>
// // //                 ))}
// // //               </ul>

// // //               <button
// // //                 onClick={() => handleExploreDetails(tier.name)}
// // //                 className={`mt-auto text-base font-semibold transition-colors hover:underline ${
// // //                   tier.id === "pro"
// // //                     ? "text-white hover:text-gray-300"
// // //                     : "text-[#042f4c] hover:text-[#074668]"
// // //                 }`}
// // //               >
// // //                 {tier.exploreText}
// // //               </button>
// // //             </motion.div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // }

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { CheckIcon } from "@heroicons/react/20/solid";

// // ✅ Custom Modal Alert
// const CustomAlert = ({ message, onClose }) => {
//   if (!message) return null;
//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">Action Required</h3>
//         <p className="text-gray-700 mb-6">{message}</p>
//         <button
//           onClick={onClose}
//           className="w-full py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// const TIERS = [
//   {
//     id: "starter",
//     name: "Starter",
//     tag: "Basic",
//     basePrice: 54,
//     minutesIncluded: 500,
//     features: [ "AI Voice Agents",
//       "Custom CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//       "Dedicated Success Manager",],
//     buttonText: "Get Started",
//     exploreText: "Explore Details",
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     tag: "Most Popular",
//     basePrice: 149,
//     minutesIncluded: 2000,
//     features: [
//       "AI Voice Agents",
//       "Custom CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//       "Dedicated Success Manager",
//     ],
//     buttonText: "Get Started",
//     exploreText: "Explore Details",
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     tag: "Pro",
//     basePrice: 499,
//     minutesIncluded: 6000,
//     features: [
//       "AI Voice Agents",
//       "Custom CRM Integrations",
//       "Chat + SMS Channels",
//       "Priority Support",
//       "Dedicated Success Manager",
//     ],
//     buttonText: "Get Started",
//     exploreText: "Explore Details",
//   },
// ];

// const OverageRate = 0.05;
// const YEARLY_DISCOUNT = 0.2;

// export default function Pricing() {
//   const [billing, setBilling] = useState("monthly");
//   const [minutes, setMinutes] = useState(1000);
//   const [alertMessage, setAlertMessage] = useState(null);

//   const calculatePrice = (tier) => {
//     let base = tier.basePrice;
//     let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate;
//     let total = base + overage;
//     if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT);
//     return Math.round(total);
//   };

//   const handleCtaClick = (tierName) => {
//     setAlertMessage(`Redirecting to Stripe checkout for ${tierName} plan.`);
//   };

//   const handleExploreDetails = (tierName) => {
//     setAlertMessage(`Exploring details for the ${tierName} package.`);
//   };

//   return (
//     <section id="pricing" className="bg-background py-20 px-4 sm:px-6 font-poppins">
//       <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />

//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <h1 className="text-3xl md:text-5xl text-white mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg text-white max-w-2xl mx-auto">
//             Choose the plan that fits your business. Scale as you grow.
//           </p>

//           {/* Billing Toggle */}
//           <div className="mt-8 inline-flex items-center bg-secondary-100 rounded-full p-1 shadow-inner">
//             <button
//               className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:border-[#FF1E1E] ${
//                 billing === "monthly"
//                   ? "bg-primary-600 text-black shadow-md"
//                   : "text-gray-600 hover:text-black hover:border-2 border-transparent"
//               }`}
//               onClick={() => setBilling("monthly")}
//             >
//               Monthly
//             </button>
//             <button
//               className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:border-[#FF1E1E] ${
//                 billing === "yearly"
//                   ? "bg-primary-600 text-black shadow-md"
//                   : "text-gray-600 hover:border-2 border-transparent "
//               }`}
//               onClick={() => setBilling("yearly")}
//             >
//               Yearly{" "}
//               <span className="text-black font-medium">(Save 20%)</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* Slider */}
//         <div className="mb-20 max-w-2xl mx-auto">
//           <div className="flex justify-between text-sm text-white mb-2 font-medium">
//             <span>0</span>
//             <span>500</span>
//             <span>2000</span>
//             <span>6000</span>
//             <span>10000+</span>
//           </div>

//           <div className="relative">
//             <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />
//             <div
//               className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary-600 rounded-full transition-all duration-300"
//               style={{ width: `${(minutes / 10000) * 100}%` }}
//             />

//             <motion.div
//               key={minutes}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: -30 }}
//               transition={{ duration: 0.3 }}
//               className="absolute -top-8 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md transform -translate-x-1/2"
//               style={{ left: `${(minutes / 10000) * 100}%` }}
//             >
//               {minutes.toLocaleString()} mins
//             </motion.div>

//             <input
//               type="range"
//               min={0}
//               max={10000}
//               step={100}
//               value={minutes}
//               onChange={(e) => setMinutes(Number(e.target.value))}
//               className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
//             />

//             <style jsx>{`
//               input[type="range"]::-webkit-slider-thumb {
//                 appearance: none;
//                 height: 20px;
//                 width: 20px;
//                 border-radius: 9999px;
//                 background: #040404ff;
//                 border: 2px solid white;
//                 box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
//               }
//               input[type="range"]::-moz-range-thumb {
//                 height: 20px;
//                 width: 20px;
//                 border-radius: 9999px;
//                 background: #2094A8;
//                 border: 2px solid white;
//               }
//             `}</style>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
//           {TIERS.map((tier, idx) => (
//             <motion.div
//               key={tier.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: idx * 0.1 }}
//               className={`relative border rounded-2xl p-8 flex flex-col w-full max-w-sm
//                 ${
//                   tier.id === "pro"
//                     ? "bg-primary-600 text-white shadow-2xl scale-105"
//                     : "bg-white text-gray-900 border-gray-200 shadow-lg"
//                 }`}
//             >
//               {/* Tag */}
//               <div
//                 className={`absolute -top-3 px-4 py-1 rounded-full text-xs font-semibold uppercase ${
//                   tier.id === "pro"
//                     ? "bg-white text-gray-800"
//                     : "bg-secondary-100 text-black"
//                 }`}
//                 style={
//                   tier.id === "pro"
//                     ? { left: "50%", transform: "translateX(-50%)" }
//                     : { right: "-10px" }
//                 }
//               >
//                 {tier.tag}
//               </div>

//               <h3
//                 className={`text-2xl font-semibold mb-2 mt-6 ${
//                   tier.id === "pro" ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 {tier.name}
//               </h3>

//               <p
//                 className={`text-4xl font-extrabold mb-2 ${
//                   tier.id === "pro" ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 ${calculatePrice(tier)}
//                 <span
//                   className={`text-lg font-medium ${
//                     tier.id === "pro" ? "text-secondary-200" : "text-gray-500"
//                   }`}
//                 >
//                   /{billing === "monthly" ? "mo" : "yr"}
//                 </span>
//               </p>

//               <p
//                 className={`text-sm mb-6 ${
//                   tier.id === "pro" ? "text-secondary-100" : "text-gray-600"
//                 }`}
//               >
//                 Includes {tier.minutesIncluded.toLocaleString()} mins
//               </p>

//               <button
//                 onClick={() => handleCtaClick(tier.name)}
//                 className={`w-full py-3 rounded-xl font-bold transition-all duration-200 mb-6 ${
//                   tier.id === "pro"
//                     ? "bg-white text-primary-600 hover:bg-gray-100"
//                     : "bg-primary-600 text-white hover:bg-primary-700"
//                 }`}
//               >
//                 {tier.buttonText}
//               </button>

//               <ul className="space-y-3 mb-8 flex-grow">
//                 {tier.features.map((feature, i) => (
//                   <li key={i} className="flex items-center">
//                     <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
//                     <span
//                       className={`text-base ${
//                         tier.id === "pro" ? "text-white" : "text-gray-700"
//                       }`}
//                     >
//                       {feature}
//                     </span>
//                   </li>
//                 ))}
//               </ul>

//               <button
//                 onClick={() => handleExploreDetails(tier.name)}
//                 className={`mt-auto text-base font-semibold transition-colors hover:underline border-t-2 border-lightgray  pt-3 ${
//                   tier.id === "pro"
//                     ? "text-white hover:text-secondary-200"
//                     : "text-primary-600 border-t-2 border-gray-600 hover:text-primary-700"
//                 }`}
//               >
//                 {tier.exploreText}
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
// pricing.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid"; // ⬅️ Added X icon

// ✅ Custom Modal Alert
const CustomAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Action Required</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ✅ Updated features list with included/excluded options
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    tag: "Basic",
    basePrice: 54,
    minutesIncluded: 500,
    features: [
      { name: "AI Voice Agents", included: true },
      { name: "Custom CRM Integrations", included: false },
      { name: "Chat + SMS Channels", included: true },
      { name: "Priority Support", included: false },
      { name: "Dedicated Success Manager", included: false },
    ],
    buttonText: "Get Started",
    exploreText: "Explore Details",
  },
  {
    id: "pro",
    name: "Pro",
    tag: "Most Popular",
    basePrice: 149,
    minutesIncluded: 2000,
    features: [
      { name: "AI Voice Agents", included: true },
      { name: "Custom CRM Integrations", included: true },
      { name: "Chat + SMS Channels", included: true },
      { name: "Priority Support", included: true },
      { name: "Dedicated Success Manager", included: false },
    ],
    buttonText: "Get Started",
    exploreText: "Explore Details",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tag: "Pro",
    basePrice: 499,
    minutesIncluded: 6000,
    features: [
      { name: "AI Voice Agents", included: true },
      { name: "Custom CRM Integrations", included: true },
      { name: "Chat + SMS Channels", included: true },
      { name: "Priority Support", included: true },
      { name: "Dedicated Success Manager", included: true },
    ],
    buttonText: "Get Started",
    exploreText: "Explore Details",
  },
];

const OverageRate = 0.05;
const YEARLY_DISCOUNT = 0.2;

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const [minutes, setMinutes] = useState(1000);
  const [alertMessage, setAlertMessage] = useState(null);

  const calculatePrice = (tier) => {
    let base = tier.basePrice;
    let overage = Math.max(0, minutes - tier.minutesIncluded) * OverageRate;
    let total = base + overage;
    if (billing === "yearly") total = total * (1 - YEARLY_DISCOUNT);
    return Math.round(total);
  };

  const handleCtaClick = (tierName) => {
    setAlertMessage(`Redirecting to Stripe checkout for ${tierName} plan.`);
  };

  const handleExploreDetails = (tierName) => {
    setAlertMessage(`Exploring details for the ${tierName} package.`);
  };

  return (
    <section id="pricing" className="bg-background py-20 px-4 sm:px-6 font-poppins">
      <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Choose the plan that fits your business. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center bg-secondary-100 rounded-full p-1 shadow-inner">
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:border-[#FF1E1E] ${
                billing === "monthly"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:text-black hover:border-2 border-transparent"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:border-[#FF1E1E] ${
                billing === "yearly"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:border-2 border-transparent "
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly{" "}
              <span className="text-white font-medium">(Save 20%)</span>
            </button>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="mb-20 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-white mb-2 font-medium">
            <span>0</span>
            <span>500</span>
            <span>2000</span>
            <span>6000</span>
            <span>10000+</span>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${(minutes / 10000) * 100}%` }}
            />

            <motion.div
              key={minutes}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: -30 }}
              transition={{ duration: 0.3 }}
              className="absolute -top-8 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md transform -translate-x-1/2"
              style={{ left: `${(minutes / 10000) * 100}%` }}
            >
              {minutes.toLocaleString()} mins
            </motion.div>

            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
            />

            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 9999px;
                background: #040404ff;
                border: 2px solid white;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                 position: relative;
                 top: -5px; /* move up */
              }
              input[type="range"]::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 9999px;
                background: #2094A8;
                border: 2px solid white;
              }
            `}</style>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {TIERS.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative border rounded-2xl p-8 flex flex-col w-full max-w-sm
                ${
                  tier.id === "pro"
                    ? "bg-primary-600 text-white shadow-2xl scale-105"
                    : "bg-white text-gray-900 border-gray-200 shadow-lg"
                }`}
            >
              {/* Tag */}
              <div
                className={`absolute -top-3 px-4 py-1 rounded-full text-xs font-semibold uppercase ${
                  tier.id === "pro"
                    ? "bg-white text-gray-800"
                    : "bg-secondary-100 text-black"
                }`}
                style={
                  tier.id === "pro"
                    ? { left: "50%", transform: "translateX(-50%)" }
                    : { right: "-10px" }
                }
              >
                {tier.tag}
              </div>

              <h3
                className={`text-2xl font-semibold mb-2 mt-6 ${
                  tier.id === "pro" ? "text-white" : "text-gray-900"
                }`}
              >
                {tier.name}
              </h3>

              <p
                className={`text-4xl font-extrabold mb-2 ${
                  tier.id === "pro" ? "text-white" : "text-gray-900"
                }`}
              >
                ${calculatePrice(tier)}
                <span
                  className={`text-lg font-medium ${
                    tier.id === "pro" ? "text-secondary-200" : "text-gray-500"
                  }`}
                >
                  /{billing === "monthly" ? "mo" : "yr"}
                </span>
              </p>

              <p
                className={`text-sm mb-6 ${
                  tier.id === "pro" ? "text-secondary-100" : "text-gray-600"
                }`}
              >
                Includes {tier.minutesIncluded.toLocaleString()} mins
              </p>

              <button
                onClick={() => handleCtaClick(tier.name)}
                className={`w-full py-3 rounded-xl font-bold transition-all duration-200 mb-6 ${
                  tier.id === "pro"
                    ? "bg-white text-primary-600 hover:bg-gray-100"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {tier.buttonText}
              </button>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    {feature.included ? (
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-black-500 mr-2" />
                    )}
                    <span
                      className={`text-base ${
                        feature.included
                          ? tier.id === "pro"
                            ? "text-white"
                            : "text-gray-700"
                            : "text-gray-400 "
                          // : "text-gray-400 line-through"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleExploreDetails(tier.name)}
                className={`mt-auto text-base font-semibold transition-colors hover:underline border-t-2 border-lightgray pt-3  focus:outline-none focus:ring-0 ${
                  tier.id === "pro"
                    ? "text-white hover:text-secondary-200"
                    : "text-primary-600 border-t-2 border-black hover:text-primary-700"
                }`}
              >
                {tier.exploreText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
