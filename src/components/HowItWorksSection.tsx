
import React, { useState } from 'react';
import { Globe, Database, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HowItWorksSection: React.FC = () => {
  const [showResource, setShowResource] = useState(false);

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMUExRjJDIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Innovación</span> al Servicio de la Precisión
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Nuestra plataforma combina datos de múltiples fuentes con una IA híbrida única para ofrecer predicciones rápidas, profundas y confiables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-6 animate-fade-in">
            <div className="h-16 w-16 mb-6 rounded-full bg-etherneon/10 flex items-center justify-center">
              <Database className="h-8 w-8 text-etherneon" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Datos Diversos</h3>
            <p className="text-ethergray-light">
              Integramos fuentes de datos heterogéneas como PIB, encuestas, métricas climáticas, tendencias en redes sociales y más para crear una base completa de análisis.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="h-16 w-16 mb-6 rounded-full bg-etherneon/10 flex items-center justify-center">
              <Globe className="h-8 w-8 text-etherneon" />
            </div>
            <h3 className="text-xl font-semibold mb-3">IA Híbrida</h3>
            <p className="text-ethergray-light">
              Nuestra arquitectura fusiona algoritmos clásicos para rapidez con computación cuántica para análisis complejo, logrando un equilibrio perfecto entre precisión y eficiencia.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="h-16 w-16 mb-6 rounded-full bg-etherneon/10 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-etherneon" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Resultados Claros</h3>
            <p className="text-ethergray-light">
              Transformamos análisis complejos en insights accionables, presentados en un formato accesible para todos los usuarios, sin importar su nivel técnico.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center rounded-xl overflow-hidden bg-etherblue border border-white/10">
          <div className="lg:w-1/2 p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4">Transparencia con IA Explicable</h3>
            <p className="text-ethergray-light mb-6">
              Nuestra IA explicable profunda asegura que cada predicción incluya una explicación clara y comprensible. 
              Entiende no solo el "qué", sino el "por qué" detrás de cada insight, generando confianza para actuar.
            </p>
            
            <div className="space-y-5">
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold mb-2">Transparencia Total</h4>
                <p className="text-sm text-ethergray-light">
                  Cada predicción viene acompañada de una explicación detallada de los factores que la influyen, permitiéndote entender el razonamiento detrás de cada resultado.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold mb-2">Confianza Accionable</h4>
                <p className="text-sm text-ethergray-light">
                  Al comprender el "por qué" detrás de cada predicción, los tomadores de decisiones pueden actuar con mayor confianza y precisión.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold mb-2">Verificabilidad</h4>
                <p className="text-sm text-ethergray-light">
                  Nuestro sistema permite rastrear y verificar las fuentes de datos y los procesos de análisis que respaldan cada predicción.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10">
                <Button 
                  variant="outline" 
                  className="text-etherneon border-etherneon hover:bg-etherneon/10"
                  onClick={() => setShowResource(!showResource)}
                >
                  {showResource ? 'Ocultar Recursos' : 'Ver Recursos'}
                </Button>

                {showResource && (
                  <div className="mt-4 p-4 bg-etherblue-dark rounded-md border border-white/10">
                    <h5 className="font-medium mb-2">Recursos de IA Explicable</h5>
                    <ul className="space-y-2 text-sm text-ethergray-light">
                      <li className="flex items-center">
                        <div className="h-1 w-1 rounded-full bg-etherneon mr-2"></div>
                        <a href="#" className="hover:text-etherneon">IA Explicable: El Futuro de la Confianza en Datos</a>
                      </li>
                      <li className="flex items-center">
                        <div className="h-1 w-1 rounded-full bg-etherneon mr-2"></div>
                        <a href="#" className="hover:text-etherneon">Cómo la IA Cuántica Predice lo Impredecible</a>
                      </li>
                      <li className="flex items-center">
                        <div className="h-1 w-1 rounded-full bg-etherneon mr-2"></div>
                        <a href="#" className="hover:text-etherneon">Casos de estudio: IA predictiva en acción</a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 p-8 md:p-12 bg-gradient-to-br from-etherblue to-etherblue-dark">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-etherneon/30 to-etherneon/10 rounded-xl blur-lg"></div>
              <div className="relative bg-etherblue-dark rounded-xl border border-white/10 p-6 md:p-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-etherneon mr-2 animate-pulse"></span>
                  Predicción Explicada
                </h4>
                
                <div className="mb-6">
                  <div className="text-sm text-ethergray-light mb-1">Evento Predicho:</div>
                  <div className="font-medium">Escasez de agua en región sureste de España en Q3 2024</div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-ethergray-light mb-1">Confianza:</div>
                  <div className="flex items-center">
                    <div className="h-2 flex-1 bg-ethergray-light/20 rounded-full mr-3">
                      <div className="h-full bg-gradient-to-r from-etherneon to-etherneon/70 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-etherneon font-semibold">92%</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-ethergray-light mb-1">Desglose de Predicción:</div>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center">
                      <div className="w-24 text-xs">Clima (40%)</div>
                      <div className="flex-1 h-2 bg-ethergray-light/20 rounded-full ml-2">
                        <div className="h-full bg-blue-400 rounded-full" style={{width: '40%'}}></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-xs">Historial (30%)</div>
                      <div className="flex-1 h-2 bg-ethergray-light/20 rounded-full ml-2">
                        <div className="h-full bg-purple-400 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-xs">Sociales (30%)</div>
                      <div className="flex-1 h-2 bg-ethergray-light/20 rounded-full ml-2">
                        <div className="h-full bg-orange-400 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-ethergray-light mb-2">Factores principales:</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="h-5 w-5 mt-0.5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-etherneon">1</span>
                      </div>
                      <p>Reducción del 40% en precipitaciones durante últimos 6 meses vs. promedio histórico</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 mt-0.5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-etherneon">2</span>
                      </div>
                      <p>Aumento de 2.3°C en temperatura media regional vs. último quinquenio</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 mt-0.5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-etherneon">3</span>
                      </div>
                      <p>Incremento del 35% en consumo agrícola por expansión de cultivos</p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="text-sm text-ethergray-light mb-2">Recomendaciones:</div>
                  <p className="text-sm">Implementar restricciones hídricas preventivas y desarrollar infraestructura de captación pluvial en próximos 60 días.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
