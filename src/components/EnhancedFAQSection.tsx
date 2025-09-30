import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EnhancedFAQSection = () => {
  const faqs = [
    {
      question: "¿Cómo funciona la precisión del 90% en las predicciones?",
      answer: "Praevisio AI combina inteligencia artificial híbrida (algoritmos clásicos + computación cuántica) para analizar más de 10,000 variables simultáneamente. Nuestros modelos han sido entrenados con datos históricos de los últimos 20 años y validados contra eventos reales, logrando una precisión consistente del 90% en ventanas de predicción de 3-6 meses."
    },
    {
      question: "¿Qué tipos de crisis puede predecir Praevisio AI?",
      answer: "Nuestra plataforma especializa en: Crisis económicas (recesiones, inflación, volatilidad de mercados), eventos climáticos extremos (sequías, inundaciones, huracanes), inestabilidad social (protestas, migración masiva), crisis sanitarias (brotes epidémicos), y disrupciones en cadenas de suministro globales."
    },
    {
      question: "¿Cuánto tiempo toma implementar Praevisio AI en mi organización?",
      answer: "La implementación completa toma entre 2-4 semanas. Incluye: Semana 1-2: Integración de fuentes de datos y personalización del dashboard. Semana 3: Entrenamiento del equipo y configuración de alertas. Semana 4: Período de prueba con soporte 24/7. Ofrecemos acompañamiento completo durante todo el proceso."
    },
    {
      question: "¿Cómo garantizan la seguridad y privacidad de nuestros datos?",
      answer: "Utilizamos encriptación militar AES-256, certificaciones SOC 2 Type II e ISO 27001. Los datos nunca salen de servidores certificados en tu región. Implementamos zero-trust architecture y auditorías de seguridad trimestrales. Cumplimos con GDPR, CCPA y regulaciones locales de cada país."
    },
    {
      question: "¿Qué soporte técnico incluye la plataforma?",
      answer: "Soporte 24/7 con analistas especializados, actualizaciones automáticas de modelos, entrenamiento continuo para tu equipo, reportes personalizados semanales, y acceso a nuestro centro de conocimiento con casos de estudio y mejores prácticas."
    },
    {
      question: "¿Cómo se diferencia de otras soluciones de análisis predictivo?",
      answer: "Praevisio AI es única por: IA Explicable (entiendes el 'por qué' de cada predicción), precisión del 90% validada, capacidad multi-sector sin reentrenamiento, integración de computación cuántica para análisis complejos, y especialización en crisis globales con impacto en Latinoamérica."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Preguntas</span> Frecuentes
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre Praevisio AI y cómo puede transformar tu capacidad de anticipación
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-etherblue-medium/30 backdrop-blur-sm rounded-lg border border-etherneon/20 px-6"
              >
                <AccordionTrigger className="text-left text-white hover:text-etherneon text-lg font-medium py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-ethergray-light text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-ethergray-light mb-6">
              ¿Tienes más preguntas? Nuestros expertos están listos para ayudarte
            </p>
            <button className="bg-gradient-to-r from-etherneon to-etherneon/80 hover:from-etherneon/90 hover:to-etherneon/70 text-etherblue-dark font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-etherneon/25">
              Hablar con un Experto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFAQSection;