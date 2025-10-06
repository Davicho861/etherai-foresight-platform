import React from 'react';

const ProphecyWidget: React.FC = () => {
  return (
    <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Primera Profecía Global: Riesgo de Inestabilidad Social en LATAM</h2>
      <p className="text-gray-300 mb-4">
        Análisis predictivo de riesgo de inestabilidad social en Colombia, Perú y Argentina para los próximos 6 meses.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-600/20 border border-red-500 rounded p-4">
          <h3 className="font-bold">Colombia</h3>
          <p>Riesgo: 68%</p>
        </div>
        <div className="bg-orange-600/20 border border-orange-500 rounded p-4">
          <h3 className="font-bold">Perú</h3>
          <p>Riesgo: 75%</p>
        </div>
        <div className="bg-red-800/20 border border-red-700 rounded p-4">
          <h3 className="font-bold">Argentina</h3>
          <p>Riesgo: 82%</p>
        </div>
      </div>
      <a href="/INTELLIGENCE_REPORT_001.md" className="text-blue-400 underline mt-4 block">Ver Informe Completo</a>
    </div>
  );
};

export default ProphecyWidget;