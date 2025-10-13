import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00D4FF', '#FF6B00', '#FFD700', '#FF0080', '#00FF80'];

const CSODashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/cso-dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching CSO data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [explanationModal, setExplanationModal] = useState<{
    isOpen: boolean;
    explanation: string;
    metric: string;
    value: any;
  }>({ isOpen: false, explanation: '', metric: '', value: null });

  const handleExplain = async (metric: string, value: any) => {
    try {
      const response = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context: 'CSODashboard' })
      });
      const result = await response.json();
      setExplanationModal({
        isOpen: true,
        explanation: result.explanation,
        metric,
        value
      });
    } catch (error) {
      console.error('Error getting explanation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-400 text-xl">Evaluando postura de seguridad...</div>
      </div>
    );
  }

  const securityPostureData = [
    { name: 'Seguro', value: data?.securityPosture || 88 },
    { name: 'Riesgo', value: 100 - (data?.securityPosture || 88) }
  ];

  const vulnerabilityTrend = [
    { month: 'Ene', vulnerabilities: 5 },
    { month: 'Feb', vulnerabilities: 3 },
    { month: 'Mar', vulnerabilities: 7 },
    { month: 'Abr', vulnerabilities: 2 },
    { month: 'May', vulnerabilities: data?.vulnerabilityCount || 3 }
  ];

  const securityRadarData = [
    { subject: 'Postura', score: data?.securityPosture || 88 },
    { subject: 'Auditorías', score: data?.auditCompliance || 92 },
    { subject: 'Detección', score: data?.threatDetection || 85 },
    { subject: 'Protección', score: data?.dataProtection || 90 },
    { subject: 'Acceso', score: data?.accessControl || 85 },
    { subject: 'Conciencia', score: data?.securityAwareness || 78 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="backdrop-blur-xl bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 border border-red-400/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-3 flex items-center justify-center">
            <span className="mr-4 text-6xl animate-pulse">🛡️</span> Fortaleza del CSO - Blindaje Digital
          </h2>
          <p className="text-gray-200 text-xl font-light">Vigilancia cuántica, protección probabilística y resiliencia del imperio</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping delay-75"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping delay-150"></div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-900/60 backdrop-blur-2xl border border-red-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">🔒</div>
              <button
                onClick={() => handleExplain('securityPosture', data?.securityPosture)}
                className="text-red-400 hover:text-red-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.securityPosture}%
            </div>
            <div className="text-gray-200 font-medium">Postura de Seguridad Cuántica</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-red-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.securityPosture}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-orange-900/60 via-orange-800/50 to-orange-900/60 backdrop-blur-2xl border border-orange-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">🎯</div>
              <button
                onClick={() => handleExplain('vulnerabilityCount', data?.vulnerabilityCount)}
                className="text-orange-400 hover:text-orange-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.vulnerabilityCount}
            </div>
            <div className="text-gray-200 font-medium">Vulnerabilidades Cuánticas</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-orange-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, data?.vulnerabilityCount * 10)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-green-900/60 via-green-800/50 to-green-900/60 backdrop-blur-2xl border border-green-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">📋</div>
              <button
                onClick={() => handleExplain('auditCompliance', data?.auditCompliance)}
                className="text-green-400 hover:text-green-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.auditCompliance}%
            </div>
            <div className="text-gray-200 font-medium">Cumplimiento Probabilístico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-green-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.auditCompliance}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-blue-900/60 backdrop-blur-2xl border border-blue-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">⚡</div>
              <button
                onClick={() => handleExplain('threatDetection', data?.threatDetection)}
                className="text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.threatDetection}%
            </div>
            <div className="text-gray-200 font-medium">Detección de Amenazas</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-blue-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.threatDetection}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Security Posture Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-2xl border border-gray-500/40 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-pulse">🔮</span> Postura de Seguridad Cuántica
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={securityPostureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {securityPostureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.6)'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vulnerability Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-2xl border border-gray-500/40 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-pulse">📊</span> Tendencia de Vulnerabilidades Probabilísticas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vulnerabilityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
                <XAxis dataKey="month" stroke="rgba(156, 163, 175, 0.7)" />
                <YAxis stroke="rgba(156, 163, 175, 0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="vulnerabilities"
                  stroke="rgba(239, 68, 68, 0.8)"
                  strokeWidth={3}
                  dot={{ fill: 'rgba(239, 68, 68, 0.8)', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'rgba(239, 68, 68, 1)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Security Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group relative bg-gradient-to-br from-red-900/50 via-red-800/40 to-red-900/50 backdrop-blur-2xl border border-red-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-4 flex items-center">
            <span className="mr-3 text-3xl animate-pulse">🔍</span> Radar de Seguridad Cuántica Integral
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={securityRadarData}>
                <PolarGrid stroke="rgba(55, 65, 81, 0.3)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(156, 163, 175, 0.8)' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(156, 163, 175, 0.8)' }} />
                <Radar
                  name="Security Score"
                  dataKey="score"
                  stroke="rgba(220, 38, 38, 0.8)"
                  fill="rgba(220, 38, 38, 0.2)"
                  fillOpacity={0.4}
                  strokeWidth={3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Security Operations Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60 backdrop-blur-2xl border border-gray-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-gray-500/10 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent mb-4 flex items-center">
            <span className="mr-3 text-3xl animate-pulse">🚨</span> Operaciones de Seguridad Cuántica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xl border border-red-400/30 rounded-xl p-4 hover:shadow-red-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-red-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">⚡</span> Tiempo Respuesta
                </div>
                <div className="text-white text-xl font-bold">{data?.incidentResponse}</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4 hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-blue-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🛡️</span> Protección Datos
                </div>
                <div className="text-white text-xl font-bold">{data?.dataProtection}%</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-green-900/40 via-green-800/30 to-green-900/40 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-green-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🔐</span> Control Acceso
                </div>
                <div className="text-white text-xl font-bold">{data?.accessControl}%</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-purple-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🧠</span> Conciencia Seguridad
                </div>
                <div className="text-white text-xl font-bold">{data?.securityAwareness}%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Modal de explicación XAI
  if (explanationModal.isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl border border-gray-500/30 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center">
                <span className="mr-3 text-3xl animate-pulse">✨</span> Revelación del Oráculo
              </h3>
              <button
                onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-red-900/20 via-purple-900/20 to-blue-900/20 rounded-xl border border-red-500/20">
              <div className="text-sm text-gray-300 mb-2">Métrica Analizada:</div>
              <div className="text-xl font-semibold text-white">{explanationModal.metric}: {explanationModal.value}</div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                {explanationModal.explanation}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Generado por Apolo Prime - Arquitecto de la Inteligencia Manifiesta
              </div>
              <button
                onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Cerrar Revelación
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="backdrop-blur-xl bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 border border-red-400/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-3 flex items-center justify-center">
            <span className="mr-4 text-6xl animate-pulse">🛡️</span> Fortaleza del CSO - Blindaje Digital
          </h2>
          <p className="text-gray-200 text-xl font-light">Vigilancia cuántica, protección probabilística y resiliencia del imperio</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping delay-75"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping delay-150"></div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-900/60 backdrop-blur-2xl border border-red-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">🔒</div>
              <button
                onClick={() => handleExplain('securityPosture', data?.securityPosture)}
                className="text-red-400 hover:text-red-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.securityPosture}%
            </div>
            <div className="text-gray-200 font-medium">Postura de Seguridad Cuántica</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-red-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.securityPosture}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-orange-900/60 via-orange-800/50 to-orange-900/60 backdrop-blur-2xl border border-orange-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">🎯</div>
              <button
                onClick={() => handleExplain('vulnerabilityCount', data?.vulnerabilityCount)}
                className="text-orange-400 hover:text-orange-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.vulnerabilityCount}
            </div>
            <div className="text-gray-200 font-medium">Vulnerabilidades Cuánticas</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-orange-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, data?.vulnerabilityCount * 10)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-green-900/60 via-green-800/50 to-green-900/60 backdrop-blur-2xl border border-green-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">📋</div>
              <button
                onClick={() => handleExplain('auditCompliance', data?.auditCompliance)}
                className="text-green-400 hover:text-green-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.auditCompliance}%
            </div>
            <div className="text-gray-200 font-medium">Cumplimiento Probabilístico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-green-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.auditCompliance}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-blue-900/60 backdrop-blur-2xl border border-blue-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">⚡</div>
              <button
                onClick={() => handleExplain('threatDetection', data?.threatDetection)}
                className="text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.threatDetection}%
            </div>
            <div className="text-gray-200 font-medium">Detección de Amenazas</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-blue-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.threatDetection}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Security Posture Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-2xl border border-gray-500/40 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-pulse">🔮</span> Postura de Seguridad Cuántica
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={securityPostureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {securityPostureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.6)'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vulnerability Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-2xl border border-gray-500/40 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-pulse">📊</span> Tendencia de Vulnerabilidades Probabilísticas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vulnerabilityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
                <XAxis dataKey="month" stroke="rgba(156, 163, 175, 0.7)" />
                <YAxis stroke="rgba(156, 163, 175, 0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="vulnerabilities"
                  stroke="rgba(239, 68, 68, 0.8)"
                  strokeWidth={3}
                  dot={{ fill: 'rgba(239, 68, 68, 0.8)', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'rgba(239, 68, 68, 1)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Security Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group relative bg-gradient-to-br from-red-900/50 via-red-800/40 to-red-900/50 backdrop-blur-2xl border border-red-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-4 flex items-center">
            <span className="mr-3 text-3xl animate-pulse">🔍</span> Radar de Seguridad Cuántica Integral
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={securityRadarData}>
                <PolarGrid stroke="rgba(55, 65, 81, 0.3)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(156, 163, 175, 0.8)' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(156, 163, 175, 0.8)' }} />
                <Radar
                  name="Security Score"
                  dataKey="score"
                  stroke="rgba(220, 38, 38, 0.8)"
                  fill="rgba(220, 38, 38, 0.2)"
                  fillOpacity={0.4}
                  strokeWidth={3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Security Operations Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60 backdrop-blur-2xl border border-gray-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-gray-500/10 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent mb-4 flex items-center">
            <span className="mr-3 text-3xl animate-pulse">🚨</span> Operaciones de Seguridad Cuántica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xl border border-red-400/30 rounded-xl p-4 hover:shadow-red-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-red-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">⚡</span> Tiempo Respuesta
                </div>
                <div className="text-white text-xl font-bold">{data?.incidentResponse}</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4 hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-blue-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🛡️</span> Protección Datos
                </div>
                <div className="text-white text-xl font-bold">{data?.dataProtection}%</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-green-900/40 via-green-800/30 to-green-900/40 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-green-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🔐</span> Control Acceso
                </div>
                <div className="text-white text-xl font-bold">{data?.accessControl}%</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-purple-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🧠</span> Conciencia Seguridad
                </div>
                <div className="text-white text-xl font-bold">{data?.securityAwareness}%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CSODashboard;