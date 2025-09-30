
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ModuleColombia from './ModuleColombia';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SolutionsSection from '../components/SolutionsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import AdvancedInteractiveDashboard from '../components/AdvancedInteractiveDashboard';
import EnhancedContactSection from '../components/EnhancedContactSection';
import EnhancedCredibilitySection from '../components/EnhancedCredibilitySection';
import EnhancedFAQSection from '../components/EnhancedFAQSection';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import ComparisonSection from '../components/ComparisonSection';
import CommandCenterLayout from '../components/CommandCenterLayout';

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
      <ComparisonSection />
      <HowItWorksSection />
      <EnhancedFAQSection />
      <EnhancedCredibilitySection />
      <EnhancedContactSection />
      <Footer />
    </div>
  );
};

export default Index;
