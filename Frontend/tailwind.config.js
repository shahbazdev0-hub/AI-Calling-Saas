// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         blue: {
//           600: '#2563eb',
//           700: '#1d4ed8',
//         },
//         indigo: {
//           600: '#4f46e5',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//       },
//     },
//   },
  
//   plugins: [],
// }

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         purple: {
//           600: '#6B46C1', // Primary purple, inspired by Synthflow
//           700: '#5A32A3', // Darker purple for hover
//         },
//         indigo: {
//           600: '#4f46e5',
//         },
//       },
//       fontFamily: {
//         poppins: ['Poppins', 'sans-serif'],
//       },
//       keyframes: {
//         scroll: {
//           '0%': { transform: 'translateX(0)' },
//           '100%': { transform: 'translateX(-50%)' },
//         },
//       },
//       animation: {
//         scroll: 'scroll 25s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// }

// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: [
// //     "./index.html",
// //     "./src/**/*.{js,ts,jsx,tsx}",
// //   ],
// //   theme: {
// //     extend: {
// //       colors: {
// //         // New Palette based on the provided image: Cyan/Teal theme
// //         'primary': {
// //           // Dark Teal/Cyan: Used for accents, buttons, and main focus states
// //           600: '#2094A8', // Main primary color
// //           700: '#176F7E', // Darker for hover/active states
// //         },
// //         'secondary': {
// //           // Light Blue/Cyan: Used for lighter highlights or backgrounds
// //           200: '#A0E0EA',
// //           100: '#CCF3F8',
// //         },
// //         'background': {
// //           // Off-White/White: Used for the main body background
// //           DEFAULT: '#F8F8F8', // Slightly off-white to match the image
// //         },
// //       },
// //       fontFamily: {
// //         poppins: ['Poppins', 'sans-serif'],
// //       },
// //       keyframes: {
// //         scroll: {
// //           '0%': { transform: 'translateX(0)' },
// //           '100%': { transform: 'translateX(-50%)' },
// //         },
// //       },
// //       animation: {
// //         scroll: 'scroll 25s linear infinite',
// //       },
// //     },
// //   },
// //   plugins: [],
// // }
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff0000", // Red from the logo
          50: "#ffe5e5",
          100: "#ffb3b3",
          200: "#ff8080",
          300: "#ff4d4d",
          400: "#ff1a1a",
          500: "#ff0000",
          600: "#e60000",
          700: "#cc0000",
          800: "#990000",
          900: "#660000",
        },
        secondary: {
          DEFAULT: "#ffffff", // White text
          50: "#ffffff",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        background: "#000000", // Black background
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
