// // import { useTranslation } from "react-i18next"
// // import { Link } from "react-router-dom"
// // import { Twitter, Facebook, Linkedin } from "lucide-react"

// // const Footer = () => {
// //   const { t } = useTranslation()

// //   return (
// //     <footer className="bg-gray-900 text-white py-8">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //           <div>
// //             <h3 className="text-xl font-bold mb-4">AI Voice Platform</h3>
// //             <p className="text-gray-400">{t('footer.copyright')}</p>
// //           </div>
// //           <nav className="space-y-2">
// //             <Link to="/#about" className="block text-gray-400 hover:text-white">{t('footer.about')}</Link>
// //             <Link to="/#features" className="block text-gray-400 hover:text-white">{t('footer.features')}</Link>
// //             <Link to="/#pricing" className="block text-gray-400 hover:text-white">{t('footer.pricing')}</Link>
// //             <Link to="/blog" className="block text-gray-400 hover:text-white">{t('footer.blog')}</Link>
// //             <Link to="/careers" className="block text-gray-400 hover:text-white">{t('footer.careers')}</Link>
// //           </nav>
// //           <div className="flex space-x-4 justify-center md:justify-start">
// //             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter className="h-6 w-6 text-gray-400 hover:text-white" /></a>
// //             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="h-6 w-6 text-gray-400 hover:text-white" /></a>
// //             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="h-6 w-6 text-gray-400 hover:text-white" /></a>
// //           </div>
// //         </div>
// //       </div>
// //     </footer>
// //   )
// // }

// // export default Footer



// import { useTranslation } from "react-i18next"
// import { motion } from "framer-motion"
// import { Link } from "react-router-dom"
// import { Twitter, Linkedin, Instagram } from "lucide-react"

// const navLinks = [
//   { to: '/#about', label: 'footer.about' },
//   { to: '/#features', label: 'footer.features' },
//   { to: '/#pricing', label: 'footer.pricing' },
//   { to: '/blog', label: 'footer.blog' },
//   { to: '/careers', label: 'footer.careers' },
// ]

// const socialLinks = [
//   { href: 'https://twitter.com/yourcompany', label: 'footer.twitter', icon: Twitter },
//   { href: 'https://linkedin.com/company/yourcompany', label: 'footer.linkedin', icon: Linkedin },
//   { href: 'https://instagram.com/yourcompany', label: 'footer.instagram', icon: Instagram },
// ]

// const Footer = () => {
//   const { t } = useTranslation()

//   return (
//     <footer className="bg-gray-900 text-gray-300 py-12 relative z-10 font-poppins">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Navigation Links */}
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="space-y-4"
//           >
//             <h3 className="text-lg font-semibold text-white">{t('footer.linksTitle')}</h3>
//             <nav className="space-y-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.label}
//                   to={link.to}
//                   className="block text-base text-gray-300 hover:text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t(link.label)}
//                 >
//                   {t(link.label)}
//                 </Link>
//               ))}
//             </nav>
//           </motion.div>

//           {/* Social Media */}
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="space-y-4"
//           >
//             Contact Us
//             <h3 className="text-lg font-semibold text-white">{t('footer.socialTitle')}</h3>
//             <div className="flex gap-4">
//               {socialLinks.map((social) => (
//                 <a
//                   key={social.label}
//                   href={social.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-300 hover:text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t(social.label)}
//                 >
//                   <social.icon className="h-6 w-6" aria-hidden="true" />
//                 </a>
//               ))}
//             </div>
//           </motion.div>

//           {/* Legal */}
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="space-y-4"
//           >
//             <h3 className="text-lg font-semibold text-white">{t('footer.legalTitle')}</h3>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">{t('footer.copyright')}</p>
//               <div className="flex gap-4">
//                 <a
//                   href="/terms"
//                   className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t('footer.terms')}
//                 >
//                   {t('footer.terms')}
//                 </a>
//                 <a
//                   href="/privacy"
//                   className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t('footer.privacy')}
//                 >
//                   {t('footer.privacy')}
//                 </a>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer


// import { useTranslation } from "react-i18next"
// import { Link } from "react-router-dom"
// import { motion } from "framer-motion"
// import { Twitter, Linkedin, Instagram } from "lucide-react"

// const navLinks = [
//   { to: '#about', label: 'footer.about' },
//   { to: '#features', label: 'footer.features' },
//   { to: '#pricing', label: 'footer.pricing' },
//   { to: '#blog', label: 'footer.blog' },
//   { to: '#careers', label: 'footer.careers' },
// ]

