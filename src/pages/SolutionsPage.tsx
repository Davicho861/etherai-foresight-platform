import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const SolutionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-etherblue-dark text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8 space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4">Soluciones Praevisio AI</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Soluciones a medida para Gobiernos, Empresas y Organizaciones de la sociedad civil. Nuestra plataforma anticipa riesgos y propone acciones concretas.</p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <article className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2">Gobiernos</h2>
            <p className="text-gray-300 mb-4">Monitoreo estratégico a escala nacional. Marcos de respuesta anticipada y dashboards operativos para ministerios y agencias.</p>
            <ul className="text-sm list-disc list-inside text-gray-300 mb-4">
              <li>Alertas tempranas integradas</li>
              <li>Mapa de riesgos regional</li>
              <li>Planes de contingencia sugeridos</li>
            </ul>
            <div className="flex gap-2">
              <Button onClick={() => { window.location.hash = '/pricing'; }} className="bg-etherneon text-etherblue-dark">Ver Planes</Button>
              <Button variant="outline" onClick={() => { window.location.hash = '/demo?plan=gov'; }}>Ver Demo</Button>
            </div>
          </article>

          <article className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2">Empresas</h2>
            <p className="text-gray-300 mb-4">Inteligencia para operaciones y continuidad del negocio. Identifica vulnerabilidades y optimiza la resiliencia de la cadena de suministro.</p>
            <ul className="text-sm list-disc list-inside text-gray-300 mb-4">
              <li>Monitoreo de proveedores críticos</li>
              <li>Simulador de escenarios de impacto</li>
              <li>Integración con ERP y BI</li>
            </ul>
            <div className="flex gap-2">
              <Button onClick={() => { window.location.hash = '/pricing'; }} className="bg-etherneon text-etherblue-dark">Ver Planes</Button>
              <Button variant="outline" onClick={() => { window.location.hash = '/demo?plan=enterprise'; }}>Ver Demo</Button>
            </div>
          </article>

          <article className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2">ONGs y Sociedad Civil</h2>
            <p className="text-gray-300 mb-4">Herramientas accesibles para organizaciones de impacto social. Priorización de intervenciones y soporte para toma de decisiones basada en evidencia.</p>
            <ul className="text-sm list-disc list-inside text-gray-300 mb-4">
              <li>Dashboards simplificados</li>
              <li>Modelos transferibles y auditables</li>
              <li>Soporte para proyectos piloto</li>
            </ul>
            <div className="flex gap-2">
              <Button onClick={() => { window.location.hash = '/pricing'; }} className="bg-etherneon text-etherblue-dark">Ver Planes</Button>
              <Button variant="outline" onClick={() => { window.location.hash = '/demo?plan=ngo'; }}>Ver Demo</Button>
            </div>
          </article>
        </section>

        <section className="mt-8 p-6 bg-etherblue-light rounded border border-etherneon">
          <h3 className="text-2xl font-semibold mb-2">Casos de Éxito</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div className="p-4 bg-gray-800/40 rounded">Colombia: Reducción temprana de impacto en la cadena alimentaria mediante alertas sectoriales.</div>
            <div className="p-4 bg-gray-800/40 rounded">Perú: Optimización de respuesta ante inestabilidades financieras regionales.</div>
          </div>
        </section>

        <section className="text-center mt-12">
          <p className="text-gray-300 mb-4">¿Listo para experimentar Praevisio AI en acción?</p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => { window.location.hash = '/demo'; }} className="bg-etherneon text-etherblue-dark">Ir al Demo</Button>
            <Button onClick={() => { window.location.hash = '/pricing'; }} variant="outline">Explorar Precios</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SolutionsPage;
