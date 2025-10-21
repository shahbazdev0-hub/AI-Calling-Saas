// import React from "react";
// import { motion } from "framer-motion";

// // --- Theme and Content Configuration ---

// export const FINITAC_COLORS = {
//     TEAL: '#38c1a5',
//     CTA_START: '#e0f7fa', // Light Aqua
//     CTA_END: '#b3e5fc',   // Light Blue
//     BUTTON: 'bg-gray-900',
//     BUTTON_HOVER: 'hover:bg-gray-700',
// };

// export const FEATURES = [
//     {
//         title: 'Decades of Experience',
//         description: "We organize your daily financial tasks like tracking sales, invoices, and expenses, so you can spend more time growing your business. Our proven processes cut down errors and keep everything running smoothly.",
//     },
//     {
//         title: 'Latest AI Tools For Efficient Bookkeeping',
//         description: "We use modern software products to cut down on manual tasks and potential errors. Get real-time updates on your numbers and tweak your strategies on the go with our AI-backed software.",
//     },
//     {
//         title: 'Dedicated Support',
//         description: "Do you have a question, need advice urgently or require access to some data? Our team will answer your query around the clock. We'd be always available to assist you with your finances.",
//     },
// ];

// // --- Custom Components ---

// /**
//  * Reusable component for the feature cards in the right column.
//  */
// const FeatureCard = ({ title, description, isLast }) => {
//     const borderClass = isLast ? '' : 'border-b border-gray-200 pb-6 mb-6';
    
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.5 }}
//             className={borderClass}
//         >
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
//             <p className="text-base text-gray-600 leading-relaxed">{description}</p>
//         </motion.div>
//     );
// };

// /**
//  * Main section component containing the layout (Image + Features).
//  */
// export const WhyChooseFinitac = () => {
//     return (
//         <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-poppins">
            
//             {/* Header and Tagline */}
//             <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6 }}
//                 className="mb-12"
//             >
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
//                     Why Choose 
//                     <span 
//                         className="rounded-lg shadow-md font-extrabold px-3 py-1 ml-2 mr-1 text-white"
//                         style={{ backgroundColor: FINITAC_COLORS.TEAL }}
//                     >
//                         FINITAC?
//                     </span>
//                 </h1>
//                 <p className="mt-4 text-lg text-gray-700 max-w-3xl">
//                     We're the best option when it comes to finding small business bookkeepers near me, we stand out by offering great value for your money.
//                 </p>
//             </motion.div>

//             {/* Layout Container (Image and Features) */}
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

//                 {/* Left Column: Image */}
//                 <motion.div
//                     initial={{ opacity: 0, x: -50 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true, amount: 0.3 }}
//                     transition={{ duration: 0.7 }}
//                     className="lg:col-span-5 rounded-2xl shadow-2xl overflow-hidden"
//                 >
//                     {/* Placeholder Image URL */}
//                     <img 
//                         src="https://placehold.co/800x800/222222/ffffff?text=Professional+Bookkeeper" 
//                         alt="A professional bookkeeper smiling while working at a desk."
//                         className="w-full h-full object-cover min-h-[300px] md:min-h-[400px] lg:min-h-[500px]"
//                         loading="lazy"
//                     />
//                 </motion.div>

//                 {/* Right Column: Features */}
//                 <div className="lg:col-span-7 pt-4">
//                     {FEATURES.map((feature, index) => (
//                         <FeatureCard 
//                             key={index}
//                             title={feature.title}
//                             description={feature.description}
//                             isLast={index === FEATURES.length - 1}
//                         />
//                     ))}
                    
//                     {/* Schedule Now Button - Hidden on Mobile */}
//                     <button 
//                         className={`hidden md:inline-flex mt-4 ${FINITAC_COLORS.BUTTON} ${FINITAC_COLORS.BUTTON_HOVER} text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02]`}
//                     >
//                         Schedule Now
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// // // import React from "react";
// // // import { motion } from "framer-motion";

