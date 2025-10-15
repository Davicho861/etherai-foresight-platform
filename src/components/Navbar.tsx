
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageToggle } from '@/components/global/LanguageToggle';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.features'), href: "#features" },
    { name: t('nav.solutions'), href: "#solutions" },
    { name: t('nav.demo'), href: "#demo" },
    { name: t('nav.contact'), href: "#contact" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
          scrolled ? 'bg-etherblue-dark/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="#" className="text-white font-bold text-xl flex items-center font-sf-pro">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--cosmic-accent-latam))] to-[hsl(var(--cosmic-accent-global))] mr-2 flex items-center justify-center text-white font-bold shadow-lg shadow-[hsl(var(--cosmic-accent-latam))]/30">
                  E
                </div>
                <span className="bg-gradient-to-r from-white to-[hsl(var(--cosmic-accent-latam))] bg-clip-text text-transparent">
                  EtherAI Foresight
                </span>
              </a>
            </div>
            
            {!isMobile ? (
              <nav className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-sm text-white/90 hover:text-[hsl(var(--cosmic-accent-latam))] transition-all hover:scale-105"
                  >
                    {link.name}
                  </a>
                ))}
                <LanguageToggle />
                <Button className="bg-gradient-to-r from-[hsl(var(--cosmic-gradient-start))] to-[hsl(var(--cosmic-gradient-end))] hover:scale-105 transition-transform text-white border-0 shadow-lg">
                  {t('nav.requestDemo')}
                </Button>
              </nav>
            ) : (
              <button
                className="md:hidden text-white flex items-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-[hsl(var(--cosmic-primary))] to-[hsl(var(--etherblue-dark))] backdrop-blur-xl pt-20 px-4 flex flex-col">
          <nav className="flex flex-col space-y-6 items-center py-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg text-white hover:text-[hsl(var(--cosmic-accent-latam))] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <LanguageToggle />
            <Button 
              className="bg-gradient-to-r from-[hsl(var(--cosmic-gradient-start))] to-[hsl(var(--cosmic-gradient-end))] hover:scale-105 transition-transform text-white w-full mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.requestDemo')}
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
