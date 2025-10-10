import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from '@/components/Sidebar';
import MissionGallery from '@/components/MissionGallery';
import AnimatedMetric from '@/components/AnimatedMetrics';
import CommunityResilienceWidget from '@/components/CommunityResilienceWidget';
import SeismicMapWidget from '@/components/SeismicMapWidget';
import FoodSecurityDashboard from '@/components/FoodSecurityDashboard';
import EthicalVectorDisplay from '@/components/EthicalVectorDisplay';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Country {
  name: string;
  code: string;
  risk: string;
  prediction: number;
}

interface ChartData {
  month: string;
  accuracy: number;
  predictions: number;
}

interface DemoData {
  kpis: {
    precisionPromedio: number;
    prediccionesDiarias: number;
    monitoreoContinuo: number;
    coberturaRegional: number;
  };
  countries: Country[];
  chartData: ChartData[];
  lastUpdated: string;
}

const DemoPage: React.FC = () => {
  const [demoData, setDemoData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const response = await fetch('/api/demo/full-state');
        if (!response.ok) {
          throw new Error('Failed to fetch demo data');
        }
        const data: DemoData = await response.json();
        setDemoData(data);
        setSelectedCountry(data.countries[0] || null);
      } catch (err) {
        console.error('Error fetching demo data:', err);
        setError('Error al cargar datos de la demo');
      } finally {
        setLoading(false);
      }
    };

    fetchDemoData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 items-center justify-center">
        <div className="text-white text-xl">Cargando datos de la demo...</div>
      </div>
    );
  }

  if (error || !demoData) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 items-center justify-center">
        <div className="text-white text-xl">{error || 'Error al cargar datos'}</div>
      </div>
    );
  }

  const getCountryColor = (countryCode: string) => {
    const country = demoData?.countries.find(c => c.code === countryCode);
    if (!country) return '#DDD';
    if (country.risk === 'Bajo') return '#10B981';
    if (country.risk === 'Medio') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Praevisio AI - Centro de Mando
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Inteligencia Predictiva de Élite para América Latina - 90% de Precisión
            </motion.p>
          </div>

          {/* Metrics Dashboard */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={demoData.kpis.precisionPromedio} suffix="%" />
                  <p className="text-gray-400 mt-2">Precisión Promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={demoData.kpis.prediccionesDiarias} suffix="K" />
                  <p className="text-gray-400 mt-2">Predicciones Diarias</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={demoData.kpis.monitoreoContinuo} suffix="/7" />
                  <p className="text-gray-400 mt-2">Monitoreo Continuo</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={demoData.kpis.coberturaRegional} suffix=" Países" />
                  <p className="text-gray-400 mt-2">Cobertura Regional</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Country Selector and Map */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Selección de País</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value) => {
                  const country = demoData.countries.find(c => c.name === value);
                  if (country) setSelectedCountry(country);
                }}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {demoData.countries.map((country) => (
                      <SelectItem key={country.code} value={country.name} className="text-white">
                        {country.name} - Riesgo: {country.risk} ({country.prediction}% precisión)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCountry && (
                  <div className="mt-6 space-y-4" data-testid={`country-card-${selectedCountry.code}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">País Seleccionado:</span>
                      <span className="text-white font-semibold">{selectedCountry.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Nivel de Riesgo:</span>
                      <span className={`font-semibold ${
                        selectedCountry.risk === 'Bajo' ? 'text-green-400' :
                        selectedCountry.risk === 'Medio' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {selectedCountry.risk}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Precisión de Predicción:</span>
                      <span className="text-blue-400 font-semibold">{selectedCountry.prediction}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Mapa Interactivo - América Latina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64" data-testid="global-map">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 300,
                      center: [-60, -15]
                    }}
                    className="w-full h-full"
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const country = demoData.countries.find(c => c.code === geo.properties.ISO_A3);
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={country ? getCountryColor(country.code) : '#374151'}
                              stroke="#FFFFFF"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: 'none' },
                                hover: { outline: 'none', fill: '#60A5FA' },
                                pressed: { outline: 'none' },
                              }}
                              data-testid={`country-${country?.code}`}
                              onMouseEnter={() => {
                                const country = demoData.countries.find(c => c.code === geo.properties.ISO_A3);
                                if (country) setHoveredCountry(country.name);
                              }}
                              onMouseLeave={() => setHoveredCountry(null)}
                              onClick={() => {
                                const country = demoData.countries.find(c => c.code === geo.properties.ISO_A3);
                                if (country) {
                                  setSelectedCountry(country);
                                  setShowBriefing(true);
                                }
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ComposableMap>
                </div>
                {hoveredCountry && (
                  <p className="text-center text-gray-300 mt-2">
                    País: {hoveredCountry}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Briefing Panel */}
          {showBriefing && selectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Panel de Briefing - {selectedCountry.name}</CardTitle>
                </CardHeader>
                <CardContent data-testid="briefing-panel">
                  <p className="text-gray-300">Riesgo: {selectedCountry.risk} - Precisión: {selectedCountry.prediction}%</p>
                  <p className="text-gray-300">Información adicional del briefing...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Charts */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Evolución de Precisión</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={demoData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#60A5FA"
                      strokeWidth={3}
                      dot={{ fill: '#60A5FA', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Volumen de Predicciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demoData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="predictions" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Galería de Misiones - Task Replay</CardTitle>
                <p className="text-gray-400">Haz clic en una misión para ver el análisis predictivo en tiempo real</p>
              </CardHeader>
              <CardContent>
                <MissionGallery />
              </CardContent>
            </Card>
          </motion.div>

          {/* Sinfonía de Manifestación - Capacidades Completas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Sinfonía de Manifestación Total</h2>
              <p className="text-gray-300">Todas las capacidades de Praevisio AI en una experiencia unificada</p>
            </div>

            {/* Resiliencia Comunitaria */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🏛️ Resiliencia Comunitaria LATAM</h3>
              <CommunityResilienceWidget />
            </div>

            {/* Monitoreo Sísmico */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🌋 Monitoreo Sísmico en Tiempo Real</h3>
              <SeismicMapWidget />
            </div>

            {/* Seguridad Alimentaria */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🌾 Seguridad Alimentaria Global</h3>
              <FoodSecurityDashboard />
            </div>

            {/* IA Ética */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">⚖️ Vector Ético - IA Explicable</h3>
              <EthicalVectorDisplay />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;