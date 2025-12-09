// // tailwind.config.js
// module.exports = {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: "#ff0000", // Red from the logo
//           50: "#ffe5e5",
//           100: "#ffb3b3",
//           200: "#ff8080",
//           300: "#ff4d4d",
//           400: "#ff1a1a",
//           500: "#ff0000",
//           600: "#e60000",
//           700: "#cc0000",
//           800: "#990000",
//           900: "#660000",
//         },
//         secondary: {
//           DEFAULT: "#ffffff", // White text
//           50: "#ffffff",
//           100: "#f5f5f5",
//           200: "#e5e5e5",
//           300: "#d4d4d4",
//           400: "#a3a3a3",
//           500: "#737373",
//           600: "#525252",
//           700: "#404040",
//           800: "#262626",
//           900: "#171717",
//         },
//         background: "#000000", // Black background
//       },
//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // ✅ IMPORTANT: Enable class-based dark mode
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