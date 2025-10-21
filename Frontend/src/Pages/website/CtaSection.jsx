// import React from "react";

// const CtaSection = () => {
//   return (
//     <section
//       className="py-20 text-center"
//       style={{
//         background: 'linear-gradient(135deg, #d2f9f5 0%, #ffffff 100%)',
//       }}
//     >
//       <div className="max-w-2xl mx-auto px-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//           Call our team of advisors!
//         </h2>
//         <p className="text-gray-700 text-base md:text-lg mb-8">
//           Our friendly and dedicated team are here to answer any tax or
//           accounting questions you may have.
//         </p>
//         <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-700 transition">
//           Schedule Now
//         </button>
//       </div>
//     </section>
//   );
// };

// export default CtaSection;
// // // import React from "react";

// // // const TailoredDemoSection = () => {
// // //   return (
// // //     <section className="font-[Poppins] bg-white py-20 px-6 sm:px-10 lg:px-16 flex justify-center">
// // //       <div className="w-full max-w-6xl bg-gradient-to-b from-purple-700 to-purple-600 text-center text-white rounded-3xl py-20 px-6 relative overflow-hidden shadow-xl">
// // //         {/* Optional subtle dotted background pattern */}
// // //         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_1px,_transparent_1px)] bg-[length:24px_24px]" />

// // //         {/* Content */}
// // //         <div className="relative z-10">
// // //           <p className="text-sm uppercase tracking-widest font-semibold mb-4">
// // //             Tailored Demo
// // //           </p>

// // //           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
// // //             Managing Over 20K <br className="hidden md:block" />
// // //             Minutes of Calls Monthly?
// // //           </h2>

// // //           <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-10">
// // //             Dive deeper with our experts to learn how Voice AI can scale your
// // //             customer service operations and deliver ROI around the clock.
// // //           </p>

// // //           <button className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md">
// // //             Contact Sales
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default TailoredDemoSection;

// import React from "react";

// const TailoredDemoSection = () => {
//   return (
//     <section className="font-[Poppins] bg-background  py-20 px-6 sm:px-10 lg:px-16 flex justify-center">
//       {/* UPDATED GRADIENT:
//         - Starts from a very dark red (red-900) to create a warm, deep tone.
//         - Transitions to solid black (to-black) for a dramatic, branded background.
//       */}
//       <div className="w-full max-w-6xl bg-[#2A2A2A] text-center text-white rounded-3xl py-20 px-6 relative overflow-hidden shadow-xl">
        
//         {/* Subtle background pattern */}
//         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[length:24px_24px]" />

//         {/* Content */}
//         <div className="relative z-10">
//           {/* Accent text color: Bright red to match the waveform */}
//           <p className="text-sm uppercase tracking-widest font-semibold mb-4 text-white">
//             Tailored Demo
//           </p>

//           {/* Heading text: White for high contrast */}
//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
//             Managing Over 20K <br className="hidden md:block" />
//             Minutes of Calls Monthly?
//           </h2>

//           {/* Paragraph text: Lighter gray for legibility */}
//           <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
//             Dive deeper with our experts to learn how Voice AI can scale your
//             customer service operations and deliver ROI around the clock.
//           </p>

//           {/* Button: White background with red text, consistent with branding */}
//           <button className="bg-white text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-lg">
//             Contact Sales
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TailoredDemoSection;
import React from "react";

const TailoredDemoSection = () => {
  return (
    <section className="font-[Poppins] bg-background py-24 px-6 flex justify-center relative overflow-hidden">
      
      {/* 🔥 Enhanced Red Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[900px] h-[220px] bg-[#FF1E1E] opacity-60 blur-[180px] rounded-[50px]"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-[#2A2A2A] text-center text-white rounded-3xl py-14 px-6 relative overflow-hidden shadow-2xl border border-red-700/40">
        
        {/* Subtle dotted texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[length:22px_22px]" />

        {/* Content */}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] font-medium mb-3 text-gray-300">
            Tailored Demo
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-snug text-white">
            Managing Over <span className="text-[#FF1E1E]">20K Minutes</span> <br className="hidden md:block" />
            of Calls Monthly?
          </h2>

          <p className="text-base text-gray-300 max-w-lg mx-auto mb-8">
            Dive deeper with our experts to learn how Voice AI can scale your
            customer service operations and deliver ROI around the clock.
          </p>

          <button className="bg-white text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-lg">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default TailoredDemoSection;
