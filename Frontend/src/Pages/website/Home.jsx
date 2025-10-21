

// // WEBSITE COMPONENTS (Same folder - pages/website/)
// // ============================================
// import Hero from "./Hero";
// import AiShowcase from "./AiShowcase";
// import KeyFeatures from "./KeyFeatures";
// import UseCases from "./UseCases";
// import Testimonials from "./Testimonials";
// import PricingFull from "./PricingFull";
// import DemoForm from "./DemoForm";

// // ============================================
// // COMMON COMPONENTS (Navigate up to src, then into components)
// // ============================================
// import DemoBooking from "../../Components/forms/DemoBooking";
// // REMOVED: Footer import - it's handled by Layout.jsx

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Hero Section */}
//       <section id="hero">
//         <Hero />
//       </section>

//       {/* AI Showcase Section */}
//       <section id="showcase">
//         <AiShowcase />
//       </section>

//       {/* Key Features Section */}
//       <section id="features">
//         <KeyFeatures />
//       </section>

//       {/* Use Cases Section */}
//       <section id="use-cases">
//         <UseCases />
//       </section>

//       {/* Testimonials Section */}
//       <section id="testimonials">
//         <Testimonials />
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing">
//         <PricingFull />
//       </section>

//       {/* Demo Form Section */}
//       <section id="demo">
//         <DemoForm />
//       </section>

//       {/* REMOVED: Footer component - Layout.jsx handles this */}
//     </div>
//   );
// };

// export default Home;
// frontend/src/Pages/website/Home.jsx - SIMPLIFIED VERSION
import Hero from "./Hero.jsx";
import AiShowcase from "./AiShowcase.jsx";
import KeyFeatures from "./KeyFeatures.jsx";
// import UseCases from "./UseCases.jsx";
import Pricing from "./Pricing.jsx";
import DemoForm from "./DemoForm.jsx";
import Testimonials from "./Testimonials.jsx";
import WhyChooseFinitac from "./WhyChooseFinitac.jsx";
import CtaSection from "./CtaSection.jsx";
// import StatsSection from "./StatsSection.jsx";
import FAQSection from "./FAQSection.jsx";
import ContactForm from "./Contact.jsx";

const Home = () => {
  return (
    <main className="min-h-screen">
      <section id="hero">
        <Hero />
      </section>

     

      <section id="features">
        <KeyFeatures />
      </section>

      <section id="showcase">
        <AiShowcase />
      </section>

      

      <section id="why-choose">
        <WhyChooseFinitac />
      </section>

      <section id="reviews">
        <Testimonials />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

      <section id="faq">
        <FAQSection />
      </section>

      <section id="cta">
        <CtaSection />
      </section>

      <section id="contact">
        <ContactForm />
      </section>
    </main>
  );
};

export default Home;