// const socialLinks = [
//   { href: 'https://twitter.com/yourcompany', label: 'footer.twitter', icon: Twitter },
//   { href: 'https://linkedin.com/company/yourcompany', label: 'footer.linkedin', icon: Linkedin },
//   { href: 'https://instagram.com/yourcompany', label: 'footer.instagram', icon: Instagram },
// ]

// const Footer = () => {
//   const { t } = useTranslation()

//   return (
//     <footer className="bg-gradient-to-r from-gray-900 to-purple-900 text-gray-300 py-12 relative z-10 font-poppins">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {/* Navigation Links */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="space-y-4"
//           >
//             <h3 className="text-xl md:text-2xl font-semibold text-white">{t('footer.linksTitle')}</h3>
//             <nav className="space-y-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.label}
//                   to={link.to}
//                   className="block text-base md:text-lg text-gray-300 hover:text-purple-600 transition-colors duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t(link.label)}
//                 >
//                   {t(link.label)}
//                 </Link>
//               ))}
//             </nav>
//           </motion.div>

//           {/* Contact */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="space-y-4"
//           >
//             <h3 className="text-xl md:text-2xl font-semibold text-white">{t('footer.contactTitle')}</h3>
//             <div className="space-y-2">
//               <a
//                 href="mailto:contact@yourcompany.com"
//                 className="block text-base md:text-lg text-gray-300 hover:text-purple-600 transition-colors duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                 aria-label={t('footer.contact')}
//               >
//                 {t('footer.contact')}
//               </a>
//               <div className="flex gap-4 pt-2">
//                 {socialLinks.map((social) => (
//                   <a
//                     key={social.label}
//                     href={social.href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-gray-300 hover:text-purple-600 transition-colors duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                     aria-label={t(social.label)}
//                   >
//                     <social.icon className="h-6 w-6" aria-hidden="true" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </motion.div>

//           {/* Legal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="space-y-4"
//           >
//             <h3 className="text-xl md:text-2xl font-semibold text-white">{t('footer.legalTitle')}</h3>
//             <div className="space-y-2">
//               <p className="text-sm md:text-base text-gray-500">{t('footer.copyright')}</p>
//               <div className="flex gap-4">
//                 <a
//                   href="#terms"
//                   className="text-sm md:text-base text-gray-500 hover:text-purple-600 transition-colors duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t('footer.terms')}
//                 >
//                   {t('footer.terms')}
//                 </a>
//                 <a
//                   href="#privacy"
//                   className="text-sm md:text-base text-gray-500 hover:text-purple-600 transition-colors duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900"
//                   aria-label={t('footer.privacy')}
//                 >
//                   {t('footer.privacy')}
//                 </a>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//         <div className="mt-8 border-t border-purple-800 pt-6 text-center">
//           <p className="text-sm md:text-base text-gray-400">
//             &copy; {new Date().getFullYear()} Your Company. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer

// import { motion } from "framer-motion"
// import { Twitter, Linkedin, Instagram } from "lucide-react"

// // Mock useTranslation function for standalone compilation
// const useTranslation = () => ({
//   t: (key) => {
//     const translations = {
//       'footer.linksTitle': 'Quick Links',
//       'footer.about': 'About Us',
//       'footer.features': 'Features',
//       'footer.pricing': 'Pricing',
//       'footer.blog': 'Blog',
//       'footer.careers': 'Careers',
//       'footer.contactTitle': 'Connect',
//       'footer.contact': 'contact@yourcompany.com',
//       'footer.twitter': 'Twitter',
//       'footer.linkedin': 'LinkedIn',
//       'footer.instagram': 'Instagram',
//       'footer.legalTitle': 'Legal',
//       'footer.copyright': 'Leveraging AI for the future of marketing.',
//       'footer.terms': 'Terms of Service',
//       'footer.privacy': 'Privacy Policy',
//     };
//     return translations[key] || key;
//   },
// });

// // Theme color definitions
// const primaryColor = 'primary-600' // Dark Teal for accents
// const hoverColor = 'primary-500' // Slightly lighter teal for hover

// const navLinks = [
//   { to: '#about', label: 'footer.about' },
//   { to: '#features', label: 'footer.features' },
//   { to: '#pricing', label: 'footer.pricing' },
//   { to: '#blog', label: 'footer.blog' },
//   { to: '#careers', label: 'footer.careers' },
// ]

// const socialLinks = [
//   { href: 'https://twitter.com/yourcompany', label: 'footer.twitter', icon: Twitter },
//   { href: 'https://linkedin.com/company/yourcompany', label: 'footer.linkedin', icon: Linkedin },
//   { href: 'https://instagram.com/yourcompany', label: 'footer.instagram', icon: Instagram },
// ]

