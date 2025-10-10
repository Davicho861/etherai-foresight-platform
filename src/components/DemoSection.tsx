import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
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

interface LiveData {
  kpis: {
    precisionPromedio: number;
    prediccionesDiarias: number;
    monitoreoContinuo: number;
    coberturaRegional: number;
  };
  countries: Array<{
    name: string;
    code: string;
    lat: number;
    lon: number;
    climate?: any;
    social?: any;
    economic?: any;
  }>;
  global: {
    crypto?: any;
    seismic?: any;
  };
  lastUpdated: string;
}

const DemoSection: React.FC = () => {
  const [demoData, setDemoData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [simulationCountry, setSimulationCountry] = useState<string>('');
  const [inflationIncrease, setInflationIncrease] = useState<number>(0);
  const [droughtLevel, setDroughtLevel] = useState<number>(0);
  const [riskIndex, setRiskIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const response = await fetch('/api/demo/live-state');
        if (!response.ok) {
          throw new Error('Failed to fetch demo data');
        }
        const data: LiveData = await response.json();
        setDemoData(data);
        setSelectedCountry(data.countries[0] ? { name: data.countries[0].name, code: data.countries[0].code, risk: 'N/A', prediction: 0 } : null);
        setError(null);
      } catch (err) {
        console.error('Error fetching demo data:', err);
        setError('Error al cargar datos de la demo');
      } finally {
        setLoading(false);
      }
    };

    fetchDemoData();

    const interval = setInterval(fetchDemoData, 60000);

    return () => clearInterval(interval);
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
    return '#60A5FA';
  };

  const simulateScenario = async () => {
    if (!simulationCountry) return;

    try {
      const response = await fetch('/api/demo/predict-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: simulationCountry,
          inflationIncrease,
          droughtLevel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to simulate scenario');
      }

      const result = await response.json();
      setRiskIndex(result.riskIndex);
    } catch (error) {
      console.error('Error simulating scenario:', error);
      const baseRisk = 50;
      const inflationRisk = inflationIncrease * 2;
      const droughtRisk = droughtLevel * 5;
      setRiskIndex(Math.min(100, baseRisk + inflationRisk + droughtRisk));
    }
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
                  if (country) setSelectedCountry({ name: country.name, code: country.code, risk: 'N/A', prediction: 0 });
                }}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {demoData.countries.map((country) => (
                      <SelectItem key={country.code} value={country.name} className="text-white">
                        {country.name} - Datos en tiempo real disponibles
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCountry && (
                  <div className="mt-6 space-y-4">
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
                <div className="h-64">
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
                              onMouseEnter={() => {
                                const country = demoData.countries.find(c => c.code === geo.properties.ISO_A3);
                                if (country) setHoveredCountry(country.name);
                              }}
                              onMouseLeave={() => setHoveredCountry(null)}
                              onClick={() => {
                                const country = demoData.countries.find(c => c.code === geo.properties.ISO_A3);
                                if (country) {
                                  setSelectedCountry({ name: country.name, code: country.code, risk: 'N/A', prediction: 0 });
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

          {showBriefing && selectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Panel de Briefing en Tiempo Real - {selectedCountry.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Datos climáticos, sociales y económicos actualizados</p>
                  <p className="text-gray-300">Última actualización: {demoData?.lastUpdated}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Panel de Control del Oráculo</CardTitle>
                <p className="text-gray-400">Simula escenarios y observa cómo cambian las predicciones</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-gray-300 block mb-2">Selecciona País para Simulación</label>
                    <Select onValueChange={setSimulationCountry}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {demoData?.countries.map((country) => (
                          <SelectItem key={country.code} value={country.code} className="text-white">
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-2">Aumento de Inflación (%): {inflationIncrease}%</label>
                    <Slider
                      value={[inflationIncrease]}
                      onValueChange={(value) => setInflationIncrease(value[0])}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-2">Nivel de Sequía: {droughtLevel}/10</label>
                    <Slider
                      value={[droughtLevel]}
                      onValueChange={(value) => setDroughtLevel(value[0])}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <Button onClick={simulateScenario} className="w-full bg-blue-600 hover:bg-blue-700">
                    Calcular Índice de Riesgo
                  </Button>

                  {riskIndex !== null && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                      <h3 className="text-white font-semibold">Índice de Riesgo Calculado: {riskIndex.toFixed(1)}%</h3>
                      <Button
                        onClick={() => setShowExplanation(!showExplanation)}
                        variant="outline"
                        className="mt-2"
                      >
                        {showExplanation ? 'Ocultar' : 'Explicar'} Predicción
                      </Button>
                      {showExplanation && (
                        <div className="mt-4 space-y-2 text-gray-300">
                          <p><strong>Dato Climático (35%):</strong> Nivel de sequía simulado afecta la agricultura</p>
                          <p><strong>Dato Económico (45%):</strong> Aumento de inflación simulado impacta la estabilidad</p>
                          <p><strong>Dato Social (20%):</strong> Historial de eventos sociales del país</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

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

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🏛️ Resiliencia Comunitaria LATAM</h3>
              <CommunityResilienceWidget resilienceData={demoData.communityResilience?.data || demoData.communityResilience} />
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🌋 Monitoreo Sísmico en Tiempo Real</h3>
              <SeismicMapWidget seismicData={demoData.global.seismic} />
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🌾 Seguridad Alimentaria Global</h3>
              <FoodSecurityDashboard foodSecurityData={demoData.foodSecurity} />
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">⚖️ Vector Ético - IA Explicable</h3>
              <EthicalVectorDisplay ethicalAssessment={demoData.ethicalAssessment} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoSection;