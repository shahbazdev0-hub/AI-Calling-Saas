import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-5 w-5 text-gray-600" aria-hidden="true" />
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="border-none bg-transparent cursor-pointer focus:outline-none text-gray-700"
        aria-label={t('language.switch')}
      >
        <option value="en">{t('language.en')}</option>
        <option value="fr">{t('language.fr')}</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher