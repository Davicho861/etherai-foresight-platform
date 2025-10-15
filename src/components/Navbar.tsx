import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Acceder', href: '/login' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <>
      <header
        role="banner"
        data-testid="navbar"
        className={`fixed w-full top-0 left-0 z-40 transition-all g-header ${
          scrolled ? 'bg-etherblue-dark/90 backdrop-blur-md shadow' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-etherneon mr-2 flex items-center justify-center text-etherblue-dark font-bold">P</div>
            <span className="font-bold">Praevisio AI</span>
            {/* Render desktop links only when not mobile to keep tests deterministic */}
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-4 g-nav" data-testid="navbar-links">
                {navLinks.map((l) => (
                  <a key={l.name} href={l.href} className="text-sm">
                    {l.name}
                  </a>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => setMobileMenuOpen((s) => !s)} aria-label="menu" data-testid="mobile-menu-btn">
              Menu
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40" data-testid="mobile-menu-overlay">
          <div className="absolute top-0 left-0 w-64 bg-white h-full p-4 g-nav">
            <nav className="flex flex-col space-y-4">
              <Link to="#inicio" onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Acceder
              </Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
