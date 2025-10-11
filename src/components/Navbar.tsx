
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
    { name: "Inicio", href: "#inicio" },
    { name: "Ver Demo", href: "/demo" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Precios", href: "/pricing" },
    { name: "Módulo LATAM", href: "/module/colombia" },
    { name: "Qué Hacemos", href: "#features" },
    { name: "Soluciones", href: "#solutions" },
    { name: "Cómo Funciona", href: "#how-it-works" },
    { name: "Casos de Éxito", href: "#credibility" },
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
              <Link to="#inicio" className="text-white font-bold text-xl flex items-center">
                <div className="h-8 w-8 rounded-full bg-etherneon mr-2 flex items-center justify-center text-etherblue-dark font-bold">P</div>
                <span>Praevisio AI</span>
              </Link>
            </div>
            
            {!isMobile ? (
              <nav className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm text-white hover:text-etherneon transition-colors link-underline"
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Desktop CTA */}
                <Link to="/demo" className="ml-4 inline-block">
                  <Button className="bg-etherneon text-etherblue-dark px-4 py-2">Ver la Demo</Button>
                </Link>
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
        <div className="fixed inset-0 z-40 bg-etherblue-dark/95 pt-20 px-4 flex flex-col">
          <nav className="flex flex-col space-y-6 items-center py-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-lg text-white hover:text-etherneon transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
