import React, { useEffect, useState } from 'react';

interface CIMetrics {
  buildTime: number; // en minutos
  testCoverage: number; // porcentaje
  failedBuilds: number;
  lastBuildStatus: string;
}

const CIMetricsWidget: React.FC = () => {
  const metrics = useState<CIMetrics>({
    buildTime: 12.5,
    testCoverage: 85.3,
    failedBuilds: 2,
    lastBuildStatus: 'SUCCESS'
  })[0];

  const [oracleLog, setOracleLog] = useState<string>('');

  useEffect(() => {
    // Simular predicción del Oracle anticipando un fallo potencial
    const simulateOraclePrediction = () => {
      const prediction = {
        probability: 0.75,
        suggestion: 'Posible fallo en pipeline de datos debido a alta carga del sistema. Recomendación: Escalar recursos o optimizar consultas.'
      };
      const log = `[Oracle Prediction] Probabilidad de fallo: ${(prediction.probability * 100).toFixed(1)}%. Sugerencia: ${prediction.suggestion}`;
      console.log(log);
      setOracleLog(log);
    };

    // Simular llamada al Oracle después de 2 segundos
    const timer = setTimeout(simulateOraclePrediction, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Métricas de CI/CD</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div data-testid="ci-metric-buildtime" className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Tiempo de Build Promedio</div>
          <div className="text-xl font-bold">{metrics.buildTime} min</div>
        </div>
        <div data-testid="ci-metric-coverage" className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Cobertura de Tests</div>
          <div className="text-xl font-bold">{metrics.testCoverage}%</div>
        </div>
        <div data-testid="ci-metric-failed" className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Builds Fallidos (última semana)</div>
          <div className="text-xl font-bold">{metrics.failedBuilds}</div>
        </div>
        <div data-testid="ci-metric-lastbuild" className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Último Build</div>
          <div className={`text-xl font-bold ${metrics.lastBuildStatus === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.lastBuildStatus}
          </div>
        </div>
      </div>
      {oracleLog && (
        <div className="bg-yellow-900/50 border border-yellow-600 rounded p-4">
          <h4 className="text-sm font-bold text-yellow-400 mb-2">Log del Oracle</h4>
          <p data-testid="oracle-log" className="text-xs text-yellow-200">{oracleLog}</p>
        </div>
      )}
    </div>
  );
};

export default CIMetricsWidget;