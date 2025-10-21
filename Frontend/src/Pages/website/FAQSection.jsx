// // import React, { useState } from "react";
// // import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"; // Requires @heroicons/react

// // const FAQSection = () => {
// //   const [openIndex, setOpenIndex] = useState(null);

// //   const faqs = [
// //     {
// //       question: 'What is Synthflow?',
// //       answer: 'Synthflow provides AI-powered voice agents designed to handle high-volume customer calls, sales interactions, and support queries with human-like conversation capabilities.',
// //     },
// //     {
// //       question: 'Does Synthflow offer a free trial?',
// //       answer: 'Yes, Synthflow offers a free trial for new users to explore its features and integrate it into their workflows. Contact our sales team for more details.',
// //     },
// //     {
// //       question: 'We already have a support team. Why use Synthflow?',
// //       answer: 'Synthflow augments your existing team by automating routine calls, reducing hold times, and ensuring instant responses, allowing your human agents to focus on complex issues and high-value interactions.',
// //     },
// //     {
// //       question: 'Is Synthflow secure and compliant?',
// //       answer: 'Absolutely. Synthflow adheres to industry-leading security protocols and compliance standards to protect your data and ensure privacy.',
// //     },
// //     // {
// //     //   question: 'Can I customize Synthflow for my workflows?',
// //     //   answer: 'Yes, Synthflow is highly customizable. You can tailor its responses, integrations, and operational logic to perfectly fit your unique business processes and customer interaction models.',
// //     // },
// //     // {
// //     //   question: 'Can Synthflow integrate with our current tools?',
// //     //   answer: 'Synthflow is designed for seamless integration with a wide range of CRM, ERP, and other business systems through robust APIs and pre-built connectors.',
// //     // },
// //     // {
// //     //   question: 'How quickly can I get started?',
// //     //   answer: 'Getting started with Synthflow is straightforward. Our onboarding process is efficient, and most businesses can have their AI voice agents operational within a few days to a couple of weeks, depending on complexity.',
// //     // },
// //     // {
// //     //   question: 'What if the AI says something off-brand?',
// //     //   answer: 'Synthflow includes extensive brand guideline training and real-time monitoring to ensure all AI interactions align with your brand\'s tone and messaging. You also have control over scripts and guardrails.',
// //     // },
// //     // {
// //     //   question: 'What happens if the AI gets stuck?',
// //     //   answer: 'Synthflow has advanced fallbacks, including the ability to seamlessly transfer calls to a human agent when it encounters a situation it cannot resolve or if a customer requests it.',
// //     // },
// //     // {
// //     //   question: 'Can Synthflow filter spam calls?',
// //     //   answer: 'Yes, Synthflow can be configured to identify and filter out spam or unwanted calls, improving efficiency and ensuring your agents focus on legitimate inquiries.',
// //     // },
// //   ];

// //   const toggleFAQ = (index) => {
// //     setOpenIndex(openIndex === index ? null : index);
// //   };

// //   return (
// //     <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-12">
// //         {/* Left Section - Heading */}
// //         <div className="lg:w-1/3 mb-10 lg:mb-0">
// //           <p className="text-primary-600 font-semibold mb-2">FAQ</p>
// //           <h1 className="text-4xl  text-gray-900 leading-tight">
// //             Everything You Need to Know About Synthflow's AI Voice Agents
// //           </h1>
// //         </div>

// //         {/* Right Section - Accordion FAQs */}
// //         <div className="lg:w-2/3 space-y-4">
// //           {faqs.map((faq, index) => (
// //             <div key={index} className="border-b border-gray-200 py-4">
// //               <button
// //                 className="flex justify-between items-center w-full text-left focus:outline-none"
// //                 onClick={() => toggleFAQ(index)}
// //               >
// //                 <span className="text-lg font-medium text-gray-800">
// //                   {faq.question}
// //                 </span>
// //                 {openIndex === index ? (
// //                   <ChevronUpIcon className="h-5 w-5 text-purple-600" />
// //                 ) : (
// //                   <ChevronDownIcon className="h-5 w-5 text-gray-400" />
// //                 )}
// //               </button>
// //               {openIndex === index && (
// //                 <div className="mt-3 pr-8">
// //                   <p className="text-gray-600 leading-relaxed">
// //                     {faq.answer}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //           {/* "See more" link */}
// //           <div className="pt-4 text-left">
// //             <a href="#" className="text-primary-600 font-medium hover:underline flex items-center">
// //               See more
// //               {/* Optional: Add an arrow icon here if desired */}
// //             </a>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default FAQSection;

