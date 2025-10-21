// // frontend/src/main.jsx - MAKE SURE AuthProvider IS IMPORTED
// import React from "react"
// import ReactDOM from "react-dom/client"
// import { BrowserRouter } from "react-router-dom"
// import App from "./App.jsx"
// import { AuthProvider } from "./contexts/AuthContext.jsx" // CRITICAL IMPORT
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>,
// )

// frontend/src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx" // CRITICAL IMPORT
import './index.css'
import i18n from "i18next"
import { initReactI18next, I18nextProvider } from "react-i18next"
import enTranslation from "./locales/en/translation"
import frTranslation from "./locales/fr/translation"

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)