// // // // --- Theme and Content Configuration ---
// // // export const FINITAC_COLORS = {
// // //   TEAL: '#38c1a5',
// // //   CTA_START: '#e0f7fa',
// // //   CTA_END: '#b3e5fc',
// // //   BUTTON: 'bg-gray-900',
// // //   BUTTON_HOVER: 'hover:bg-gray-700',
// // // };

// // // export const FEATURES = [
// // //   {
// // //     title: 'Decades of Experience',
// // //     description:
// // //       "We organize your daily financial tasks like tracking sales, invoices, and expenses, so you can spend more time growing your business. Our proven processes cut down errors and keep everything running smoothly.",
// // //   },
// // //   {
// // //     title: 'Latest AI Tools For Efficient Bookkeeping',
// // //     description:
// // //       "We use modern software products to cut down on manual tasks and potential errors. Get real-time updates on your numbers and tweak your strategies on the go with our AI-backed software.",
// // //   },
// // //   {
// // //     title: 'Dedicated Support',
// // //     description:
// // //       "Do you have a question, need advice urgently or require access to some data? Our team will answer your query around the clock. We're always available to assist you with your finances.",
// // //   },
// // // ];

// // // // --- Custom Components ---
// // // const FeatureCard = ({ title, description, isLast }) => {
// // //   const borderClass = isLast ? '' : 'border-b border-gray-200 pb-5 mb-5';
// // //   return (
// // //     <motion.div
// // //       initial={{ opacity: 0, y: 25 }}
// // //       whileInView={{ opacity: 1, y: 0 }}
// // //       viewport={{ once: true, amount: 0.2 }}
// // //       transition={{ duration: 0.4 }}
// // //       className={borderClass}
// // //     >
// // //       <h3 className="text-xl font-bold text-gray-900 mb-1 font-poppins">{title}</h3>
// // //       <p className="text-base text-gray-600 leading-relaxed font-poppins">
// // //         {description}
// // //       </p>
// // //     </motion.div>
// // //   );
// // // };

// // // // --- Main Section Component ---
// // // export const WhyChooseFinitac = () => {
// // //   return (
// // //     <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-poppins">
// // //       {/* Header */}
// // //       <motion.div
// // //         initial={{ opacity: 0, y: 15 }}
// // //         whileInView={{ opacity: 1, y: 0 }}
// // //         viewport={{ once: true }}
// // //         transition={{ duration: 0.5 }}
// // //         className="mb-10 text-center lg:text-left"
// // //       >
// // //         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
// // //           Why Choose{' '}
// // //           <span
// // //             className="rounded-lg shadow-md font-extrabold px-3 py-1 ml-2 text-white"
// // //             style={{ backgroundColor: FINITAC_COLORS.TEAL }}
// // //           >
// // //             FINITAC?
// // //           </span>
// // //         </h1>
// // //         <p className="mt-3 text-base md:text-lg text-gray-700 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
// // //           We're the best option when it comes to finding small business bookkeepers near you.
// // //           Our tailored solutions offer exceptional value and efficiency for your business.
// // //         </p>
// // //       </motion.div>

// // //       {/* Layout Container (Image + Features) */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
// // //         {/* Left: Image */}
// // //         <motion.div
// // //           initial={{ opacity: 0, x: -40 }}
// // //           whileInView={{ opacity: 1, x: 0 }}
// // //           viewport={{ once: true, amount: 0.3 }}
// // //           transition={{ duration: 0.6 }}
// // //           className="lg:col-span-5 rounded-2xl shadow-xl overflow-hidden"
// // //         >
// // //           <img
// // //             src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80"
// // //             alt="Professional bookkeeper reviewing financial reports at a modern office."
// // //             className="w-full h-full object-cover min-h-[240px] md:min-h-[320px] lg:min-h-[400px]"
// // //             loading="lazy"
// // //           />
// // //         </motion.div>