// // // import React, { useState } from "react";
// // // import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

// // // const FAQSection = () => {
// // //   const [openIndex, setOpenIndex] = useState(null);

// // //   const faqs = [
// // //     {
// // //       question: "What is Synthflow?",
// // //       answer:
// // //         "Synthflow is an AI-powered voice automation platform that helps businesses handle inbound and outbound calls with human-like conversational agents. It integrates seamlessly with your existing CRM and workflows to improve efficiency and reduce costs.",
// // //     },
// // //     {
// // //       question: "How does Synthflow’s AI Voice Agent work?",
// // //       answer:
// // //         "Our AI agents use advanced speech recognition and natural language processing to understand customers, respond intelligently, and complete tasks like scheduling, lead qualification, and support routing—all in real time.",
// // //     },
// // //     {
// // //       question: "Can Synthflow integrate with our CRM or tools?",
// // //       answer:
// // //         "Yes. Synthflow integrates with popular CRMs such as HubSpot, Salesforce, and Pipedrive, as well as communication tools like Twilio and Slack. Custom integrations are also supported through APIs.",
// // //     },
// // //     {
// // //       question: "Is there a free trial available?",
// // //       answer:
// // //         "Absolutely! You can start with a free trial to explore how Synthflow fits your business. Our onboarding team will help you set up your first AI voice agent in just minutes.",
// // //     },
// // //     {
// // //       question: "Is Synthflow compliant and secure?",
// // //       answer:
// // //         "Yes, security is a top priority. Synthflow is GDPR-compliant and uses enterprise-grade encryption to protect all customer data. We also provide options for region-specific data hosting.",
// // //     },
// // //     // {
// // //     //   question: "Can I customize the AI’s voice and tone?",
// // //     //   answer:
// // //     //     "Definitely. You can choose from multiple voice profiles and customize tone, speaking style, and language to match your brand’s personality and customer expectations.",
// // //     // },
// // //     // {
// // //     //   question: "What happens if the AI cannot answer a question?",
// // //     //   answer:
// // //     //     "If the AI encounters a situation it can’t resolve, it automatically transfers the conversation to a human agent or triggers a follow-up workflow to ensure customer satisfaction.",
// // //     // },
// // //     // {
// // //     //   question: "Does Synthflow support multiple languages?",
// // //     //   answer:
// // //     //     "Yes. Synthflow supports over 30 global languages and dialects, allowing your business to provide localized experiences to customers anywhere in the world.",
// // //     // },
// // //     // {
// // //     //   question: "How quickly can I deploy Synthflow?",
// // //     //   answer:
// // //     //     "Most businesses get started within 24–48 hours. Our setup process is fast and simple, and our support team assists with configuration, integration, and testing.",
// // //     // },
// // //     // {
// // //     //   question: "Can Synthflow scale with my business?",
// // //     //   answer:
// // //     //     "Absolutely. Synthflow is built to grow with your needs—from handling a few calls per day to managing thousands simultaneously without compromising quality or performance.",
// // //     // },
// // //   ];

// // //   const toggleFAQ = (index) => {
// // //     setOpenIndex(openIndex === index ? null : index);
// // //   };

