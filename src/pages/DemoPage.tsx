import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from '@/components/Sidebar';
import MissionGallery from '@/components/MissionGallery';
import AnimatedMetric from '@/components/AnimatedMetrics';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries = [
  { name: 'Colombia', code: 'COL', risk: 'Bajo', prediction: 92 },
  { name: 'Perú', code: 'PER', risk: 'Medio', prediction: 87 },
  { name: 'Brasil', code: 'BRA', risk: 'Alto', prediction: 78 },
  { name: 'México', code: 'MEX', risk: 'Medio', prediction: 85 },
  { name: 'Argentina', code: 'ARG', risk: 'Bajo', prediction: 91 },
];

const chartData = [
  { month: 'Ene', accuracy: 85, predictions: 120 },
  { month: 'Feb', accuracy: 87, predictions: 135 },
  { month: 'Mar', accuracy: 89, predictions: 142 },
  { month: 'Abr', accuracy: 91, predictions: 158 },
  { month: 'May', accuracy: 93, predictions: 165 },
  { month: 'Jun', accuracy: 95, predictions: 178 },
];

const DemoPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountryColor = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
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
                  <AnimatedMetric value={95} suffix="%" />
                  <p className="text-gray-400 mt-2">Precisión Promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={178} suffix="K" />
                  <p className="text-gray-400 mt-2">Predicciones Diarias</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={24} suffix="/7" />
                  <p className="text-gray-400 mt-2">Monitoreo Continuo</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <AnimatedMetric value={6} suffix=" Países" />
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
                  const country = countries.find(c => c.name === value);
                  if (country) setSelectedCountry(country);
                }}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name} className="text-white">
                        {country.name} - Riesgo: {country.risk} ({country.prediction}% precisión)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                          const country = countries.find(c => c.code === geo.properties.ISO_A3);
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
                                const country = countries.find(c => c.code === geo.properties.ISO_A3);
                                if (country) setHoveredCountry(country.name);
                              }}
                              onMouseLeave={() => setHoveredCountry(null)}
                              onClick={() => {
                                const country = countries.find(c => c.code === geo.properties.ISO_A3);
                                if (country) setSelectedCountry(country);
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
                  <LineChart data={chartData}>
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
                  <BarChart data={chartData}>
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
        </motion.div>
      </div>
    </div>
  );
};

export default DemoPage;