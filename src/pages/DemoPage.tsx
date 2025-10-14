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
import StarterDemoDashboard from '@/components/demos/StarterDemoDashboard';
import GrowthDemoDashboard from '@/components/demos/GrowthDemoDashboard';
import PantheonDemoDashboard from '@/components/demos/PantheonDemoDashboard';

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
  communityResilience?: any;
  foodSecurity?: any;
  ethicalAssessment?: any;
  global: {
    crypto?: any;
    seismic?: any;
  };
  lastUpdated: string;
}

interface DemoPageProps {
  plan?: string;
}

const DemoPage: React.FC<DemoPageProps> = ({ plan }) => {
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
  const [planParam, setPlanParam] = useState<string | null>(null);

  useEffect(() => {
    // Read optional plan query param to parameterize the demo, or use prop
    if (plan) {
      setPlanParam(plan.toLowerCase());
    } else {
      try {
        const params = new URLSearchParams(window.location.search);
        const planFromUrl = params.get('plan');
        if (planFromUrl) setPlanParam(planFromUrl.toLowerCase());
      } catch (e) {}
    }

    const fetchDemoData = async () => {
      try {
        const response = await fetch('/api/demo/live-state');
        if (!response.ok) {
          throw new Error('Failed to fetch demo data');
        }
        const data: LiveData = await response.json();
        setDemoData(data);
        const first = data.countries[0];
        setSelectedCountry(first ? { name: first.name, code: first.code, risk: 'N/A', prediction: 0 } : null);
        // Ensure simulation select has a sensible default so tests that click simulate without selecting still trigger POST
        if (first) setSimulationCountry(first.code);
        setError(null); // Clear error on success
      } catch (err) {
        console.error('Error fetching demo data:', err);
        // Try to load a static mock JSON from public/mock if available
        try {
          const staticResp = await fetch('/mock/demo-live-state.json');
          if (staticResp.ok) {
            const staticData: LiveData = await staticResp.json();
            setDemoData(staticData);
            const first = staticData.countries[0];
            setSelectedCountry(first ? { name: first.name, code: first.code, risk: 'N/A', prediction: 0 } : null);
            if (first) setSimulationCountry(first.code);
            // Friendly informational banner indicating static mock was used
            setError('Datos de la demo cargados desde mock estático (modo demostración, datos simulados)');
            return;
          }
        } catch (e) {
          console.warn('Static mock not available:', e?.message || e);
        }

        // Fallback: inline high-fidelity mock so the demo remains functional even if backend is unavailable
        const now = new Date().toISOString();
        const mock: LiveData = {
          kpis: {
            precisionPromedio: 90,
            prediccionesDiarias: 120,
            monitoreoContinuo: 24,
            coberturaRegional: 6
          },
          countries: [
            { name: 'Colombia', code: 'COL', lat: 4.5709, lon: -74.2973 },
            { name: 'Perú', code: 'PER', lat: -9.1899, lon: -75.0152 },
            { name: 'Brasil', code: 'BRA', lat: -14.2350, lon: -51.9253 },
            { name: 'México', code: 'MEX', lat: 23.6345, lon: -102.5528 },
            { name: 'Argentina', code: 'ARG', lat: -38.4161, lon: -63.6167 },
            { name: 'Chile', code: 'CHL', lat: -35.6751, lon: -71.5430 }
          ],
          communityResilience: {
            data: {
              resilienceAnalysis: {
                'COL': { country: 'Colombia', socialEvents: 5, resilienceScore: 75, recommendations: ['Mejorar infraestructura social', 'Fortalecer redes comunitarias'], period: { startDate: '2025-01-01', endDate: '2025-10-11' } },
                'PER': { country: 'Perú', socialEvents: 8, resilienceScore: 68, recommendations: ['Implementar programas de apoyo social', 'Monitorear indicadores económicos'], period: { startDate: '2025-01-01', endDate: '2025-10-11' } },
                'BRA': { country: 'Brasil', socialEvents: 12, resilienceScore: 72, recommendations: ['Desarrollar estrategias de mitigación', 'Fomentar la participación ciudadana'], period: { startDate: '2025-01-01', endDate: '2025-10-11' } },
                'MEX': { country: 'México', socialEvents: 6, resilienceScore: 78, recommendations: ['Reforzar sistemas de alerta temprana', 'Invertir en educación comunitaria'], period: { startDate: '2025-01-01', endDate: '2025-10-11' } },
                'ARG': { country: 'Argentina', socialEvents: 9, resilienceScore: 65, recommendations: ['Estabilizar la economía local', 'Mejorar acceso a servicios básicos'], period: { startDate: '2025-01-01', endDate: '2025-10-11' } },
                'CHL': { country: 'Chile', socialEvents: 4, resilienceScore: 82, recommendations: ['Mantener políticas de inclusión', 'Fortalecer instituciones democráticas'], period: { startDate: '2025-01-01', endDate: '2025-10-11' } }
              }
            },
            timestamp: now,
            isMock: true
          },
          foodSecurity: {
            data: [
              { country: 'COL', year: 2024, prevalenceUndernourishment: 8.5, riskIndex: 45, volatilityIndex: 20 },
              { country: 'PER', year: 2024, prevalenceUndernourishment: 12.2, riskIndex: 55, volatilityIndex: 25 },
              { country: 'BRA', year: 2024, prevalenceUndernourishment: 6.8, riskIndex: 40, volatilityIndex: 18 },
              { country: 'MEX', year: 2024, prevalenceUndernourishment: 9.1, riskIndex: 48, volatilityIndex: 22 },
              { country: 'ARG', year: 2024, prevalenceUndernourishment: 11.5, riskIndex: 52, volatilityIndex: 24 },
              { country: 'CHL', year: 2024, prevalenceUndernourishment: 5.2, riskIndex: 35, volatilityIndex: 15 }
            ],
            timestamp: now,
            source: 'mock',
            isMock: true
          },
          ethicalAssessment: {
            success: true,
            data: {
              vector: [25, 70, 55],
              overallScore: 50,
              assessment: 'Medium Ethical Concern',
              timestamp: now
            },
            isMock: true
          },
          global: { crypto: { data: [{ id: 'bitcoin', current_price: 50000 }], isMock: true }, seismic: { events: [], isMock: true } },
          lastUpdated: now
        };
  setDemoData(mock);
        const first = mock.countries[0];
        setSelectedCountry(first ? { name: first.name, code: first.code, risk: 'N/A', prediction: 0 } : null);
        if (first) setSimulationCountry(first.code);
  // Friendly informational banner so users know the demo is running with simulated data
  setError('Datos de la demo cargados desde fallback local (simulados)');
      } finally {
        setLoading(false);
      }
    };

    fetchDemoData();

    // Set up interval to fetch data every 60 seconds
    const interval = setInterval(fetchDemoData, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // If the URL contains contact=true, scroll to the contact section once demoData is available
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const contact = params.get('contact');
      if (contact && contact.toLowerCase() === 'true') {
        // Delay slightly to allow the page layout to settle
        const t = setTimeout(() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
        return () => clearTimeout(t);
      }
    } catch (e) {
      // ignore
    }
  }, [demoData]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 items-center justify-center">
        <div className="text-white text-xl">Cargando datos de la demo...</div>
      </div>
    );
  }

  // Only show a blocking full-screen error when we have no demo data at all.
  if (!demoData) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 items-center justify-center">
        <div className="text-white text-xl">{error || 'Error al cargar datos'}</div>
      </div>
    );
  }

  const getCountryColor = (countryCode: string) => {
    const country = demoData?.countries.find(c => c.code === countryCode);
    if (!country) return '#DDD';
    // Default color for live data
    return '#60A5FA';
  };

  // Determine which widgets to show based on plan param
  const widgetsForPlan = (plan?: string) => {
    // default: show all
    const normalized = (plan || '').toLowerCase();
    switch (normalized) {
      case 'starter':
      case 'oracle':
        return {
          community: false,
          seismic: true,
          food: false,
          ethical: false,
          missionGallery: false
        };
      case 'growth':
      case 'titans':
        return {
          community: true,
          seismic: true,
          food: true,
          ethical: false,
          missionGallery: true
        };
      case 'panteon':
      case 'enterprise':
      case 'gov':
      case 'ngo':
        return {
          community: true,
          seismic: true,
          food: true,
          ethical: true,
          missionGallery: true
        };
      default:
        return {
          community: true,
          seismic: true,
          food: true,
          ethical: true,
          missionGallery: true
        };
    }
  };

  const activeWidgets = widgetsForPlan(planParam || undefined);

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
      // Fallback calculation
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
              {planParam ? (
                (() => {
                  const p = planParam.toLowerCase();
                  if (p === 'starter' || p === 'oracle') return (
                    <>
                      Demo optimizada para <span className="text-etherneon font-semibold">{planParam.toUpperCase()}</span>. Prueba las capacidades esenciales y comprueba la integrabilidad con tus sistemas.
                    </>
                  );
                  if (p === 'growth' || p === 'titans') return (
                    <>
                      Demo del plan <span className="text-etherneon font-semibold">{planParam.toUpperCase()}</span>: incluye integración comunitaria y paneles avanzados de riesgo.
                    </>
                  );
                  if (p === 'panteon' || p === 'enterprise' || p === 'gov' || p === 'ngo') return (
                    <>
                      Experiencia completa del <span className="text-etherneon font-semibold">{planParam.toUpperCase()}</span>: acceso a todos los módulos, datos de alta fidelidad y soporte prioritario.
                    </>
                  );
                  return (
                    <>
                      Experiencia de demo personalizada para el plan <span className="text-etherneon font-semibold">{planParam.toUpperCase()}</span> — vea capacidades y límites del plan en tiempo real.
                    </>
                  );
                })()
              ) : (
                'Inteligencia Predictiva de Élite para América Latina - 90% de Precisión'
              )}
            </motion.p>
            {/* Plan banner with CTAs */}
            {planParam && (
              <div className="mt-4 inline-flex items-center justify-center space-x-3">
                <a href={`#/pricing?highlight=${encodeURIComponent(planParam)}`} className="inline-block bg-etherneon text-etherblue-dark font-semibold px-5 py-2 rounded">Ver Plan</a>
                <a href={`#/demo?plan=${encodeURIComponent(planParam)}&contact=true`} className="inline-block border border-white/20 px-5 py-2 rounded">Contactar Ventas</a>
              </div>
            )}
            {/* Non-blocking informational banner when demo loaded from fallback/mock */}
            {error && (
              <div className="mt-6 max-w-2xl mx-auto bg-yellow-800/20 border-l-4 border-yellow-400 text-yellow-100 px-4 py-2 rounded">
                <strong className="font-semibold">Aviso:</strong> {error}
              </div>
            )}
          </div>

          {/* Renderizar dashboard específico según planParam. Si no hay plan, mostrar la experiencia completa actual (compatibilidad). */}
          {planParam ? (
            <div className="space-y-8">
              {planParam === 'starter' && <StarterDemoDashboard data={demoData} />}
              {planParam === 'growth' && <GrowthDemoDashboard data={demoData} />}
              {(planParam === 'panteon' || planParam === 'pantheon') && <PantheonDemoDashboard data={demoData} />}
              {/* Fallback para alias */}
              {!(planParam === 'starter' || planParam === 'growth' || planParam === 'panteon' || planParam === 'pantheon') && (
                <div>
                  <h3 className="text-white">Demo personalizada: {planParam}</h3>
                  <p className="text-gray-300">Mostrando experiencia completa por defecto.</p>
                </div>
              )}
            </div>
          ) : (
            // Sin plan: mantener la experiencia completa previa
            <>
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

            {/* Resto de la UI previa: mapas, panel, etc. (mantener compatibilidad) */}
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
                    if (country) setSelectedCountry({ name: country.name, code: country.code, risk: 'N/A', prediction: 0 });
                  }}>
                    <SelectTrigger data-testid="country-select-trigger" className="bg-gray-700 border-gray-600 text-white">
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

            {/* Mantener el resto de la UI previa (briefing, control, galería, sinfonía) para compatibilidad */}
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
                  <CardContent data-testid="briefing-panel">
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
                        <SelectTrigger data-testid="simulation-select-trigger" className="bg-gray-700 border-gray-600 text-white">
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

                    <Button data-testid="simulate-button" onClick={simulateScenario} className="w-full bg-blue-600 hover:bg-blue-700">
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
                {activeWidgets.missionGallery && (
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">Galería de Misiones - Task Replay</CardTitle>
                      <p className="text-gray-400">Haz clic en una misión para ver el análisis predictivo en tiempo real</p>
                    </CardHeader>
                    <CardContent>
                      <MissionGallery />
                    </CardContent>
                  </Card>
                )}
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
                {activeWidgets.community && <CommunityResilienceWidget resilienceData={demoData.communityResilience} />}
              </div>

              {/* Monitoreo Sísmico */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">🌋 Monitoreo Sísmico en Tiempo Real</h3>
                {activeWidgets.seismic && <SeismicMapWidget seismicData={demoData.global.seismic} />}
              </div>

              {/* Seguridad Alimentaria */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">🌾 Seguridad Alimentaria Global</h3>
                {activeWidgets.food && <FoodSecurityDashboard foodSecurityData={demoData.foodSecurity} />}
              </div>

              {/* IA Ética */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">⚖️ Vector Ético - IA Explicable</h3>
                {activeWidgets.ethical && <EthicalVectorDisplay ethicalAssessment={demoData.ethicalAssessment} />}
              </div>
            </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;