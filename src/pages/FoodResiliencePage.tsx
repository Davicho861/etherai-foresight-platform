import React, { useEffect, useState } from 'react';

interface PriceData {
  product: string;
  currentPrice: number;
  predictedPrice: number;
  volatilityIndex: number;
  confidence: number;
}

interface SupplyChainData {
  region: string;
  capacity: number;
  distance: number;
  cost: number;
  efficiency: number;
}

const FoodResiliencePage: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [supplyChain, setSupplyChain] = useState<SupplyChainData[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('rice');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = (globalThis?.VITE_PRAEVISIO_TOKEN || process.env.VITE_PRAEVISIO_TOKEN || 'demo-token');

      const [pricesRes, supplyRes] = await Promise.all([
        fetch('/api/food-resilience/prices', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/food-resilience/supply-chain', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!pricesRes.ok || !supplyRes.ok) throw new Error('fetch_error');

      const pricesData = await pricesRes.json();
      const supplyData = await supplyRes.json();

      setPrices(pricesData.prices);
      setSupplyChain(supplyData.routes);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'error');
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    try {
      const token = (globalThis?.VITE_PRAEVISIO_TOKEN || process.env.VITE_PRAEVISIO_TOKEN || 'demo-token');
      const res = await fetch('/api/food-resilience/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product: selectedProduct, timeframe: '30_days' })
      });

      if (!res.ok) throw new Error('prediction_error');
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'prediction_error');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-etherblue-dark text-white" data-testid="food-resilience-page">
      <h2 className="text-3xl font-bold mb-6">Plataforma de Resiliencia Alimentaria - Perú</h2>

      {loading && <div className="p-8">Cargando datos de resiliencia alimentaria...</div>}
      {error && <div className="p-8">Error: {error}</div>}

      {!loading && !error && (
        <React.Fragment>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Precios de Alimentos */}
        <div className="p-6 bg-etherblue rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Precios de Alimentos</h3>
          <div className="space-y-3">
            {prices.map((item) => (
              <div key={item.product} className="flex justify-between items-center p-3 bg-etherblue-dark rounded">
                <span className="capitalize font-medium">{item.product}</span>
                <div className="text-right">
                  <div className="text-sm">Actual: S/ {item.currentPrice.toFixed(2)}</div>
                  <div className="text-sm text-yellow-400">Predicho: S/ {item.predictedPrice.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Volatilidad: {(item.volatilityIndex * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadena de Suministro */}
        <div className="p-6 bg-etherblue rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Optimización de Cadena de Suministro</h3>
          <div className="space-y-3">
            {supplyChain.slice(0, 4).map((route, index) => (
              <div key={route.region} className={`p-3 rounded ${index < 2 ? 'bg-green-800' : 'bg-etherblue-dark'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{route.region}</span>
                  <span className="text-sm">Eficiencia: {(route.efficiency * 100).toFixed(0)}%</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Capacidad: {route.capacity}% | Costo: S/ {route.cost.toFixed(1)} | Distancia: {route.distance}km
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-etherblue rounded-lg mb-8">
        {/* Predicción Interactiva */}
        <h3 className="text-xl font-semibold mb-4">Predicción de Precios</h3>
        <div className="flex gap-4 items-center mb-4">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-2 bg-etherblue-dark rounded text-white"
          >
            {prices.map((p) => (
              <option key={p.product} value={p.product}>{p.product}</option>
            ))}
          </select>
          <button
            onClick={handlePredict}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
          >
            Generar Predicción
          </button>
        </div>

        {prediction && (
          <div className="p-4 bg-etherblue-dark rounded">
            <h4 className="font-semibold mb-2">Predicción para {prediction.product}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Precio Actual</span>
                <div className="text-lg font-bold">S/ {prediction.currentPrice.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Precio Predicho (30 días)</span>
                <div className="text-lg font-bold text-yellow-400">S/ {prediction.predictedPrice.toFixed(2)}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-400">
              Confianza: {(prediction.confidence * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-red-900 rounded-lg">
        {/* Recomendaciones */}
        <h3 className="text-xl font-semibold mb-4">Recomendaciones de Mitigación</h3>
        <ul className="space-y-2 text-sm">
          <li>• Implementar stocks de reserva para arroz y papas</li>
          <li>• Optimizar rutas de distribución desde Lima y Trujillo</li>
          <li>• Monitorear factores climáticos y de importación</li>
          <li>• Establecer alianzas con productores locales</li>
        </ul>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default FoodResiliencePage;