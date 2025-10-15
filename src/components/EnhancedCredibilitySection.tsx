import React from 'react';
import { Play, Users, DollarSign, Clock, Award } from 'lucide-react';
import AnimatedMetric from './AnimatedMetrics';

const EnhancedCredibilitySection = () => {
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
    }
  ];

  const partners = [
    "Ministerio de Salud Colombia",
    "Banco Central Ecuador",
    "ONU Desarrollo",
    "Cruz Roja Internacional",
    "Banco Mundial",
    "CEPAL"
  ];

  const stats = [
    {
      value: 90,
      suffix: "%",
      label: "Precisión promedio",
      description: "En predicciones de eventos críticos",
      icon: Award,
      delay: 0
    },
    {
      value: 50,
      suffix: "+",
      label: "Organizaciones",
      description: "Confían en Praevisio AI",
      icon: Users,
      delay: 300
    },
    {
      value: 15,
      suffix: "M+",
      label: "Vidas impactadas",
      description: "Positivamente por nuestras predicciones",
      icon: Users,
      delay: 600
    },
    {
      value: 30,
      suffix: "%",
      label: "Reducción en tiempo",
      description: "De respuesta ante crisis",
      icon: Clock,
      delay: 900
    }
  ];

  return (
    <section id="credibility" className="py-20 md:py-28 bg-etherblue-medium/20 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Confiado</span> por Líderes Globales
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Más de 50 organizaciones ya confían en Praevisio AI para anticipar eventos críticos y tomar decisiones informadas
          </p>
        </div>

        {/* Partners */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-center mb-8 text-ethergray-light">
            Organizaciones que transformaron su futuro con nosotros
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="bg-etherblue-dark/50 rounded-lg p-4 text-center border border-etherneon/10 hover:border-etherneon/30 transition-colors group"
              >
                <div className="h-12 w-12 rounded-full bg-etherneon/20 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-etherneon font-bold text-sm">{partner.charAt(0)}</span>
                </div>
                <p className="text-xs text-ethergray-light group-hover:text-white transition-colors">
                  {partner}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-etherblue-dark/50 backdrop-blur-sm rounded-xl p-8 border border-etherneon/20 hover:border-etherneon/40 transition-all duration-300 hover:shadow-lg hover:shadow-etherneon/10"
            >
              <div className="flex items-start mb-6">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-etherneon">{testimonial.position}</p>
                  <p className="text-xs text-ethergray-light">{testimonial.organization}</p>
                </div>
                <button className="h-8 w-8 rounded-full bg-etherneon/20 flex items-center justify-center hover:bg-etherneon/30 transition-colors">
                  <Play className="h-4 w-4 text-etherneon" />
                </button>
              </div>
              
              <blockquote className="text-ethergray-light mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-etherneon/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-etherneon">{testimonial.impact}</div>
                  <div className="text-xs text-ethergray-light">Impacto</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-etherneon">{testimonial.anticipation}</div>
                  <div className="text-xs text-ethergray-light">Anticipación</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-etherneon">{testimonial.precision}</div>
                  <div className="text-xs text-ethergray-light">Precisión</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-etherneon/20 to-etherneon/10 rounded-full px-6 py-2 mb-8">
            <Award className="h-5 w-5 text-etherneon" />
            <span className="text-sm font-medium text-etherneon">Destacado en Forbes 2024: Innovación en IA</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-etherblue-dark/30 rounded-xl border border-etherneon/10 hover:border-etherneon/30 transition-colors group"
              >
                <div className="h-12 w-12 rounded-full bg-etherneon/20 mx-auto mb-4 flex items-center justify-center group-hover:bg-etherneon/30 transition-colors">
                  <stat.icon className="h-6 w-6 text-etherneon" />
                </div>
                <div className="mb-2">
                  <AnimatedMetric 
                    value={stat.value} 
                    suffix={stat.suffix}
                    delay={stat.delay}
                  />
                </div>
                <div className="font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-ethergray-light">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Únete a los Líderes que ya Anticipan el Futuro
          </h3>
          <p className="text-ethergray-light mb-8 max-w-2xl mx-auto">
            No esperes a la próxima crisis. Solicita tu demo personalizada hoy y descubre cómo Praevisio AI puede transformar tu capacidad de anticipación.
          </p>
          <button className="bg-gradient-to-r from-etherneon to-etherneon/80 hover:from-etherneon/90 hover:to-etherneon/70 text-etherblue-dark font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-etherneon/25">
            Solicitar Demo Personalizada
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCredibilitySection;