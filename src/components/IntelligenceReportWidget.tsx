import React, { useEffect, useState } from 'react';

const IntelligenceReportWidget: React.FC = () => {
  const [report, setReport] = useState<string>('');

  useEffect(() => {
    fetch('/INTELLIGENCE_REPORT_001.md')
      .then(res => res.text())
      .then(text => setReport(text))
      .catch(err => console.error('Error loading report:', err));
  }, []);

  if (!report) return <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">Cargando informe de inteligencia...</div>;

  return (
    <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Informe de Inteligencia Predictiva - LATAM</h3>
      <div className="text-sm whitespace-pre-wrap">{report}</div>
    </div>
  );
};

export default IntelligenceReportWidget;