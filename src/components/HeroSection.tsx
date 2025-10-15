
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CosmicParticles } from '@/components/global/CosmicParticles';
import { TaskReplayPortal } from '@/components/global/TaskReplayPortal';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

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
    setShowPortal(true);
    toast.success("🌌 Iniciando Portal Cósmico de Foresight Global");
  };

  return (
    <>
      <TaskReplayPortal isOpen={showPortal} onClose={() => setShowPortal(false)} />
      
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <CosmicParticles />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cosmic-primary))]/95 via-[hsl(var(--etherblue-dark))]/90 to-[hsl(var(--cosmic-secondary))]/85"></div>
      
        {showVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center" 
               onClick={() => setShowVideo(false)}>
            <div className="relative w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
              <button 
                className="absolute -top-10 right-0 text-white hover:text-[hsl(var(--cosmic-accent-latam))] transition-colors"
                onClick={() => setShowVideo(false)}
              >
                Cerrar Video
              </button>
              <div className="aspect-video bg-gradient-to-br from-[hsl(var(--cosmic-primary))] to-[hsl(var(--etherblue-dark))] rounded-2xl overflow-hidden border border-[hsl(var(--cosmic-accent-latam))]/30 shadow-2xl">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <Sparkles className="h-16 w-16 text-[hsl(var(--cosmic-accent-latam))] mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2 font-sf-pro">EtherAI Foresight en Acción</h3>
                    <p className="text-white/70 mb-6">Demo Épica: Anticipamos una crisis financiera en Colombia con 4 meses de antelación</p>
                    <div className="inline-block">
                      <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-[hsl(var(--cosmic-gradient-start))] to-[hsl(var(--cosmic-gradient-end))] animate-pulse"></div>
                      </div>
                      <p className="text-sm text-white/50 mt-2">Cargando experiencia inmersiva...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      
        <div className="container relative z-10 px-4 py-32 md:py-40 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center py-2 px-4 rounded-full bg-white/5 border border-[hsl(var(--cosmic-accent-latam))]/30 backdrop-blur-md hover:scale-105 transition-transform">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--cosmic-accent-latam))] mr-2 animate-pulse shadow-lg shadow-[hsl(var(--cosmic-accent-latam))]/50"></span>
            <span className="text-sm font-medium text-[hsl(var(--cosmic-accent-latam))]">IA Híbrida Cuántica-Clásica • 90% Precisión</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in font-sf-pro" style={{ letterSpacing: '-0.02em' }}>
            {t('hero.title').split(',')[0]},<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-[hsl(var(--cosmic-accent-latam))] to-[hsl(var(--cosmic-accent-global))] bg-clip-text text-transparent">
              {t('hero.title').split(',')[1]}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mb-10 animate-fade-in leading-relaxed">
            {t('hero.subtitle')}
          </p>
        
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[hsl(var(--cosmic-gradient-start))] to-[hsl(var(--cosmic-gradient-end))] hover:scale-105 text-white group transition-all duration-300 border-0 shadow-2xl shadow-[hsl(var(--cosmic-secondary))]/50 text-lg px-8 py-6" 
              onClick={handleCTAClick}
            >
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5 transition-all group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white group text-lg px-8 py-6"
              onClick={() => setShowVideo(true)}
            >
              <Play className="mr-2 h-5 w-5 transition-all group-hover:scale-110" /> 
              {t('hero.watchVideo')}
            </Button>
          </div>
        
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-fade-in">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[hsl(var(--cosmic-accent-latam))]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(var(--cosmic-accent-latam))]/20 group">
              <div className="text-4xl font-bold text-[hsl(var(--cosmic-accent-latam))] mb-2 group-hover:scale-110 transition-transform">90%</div>
              <h3 className="font-bold text-lg mb-2 text-white font-sf-pro">Precisión Élite</h3>
              <p className="text-white/60 text-sm leading-relaxed">Predicciones críticas en salud, economía, política y clima para LATAM y el mundo</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[hsl(var(--cosmic-accent-global))]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(var(--cosmic-accent-global))]/20 group">
              <div className="text-4xl font-bold text-[hsl(var(--cosmic-accent-global))] mb-2 group-hover:scale-110 transition-transform">∞</div>
              <h3 className="font-bold text-lg mb-2 text-white font-sf-pro">IA Explicable</h3>
              <p className="text-white/60 text-sm leading-relaxed">Transparencia total en cada predicción con cadenas de razonamiento visual</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[hsl(var(--cosmic-secondary))]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(var(--cosmic-secondary))]/20 group">
              <div className="text-4xl font-bold text-[hsl(var(--cosmic-secondary))] mb-2 group-hover:scale-110 transition-transform">∞</div>
              <h3 className="font-bold text-lg mb-2 text-white font-sf-pro">Alcance Global</h3>
              <p className="text-white/60 text-sm leading-relaxed">De Ecuador a la ONU: soluciones adaptadas a cada región y sector del planeta</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