// const Footer = () => {
//   const { t } = useTranslation()

//   return (
//     // Updated background to solid gray-900 and added primary border
//     <footer className={`bg-gray-900 text-gray-300 py-12 relative z-10 font-sans border-t-4 border-${primaryColor}`}>
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
//           {/* Logo & Info Slot (Added a placeholder for a cleaner layout) */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="col-span-2 md:col-span-1 space-y-3"
//           >
//             <h2 className={`text-3xl font-extrabold text-${primaryColor}`}>AI Boost</h2>
//             <p className="text-sm text-gray-500">{t('footer.copyright')}</p>
//           </motion.div>

//           {/* Navigation Links */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="space-y-4"
//           >
//             <h3 className="text-lg font-semibold text-white tracking-wider">{t('footer.linksTitle')}</h3>
//             <nav className="space-y-2">
//               {navLinks.map((link) => (
//                 // Replaced Link with standard <a> tag
//                 <a
//                   key={link.label}
//                   href={link.to}
//                   className={`block text-base text-gray-400 hover:text-${primaryColor} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md`}
//                   aria-label={t(link.label)}
//                 >
//                   {t(link.label)}
//                 </a>
//               ))}
//             </nav>
//           </motion.div>

//           {/* Legal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="space-y-4"
//           >
//             <h3 className="text-lg font-semibold text-white tracking-wider">{t('footer.legalTitle')}</h3>
//             <div className="space-y-2">
//               <a
//                 href="#terms"
//                 className={`block text-base text-gray-400 hover:text-${primaryColor} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md`}
//                 aria-label={t('footer.terms')}
//               >
//                 {t('footer.terms')}
//               </a>
//               <a
//                 href="#privacy"
//                 className={`block text-base text-gray-400 hover:text-${primaryColor} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md`}
//                 aria-label={t('footer.privacy')}
//               >
//                 {t('footer.privacy')}
//               </a>
//             </div>
//           </motion.div>
          
//           {/* Contact & Social */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="col-span-2 md:col-span-1 space-y-4"
//           >
//             <h3 className="text-lg font-semibold text-white tracking-wider">{t('footer.contactTitle')}</h3>
//             <div className="space-y-2">
//               <a
//                 href="mailto:contact@yourcompany.com"
//                 className={`block text-base text-gray-400 hover:text-${primaryColor} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md`}
//                 aria-label={t('footer.contact')}
//               >
//                 {t('footer.contact')}
//               </a>
//             </div>
//             {/* Social Links */}
//             <div className="flex gap-4 pt-2">
//               {socialLinks.map((social) => (
//                 <a
//                   key={social.label}
//                   href={social.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={`text-gray-400 hover:text-${primaryColor} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full p-1`}
//                   aria-label={t(social.label)}
//                 >
//                   <social.icon className="h-6 w-6" aria-hidden="true" />
//                 </a>
//               ))}
//             </div>
//           </motion.div>
//         </div>
        
//         {/* Bottom Copyright */}
//         <div className="mt-12 border-t border-gray-700 pt-6 text-center">
//           <p className="text-sm text-gray-500">
//             &copy; {new Date().getFullYear()} Your Company. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer
import { motion } from "framer-motion"
import { Twitter, Linkedin, Instagram } from "lucide-react"
import vendiraLogo from "../../assets/vendiralogo.png"; 
// Mock useTranslation function for standalone compilation
const useTranslation = () => ({
  t: (key) => {
    const translations = {
      'footer.linksTitle': 'Quick Links',
      'footer.about': 'About Us',
      'footer.features': 'Features',
      'footer.pricing': 'Pricing',
      'footer.blog': 'Blog',
      'footer.careers': 'Careers',
      'footer.contactTitle': 'Connect',
      'footer.contact': 'contact@yourcompany.com',
      'footer.twitter': 'Twitter',
      'footer.linkedin': 'LinkedIn',
      'footer.instagram': 'Instagram',
      'footer.legalTitle': 'Legal',
      'footer.terms': 'Terms of Service',
      'footer.privacy': 'Privacy Policy',
      'footer.copyright': 'Leveraging AI for the future of marketing.',
    };
    return translations[key] || key;
  },
});
 
// Theme color definitions: Using the primary red accent and ultra dark background
const accentColor = '#FF1E1E'
const ultraDarkBg = 'bg-black' // Using true black for maximum contrast
const footerBgImageUrl = 'https://placehold.co/1920x400/1a1a1a/1a1a1a?text=Subtle+Pattern' // Placeholder for a dark, subtle background pattern/image