// // //   return (
// // //     <section
// // //       id="faq"
// // //       className="bg-white py-20 px-6 sm:px-10 lg:px-16 font-[Poppins]"
// // //     >
// // //       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-16">
// // //         {/* Left Section */}
// // //         <div className="lg:w-1/3 mb-12 lg:mb-0">
// // //           <p className="text-purple-600 font-semibold mb-3 tracking-wide uppercase">
// // //             FAQ
// // //           </p>
// // //           <h1 className="text-4xl md:text-5xl text-gray-900 leading-snug font-semibold">
// // //             Everything You Need to Know About Synthflow’s AI Voice Agents
// // //           </h1>
// // //         </div>

// // //         {/* Right Section */}
// // //         <div className="lg:w-2/3 space-y-6">
// // //           {faqs.map((faq, index) => (
// // //             <div
// // //               key={index}
// // //               className="border-b border-gray-200 pb-5 transition-all duration-300"
// // //             >
// // //               <button
// // //                 className="flex justify-between items-center w-full text-left focus:outline-none"
// // //                 onClick={() => toggleFAQ(index)}
// // //               >
// // //                 <span className="text-lg md:text-xl font-medium text-gray-800">
// // //                   {faq.question}
// // //                 </span>
// // //                 {openIndex === index ? (
// // //                   <ChevronUpIcon className="h-6 w-6 text-purple-600" />
// // //                 ) : (
// // //                   <ChevronDownIcon className="h-6 w-6 text-gray-400" />
// // //                 )}
// // //               </button>

// // //               <div
// // //                 className={`overflow-hidden transition-all duration-300 ease-in-out ${
// // //                   openIndex === index ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
// // //                 }`}
// // //               >
// // //                 <p className="text-gray-600 leading-relaxed text-base">
// // //                   {faq.answer}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           ))}

// // //           {/* See more link */}
// // //           <div className="pt-4">
// // //             <a
// // //               href="#"
// // //               className="text-purple-600 font-medium hover:underline text-base flex items-center"
// // //             >
// // //               See more questions →
// // //             </a>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default FAQSection;


import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is AI?",
      answer:
        "AI is an AI-powered voice automation platform that helps businesses handle inbound and outbound calls with human-like conversational agents. It integrates seamlessly with your existing CRM and workflows to improve efficiency and reduce costs.",
    },
    {
      question: "How does  AI Voice Agent work?",
      answer:
        "Our AI agents use advanced speech recognition and natural language processing to understand customers, respond intelligently, and complete tasks like scheduling, lead qualification, and support routing—all in real time.",
    },
    {
      question: "Can  integrate with our CRM or tools?",
      answer:
        "Yes.  integrates with popular CRMs such as HubSpot, Salesforce, and Pipedrive, as well as communication tools like Twilio and Slack. Custom integrations are also supported through APIs.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Absolutely! You can start with a free trial to explore how Wendira fits your business. Our onboarding team will help you set up your first AI voice agent in just minutes.",
    },
    {
      question: "Is  compliant and secure?",
      answer:
        "Yes, security is a top priority. Wendira is GDPR-compliant and uses enterprise-grade encryption to protect all customer data. We also provide options for region-specific data hosting.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-black text-white py-20 px-6 sm:px-10 lg:px-16 font-poppins"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-16">
        {/* Left Section */}
        <div className="lg:w-1/3 mb-12 lg:mb-0">
          <p className="text-primary-500 text-3xl mb-3 tracking-wide uppercase">
            FAQ
          </p>
          <h1 className="text-3xl md:text-4xl text-white leading-snug ">
            Everything You Need to Know About Wendira’s AI Voice Agents
          </h1>
        </div>

        {/* Right Section */}
        <div className="lg:w-2/3 space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-800 pb-5 transition-all duration-300"
            >
              <button
                className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-0 "
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg md:text-xl font-medium text-gray-200 hover:text-white transition">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-6 w-6 text-white" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-white " />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-40 mt-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-400 leading-relaxed text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}

          {/* See more link */}
          <div className="pt-4">
            <a
              href="#"
              className="text-white font-medium hover:text-primary-500 hover:bg-white  flex items-center border border-primary-500 px-4 py-2 rounded-lg w-fit"
            >
              See more questions →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
