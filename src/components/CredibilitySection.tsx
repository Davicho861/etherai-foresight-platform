
import React from 'react';
import { PlayCircle, Check, TrendingUp } from 'lucide-react';

const CredibilitySection: React.FC = () => {
  return (
    <section id="credibility" className="py-20 md:py-28 bg-etherblue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Confiado por <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Líderes Globales</span>
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Más de 50 organizaciones ya confían en EtherAI Labs para anticipar eventos críticos y tomar decisiones informadas.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Partner logos with subtle opacity and hover effect */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="h-16 bg-white/5 rounded-lg flex items-center justify-center p-4 hover:bg-white/10 transition-colors"
            >
              <div className="h-8 w-full bg-ethergray-light/30 rounded-md"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-etherblue-dark rounded-xl border border-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-etherneon/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-ethergray-light/20 mr-4 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Ministro de Salud</h4>
                  <p className="text-sm text-ethergray-light">Colombia</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-etherneon/10 text-xs text-etherneon">
                    Impacto: 15,000+ vidas
                  </span>
                </div>
              </div>
              
              <blockquote className="text-lg mb-6 italic text-ethergray-light">
                "EtherAI Labs nos ayudó a prever un brote de dengue en 2023, permitiéndonos implementar medidas preventivas que salvaron miles de vidas y optimizaron nuestros recursos sanitarios."
              </blockquote>
              
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center bg-etherblue rounded-full px-3 py-1">
                  <Check className="h-3 w-3 text-etherneon mr-1" />
                  <span className="text-xs">Anticipación: 5 meses</span>
                </div>
                <div className="inline-flex items-center bg-etherblue rounded-full px-3 py-1">
                  <TrendingUp className="h-3 w-3 text-etherneon mr-1" />
                  <span className="text-xs">Precisión: 94%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-etherblue-dark rounded-xl border border-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-etherneon/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-ethergray-light/20 mr-4 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Director de Planificación</h4>
                  <p className="text-sm text-ethergray-light">Organización Internacional</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-etherneon/10 text-xs text-etherneon">
                    Impacto: $7.2M ahorrados
                  </span>
                </div>
              </div>
              
              <blockquote className="text-lg mb-6 italic text-ethergray-light">
                "La capacidad predictiva de EtherAI Labs transformó nuestra planificación estratégica. Anticipamos una crisis migratoria con 5 meses de antelación, permitiéndonos preparar adecuadamente recursos y coordinar esfuerzos internacionales."
              </blockquote>
              
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center bg-etherblue rounded-full px-3 py-1">
                  <Check className="h-3 w-3 text-etherneon mr-1" />
                  <span className="text-xs">Anticipación: 5 meses</span>
                </div>
                <div className="inline-flex items-center bg-etherblue rounded-full px-3 py-1">
                  <TrendingUp className="h-3 w-3 text-etherneon mr-1" />
                  <span className="text-xs">Precisión: 89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-etherblue-dark/50 rounded-xl p-6 mb-12">
          <div className="text-center mb-6">
            <span className="px-3 py-1 text-xs font-semibold bg-etherneon/20 text-etherneon rounded-full">Destacado en Forbes 2024: Innovación en IA</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-etherblue-dark rounded-lg p-6 text-center group hover:bg-etherblue transition-colors duration-300">
            <div className="text-4xl font-bold text-etherneon mb-2 group-hover:scale-110 transition-transform duration-300">90%</div>
            <p className="text-ethergray-light">Precisión promedio en predicciones</p>
          </div>
          
          <div className="bg-etherblue-dark rounded-lg p-6 text-center group hover:bg-etherblue transition-colors duration-300">
            <div className="text-4xl font-bold text-etherneon mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
            <p className="text-ethergray-light">Organizaciones confían en nosotros</p>
          </div>
          
          <div className="bg-etherblue-dark rounded-lg p-6 text-center group hover:bg-etherblue transition-colors duration-300">
            <div className="text-4xl font-bold text-etherneon mb-2 group-hover:scale-110 transition-transform duration-300">15M+</div>
            <p className="text-ethergray-light">Vidas impactadas positivamente</p>
          </div>

          <div className="bg-etherblue-dark rounded-lg p-6 text-center group hover:bg-etherblue transition-colors duration-300">
            <div className="text-4xl font-bold text-etherneon mb-2 group-hover:scale-110 transition-transform duration-300">30%</div>
            <p className="text-ethergray-light">Reducción en tiempo de respuesta</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredibilitySection;
