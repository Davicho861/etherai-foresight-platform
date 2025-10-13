import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

interface DesignData {
  complexityScore: number;
  technicalDebt: number;
  securityScore: number;
  responseTime: string;
  architectureMap: {
    layers: string[];
    dependencies: number;
    circularDeps: number;
  };
  securityProfile: {
    encryption: string;
    auth: string;
    audit: string;
  };
}

const DesignDashboard: React.FC = () => {
  const [data, setData] = useState<DesignData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/design');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching design data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-etherneon text-xl">Cargando datos de diseño...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-xl">Error al cargar datos</div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Complejidad', A: data.complexityScore, fullMark: 10 },
    { subject: 'Deuda Técnica', A: data.technicalDebt, fullMark: 10 },
    { subject: 'Seguridad', A: data.securityScore / 10, fullMark: 10 },
    { subject: 'Performance', A: 8.5, fullMark: 10 },
    { subject: 'Mantenibilidad', A: 9.2, fullMark: 10 },
    { subject: 'Escalabilidad', A: 8.8, fullMark: 10 }
  ];

  const architectureData = [
    { name: 'Capas', value: data.architectureMap.layers.length },
    { name: 'Dependencias', value: data.architectureMap.dependencies },
    { name: 'Deps Circulares', value: data.architectureMap.circularDeps }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-etherblue-dark/60 to-etherblue-800/60 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-etherneon flex items-center">
          <span className="mr-3">⚒️</span> Consejo Técnico Soberano - Arquitectura y Diseño
        </h2>
        <p className="text-gray-300">Forja divina de la arquitectura técnica que sustentará la soberanía de Praevisio AI</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-800/80 to-pink-800/80 p-6 rounded-xl border border-red-600/30"
        >
          <div className="text-2xl font-bold text-red-400">{data.complexityScore}</div>
          <div className="text-sm text-gray-300">Complejidad Ciclomática</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-800/80 to-orange-800/80 p-6 rounded-xl border border-yellow-600/30"
        >
          <div className="text-2xl font-bold text-yellow-400">{data.technicalDebt}%</div>
          <div className="text-sm text-gray-300">Deuda Técnica</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-800/80 to-emerald-800/80 p-6 rounded-xl border border-green-600/30"
        >
          <div className="text-2xl font-bold text-green-400">{data.securityScore}%</div>
          <div className="text-sm text-gray-300">Cobertura de Seguridad</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-800/80 to-cyan-800/80 p-6 rounded-xl border border-blue-600/30"
        >
          <div className="text-2xl font-bold text-blue-400">{data.responseTime}</div>
          <div className="text-sm text-gray-300">Tiempo de Respuesta</div>
        </motion.div>
      </div>

      {/* Radar Chart de Arquitectura */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🎯 Perfil Arquitectónico</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 10]} />
            <Radar
              name="Puntuación"
              dataKey="A"
              stroke="#00D4FF"
              fill="#00D4FF"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Arquitectura y Dependencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-etherneon">🏗️ Mapa Arquitectónico</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Capas del Sistema</h4>
              <div className="space-y-1">
                {data.architectureMap.layers.map((layer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-etherneon rounded-full mr-2"></div>
                    <span className="text-gray-300 text-sm">{layer}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-etherneon">{data.architectureMap.dependencies}</div>
                <div className="text-xs text-gray-400">Dependencias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{data.architectureMap.circularDeps}</div>
                <div className="text-xs text-gray-400">Deps Circulares</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-etherneon">🔐 Perfil de Seguridad</h3>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
                <span className="text-gray-300">Encriptación</span>
                <span className="text-green-400 font-medium">{data.securityProfile.encryption}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
                <span className="text-gray-300">Autenticación</span>
                <span className="text-green-400 font-medium">{data.securityProfile.auth}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
                <span className="text-gray-300">Auditoría</span>
                <span className="text-green-400 font-medium">{data.securityProfile.audit}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{data.securityScore}%</div>
                <div className="text-xs text-gray-400">Puntuación Global de Seguridad</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráfico de Barras de Arquitectura */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📊 Métricas Arquitectónicas</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={architectureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Bar dataKey="value" fill="#00D4FF" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default DesignDashboard;