
import React, { useEffect, useState, Suspense } from 'react';
import Navbar from '../components/Navbar';
import ModuleColombia from './ModuleColombia';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SolutionsSection from '../components/SolutionsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import EnhancedContactSection from '../components/EnhancedContactSection';
import EnhancedCredibilitySection from '../components/EnhancedCredibilitySection';
import EnhancedFAQSection from '../components/EnhancedFAQSection';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import ComparisonSection from '../components/ComparisonSection';
import CommandCenterLayout from '../components/CommandCenterLayout';

// Lazy load heavy components for better performance
const AdvancedInteractiveDashboard = React.lazy(() => import('../components/AdvancedInteractiveDashboard'));
const TestimonialCarousel = React.lazy(() => import('../components/generated/TestimonialCarousel'));
// DemoSection removed from landing — demo moved to /demo (Praevisio-Apollo-Sanctuary-Restoration)


const Index = () => {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check for token
    const token = window.localStorage.getItem('praevisio_token');
    setHasToken(!!token);

    // Minimal loading delay for smooth UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;

        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: (target as HTMLElement).offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // Update title and meta description
    document.title = 'Praevisio AI | Inteligencia Anticipatoria de Élite';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Praevisio AI: Plataforma de inteligencia anticipatoria con precisión del 90% para predecir crisis globales. IA híbrida (clásica + cuántica) para gobiernos, empresas y ONGs en Latinoamérica.');
    }

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-etherblue-dark">
        <div className="text-etherneon text-4xl font-bold relative">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-4 border-etherneon border-t-transparent animate-spin"></div>
          </div>
          <span className="opacity-0">Praevisio</span>
        </div>
      </div>
    );
  }

  // If user has token, show dashboard
  if (hasToken) {
    return <CommandCenterLayout />;
  }

  // If user navigates directly to /module/colombia render that page
  if (typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/module/colombia')) {
    return <ModuleColombia />;
  }

  return (
    <div className="min-h-screen bg-etherblue-dark text-white">
      <Toaster position="top-right" />
      <Navbar />
      <div id="inicio">
        <HeroSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="solutions">
        <SolutionsSection />
      </div>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-etherblue-dark text-etherneon"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-etherneon"></div></div>}>
        <AdvancedInteractiveDashboard />
      </Suspense>
      <section id="demo-cta" className="py-20 bg-gradient-to-r from-etherblue-dark to-transparent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Experimenta la Sinfonía en Vivo — v2</h2>
          <p className="text-gray-300 mb-6">Visita nuestro demo inmersivo para ver todas las capacidades de Praevisio AI en acción. (HMR test)</p>
          <div className="flex justify-center">
            <a href="#/demo" className="inline-block bg-etherneon text-etherblue-dark font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">Ver la Demo</a>
          </div>
        </div>
      </section>
      <ComparisonSection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <EnhancedFAQSection />
      <div id="credibility">
        <EnhancedCredibilitySection />
      </div>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-etherblue-dark text-etherneon"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-etherneon"></div></div>}>
        <TestimonialCarousel />
      </Suspense>
      <EnhancedContactSection />
      <Footer />
    </div>
  );
};

export default Index;