const navLinks = [
  { to: '#about', label: 'footer.about' },
  { to: '#features', label: 'footer.features' },
  { to: '#pricing', label: 'footer.pricing' },
  { to: '#blog', label: 'footer.blog' },
  { to: '#careers', label: 'footer.careers' },
]

const socialLinks = [
  { href: 'https://twitter.com/yourcompany', label: 'footer.twitter', icon: Twitter },
  { href: 'https://linkedin.com/company/yourcompany', label: 'footer.linkedin', icon: Linkedin },
  { href: 'https://instagram.com/yourcompany', label: 'footer.instagram', icon: Instagram },
]

const Footer = () => {
  const { t } = useTranslation()

  // Pre-calculate dynamic classes using Tailwind's arbitrary value syntax for safety
  const redBorderClass = `border-[${accentColor}]`
  const redTextClass = `text-[${accentColor}]`
  const redHoverClass = `hover:text-[${accentColor}]`
  const focusRingClass = `focus:ring-[${accentColor}]`
  const focusOffsetClass = 'focus:ring-offset-2 focus:ring-offset-black' // Offset with black for contrast
  const focusRingFull = `${focusRingClass} ${focusOffsetClass}`


  return (
    // Base container: Increased top padding (pt-24) for better separation, font-poppins, and accent border
    <footer className={`text-gray-300 pt-24 pb-12 relative z-10 font-poppins border-t- ${redBorderClass} overflow-hidden`}>
        {/* Background Image Element - Subtle dark pattern */}
        <img
            src={footerBgImageUrl}
            alt="Subtle dark background pattern"
            // The image provides a dark base layer. Adjust opacity for subtlety.
            className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm pointer-events-none"
        />

        {/* Dark Overlay to ensure maximum readability */}
        <div className={`absolute inset-0 ${ultraDarkBg} opacity-95 pointer-events-none`}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-20"> {/* Content is layered above the image/overlay */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Logo & Info Slot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-1 space-y-3"
          >
            {/* Applied red accent color */}
{/*             <h2 className={`text-3xl font-extrabold text-red ${redTextClass}`}>AI Boost</h2> */}
<a
            href="#hero"
            onClick={(e) => onNavClick(e, 'hero')}
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-300`}
            aria-label="Home"
          >   
            {/* <span className="text-[#FF1E1E]">AI</span> Voice 
            <span className="text-[#FF1E1E]"> Platform</span> */}
            <img 
 src={vendiraLogo}  
  alt="Mendira.ai Logo" 
  className="h-10 sm:h-10 w-auto" 
/>
          </a>
            <p className="text-sm text-white">{t('footer.copyright')}</p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white tracking-wider">{t('footer.linksTitle')}</h3>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  // Applied red hover and focus styles
                  className={`block text-base text-gray-400 ${redHoverClass} transition-colors duration-200 focus:outline-none focus:ring-2 ${focusRingFull} rounded-md`}
                  aria-label={t(link.label)}
                >
                  {t(link.label)}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white tracking-wider">{t('footer.legalTitle')}</h3>
            <div className="space-y-2">
              <a
                href="#terms"
                // Applied red hover and focus styles
                className={`block text-base text-gray-400 ${redHoverClass} transition-colors duration-200 focus:outline-none focus:ring-2 ${focusRingFull} rounded-md`}
                aria-label={t('footer.terms')}
              >
                {t('footer.terms')}
              </a>
              <a
                href="#privacy"
                // Applied red hover and focus styles
                className={`block text-base text-gray-400 ${redHoverClass} transition-colors duration-200 focus:outline-none focus:ring-2 ${focusRingFull} rounded-md`}
                aria-label={t('footer.privacy')}
              >
                {t('footer.privacy')}
              </a>
            </div>
          </motion.div>
          
          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-2 md:col-span-1 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white tracking-wider">{t('footer.contactTitle')}</h3>
            <div className="space-y-2">
              <a
                href="mailto:contact@yourcompany.com"
                // Applied red hover and focus styles
                className={`block text-base text-gray-400 ${redHoverClass} transition-colors duration-200  focus:outline-none focus:ring-0`}
                aria-label={t('footer.contact')}
              >
                {t('footer.contact')}
              </a>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Applied red hover and focus styles
                  className={`text-gray-400 ${redHoverClass} transition-colors duration-200 focus:outline-none focus:ring-2 ${focusRingFull} rounded-full p-1`}
                  aria-label={t(social.label)}
                >
                  <social.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer