import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ComparisonSection = () => {
  const features = [
    {
      feature: "Precisión en Predicciones",
  etherAI: "90%",
      traditional: "65%",
      highlight: true
    },
    {
      feature: "IA Explicable",
  etherAI: true,
      traditional: false,
      highlight: true
    },
    {
      feature: "Tiempo de Implementación",
  etherAI: "2-4 semanas",
      traditional: "6-12 meses",
      highlight: false
    },
    {
      feature: "Capacidad Multi-sector",
  etherAI: true,
      traditional: false,
      highlight: false
    },
    {
      feature: "Análisis en Tiempo Real",
  etherAI: true,
      traditional: false,
      highlight: false
    },
    {
      feature: "Soporte 24/7",
  etherAI: true,
      traditional: "Limitado",
      highlight: false
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-etherblue-medium/30 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por Qué Elegir <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Praevisio AI</span>?
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Comparamos nuestra inteligencia anticipatoria con las soluciones tradicionales del mercado
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-etherblue-medium/50 backdrop-blur-sm rounded-xl border border-etherneon/20 overflow-hidden">
            <div className="grid grid-cols-3 bg-gradient-to-r from-etherneon/20 to-etherblue-light/20 p-4">
              <div className="font-semibold text-ethergray-light">Característica</div>
              <div className="font-semibold text-center text-etherneon">Praevisio AI</div>
              <div className="font-semibold text-center text-ethergray-light">Soluciones Tradicionales</div>
            </div>
            
            {features.map((item, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 p-4 border-b border-etherneon/10 last:border-b-0 ${
                  item.highlight ? 'bg-etherneon/5' : ''
                }`}
              >
                <div className="flex items-center font-medium text-white">
                  {item.feature}
                </div>
                <div className="flex items-center justify-center">
                  {typeof item.etherAI === 'boolean' ? (
                    item.etherAI ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )
                  ) : (
                    <span className="text-etherneon font-semibold">{item.etherAI}</span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {typeof item.traditional === 'boolean' ? (
                    item.traditional ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )
                  ) : (
                    <span className="text-ethergray-light">{item.traditional}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-ethergray-light mb-6">
              Únete a más de 50+ organizaciones que ya transformaron sus decisiones
            </p>
            <button className="bg-gradient-to-r from-etherneon to-etherneon/80 hover:from-etherneon/90 hover:to-etherneon/70 text-etherblue-dark font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-etherneon/25">
              Comienza tu Transformación
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;