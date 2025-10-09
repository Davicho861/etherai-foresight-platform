import React, { useEffect, useState } from 'react';

interface RouteRisk {
  logisticRiskIndex: number;
  factors: {
    seismic: number;
    social: number;
    climate: number;
    economic: number;
  };
  recommendations: string[];
  timestamp: string;
}

// RouteData interface removed — not used currently

const CoffeeResiliencePage: React.FC = () => {
  const [routeRisks, setRouteRisks] = useState<Record<string, RouteRisk>>({});
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCoffeeData();
  }, []);

  const loadCoffeeData = async () => {
    try {
      const token = (globalThis?.VITE_PRAEVISIO_TOKEN || process.env.VITE_PRAEVISIO_TOKEN || 'demo-token');

      const res = await fetch('/api/coffee-resilience/risks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('fetch_error');

      const data = await res.json();
      setRouteRisks(data.routeRisks);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'error');
      setLoading(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 70) return 'bg-red-600';
    if (risk > 50) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const getRiskLevel = (risk: number) => {
    if (risk > 70) return 'Alto';
    if (risk > 50) return 'Medio';
    return 'Bajo';
  };

  if (loading) return <div className="p-8">Cargando datos de resiliencia de cadena de suministro de café...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  const routes = Object.entries(routeRisks);

  return (
    <div className="min-h-screen p-8 bg-etherblue-dark text-white" data-testid="coffee-resilience-page">
      <h2 className="text-3xl font-bold mb-6">Plataforma de Resiliencia de la Cadena de Suministro de Café - Colombia</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Mapa de Colombia */}
        <div className="p-6 bg-etherblue rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Mapa de Rutas Logísticas</h3>
          <div className="bg-etherblue-dark rounded p-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🇨🇴</div>
              <div className="text-sm text-gray-400">Eje Cafetero - Puertos</div>
              <div className="text-xs text-gray-500 mt-2">
                Manizales • Pereira • Armenia<br/>
                → Buenaventura • Cartagena
              </div>
            </div>
          </div>
        </div>

        {/* Índices de Riesgo por Ruta */}
        <div className="p-6 bg-etherblue rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Índices de Riesgo Logístico</h3>
          <div className="space-y-3">
            {routes.map(([route, riskData]) => (
              <div
                key={route}
                className={`p-3 rounded cursor-pointer transition-colors ${getRiskColor((riskData as RouteRisk).logisticRiskIndex)} ${
                  selectedRoute === route ? 'ring-2 ring-white' : ''
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{route}</span>
                  <div className="text-right">
                    <div className="text-lg font-bold">{(riskData as RouteRisk).logisticRiskIndex}%</div>
                    <div className="text-xs">{getRiskLevel((riskData as RouteRisk).logisticRiskIndex)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detalles de Ruta Seleccionada */}
      {selectedRoute && routeRisks[selectedRoute] && (
        <div className="p-6 bg-etherblue rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Análisis Detallado: {selectedRoute}</h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-etherblue-dark rounded text-center">
              <div className="text-2xl font-bold text-red-400">{routeRisks[selectedRoute].factors.seismic}%</div>
              <div className="text-sm text-gray-400">Riesgo Sísmico</div>
            </div>
            <div className="p-4 bg-etherblue-dark rounded text-center">
              <div className="text-2xl font-bold text-orange-400">{routeRisks[selectedRoute].factors.social}%</div>
              <div className="text-sm text-gray-400">Riesgo Social</div>
            </div>
            <div className="p-4 bg-etherblue-dark rounded text-center">
              <div className="text-2xl font-bold text-blue-400">{routeRisks[selectedRoute].factors.climate}%</div>
              <div className="text-sm text-gray-400">Riesgo Climático</div>
            </div>
            <div className="p-4 bg-etherblue-dark rounded text-center">
              <div className="text-2xl font-bold text-green-400">{routeRisks[selectedRoute].factors.economic}%</div>
              <div className="text-sm text-gray-400">Riesgo Económico</div>
            </div>
          </div>

          <div className="p-4 bg-etherblue-dark rounded">
            <h4 className="font-semibold mb-2">Recomendaciones de IA</h4>
            <ul className="space-y-1 text-sm">
              {routeRisks[selectedRoute].recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modelo de Riesgo Explicable */}
      <div className="p-6 bg-etherblue rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Modelo de Riesgo - IA Explicable</h3>
        <div className="text-sm space-y-2">
          <p><strong>Fórmula del Índice de Riesgo Logístico:</strong></p>
          <code className="block p-2 bg-etherblue-dark rounded text-xs">
            IRL = (RiesgoSísmico × 0.25) + (RiesgoSocial × 0.35) + (RiesgoClimático × 0.25) + (RiesgoEconómico × 0.15)
          </code>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">Factores de Riesgo:</h4>
              <ul className="space-y-1 text-xs">
                <li><strong>Sísmico:</strong> Basado en ubicación geográfica (Andes = alto riesgo)</li>
                <li><strong>Social:</strong> Derivado de resiliencia comunitaria (inverso)</li>
                <li><strong>Climático:</strong> Precipitación y deslizamientos (Open Meteo)</li>
                <li><strong>Económico:</strong> Inflación y costos de transporte (World Bank)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Umbrales de Riesgo:</h4>
              <ul className="space-y-1 text-xs">
                <li><span className="inline-block w-3 h-3 bg-green-600 rounded mr-2"></span>0-50%: Ruta Estable</li>
                <li><span className="inline-block w-3 h-3 bg-yellow-600 rounded mr-2"></span>51-70%: Monitoreo Requerido</li>
                <li><span className="inline-block w-3 h-3 bg-red-600 rounded mr-2"></span>71-100%: Alto Riesgo - Contingencia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones Generales */}
      <div className="p-6 bg-red-900 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Recomendaciones Estratégicas para PYMEs Cafeteras</h3>
        <ul className="space-y-2 text-sm">
          <li>• Diversificar rutas de exportación para reducir dependencia de puertos únicos</li>
          <li>• Implementar seguros de cadena de suministro para rutas de alto riesgo</li>
          <li>• Monitorear indicadores climáticos y sociales en tiempo real</li>
          <li>• Establecer alianzas con transportistas locales para rutas alternativas</li>
          <li>• Desarrollar capacidad de almacenamiento temporal en zonas de riesgo</li>
        </ul>
      </div>
    </div>
  );
};

export default CoffeeResiliencePage;