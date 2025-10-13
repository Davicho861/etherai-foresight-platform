import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

interface DeploymentData {
  deploymentFrequency: number;
  deploymentTime: string;
  failureRate: number;
  mttr: string;
  availability: number;
  pipelineStatus: {
    build: string;
    test: string;
    security: string;
    deploy: string;
  };
  recentDeployments: Array<{
    id: string;
    time: string;
    status: string;
    duration: string;
  }>;
  infrastructure: {
    autoScaling: string;
    loadBalancing: string;
    monitoring: string;
    backup: string;
  };
}

const DeploymentDashboard: React.FC = () => {
  const [data, setData] = useState<DeploymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/deployment');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching deployment data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-etherneon text-xl">Cargando datos de despliegue...</div>
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

  const uptimeData = [
    { time: '00:00', uptime: 99.99, latency: 45 },
    { time: '06:00', uptime: 99.95, latency: 52 },
    { time: '12:00', uptime: 99.99, latency: 48 },
    { time: '18:00', uptime: 99.97, latency: 51 },
    { time: '24:00', uptime: data.availability, latency: 45 }
  ];

  const deploymentFrequencyData = [
    { period: 'Semana 1', deployments: 8 },
    { period: 'Semana 2', deployments: 12 },
    { period: 'Semana 3', deployments: 15 },
    { period: 'Semana 4', deployments: data.deploymentFrequency }
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
          <span className="mr-3">🚀</span> El Vuelo de Hermes - Despliegue y Operaciones
        </h2>
        <p className="text-gray-300">El mensajero divino que lleva el código perfecto a través de los reinos digitales</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-800/80 to-emerald-800/80 p-6 rounded-xl border border-green-600/30"
        >
          <div className="text-2xl font-bold text-green-400">{data.availability}%</div>
          <div className="text-sm text-gray-300">Disponibilidad</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-800/80 to-cyan-800/80 p-6 rounded-xl border border-blue-600/30"
        >
          <div className="text-2xl font-bold text-blue-400">{data.deploymentFrequency}/día</div>
          <div className="text-sm text-gray-300">Frecuencia de Despliegue</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-800/80 to-pink-800/80 p-6 rounded-xl border border-red-600/30"
        >
          <div className="text-2xl font-bold text-red-400">{(data.failureRate * 100).toFixed(2)}%</div>
          <div className="text-sm text-gray-300">Tasa de Fallos</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-6 rounded-xl border border-purple-600/30"
        >
          <div className="text-2xl font-bold text-purple-400">{data.mttr}</div>
          <div className="text-sm text-gray-300">MTTR</div>
        </motion.div>
      </div>

      {/* Estado del Despliegue */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🚀 Estado del Despliegue</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
              <span className="text-gray-300">Último Despliegue</span>
              <span className="text-green-400 font-medium">Éxitoso</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
              <span className="text-gray-300">Tiempo de Despliegue</span>
              <span className="text-etherneon font-medium">{data.deploymentTime}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
              <span className="text-gray-300">Frecuencia de Despliegue</span>
              <span className="text-etherneon font-medium">{data.deploymentFrequency}/día</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
              <span className="text-gray-300">Tasa de Fallos</span>
              <span className="text-green-400 font-medium">{(data.failureRate * 100).toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <div className="text-etherneon text-xl font-bold">Sistema Operativo</div>
              <div className="text-gray-400 text-sm">Todos los sistemas funcionando</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pipeline de CI/CD */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🔄 Pipeline de CI/CD</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(data.pipelineStatus).map(([stage, status], index) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 bg-etherblue-800/30 rounded-lg text-center"
            >
              <div className="text-sm text-gray-300 mb-2 capitalize">{stage}</div>
              <div className={`font-medium ${
                status === 'Success' ? 'text-green-400' :
                status === 'Running' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {status}
              </div>
              <div className={`w-full h-2 rounded-full mt-2 ${
                status === 'Success' ? 'bg-green-400' :
                status === 'Running' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Métricas de Disponibilidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📊 Disponibilidad y Performance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={uptimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Line type="monotone" dataKey="uptime" stroke="#00D4FF" strokeWidth={2} name="Disponibilidad %" />
            <Line type="monotone" dataKey="latency" stroke="#FF6B00" strokeWidth={2} name="Latencia (ms)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Frecuencia de Despliegues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📈 Frecuencia de Despliegues</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={deploymentFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="period" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Bar dataKey="deployments" fill="#00D4FF" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Operaciones Autonómicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🤖 Operaciones Autonómicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data.infrastructure).map(([service, status], index) => (
            <div key={service} className="p-4 bg-etherblue-800/30 rounded-lg">
              <div className="text-sm text-gray-300 mb-2 capitalize">
                {service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className={`font-medium ${
                status === 'Active' ? 'text-green-400' :
                status === 'In Progress' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {status}
              </div>
              <div className={`w-full h-2 rounded-full mt-2 ${
                status === 'Active' ? 'bg-green-400' :
                status === 'In Progress' ? 'bg-yellow-400' : 'bg-gray-400'
              }`}></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Despliegues Recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📋 Despliegues Recientes</h3>
        <div className="space-y-3">
          {data.recentDeployments.map((deployment, index) => (
            <motion.div
              key={deployment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg"
            >
              <div>
                <div className="font-medium text-white">{deployment.id}</div>
                <div className="text-sm text-gray-400">{deployment.time}</div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  deployment.status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {deployment.status === 'success' ? 'Éxitoso' : 'Fallido'}
                </div>
                <div className="text-sm text-gray-400">{deployment.duration}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeploymentDashboard;