
import React, { useState } from 'react';
import { Building, Briefcase, Users, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const SolutionsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("gobiernos");
  
  return (
    <section id="solutions" className="py-20 md:py-28 bg-etherblue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Diseñado para <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Tu Sector</span>
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Sea cual sea tu desafío, Praevisio AI tiene la solución de inteligencia anticipatoria. 
            Nuestra tecnología se adapta a tus necesidades específicas, proporcionando 
            insights relevantes y accionables para tu industria.
          </p>
        </div>

        <Tabs defaultValue="gobiernos" className="w-full max-w-4xl mx-auto" 
          onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="w-full grid grid-cols-3 mb-8 bg-etherblue-dark">
            <TabsTrigger 
              value="gobiernos" 
              className="data-[state=active]:text-etherneon data-[state=active]:border-b-2 data-[state=active]:border-etherneon"
            >
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Gobiernos</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="empresas"
              className="data-[state=active]:text-etherneon data-[state=active]:border-b-2 data-[state=active]:border-etherneon"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Empresas</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="ongs"
              className="data-[state=active]:text-etherneon data-[state=active]:border-b-2 data-[state=active]:border-etherneon"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>ONGs</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-etherneon/50 to-etherneon/10 rounded-xl blur-xl opacity-30"></div>
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-etherblue-dark">
              <TabsContent value="gobiernos" className="p-0 m-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 p-8 md:p-10">
                    <h3 className="text-2xl font-bold mb-6">Gobiernos & Políticas Públicas</h3>
                    <p className="text-ethergray-light mb-8">
                      Predice tendencias económicas y disturbios sociales para políticas proactivas. 
                      Predijo un aumento del 20% en migración, permitiendo a un país preparar refugios con 3 meses de ventaja.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Anticipación de crisis económicas y sociales</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Planificación urbana basada en predicciones climáticas</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Optimización de recursos y presupuestos públicos</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Prevención de conflictos y gestión de seguridad</p>
                      </div>

                      <div className="mt-6">
                        <Button className="bg-etherneon hover:bg-etherneon/80 text-etherblue-dark">
                          Anticipa Crisis Gubernamentales
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 bg-[url('https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
                    <div className="w-full h-full bg-gradient-to-r from-etherblue-dark to-transparent p-8 md:p-10 flex flex-col justify-end">
                      <div className="bg-etherblue/80 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <h4 className="text-lg font-semibold mb-2">Caso de Éxito</h4>
                        <p className="text-sm text-ethergray-light">
                          El Ministerio de Economía de Colombia utilizó Praevisio AI para anticipar una recesión regional, implementando políticas preventivas que redujeron un 30% el impacto económico y protegieron miles de empleos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="empresas" className="p-0 m-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 p-8 md:p-10">
                    <h3 className="text-2xl font-bold mb-6">Empresas & Organizaciones</h3>
                    <p className="text-ethergray-light mb-8">
                      Anticipa fluctuaciones del mercado y optimiza tu cadena de suministro. 
                      Anticipó una caída del 15% en ventas, ajustando producción y ahorrando $5 millones.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Predicción de tendencias de mercado y comportamiento del consumidor</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Optimización de cadenas de suministro y logística</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Gestión de riesgos financieros y operacionales</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Planificación estratégica basada en macrotrends</p>
                      </div>

                      <div className="mt-6">
                        <Button className="bg-etherneon hover:bg-etherneon/80 text-etherblue-dark">
                          Optimiza tu Negocio Hoy
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
                    <div className="w-full h-full bg-gradient-to-r from-etherblue-dark to-transparent p-8 md:p-10 flex flex-col justify-end">
                      <div className="bg-etherblue/80 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <h4 className="text-lg font-semibold mb-2">Caso de Éxito</h4>
                        <p className="text-sm text-ethergray-light">
                          Una cadena internacional de suministros utilizó nuestros modelos predictivos para anticipar disrupciones logísticas, reajustando sus rutas y proveedores 4 meses antes de una crisis global, manteniendo una operación sin interrupciones.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ongs" className="p-0 m-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 p-8 md:p-10">
                    <h3 className="text-2xl font-bold mb-6">ONGs & Organizaciones Internacionales</h3>
                    <p className="text-ethergray-light mb-8">
                      Detecta áreas vulnerables a desastres y coordina ayuda eficiente. 
                      Detectó un riesgo de sequía, movilizando agua y alimentos a 10,000 personas.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Anticipación de crisis humanitarias y desastres naturales</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Planificación de distribución de recursos de ayuda</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Identificación de poblaciones vulnerables y necesidades críticas</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-etherneon/20 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-etherneon" />
                        </div>
                        <p className="text-sm text-ethergray-light">Monitoreo y evaluación de programas de impacto social</p>
                      </div>

                      <div className="mt-6">
                        <Button className="bg-etherneon hover:bg-etherneon/80 text-etherblue-dark">
                          Prevé Crisis Humanitarias
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
                    <div className="w-full h-full bg-gradient-to-r from-etherblue-dark to-transparent p-8 md:p-10 flex flex-col justify-end">
                      <div className="bg-etherblue/80 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                        <h4 className="text-lg font-semibold mb-2">Caso de Éxito</h4>
                        <p className="text-sm text-ethergray-light">
                          Una organización internacional de ayuda humanitaria utilizó Praevisio AI para anticipar brotes de enfermedades tras inundaciones en el sudeste asiático, permitiendo la movilización preventiva de equipos médicos que evitaron una epidemia.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default SolutionsSection;
