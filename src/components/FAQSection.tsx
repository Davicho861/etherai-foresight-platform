
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-etherblue relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-etherblue-dark/30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Frecuentes</span>
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Respuestas a las dudas más comunes sobre nuestra tecnología predictiva y cómo puede ayudar a tu organización.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-white/10">
              <AccordionTrigger className="text-lg hover:text-etherneon">
                ¿Qué nivel de precisión tienen realmente las predicciones?
              </AccordionTrigger>
              <AccordionContent className="text-ethergray-light">
                Nuestros modelos predictivos alcanzan una precisión promedio del 90% en eventos críticos específicos. 
                Esta precisión varía según el tipo de evento, la calidad de los datos disponibles y el horizonte 
                temporal de predicción. En cada caso proporcionamos el nivel de confianza específico junto con la 
                predicción para total transparencia.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b border-white/10">
              <AccordionTrigger className="text-lg hover:text-etherneon">
                ¿Cómo protegen la seguridad y privacidad de nuestros datos?
              </AccordionTrigger>
              <AccordionContent className="text-ethergray-light">
                Implementamos cifrado de extremo a extremo, controles de acceso estrictos y cumplimos con regulaciones 
                como GDPR y CCPA. Nunca compartimos datos entre clientes y ofrecemos opciones de despliegue en la nube 
                o on-premise según los requisitos de seguridad de cada organización. Además, todos nuestros procesos 
                están certificados bajo ISO 27001.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-b border-white/10">
              <AccordionTrigger className="text-lg hover:text-etherneon">
                ¿Cuánto tiempo se tarda en implementar Praevisio AI?
              </AccordionTrigger>
              <AccordionContent className="text-ethergray-light">
                El tiempo de implementación varía según la complejidad del caso. Una implementación básica puede estar 
                operativa en 2-4 semanas. Proyectos más complejos con integraciones profundas pueden requerir 2-3 meses. 
                Ofrecemos un programa piloto acelerado que permite ver resultados preliminares en solo 10 días hábiles.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-b border-white/10">
              <AccordionTrigger className="text-lg hover:text-etherneon">
                ¿Qué hace diferente a Praevisio AI de otras soluciones predictivas?
              </AccordionTrigger>
              <AccordionContent className="text-ethergray-light">
                Nos diferenciamos en tres aspectos clave: nuestra IA explicable que proporciona total transparencia sobre 
                las predicciones, nuestra arquitectura híbrida que combina algoritmos tradicionales con computación cuántica 
                para mayor precisión, y nuestro enfoque consultivo personalizado que adapta la solución a las necesidades 
                específicas de cada sector y organización.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border-b border-white/10">
              <AccordionTrigger className="text-lg hover:text-etherneon">
                ¿Qué soporte ofrecen después de la implementación?
              </AccordionTrigger>
              <AccordionContent className="text-ethergray-light">
                Todos nuestros clientes reciben soporte técnico 24/7, actualizaciones periódicas del modelo, consultoría 
                estratégica trimestral y formación continua para sus equipos. Ofrecemos diferentes niveles de SLA según 
                las necesidades de cada organización, con tiempos de respuesta garantizados desde 15 minutos para 
                incidencias críticas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
