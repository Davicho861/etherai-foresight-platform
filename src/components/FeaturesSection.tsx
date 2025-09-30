
import React from 'react';
import { Database, FileSearch, Activity } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Predicciones</span> que Transforman Decisiones
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Praevisio AI integra inteligencia híbrida (clásica y cuántica) para ofrecer predicciones de crisis con precisión del 90%.
            Nuestra plataforma analiza datos complejos para anticipar eventos críticos,
            empoderando líderes y organizaciones para acciones oportunas y efectivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-etherblue bg-opacity-40 backdrop-blur-md border border-white/10 animate-fade-in">
            <div className="h-12 w-12 mb-4 rounded-lg bg-etherneon/20 flex items-center justify-center">
              <Database className="h-6 w-6 text-etherneon" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analiza todo</h3>
            <p className="text-ethergray-light">
              Clima, economía, redes sociales y más para obtener una visión integral de los posibles eventos futuros.
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-etherblue bg-opacity-40 backdrop-blur-md border border-white/10 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="h-12 w-12 mb-4 rounded-lg bg-etherneon/20 flex items-center justify-center">
              <FileSearch className="h-6 w-6 text-etherneon" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Funciona para todos</h3>
            <p className="text-ethergray-light">
              Salud, política, economía y medio ambiente, entregando soluciones específicas para cada contexto.
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-etherblue bg-opacity-40 backdrop-blur-md border border-white/10 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="h-12 w-12 mb-4 rounded-lg bg-etherneon/20 flex items-center justify-center">
              <Activity className="h-6 w-6 text-etherneon" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resultados simples, decisiones claras</h3>
            <p className="text-ethergray-light">
              Interfaz intuitiva que traduce predicciones complejas en información accionable, sin necesidad de experiencia técnica.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col lg:flex-row items-center bg-etherblue bg-opacity-40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
          <div className="lg:w-1/2 p-8 lg:p-12">
            <h3 className="text-2xl font-bold mb-4">Transformando Datos en Predicciones Actionables</h3>
            <p className="text-ethergray-light mb-6">
              Nuestra plataforma unifica diversas fuentes de datos para crear modelos predictivos altamente precisos. 
              Mediante análisis de tendencias, patrones y correlaciones, convertimos información compleja en señales claras para la toma de decisiones.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-etherneon mr-3"></div>
                <span>Análisis multivariable de economía, clima, y tendencias sociales</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-etherneon mr-3"></div>
                <span>Detección temprana de crisis con ventanas de 3-6 meses</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-etherneon mr-3"></div>
                <span>Recomendaciones personalizadas y accionables</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 bg-etherblue-dark p-8 lg:p-0">
            <div className="h-full w-full bg-gradient-to-br from-etherneon/20 to-transparent rounded-lg p-6 lg:p-12">
              <div className="bg-etherblue border border-white/10 rounded-lg p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-etherneon/30 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold">Análisis de Riesgo Climático</h4>
                    <span className="text-xs text-etherneon py-1 px-2 rounded-full bg-etherneon/20">90% precisión</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Riesgo de inundación</span>
                        <span className="text-etherneon">Alto</span>
                      </div>
                      <div className="h-2 bg-ethergray-light/20 rounded-full">
                        <div className="h-full bg-gradient-to-r from-etherneon to-etherneon/70 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Impacto económico</span>
                        <span className="text-etherneon">Medio</span>
                      </div>
                      <div className="h-2 bg-ethergray-light/20 rounded-full">
                        <div className="h-full bg-gradient-to-r from-etherneon to-etherneon/70 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Preparación social</span>
                        <span className="text-etherneon">Bajo</span>
                      </div>
                      <div className="h-2 bg-ethergray-light/20 rounded-full">
                        <div className="h-full bg-gradient-to-r from-etherneon to-etherneon/70 rounded-full" style={{width: '35%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm text-ethergray-light">
                    <p>Recomendación: Implementar medidas de mitigación en próximos 45 días para áreas costeras vulnerables.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
