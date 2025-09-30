import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';
import { toast } from "sonner";

const EnhancedContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    sector: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("¡Solicitud enviada! Te contactaremos en 24 horas");
    }, 2000);
  };

  const isFormValid = formData.name && formData.email && formData.organization && formData.sector;

  const sectors = [
    { value: "gobierno", label: "Gobierno/Sector Público" },
    { value: "salud", label: "Salud y Servicios Médicos" },
    { value: "finanzas", label: "Servicios Financieros" },
    { value: "energia", label: "Energía y Recursos" },
    { value: "agricultura", label: "Agricultura y Alimentos" },
    { value: "ong", label: "ONG/Organización Internacional" },
    { value: "educacion", label: "Educación e Investigación" },
    { value: "otro", label: "Otro sector" }
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 md:py-28 bg-etherblue-dark relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-etherblue-medium/50 backdrop-blur-sm border-etherneon/20">
              <CardContent className="p-12">
                <div className="h-20 w-20 rounded-full bg-etherneon/20 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-etherneon" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">¡Solicitud Recibida!</h2>
                <p className="text-ethergray-light mb-6">
                  Gracias por tu interés en Praevisio AI. Nuestro equipo de especialistas revisará tu solicitud y te contactará en las próximas 24 horas para programar tu demo personalizada.
                </p>
                <div className="bg-etherblue-dark/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-etherneon mb-2">Próximos pasos:</h3>
                  <ul className="text-sm text-ethergray-light space-y-1 text-left">
                    <li>• Análisis de tus necesidades específicas</li>
                    <li>• Preparación de demo personalizada para tu sector</li>
                    <li>• Contacto telefónico para agendar sesión</li>
                    <li>• Demo interactiva de 45 minutos</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-etherneon/30 text-etherneon hover:bg-etherneon/10"
                >
                  Enviar otra solicitud
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            No Esperes a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Próxima Crisis</span>
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Únete a los líderes que ya están transformando el futuro con Praevisio AI. Solicita tu demo personalizada hoy y descubre cómo anticipar y actuar a tiempo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-etherblue-medium/50 backdrop-blur-sm border-etherneon/20">
              <CardHeader>
                <CardTitle className="text-etherneon">Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-etherneon/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-etherneon" />
                  </div>
                  <div>
                    <p className="text-sm text-ethergray-light">Email</p>
                    <p className="font-medium text-white">contacto@praevisio.ai</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-etherneon/20 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-etherneon" />
                  </div>
                  <div>
                    <p className="text-sm text-ethergray-light">Teléfono</p>
                    <p className="font-medium text-white">+57 1 234 5678</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-etherneon/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-etherneon" />
                  </div>
                  <div>
                    <p className="text-sm text-ethergray-light">Oficina</p>
                    <p className="font-medium text-white">Bogotá, Colombia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-etherblue-medium/50 backdrop-blur-sm border-etherneon/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-etherneon mb-3">Demo Personalizada</h3>
                <ul className="text-sm text-ethergray-light space-y-2">
                  <li>✓ Análisis específico para tu sector</li>
                  <li>✓ Casos de uso relevantes</li>
                  <li>✓ ROI estimado</li>
                  <li>✓ Plan de implementación</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-etherblue-medium/50 backdrop-blur-sm border-etherneon/20">
              <CardHeader>
                <CardTitle className="text-etherneon">Inicia tu Programa Piloto Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-ethergray-light mb-2 block">
                        Nombre completo *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Tu nombre"
                        className="bg-etherblue-dark border-etherneon/30 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-ethergray-light mb-2 block">
                        Correo electrónico *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@organizacion.com"
                        className="bg-etherblue-dark border-etherneon/30 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-ethergray-light mb-2 block">
                        Organización *
                      </label>
                      <Input
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        placeholder="Nombre de tu organización"
                        className="bg-etherblue-dark border-etherneon/30 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-ethergray-light mb-2 block">
                        Sector *
                      </label>
                      <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                        <SelectTrigger className="bg-etherblue-dark border-etherneon/30 text-white">
                          <SelectValue placeholder="Selecciona tu sector" />
                        </SelectTrigger>
                        <SelectContent className="bg-etherblue-dark border-etherneon/30">
                          {sectors.map((sector) => (
                            <SelectItem key={sector.value} value={sector.value}>
                              {sector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-ethergray-light mb-2 block">
                      ¿En qué estás interesado específicamente?
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Cuéntanos sobre tus necesidades y desafíos..."
                      className="bg-etherblue-dark border-etherneon/30 text-white min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full bg-gradient-to-r from-etherneon to-etherneon/80 hover:from-etherneon/90 hover:to-etherneon/70 text-etherblue-dark font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 rounded-full border-2 border-etherblue-dark border-t-transparent animate-spin mr-2"></div>
                        Enviando solicitud...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Solicitar Demo Personalizada
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-ethergray-light text-center">
                    Al enviar este formulario, aceptas que Praevisio AI se ponga en contacto contigo para programar tu demo personalizada.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContactSection;