import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const testimonials = [
    {
      name: "Dr. María González",
      position: "Ministra de Salud",
      organization: "República de Colombia",
      quote: "Praevisio AI nos ayudó a prever un brote de dengue en 2023, permitiéndonos implementar medidas preventivas que salvaron miles de vidas y optimizaron nuestros recursos sanitarios.",
      impact: "15,000+ vidas",
      anticipation: "5 meses",
      precision: "94%",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Carlos Mendoza",
      position: "Director de Planificación Estratégica",
      organization: "Organización Internacional de Desarrollo",
      quote: "La capacidad predictiva de Praevisio AI transformó nuestra planificación estratégica. Anticipamos una crisis migratoria con 5 meses de antelación, permitiéndonos preparar adecuadamente recursos y coordinar esfuerzos internacionales.",
      impact: "$7.2M ahorrados",
      anticipation: "5 meses",
      precision: "89%",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Ana Rodríguez",
      position: "CEO",
      organization: "TechCorp Global",
      quote: "Implementar Praevisio AI fue la mejor decisión estratégica. Su precisión del 90% nos permitió anticipar cambios en el mercado y ajustar nuestra estrategia con meses de antelación.",
      impact: "$50M+ en ingresos",
      anticipation: "6 meses",
      precision: "91%",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Dr. Luis Fernández",
      position: "Director de Investigación",
      organization: "Universidad Nacional",
      quote: "La integración de IA híbrida en nuestras investigaciones ha revolucionado nuestro enfoque. Praevisio AI no solo predice, sino que explica las variables críticas con claridad excepcional.",
      impact: "12 publicaciones",
      anticipation: "4 meses",
      precision: "96%",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Testimonios</span> de Líderes Globales
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Descubre cómo Praevisio AI ha transformado la toma de decisiones en organizaciones líderes alrededor del mundo
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="bg-etherblue-medium/20 backdrop-blur-sm rounded-xl p-8 border border-etherneon/20 hover:border-etherneon/40 transition-all duration-300 hover:shadow-lg hover:shadow-etherneon/10">
                    <div className="flex items-start mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full mr-6 object-cover border-2 border-etherneon/30"
                      />
                      <div className="flex-1">
                        <Quote className="h-8 w-8 text-etherneon mb-4 opacity-50" />
                        <blockquote className="text-ethergray-light mb-6 text-lg italic leading-relaxed">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white text-xl mb-1">{testimonial.name}</h4>
                            <p className="text-sm text-etherneon font-medium">{testimonial.position}</p>
                            <p className="text-xs text-ethergray-light">{testimonial.organization}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-etherneon">{testimonial.impact}</div>
                              <div className="text-xs text-ethergray-light">Impacto</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-etherneon">{testimonial.anticipation}</div>
                              <div className="text-xs text-ethergray-light">Anticipación</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-etherneon">{testimonial.precision}</div>
                              <div className="text-xs text-ethergray-light">Precisión</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-12 w-12 rounded-full bg-etherblue-dark/80 border border-etherneon/30 hover:bg-etherneon/20 hover:border-etherneon/50 transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronLeft className="h-6 w-6 text-etherneon group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-12 w-12 rounded-full bg-etherblue-dark/80 border border-etherneon/30 hover:bg-etherneon/20 hover:border-etherneon/50 transition-all duration-300 flex items-center justify-center group"
          >
            <ChevronRight className="h-6 w-6 text-etherneon group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-ethergray-light mb-6">
            ¿Listo para unirte a estos líderes visionarios?
          </p>
          <button className="bg-gradient-to-r from-etherneon to-etherneon/80 hover:from-etherneon/90 hover:to-etherneon/70 text-etherblue-dark font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-etherneon/25">
            Solicitar Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;