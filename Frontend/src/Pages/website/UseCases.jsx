// UseCases.jsx
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Users, Headphones, Briefcase } from "lucide-react"

// --- START: Dependency Fix ---
// This function replaces the imported 'useTranslation' hook. 
// It ensures the component compiles correctly by returning 
// the translation key itself, preserving your original text placeholders.
const t = (key) => {
  return key; 
};
// --- END: Dependency Fix ---

const useCases = [
  {
    icon: Users,
    key: 'sales',
    title: 'useCases.sales',
    description: 'useCases.salesDesc',
    cta: 'useCases.salesCta',
  },
  {
    icon: Headphones,
    key: 'support',
    title: 'useCases.support',
    description: 'useCases.supportDesc',
    cta: 'useCases.supportCta',
  },
  {
    icon: Briefcase,
    key: 'smallBusiness',
    title: 'useCases.smallBusiness',
    description: 'useCases.smallBusinessDesc',
    cta: 'useCases.smallBusinessCta',
  },
]

const UseCases = ({ id }) => {
   const { t } = useTranslation() // Original hook is commented out

  const handleCtaClick = (key) => {
    console.log(`Clicked CTA for ${key}`) // Mock action
  }

  return (
    <section 
      id="use-cases" 
      // Reverted to Dark Teal border and background class
      className="py-16 bg-background relative z-10 font-poppins border-t-2 border-primary-600 p-2 "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl  text-center text-gray-900 mb-12"
        >
          {t('useCases.title')}
        </motion.h2>

        {/* Use Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              // Reverted border-t-4 to use primary-600
              className="p-8 bg-white rounded-xl shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-600 border-t-4 border-primary-600 pt-6"
            >
              {/* Reverted icon color to primary-600 */}
              <useCase.icon className="h-10 w-10 text-primary-600 mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(useCase.title)}</h3>
              <p className="text-base text-gray-700 mb-6">{t(useCase.description)}</p>
              <button
                onClick={() => handleCtaClick(useCase.key)}
                // Reverted button colors and focus ring to primary-600/700
                className="w-full h-12 rounded-lg bg-primary-600 text-white font-semibold text-base hover:bg-primary-700 transition-colors duration-200 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 shadow-md"
                aria-label={t(useCase.cta)}
              >
                {t(useCase.cta)}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCases