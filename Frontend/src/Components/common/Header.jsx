
// // Header.jsx - FIXED VERSION with proper navigation
// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Menu, X } from "lucide-react"
// import { Link, useLocation, useNavigate } from "react-router-dom"

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

//   // Handle scrolling to section when page loads with hash
//   useEffect(() => {
//     if (location.pathname === '/' && location.hash) {
//       const sectionId = location.hash.substring(1) // Remove the '#'
//       setTimeout(() => {
//         const element = document.getElementById(sectionId)
//         if (element) {
//           element.scrollIntoView({ 
//             behavior: 'smooth',
//             block: 'start'
//           })
//         }
//       }, 100) // Small delay to ensure page is fully loaded
//     }
//   }, [location])

//   // Check if we're on a dashboard route
//   const isDashboard = location.pathname.startsWith('/dashboard')
  
//   // Don't show header on dashboard pages
//   if (isDashboard) return null

//   // Smooth scroll function for anchor links
//   const scrollToSection = (sectionId) => {
//     // If we're not on the home page, navigate there first using React Router
//     if (location.pathname !== '/') {
//       navigate(`/#${sectionId}`)
//     } else {
//       // We're already on home page, just scroll
//       const element = document.getElementById(sectionId)
//       if (element) {
//         element.scrollIntoView({ 
//           behavior: 'smooth',
//           block: 'start'
//         })
//       }
//     }
//     setIsMenuOpen(false) // Close mobile menu after click
//   }

//   return (
//     <header className="sticky top-0 bg-gradient-to-r from-white to-secondary-100 shadow-md z-50 font-poppins">
//       <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-primary-600">
//             AI Voice Platform
//           </Link>
//         </motion.div>
        
//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-6">
//           <button 
//             onClick={() => scrollToSection('features')}
//             className="text-gray-900 hover:text-primary-600 text-base md:text-lg font-medium transition-colors duration-300"
//           >
//             Features
//           </button>
//           <Link 
//             to="/pricing" 
//             className="text-gray-900 hover:text-primary-600 text-base md:text-lg font-medium transition-colors duration-300"
//           >
//             Pricing
//           </Link>
//           <button 
//             onClick={() => scrollToSection('use-cases')}
//             className="text-gray-900 hover:text-primary-600 text-base md:text-lg font-medium transition-colors duration-300"
//           >
//             Use Cases
//           </button>
//           <Link 
//             to="/contact" 
//             className="text-gray-900 hover:text-primary-600 text-base md:text-lg font-medium transition-colors duration-300"
//           >
//             Contact
//           </Link>
//           <button 
//             onClick={() => scrollToSection('showcase')}
//             className="text-gray-900 hover:text-primary-600 text-base md:text-lg font-medium transition-colors duration-300"
//           >
//             Showcase
//           </button>
//           <button 
//             onClick={() => scrollToSection('testimonials')}
//             className="text-gray-900 hover:text-primary-600 text-base md:text-lg font-medium transition-colors duration-300"
//           >
//             Reviews
//           </button>
          
//           {/* Auth Buttons */}
//           <div className="flex items-center space-x-4 ml-6">
//             <Link 
//               to="/login"
//               className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
//             >
//               Sign In
//             </Link>
//             <Link 
//               to="/demo"
//               className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               Book a Demo
//             </Link>
//           </div>
//         </nav>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={toggleMenu}
//           className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200"
//           aria-label="Toggle menu"
//         >
//           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation Menu */}
//       {isMenuOpen && (
//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: 'auto' }}
//           exit={{ opacity: 0, height: 0 }}
//           className="md:hidden bg-white border-t shadow-lg"
//         >
//           <nav className="px-6 py-4 space-y-4">
//             <button 
//               onClick={() => scrollToSection('features')}
//               className="block w-full text-left text-gray-900 hover:text-primary-600 font-medium py-2"
//             >
//               Features
//             </button>
//             <Link 
//               to="/pricing"
//               className="block text-gray-900 hover:text-primary-600 font-medium py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Pricing
//             </Link>
//             <button 
//               onClick={() => scrollToSection('use-cases')}
//               className="block w-full text-left text-gray-900 hover:text-primary-600 font-medium py-2"
//             >
//               Use Cases
//             </button>
//             <Link 
//               to="/contact"
//               className="block text-gray-900 hover:text-primary-600 font-medium py-2"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Contact
//             </Link>
//             <button 
//               onClick={() => scrollToSection('showcase')}
//               className="block w-full text-left text-gray-900 hover:text-primary-600 font-medium py-2"
//             >
//               Showcase
//             </button>
//             <button 
//               onClick={() => scrollToSection('testimonials')}
//               className="block w-full text-left text-gray-900 hover:text-primary-600 font-medium py-2"
//             >
//               Reviews
//             </button>
            
//             {/* Mobile Auth Buttons */}
//             <div className="pt-4 border-t border-gray-200 space-y-3">
//               <Link 
//                 to="/login"
//                 className="block text-center text-gray-700 hover:text-primary-600 font-medium py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Sign In
//               </Link>
//               <Link 
//                 to="/demo"
//                 className="block text-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium transition-all duration-300"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Book a Demo
//               </Link>
//             </div>
//           </nav>
//         </motion.div>
//       )}
//     </header>
//   )
// }

// export default Header
// // header.jsx 
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, ChevronDown } from "lucide-react";
// import gsap from "gsap";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// // Register GSAP plugins
// gsap.registerPlugin(ScrollToPlugin);

// // Import logo from assets
// import vendiraLogo from "../../assets/vendiralogo.png"

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showMoreLinks, setShowMoreLinks] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const isLoggedIn = localStorage.getItem('token');
//   const isHomePage = location.pathname === '/';

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSectionClick = (e, sectionId) => {
//     e.preventDefault();
    
//     if (!isHomePage) {
//       navigate('/');
//       setTimeout(() => {
//         scrollToSection(sectionId);
//       }, 100);
//     } else {
//       scrollToSection(sectionId);
//     }
    
//     setIsMobileMenuOpen(false);
//     setShowMoreLinks(false);
//   };

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       gsap.to(window, {
//         duration: 1,
//         scrollTo: {
//           y: element,
//           offsetY: 80
//         },
//         ease: "power2.inOut"
//       });
//     }
//   };

//   // Primary navigation links (always visible on desktop)
//   const primaryNavLinks = [
//     { name: 'Home', sectionId: 'hero' },
//     { name: 'Features', sectionId: 'features' },
//     { name: 'Showcase', sectionId: 'showcase' },
//     { name: 'Pricing', sectionId: 'pricing' },
//     { name: 'Reviews', sectionId: 'reviews' },
//   ];

//   // Secondary navigation links (in "More" dropdown on desktop)
//   const secondaryNavLinks = [
//     { name: 'Stats', sectionId: 'stats' },
//     { name: 'Use Cases', sectionId: 'use-cases' },
//     { name: 'Why Choose Us', sectionId: 'why-choose' },
//     { name: 'FAQ', sectionId: 'faq' },
//     { name: 'CTA', sectionId: 'cta' },
//     { name: 'Contact', sectionId: 'contact' },
//   ];

//   const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? 'bg-white/95 backdrop-blur-md shadow-lg'
//           : 'bg-transparent'
//       }`}
//     >
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3">
//             <img 
//               src={vendiraLogo} 
//               alt="Finitac Logo" 
//               className="h-10 w-auto"
//             />
//             <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              
//             </span>
//           </Link>

//           {/* Desktop Navigation - Primary Links + More Dropdown */}
//           <div className="hidden lg:flex items-center space-x-6">
//             {primaryNavLinks.map((link) => (
//               <a
//                 key={link.name}
//                 href={`#${link.sectionId}`}
//                 onClick={(e) => handleSectionClick(e, link.sectionId)}
//                 className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
//                   isScrolled
//                     ? 'text-gray-700 hover:text-blue-600'
//                     : 'text-white hover:text-blue-300'
//                 }`}
//               >
//                 {link.name}
//               </a>
//             ))}

//             {/* More Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowMoreLinks(!showMoreLinks)}
//                 className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
//                   isScrolled
//                     ? 'text-gray-700 hover:text-blue-600'
//                     : 'text-white hover:text-blue-300'
//                 }`}
//               >
//                 More
//                 <ChevronDown size={16} className={`transition-transform ${showMoreLinks ? 'rotate-180' : ''}`} />
//               </button>

//               <AnimatePresence>
//                 {showMoreLinks && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
//                   >
//                     {secondaryNavLinks.map((link) => (
//                       <a
//                         key={link.name}
//                         href={`#${link.sectionId}`}
//                         onClick={(e) => handleSectionClick(e, link.sectionId)}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
//                       >
//                         {link.name}
//                       </a>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden lg:flex items-center space-x-4">
//             {isLoggedIn ? (
//               <Link
//                 to="/dashboard"
//                 className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
//               >
//                 Dashboard
//               </Link>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
//                     isScrolled
//                       ? 'text-gray-700 hover:text-blue-600'
//                       : 'text-white hover:text-blue-300'
//                   }`}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
//                 >
//                   Get Started
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
//           >
//             {isMobileMenuOpen ? (
//               <X className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
//             ) : (
//               <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
//             )}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu - All 12 Links */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto"
//           >
//             <div className="px-4 py-6 space-y-2">
//               <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
//                 Navigation
//               </p>
//               {allNavLinks.map((link) => (
//                 <a
//                   key={link.name}
//                   href={`#${link.sectionId}`}
//                   onClick={(e) => handleSectionClick(e, link.sectionId)}
//                   className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
//                 >
//                   {link.name}
//                 </a>
//               ))}

//               <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
//                 {isLoggedIn ? (
//                   <Link
//                     to="/dashboard"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="block w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold"
//                   >
//                     Dashboard
//                   </Link>
//                 ) : (
//                   <>
//                     <Link
//                       to="/login"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className="block w-full px-4 py-2.5 text-gray-700 text-center border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
//                     >
//                       Login
//                     </Link>
//                     <Link
//                       to="/signup"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className="block w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold"
//                     >
//                       Get Started
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   );
// };

// export default Header;




// header.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import vendiraLogo from '../../assets/vendiralogo.png'; 

// --- i18n mock (replace with your real t() as needed) ---
const t = (key) => {
  const translations = {
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'contact.title': 'Contact',
    'hero.bookDemo': 'Book a Demo',
    'header.showcase': 'Showcase',
    'header.reviews': 'Reviews',
  };
  return translations[key] || key;
};
// --- end mock ---

const sectionBgColors = {
  hero: '#000000',
  features: '#000000ff',
  pricing: '#111111',
  contact: '#0B0B0B',
  showcase: '#1A1A1A',
  reviews: '#0D0D0D',
  default: '#000000',
};

const isLightColor = (hex) => {
  if (!hex || hex.length < 7) return false;
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128;
};

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef(null);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const navItems = [
    { id: 'features', label: t('footer.features') },
    { id: 'showcase', label: t('header.showcase') },
    { id: 'reviews', label: t('header.reviews') },
    { id: 'pricing', label: t('footer.pricing') },
    { id: 'contact', label: t('contact.title') },
  ];

  const currentBgColorHex =
    activeSection && sectionBgColors[activeSection]
      ? sectionBgColors[activeSection]
      : sectionBgColors.default;

  const isCurrentBgLight = isLightColor(currentBgColorHex);

  // --- NEW COLOR SCHEME ---
  const textColor = isCurrentBgLight ? 'text-black' : 'text-white';
  const linkHoverColor = isCurrentBgLight ? 'hover:text-[#FF1E1E]' : 'hover:text-[#FF1E1E]';
  const buttonBg = isCurrentBgLight ? 'bg-[#FF1E1E]' : 'bg-[#FF1E1E]';
  const buttonHoverBg = isCurrentBgLight ? 'hover:bg-[#E60000]' : 'hover:bg-[#E60000]';
  const mobileMenuBg = isCurrentBgLight ? 'bg-white' : 'bg-[#0B0B0B]';
  const mobileMenuBorder = isCurrentBgLight ? 'border-gray-200' : 'border-[#2B2B2B]';
  const focusRingOffset = 'focus:ring-offset-0';
  const underlineColor = 'bg-[#FF1E1E]';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const heroEl = document.getElementById('hero');
    if (heroEl) sections.push(heroEl);

    if (!sections.length) return;

    const visibleSections = {};

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        visibleSections[entry.target.id] = entry.intersectionRatio;
      });

      const mostVisible = Object.entries(visibleSections)
        .filter(([_, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0];

      if (mostVisible && mostVisible[0] !== activeSection) {
        setActiveSection(mostVisible[0]);
      } else if (!mostVisible && window.scrollY < 50) {
        setActiveSection('hero');
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0% -55% 0%',
      threshold: Array.from({ length: 20 }, (_, i) => i / 20),
    });

    sections.forEach((s) => observerRef.current.observe(s));

    return () => {
      if (observerRef.current) {
        sections.forEach((s) => observerRef.current.unobserve(s));
        observerRef.current.disconnect();
      }
    };
  }, [navItems]);

  const onNavClick = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    } else {
      window.location.hash = `#${id}`;
    }
    setIsMenuOpen(false);
  };

  // Navigate to demo page - same as Hero component
  const handleBookDemo = () => {
    navigate('/demo');
    setIsMenuOpen(false);
  };

  // Navigate to login page
  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const headerPaddingY = scrolled ? 'py-3' : 'py-5';

  return (
    <motion.header
      className={`sticky top-0 z-50 font-poppins transition-all duration-300 ${headerPaddingY}`}
      style={{
        backgroundColor: currentBgColorHex,
        boxShadow: scrolled ? '0 4px 18px rgba(0,0,0,0.25)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <a
            href="#hero"
            onClick={(e) => onNavClick(e, 'hero')}
            className={`text-2xl sm:text-3xl font-bold ${textColor} ${linkHoverColor} transition-colors duration-300`}
            aria-label="Home"
          >   
            <img 
              src={vendiraLogo}  
              alt="Mendira.ai Logo" 
              className="h-10 sm:h-10 w-auto" 
            />
          </a>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 relative">
          {navItems.map((item) => (
            <div key={item.id} className="relative">
              <motion.a
                href={`#${item.id}`}
                onClick={(e) => onNavClick(e, item.id)}
                className={`${textColor} ${linkHoverColor} text-base md:text-lg transition-colors duration-200`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.a>
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-underline"
                  className={`absolute bottom-[-4px] left-0 w-full h-[2px] ${underlineColor} rounded-full`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleLogin}
            className={`hidden md:inline-flex px-5 py-2 rounded-full ${buttonBg} ${textColor} font-medium text-base shadow-md ${buttonHoverBg} transition-transform duration-200 ${focusRingOffset}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            Login
          </motion.button>

          <motion.button
            onClick={handleBookDemo}
            className={`hidden md:inline-flex px-5 py-2 rounded-full ${buttonBg} ${textColor} font-medium text-base shadow-md ${buttonHoverBg} transition-transform duration-200 ${focusRingOffset}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            {t('hero.bookDemo')}
          </motion.button>

          <motion.button
            className={`md:hidden ${textColor}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className={`md:hidden ${mobileMenuBg} border-t ${mobileMenuBorder}`}
            style={{ zIndex: 60 }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => onNavClick(e, item.id)}
                  className={`${textColor} ${linkHoverColor} text-lg font-medium py-2`}
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-4 border-t border-[#2B2B2B] space-y-3">
                <button
                  onClick={handleLogin}
                  className={`w-full px-4 py-3 rounded-full border-2 border-[#FF1E1E] ${textColor} font-semibold text-lg ${linkHoverColor} transition-all duration-200`}
                >
                  Login
                </button>

                <button
                  onClick={handleBookDemo}
                  className={`w-full px-4 py-3 rounded-full ${buttonBg} ${textColor} font-semibold text-lg ${buttonHoverBg} transition-all duration-200`}
                >
                  {t('hero.bookDemo')}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;