import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FoodSecurityData {
  country: string;
  year: number;
  prevalenceUndernourishment: number;
  riskIndex: number;
  volatilityIndex: number;
}

interface FoodSecurityResponse {
  data: FoodSecurityData[];
  timestamp: string;
}

const FoodSecurityDashboard: React.FC = () => {
  const [foodData, setFoodData] = useState<FoodSecurityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('COL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('praevisio_token') || 'demo-token';
        const response = await fetch('/api/global-risk/food-security', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: FoodSecurityResponse = await response.json();
          setFoodData(data.data);
        } else {
          throw new Error('Failed to fetch food security data');
        }
      } catch (err) {
        console.error('Error fetching food security data:', err);
        setError('Error al cargar datos de seguridad alimentaria');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique countries
  const countries = [...new Set(foodData.map(d => d.country))];

  // Filter data for selected country
  const countryData = foodData.filter(d => d.country === selectedCountry);

  // Prepare chart data
  const chartData = countryData.map(d => ({
    year: d.year,
    prevalence: d.prevalenceUndernourishment,
    riskIndex: d.riskIndex,
    volatility: d.volatilityIndex,
  }));

  // Get latest data for selected country
  const latestData = countryData.sort((a, b) => b.year - a.year)[0];

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-400';
    if (risk >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 70) return 'Alto';
    if (risk >= 40) return 'Medio';
    return 'Bajo';
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-300">Cargando datos de seguridad alimentaria...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-900 to-red-900 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white text-2xl">Dashboard de Seguridad Alimentaria</CardTitle>
              <p className="text-gray-300 mt-1">
                Índice de Riesgo de Hambruna y Volatilidad de Precios
              </p>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {countries.map(country => (
                  <SelectItem key={country} value={country} className="text-white">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Current Status */}
      {latestData && (
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getRiskColor(latestData.riskIndex)}`}>
                  {latestData.riskIndex.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Índice de Riesgo de Hambruna</div>
                <div className={`text-sm font-semibold ${getRiskColor(latestData.riskIndex)}`}>
                  Nivel: {getRiskLevel(latestData.riskIndex)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {latestData.prevalenceUndernourishment.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Prevalencia de Desnutrición</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {latestData.volatilityIndex.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Índice de Volatilidad</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Evolución del Riesgo de Hambruna</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9CA3AF" />
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
                  dataKey="riskIndex"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Riesgo de Hambruna (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Volatilidad de Precios Alimentarios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="volatility" fill="#F59E0B" name="Volatilidad (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Prevalence Trend */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tendencia de Prevalencia de Desnutrición</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
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
                dataKey="prevalence"
                stroke="#10B981"
                strokeWidth={3}
                name="Prevalencia (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodSecurityDashboard;