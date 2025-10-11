
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full width and height
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Quantum circuit visualization parameters
    const particles: { x: number, y: number, size: number, speed: number, color: string }[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#4ADE80' : '#34D399'
      });
    }

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor((0.2 + Math.random() * 0.2) * 255).toString(16)}`;
        ctx.fill();

        // Move particles
        particle.y -= particle.speed;
        
        // Reset particles
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${particles[i].color}${Math.floor((0.1 * (1 - distance / 100)) * 255).toString(16)}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  const handleCTAClick = () => {
    toast.info("Preparando tu experiencia con Praevisio AI");
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
      <div className="absolute inset-0 bg-gradient-radial from-etherblue-dark/90 via-etherblue-dark to-etherblue-dark/95"></div>
      
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" 
             onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-10 right-0 text-white hover:text-etherneon"
              onClick={() => setShowVideo(false)}
            >
              Cerrar Video
            </button>
            <div className="aspect-video bg-etherblue-dark rounded-lg overflow-hidden border border-etherneon/30">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl text-etherneon mb-2">Praevisio AI en Acción</h3>
                  <p className="text-ethergray-light">Descubre cómo anticipamos una crisis financiera en Colombia con 4 meses de antelación</p>
                  <div className="mt-4 bg-etherblue-medium/50 rounded-lg p-6">
                    <div className="flex items-center justify-center h-32 text-ethergray-light">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full border-4 border-etherneon border-t-transparent animate-spin mx-auto mb-4"></div>
                        <p>Cargando demostración interactiva...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container relative z-10 px-4 py-32 md:py-40 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center py-1 px-3 rounded-full bg-etherneon/10 border border-etherneon/30 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-etherneon mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-etherneon">IA Predictiva del 90% de Precisión</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
          Anticipa el Futuro, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon via-etherneon to-etherneon/70">Actúa Hoy</span>
        </h1>
        
        <p className="text-lg md:text-xl text-ethergray-light max-w-3xl mb-10 animate-fade-in">
          Praevisio AI: Inteligencia anticipatoria de élite con precisión del 90% para un mundo más preparado y resiliente ante crisis globales.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button size="lg" className="bg-etherneon hover:bg-etherneon/80 text-etherblue-dark group transition-all duration-300 transform hover:scale-105" onClick={handleCTAClick}>
            Actúa Antes de la Próxima Crisis
            <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-1" />
          </Button>
          
          <Button variant="outline" size="lg" className="border-ethergray border-opacity-30 hover:bg-etherblue text-white group" onClick={() => { window.location.hash = '/solutions'; }}>
            <Globe className="mr-2 h-4 w-4 transition-all group-hover:rotate-12" /> 
            Explorar Soluciones
          </Button>
        </div>
        
        <button 
          className="mt-8 flex items-center gap-2 text-ethergray-light hover:text-etherneon transition-colors"
          onClick={() => setShowVideo(true)}
        >
          <div className="h-10 w-10 rounded-full bg-etherneon/20 flex items-center justify-center">
            <Play className="h-4 w-4 text-etherneon" />
          </div>
          <span>Ver video (90 seg)</span>
        </button>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl animate-fade-in">
          <div className="p-6 rounded-lg bg-gradient-to-br from-etherblue to-etherblue-dark backdrop-blur-sm border border-white/10 hover:border-etherneon/30 transition-all duration-300 hover:shadow-lg hover:shadow-etherneon/5 group">
            <h3 className="font-bold text-xl mb-1 group-hover:text-etherneon transition-colors">Precisión del 90%</h3>
            <p className="text-ethergray-light text-sm">En predicciones de eventos críticos como desastres naturales y crisis económicas</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-etherblue to-etherblue-dark backdrop-blur-sm border border-white/10 hover:border-etherneon/30 transition-all duration-300 hover:shadow-lg hover:shadow-etherneon/5 group">
            <h3 className="font-bold text-xl mb-1 group-hover:text-etherneon transition-colors">IA Explicable</h3>
            <p className="text-ethergray-light text-sm">Entendiendo cada predicción con total transparencia para generar confianza en la acción</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-etherblue to-etherblue-dark backdrop-blur-sm border border-white/10 hover:border-etherneon/30 transition-all duration-300 hover:shadow-lg hover:shadow-etherneon/5 group">
            <h3 className="font-bold text-xl mb-1 group-hover:text-etherneon transition-colors">Adaptable</h3>
            <p className="text-ethergray-light text-sm">A cualquier sector y organización, con soluciones personalizadas para tus desafíos específicos</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
