
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              No Esperes a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Próxima Crisis</span>
            </h2>
            <p className="text-lg text-ethergray-light max-w-2xl mx-auto">
              Únete a los líderes que ya están transformando el futuro con Praevisio AI. 
              Solicita tu demo personalizada hoy y descubre cómo anticipar y actuar a tiempo.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-etherneon/40 to-etherneon/10 rounded-xl blur-xl opacity-50"></div>
            
            <div className="relative bg-etherblue rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Inicia tu Programa Piloto Hoy</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </label>
                    <Input 
                      id="name" 
                      placeholder="Tu nombre" 
                      className="bg-etherblue-dark border-ethergray-light/20 focus:border-etherneon" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="tu@organizacion.com" 
                      className="bg-etherblue-dark border-ethergray-light/20 focus:border-etherneon" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-sm font-medium">
                      Organización
                    </label>
                    <Input
                      id="organization"
                      placeholder="Nombre de tu organización"
                      className="bg-etherblue-dark border-ethergray-light/20 focus:border-etherneon"
                      aria-describedby="organization-help"
                    />
                    <p id="organization-help" className="text-xs text-ethergray-light/70">Opcional: para contextualizar mejor tu solicitud</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      className="bg-etherblue-dark border-ethergray-light/20 focus:border-etherneon"
                      aria-describedby="phone-help"
                    />
                    <p id="phone-help" className="text-xs text-ethergray-light/70">Para coordinar la demo personalizada</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="sector" className="text-sm font-medium">
                    Sector
                  </label>
                  <Select>
                    <SelectTrigger className="bg-etherblue-dark border-ethergray-light/20 focus:border-etherneon" aria-label="Selecciona tu sector">
                      <SelectValue placeholder="Selecciona tu sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-etherblue border border-white/10">
                      <SelectItem value="gobierno">Gobierno / Sector Público</SelectItem>
                      <SelectItem value="empresa">Empresa / Sector Privado</SelectItem>
                      <SelectItem value="ong">ONG / Organización Internacional</SelectItem>
                      <SelectItem value="academia">Academia / Investigación</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    ¿En qué estás interesado específicamente?
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Cuéntanos sobre tus necesidades y desafíos..." 
                    className="bg-etherblue-dark border-ethergray-light/20 focus:border-etherneon min-h-[120px]" 
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto bg-etherneon hover:bg-etherneon/80 text-etherblue-dark transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-etherneon/25 group"
                    aria-label="Enviar solicitud de demo personalizada"
                  >
                    Solicitar Demo Personalizada
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
