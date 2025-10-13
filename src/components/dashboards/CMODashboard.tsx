import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const CMODashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/cmo-dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching CMO data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExplain = async (metric: string, value: any) => {
    try {
      const response = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context: 'CMODashboard' })
      });
      const result = await response.json();
      alert(result.explanation);
    } catch (error) {
      console.error('Error getting explanation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Midiendo el engagement global...</div>
      </div>
    );
  }

  const engagementData = [
    { channel: 'Demo', engagement: data?.demoEngagement || 0 },
    { channel: 'Social', engagement: 75 },
    { channel: 'Content', engagement: 68 },
    { channel: 'Events', engagement: 82 }
  ];

  const brandSentimentData = [
    { month: 'Ene', positive: 65, neutral: 25, negative: 10 },
    { month: 'Feb', positive: 70, neutral: 20, negative: 10 },
    { month: 'Mar', positive: 75, neutral: 15, negative: 10 },
    { month: 'Abr', positive: 78, neutral: 12, negative: 10 },
    { month: 'May', positive: data?.brandSentiment || 80, neutral: 10, negative: 10 }
  ];

  const marketRadarData = [
    { subject: 'Awareness', A: 85, fullMark: 100 },
    { subject: 'Engagement', A: data?.demoEngagement || 0, fullMark: 100 },
    { subject: 'Conversion', A: data?.conversionRate ? parseFloat(data.conversionRate) * 10 : 50, fullMark: 100 },
    { subject: 'Retention', A: data?.retentionRate ? parseFloat(data.retentionRate.replace('%', '')) : 80, fullMark: 100 },
    { subject: 'Advocacy', A: data?.viralCoefficient ? data.viralCoefficient * 20 : 60, fullMark: 100 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-purple-400 mb-2 flex items-center justify-center">
          <span className="mr-3">🌍</span> Dominio del CMO - Mercado Global
        </h2>
        <p className="text-gray-300 text-lg">Engagement, conversión y presencia de marca</p>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-800/80 to-purple-700/80 backdrop-blur-xl border border-purple-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">📈</div>
            <button
              onClick={() => handleExplain('demoEngagement', data?.demoEngagement)}
              className="text-purple-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">{data?.demoEngagement}%</div>
          <div className="text-gray-300">Engagement Demo</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-800/80 to-blue-700/80 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🎯</div>
            <button
              onClick={() => handleExplain('leadsGenerated', data?.leadsGenerated)}
              className="text-blue-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">{data?.leadsGenerated}</div>
          <div className="text-gray-300">Leads Generados</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">💬</div>
            <button
              onClick={() => handleExplain('brandSentiment', data?.brandSentiment)}
              className="text-green-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">{data?.brandSentiment}%</div>
          <div className="text-gray-300">Sentimiento Marca</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-800/80 to-orange-700/80 backdrop-blur-xl border border-orange-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">📊</div>
            <button
              onClick={() => handleExplain('marketPenetration', data?.marketPenetration)}
              className="text-orange-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">{data?.marketPenetration}%</div>
          <div className="text-gray-300">Penetración Mercado</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement by Channel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-purple-400 mb-4">Engagement por Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="channel" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Bar dataKey="engagement" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Brand Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-purple-400 mb-4">Tendencia Sentimiento Marca</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={brandSentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Market Position Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 backdrop-blur-xl border border-purple-400/20 rounded-xl p-6 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
          <span className="mr-2">🎯</span> Radar de Posicionamiento de Mercado
        </h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={marketRadarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
              <Radar
                name="Market Position"
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Conversion Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-800/60 to-blue-900/60 backdrop-blur-xl border border-blue-400/20 rounded-xl p-6 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
          <span className="mr-2">⚡</span> Métricas de Conversión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-2">Tasa Conversión</div>
            <div className="text-white text-xl">{data?.conversionRate}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">Adquisición Clientes</div>
            <div className="text-white text-xl">{data?.customerAcquisition}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 font-semibold mb-2">Tasa Retención</div>
            <div className="text-white text-xl">{data?.retentionRate}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/30 rounded-lg p-4">
            <div className="text-orange-400 font-semibold mb-2">Coeficiente Viral</div>
            <div className="text-white text-xl">{data?.viralCoefficient}x</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CMODashboard;