// // //         {/* Right: Feature List */}
// // //         <div className="lg:col-span-7 pt-2">
// // //           {FEATURES.map((feature, index) => (
// // //             <FeatureCard
// // //               key={index}
// // //               title={feature.title}
// // //               description={feature.description}
// // //               isLast={index === FEATURES.length - 1}
// // //             />
// // //           ))}

// // //           {/* CTA Button */}
// // //           <motion.button
// // //             initial={{ opacity: 0, y: 15 }}
// // //             whileInView={{ opacity: 1, y: 0 }}
// // //             viewport={{ once: true }}
// // //             transition={{ duration: 0.5, delay: 0.1 }}
// // //             className={`hidden md:inline-flex mt-6 ${FINITAC_COLORS.BUTTON} ${FINITAC_COLORS.BUTTON_HOVER} text-white font-semibold py-2.5 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.03]`}
// // //           >
// // //             Schedule Now
// // //           </motion.button>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };
import React from "react";
import { motion } from "framer-motion";

// --- Color Palette (matches your new theme) ---
const COLORS = {
  PRIMARY: '#FF1E1E', // vibrant red accent
  BACKGROUND: '#0B0B0B', // deep black background
  TEXT_LIGHT: '#FFFFFF',
  TEXT_GRAY: '#B3B3B3',
  CARD_BG: '#111111',
  BORDER: '#2B2B2B',
};

// --- Feature Data ---
const FEATURES = [
  {
    title: 'Decades of Experience',
    description:
      "We organize your daily financial tasks like tracking sales, invoices, and expenses, so you can focus on growing your business. Our proven processes reduce errors and improve accuracy.",
  },
  {
    title: 'Latest AI Tools For Efficient Bookkeeping',
    description:
      "We leverage advanced AI tools to minimize manual work and potential errors. Gain real-time financial insights and adjust your strategies on the go.",
  },
  {
    title: 'Dedicated 24/7 Support',
    description:
      "Have a question or need assistance? Our expert team is available around the clock to ensure your business runs smoothly and efficiently.",
  },
];

// --- Feature Card Component ---
const FeatureCard = ({ title, description, isLast }) => {
  const borderClass = isLast ? '' : `border-b border-[${COLORS.BORDER}] pb-6 mb-6`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className={`${borderClass}`}
    >
      <h3 className="text-xl font-bold mb-2 font-poppins text-white">{title}</h3>
      <p className="text-base font-poppins leading-relaxed text-gray-300">
        {description}
      </p>
    </motion.div>
  );
};

// --- Main Section Component ---
const WhyChooseFinitac = () => {
  return (
    <section
      className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 font-poppins relative overflow-hidden"
      style={{ backgroundColor: COLORS.BACKGROUND }}
    >
      {/* Subtle Background Glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-[#FF1E1E]/10 -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left mb-14"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-4xl  text-white leading-tight">
            Why Choose{' '}
            <span
              className=" px-3 py-1 rounded-lg shadow-md text-white"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              AI Voice Platform?
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
            We combine human-level voice realism with next-gen AI technology —
            making it easier for your business to communicate, connect, and grow.
          </p>
        </motion.div>

        {/* Layout (Image + Features) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-[#2B2B2B]"
          >
            <img
              src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80"
              alt="Professional discussing AI-driven solutions in a modern workspace."
              className="w-full h-full object-cover min-h-[280px] md:min-h-[360px] lg:min-h-[420px]"
              loading="lazy"
            />
          </motion.div>

          {/* Features Section */}
          <div className="lg:col-span-7 text-left">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                isLast={index === FEATURES.length - 1}
              />
            ))}

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:inline-flex mt-8 bg-[#FF1E1E] hover:bg-[#E60000] text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-transform duration-300 hover:scale-[1.05]"
            >
              Schedule a Demo
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseFinitac;
