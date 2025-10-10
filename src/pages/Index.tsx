
import React, { useEffect, useState, Suspense } from 'react';
import Navbar from '../components/Navbar';
import ModuleColombia from './ModuleColombia';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SolutionsSection from '../components/SolutionsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import AdvancedInteractiveDashboard from '../components/AdvancedInteractiveDashboard';
import EnhancedContactSection from '../components/EnhancedContactSection';
import EnhancedCredibilitySection from '../components/EnhancedCredibilitySection';
import TestimonialCarousel from '../components/generated/TestimonialCarousel';
import EnhancedFAQSection from '../components/EnhancedFAQSection';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import ComparisonSection from '../components/ComparisonSection';
import CommandCenterLayout from '../components/CommandCenterLayout';

// Lazy load heavy components for performance
const CommunityResilienceWidget = React.lazy(() => import('../components/CommunityResilienceWidget'));
const SeismicMapWidget = React.lazy(() => import('../components/SeismicMapWidget'));
const FoodSecurityDashboard = React.lazy(() => import('../components/FoodSecurityDashboard'));
const EthicalVectorDisplay = React.lazy(() => import('../components/EthicalVectorDisplay'));

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check for token
    const token = window.localStorage.getItem('praevisio_token');
    setHasToken(!!token);

    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

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
      <HeroSection />
      <FeaturesSection />
      <SolutionsSection />
      <AdvancedInteractiveDashboard />

      {/* Sinfonía de Manifestación Total - Secciones Interactivas */}
      <section id="manifestation-symphony" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Sinfonía de Manifestación Total
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cada capacidad de Praevisio AI manifestada visualmente. Explora la inteligencia que protege el futuro de América Latina.
            </p>
          </div>

          {/* Acto I: Resiliencia Comunitaria */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Acto I: La Resiliencia Comunitaria</h3>
              <p className="text-gray-400">Fortaleza social frente a amenazas - Evaluación en tiempo real de comunidades LATAM</p>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etherneon"></div></div>}>
              <CommunityResilienceWidget />
            </Suspense>
          </div>

          {/* Acto II: La Conquista Geofísica */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Acto II: La Conquista Geofísica</h3>
              <p className="text-gray-400">Monitoreo sísmico en tiempo real - Protección contra desastres naturales</p>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etherneon"></div></div>}>
              <SeismicMapWidget />
            </Suspense>
          </div>

          {/* Acto III: La Profecía Alimentaria */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Acto III: La Profecía Alimentaria</h3>
              <p className="text-gray-400">Índice de riesgo de hambruna - Vigilancia de seguridad alimentaria global</p>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etherneon"></div></div>}>
              <FoodSecurityDashboard />
            </Suspense>
          </div>

          {/* Acto IV: La Conciencia Ética */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Acto IV: La Conciencia Ética</h3>
              <p className="text-gray-400">Vector Ético de IA - Máxima expresión de IA Explicable y responsable</p>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-etherneon"></div></div>}>
              <EthicalVectorDisplay />
            </Suspense>
          </div>
        </div>
      </section>

      <ComparisonSection />
      <HowItWorksSection />
      <EnhancedFAQSection />
      <EnhancedCredibilitySection />
      <TestimonialCarousel />
      <EnhancedContactSection />
      <Footer />
    </div>
  );
};

export default Index;
