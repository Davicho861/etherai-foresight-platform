import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResilienceData {
  country: string;
  socialEvents: number;
  resilienceScore: number;
  recommendations: string[];
  period: { startDate: string; endDate: string };
}

interface GlobalAssessment {
  averageResilience: number;
  lowResilienceCountries: number;
  assessment: string;
  globalRecommendations: string[];
}

interface CommunityResilienceResponse {
  resilienceAnalysis: { [key: string]: ResilienceData };
  globalResilienceAssessment: GlobalAssessment;
  timestamp: string;
}

const CommunityResilienceSection: React.FC = () => {
  const [resilienceData, setResilienceData] = useState<CommunityResilienceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());

  const fetchResilienceData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('praevision_token') || 'demo-token';
      const response = await fetch('/api/community-resilience', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResilienceData(data.data);
        setLastUpdate(data.data.timestamp);
      } else {
        console.error('Error fetching resilience data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching resilience data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResilienceData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchResilienceData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getResilienceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResilienceBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!resilienceData) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mr-2" />
            <span className="text-gray-300">Cargando datos de resiliencia comunitaria...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const countries = Object.entries(resilienceData.resilienceAnalysis);

  // Prepare chart data
  const chartData = countries.map(([country, data]: [string, ResilienceData]) => ({
    country,
    resilience: data.resilienceScore,
    events: data.socialEvents,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white text-2xl flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Resiliencia Comunitaria LATAM
              </CardTitle>
              <p className="text-gray-300 mt-1">
                Análisis de fortaleza social frente a amenazas
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Última actualización: {new Date(lastUpdate).toLocaleString()}
              </p>
            </div>
            <Button
              onClick={fetchResilienceData}
              disabled={isLoading}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Global Assessment */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {resilienceData.globalResilienceAssessment.averageResilience.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Resiliencia Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {resilienceData.globalResilienceAssessment.lowResilienceCountries}
              </div>
              <div className="text-sm text-gray-400">Países con Baja Resiliencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {countries.length}
              </div>
              <div className="text-sm text-gray-400">Países Analizados</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Evaluación Global</h4>
            <p className="text-gray-300">{resilienceData.globalResilienceAssessment.assessment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Country Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {countries.map(([country, data]: [string, ResilienceData]) => (
          <Card key={country} className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{country}</h3>
                  <p className={`text-2xl font-bold ${getResilienceColor(data.resilienceScore)}`}>
                    {data.resilienceScore.toFixed(1)}/100
                  </p>
                  <p className="text-sm text-gray-400">Puntaje de Resiliencia</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{data.socialEvents} eventos</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${getResilienceBgColor(data.resilienceScore)}`}
                  style={{ width: `${data.resilienceScore}%` }}
                ></div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-300">Recomendaciones:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  {data.recommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-400 mr-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Análisis de Resiliencia por País
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="country" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar yAxisId="left" dataKey="resilience" fill="#10B981" name="Resiliencia (%)" />
              <Bar yAxisId="right" dataKey="events" fill="#F59E0B" name="Eventos Sociales" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Global Recommendations */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recomendaciones Globales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resilienceData.globalResilienceAssessment.globalRecommendations.map((rec, idx) => (
              <div key={idx} className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{rec}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityResilienceSection;