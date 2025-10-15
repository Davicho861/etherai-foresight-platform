import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Filter, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RiskAlert {
  id: string;
  country: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;
  type: string;
  message: string;
  timestamp: string;
  factors: { name: string; value: number }[];
}

interface RiskData {
  country: string;
  currentRisk: number;
  trend: 'up' | 'down' | 'stable';
  alerts: number;
  lastUpdate: string;
}

const EnhancedRiskDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());

  // Mock data for demonstration
  useEffect(() => {
    const mockAlerts: RiskAlert[] = [
      {
        id: '1',
        country: 'COL',
        riskLevel: 'High',
        riskScore: 8.5,
        type: 'Social Instability',
        message: 'Elevated risk of social unrest due to economic pressures',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        factors: [
          { name: 'Economic', value: 85 },
          { name: 'Social', value: 70 },
          { name: 'Political', value: 60 }
        ]
      },
      {
        id: '2',
        country: 'PER',
        riskLevel: 'Medium',
        riskScore: 6.2,
        type: 'Climate Risk',
        message: 'Increased flood risk in coastal regions',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        factors: [
          { name: 'Climate', value: 90 },
          { name: 'Infrastructure', value: 45 },
          { name: 'Population', value: 55 }
        ]
      },
      {
        id: '3',
        country: 'ARG',
        riskLevel: 'Critical',
        riskScore: 9.1,
        type: 'Economic Crisis',
        message: 'Critical economic indicators showing severe deterioration',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        factors: [
          { name: 'Economic', value: 95 },
          { name: 'Social', value: 80 },
          { name: 'Political', value: 75 }
        ]
      }
    ];

    const mockRiskData: RiskData[] = [
      { country: 'COL', currentRisk: 8.5, trend: 'up', alerts: 3, lastUpdate: new Date().toISOString() },
      { country: 'PER', currentRisk: 6.2, trend: 'stable', alerts: 1, lastUpdate: new Date().toISOString() },
      { country: 'ARG', currentRisk: 9.1, trend: 'up', alerts: 5, lastUpdate: new Date().toISOString() }
    ];

    setAlerts(mockAlerts);
    setRiskData(mockRiskData);
  }, []);

  // Fetch real-time data
  const fetchRealTimeData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the API
      // For now, we'll simulate with mock data updates
      setTimeout(() => {
        setLastUpdate(new Date().toISOString());
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-[color:var(--accent-yellow)]';
      case 'Medium': return 'bg-[color:var(--accent-yellow)]';
      case 'High': return 'bg-[color:var(--accent-red)]';
      case 'Critical': return 'bg-[color:var(--accent-red)]';
      default: return 'bg-[color:var(--border)]';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const countryMatch = selectedCountry === 'all' || alert.country === selectedCountry;
    const riskMatch = selectedRiskLevel === 'all' || alert.riskLevel === selectedRiskLevel;
    return countryMatch && riskMatch;
  });

  const exportData = () => {
    const dataStr = JSON.stringify({ alerts: filteredAlerts, riskData, lastUpdate }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `praevision-risk-report-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Prepare chart data
  const riskTrendData = riskData.map(country => ({
    country: country.country,
    risk: country.currentRisk,
    alerts: country.alerts
  }));

  const riskLevelDistribution = [
    { name: 'Low', value: alerts.filter(a => a.riskLevel === 'Low').length, color: '#10B981' },
    { name: 'Medium', value: alerts.filter(a => a.riskLevel === 'Medium').length, color: '#F59E0B' },
    { name: 'High', value: alerts.filter(a => a.riskLevel === 'High').length, color: '#F97316' },
    { name: 'Critical', value: alerts.filter(a => a.riskLevel === 'Critical').length, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <Card className="bg-[color:var(--card)] border-[color:var(--border)]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white text-2xl">Dashboard de Riesgos en Tiempo Real</CardTitle>
              <p className="text-gray-300 mt-1">
                Última actualización: {new Date(lastUpdate).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={fetchRealTimeData}
                disabled={isLoading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-[color:var(--card)] border-[color:var(--border)]">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Filtros:</span>
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-40 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">Todos los países</option>
              <option value="COL">Colombia</option>
              <option value="PER">Perú</option>
              <option value="ARG">Argentina</option>
            </select>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-40 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">Todos los niveles</option>
              <option value="Low">Bajo</option>
              <option value="Medium">Medio</option>
              <option value="High">Alto</option>
              <option value="Critical">Crítico</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riskData.map((country) => (
          <Card key={country.country} className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{country.country}</h3>
                  <p className="text-2xl font-bold text-blue-400">{country.currentRisk}/10</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl">{getTrendIcon(country.trend)}</span>
                  <p className="text-sm text-gray-400">{country.alerts} alertas</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    country.currentRisk >= 8 ? 'bg-red-500' :
                    country.currentRisk >= 6 ? 'bg-orange-500' :
                    country.currentRisk >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(country.currentRisk / 10) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[color:var(--card)] border-[color:var(--border)]">
          <CardHeader>
            <CardTitle className="text-white">Tendencia de Riesgos por País</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" stroke="hsl(var(--text-secondary))" />
                <YAxis stroke="hsl(var(--text-secondary))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: `1px solid hsl(var(--border))`,
                    borderRadius: '8px',
                    color: 'hsl(var(--text-primary))'
                  }}
                />
                <Bar dataKey="risk" fill="hsl(var(--primary))" name="Riesgo Actual" />
                <Bar dataKey="alerts" fill="hsl(var(--accent-red))" name="Alertas Activas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Distribución de Niveles de Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskLevelDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {riskLevelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
            Alertas Activas ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRiskColor(alert.riskLevel)}`}>
                      {alert.riskLevel}
                    </span>
                    <span className="text-white font-semibold">{alert.country}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{alert.type}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-200 mb-3">{alert.message}</p>
                <div className="flex flex-wrap gap-2">
                  {alert.factors.map((factor, index) => (
                    <div key={index} className="text-xs bg-gray-600 px-2 py-1 rounded">
                      {factor.name}: {factor.value}%
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredAlerts.length === 0 && (
              <p className="text-gray-400 text-center py-8">No hay alertas activas con los filtros seleccionados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRiskDashboard;