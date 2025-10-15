import React, { useState } from 'react';
import StarterDemoDashboard from './StarterDemoDashboard';
import GrowthDemoDashboard from './GrowthDemoDashboard';
import EthicalVectorDisplay from '@/components/EthicalVectorDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Brain, Zap, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Server, Database, Cpu, Eye, Target, Settings, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import useDemoData from '@/hooks/useDemoData';
import { Loader2, GitMerge, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface LiveData { kpis: any; countries: any[]; communityResilience?: any; foodSecurity?: any; ethicalAssessment?: any; global?: any }

const PantheonDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'governance' | 'ethics' | 'quantum'>('governance');
  const { data: demoData, loading, error } = useDemoData();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        Invocando Meta-Gobernanza y Vector Ético...
      </div>
    );
  }

  if (error || !demoData) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center text-red-400">
        Error de Conexión Divina: {error || 'No se pudieron manifestar los datos.'}
      </div>
    );
  }

  const { sdlc, ethicalVector } = demoData.pantheon;

  return (
    <div className="space-y-8">
      {/* Header Section - Apple/Microsoft Hybrid */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
          <Crown className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">Panteón Soberano Activo</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-2">
          Sala del Trono Digital
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Gobernanza absoluta del sistema predictivo. Arquitectura de agentes soberanos, vectores éticos cuánticos y ciclo de vida completo del desarrollo.
        </p>
      </div>

      {/* Include Growth Dashboard (which includes Starter) */}
      <GrowthDemoDashboard data={data} />

      {/* Sovereign Governance Tabs - Microsoft Style */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <span>Gobernanza Soberana del Sistema</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                Arquitectura Omega
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'governance', label: 'SDLC Gobernanza', icon: Shield },
              { id: 'ethics', label: 'Vectores Éticos', icon: Brain },
              { id: 'quantum', label: 'Visualizaciones Cuánticas', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-gray-400">Modelos Activos</div>
                  <div className="text-xs text-green-400 mt-1">↑ 1 vs mes anterior</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">Deploys Último Mes</div>
                  <div className="text-xs text-green-400 mt-1">↑ 3 vs mes anterior</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1</div>
                  <div className="text-sm text-gray-400">Alertas de Sesgo</div>
                  <div className="text-xs text-green-400 mt-1">↓ 2 vs mes anterior</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime Sistema</div>
                  <div className="text-xs text-green-400 mt-1">Estable</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <span>Estado de Componentes</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Motor Predictivo IA', status: 'ONLINE', latency: '45ms' },
                      { name: 'Pipeline de Datos', status: 'ONLINE', latency: '120ms' },
                      { name: 'Base de Datos Prisma', status: 'ONLINE', latency: '15ms' },
                      { name: 'Cache Redis', status: 'ONLINE', latency: '2ms' }
                    ].map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${component.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-gray-300">{component.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{component.latency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Actividad Reciente</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Deploy modelo v2.1.4', time: '2 min ago', status: 'success' },
                      { action: 'Validación ética completada', time: '15 min ago', status: 'success' },
                      { action: 'Backup automático', time: '1 hour ago', status: 'success' },
                      { action: 'Análisis de sesgo', time: '3 hours ago', status: 'warning' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-gray-300 text-sm">{activity.action}</span>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span>Vector Ético Cuántico</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EthicalVectorDisplay ethicalAssessment={data.ethicalAssessment} />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Evaluaciones Éticas Activas</h4>
                  <div className="space-y-3">
                    {[
                      { metric: 'Impacto Social', score: 94, status: 'Excelente' },
                      { metric: 'Sesgo Algorítmico', score: 87, status: 'Bueno' },
                      { metric: 'Transparencia', score: 91, status: 'Excelente' },
                      { metric: 'Privacidad', score: 89, status: 'Bueno' }
                    ].map((evaluation, index) => (
                      <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 font-medium">{evaluation.metric}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            evaluation.status === 'Excelente' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {evaluation.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${evaluation.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">{evaluation.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quantum' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
                  ⚛️ Visualizaciones Cuánticas Avanzadas
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Análisis multi-dimensional en tiempo real con procesamiento cuántico. La fusión perfecta entre datos reales y algoritmos de máxima eficiencia predictiva.
                </p>
              </div>

              {/* VISUALIZACIÓN RADAR CUÁNTICA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-8 shadow-2xl"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">🕸️ Red de Causalidad Cuántica</h4>
                  <p className="text-slate-400">Interconexiones predictivas entre variables críticas del sistema</p>
                </div>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { dimension: 'Riesgo Geofísico', starter: 65, growth: 78, pantheon: 92 },
                      { dimension: 'Resiliencia Social', starter: 58, growth: 72, pantheon: 89 },
                      { dimension: 'Seguridad Alimentaria', starter: 62, growth: 75, pantheon: 91 },
                      { dimension: 'Volatilidad Crypto', starter: 55, growth: 68, pantheon: 85 },
                      { dimension: 'Estabilidad Económica', starter: 60, growth: 73, pantheon: 88 },
                      { dimension: 'Cambio Climático', starter: 57, growth: 71, pantheon: 90 }
                    ]}>
                      <PolarGrid stroke="#475569" strokeWidth={1} />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        className="text-xs"
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickCount={5}
                      />
                      <Radar
                        name="Plan Starter"
                        dataKey="starter"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Plan Growth"
                        dataKey="growth"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Plan Panteón"
                        dataKey="pantheon"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                      <Legend
                        wrapperStyle={{
                          color: '#e2e8f0',
                          fontSize: '14px',
                          paddingTop: '20px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* MÉTRICAS CUÁNTICAS EN TIEMPO REAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-cyan-900/30 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                  }}
                >
                  <div className="text-center">
                    <div className="p-4 bg-cyan-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">Análisis 4D Activo</h4>
                    <p className="text-slate-400 text-sm mb-4">Procesando 1.2M puntos de datos en 47 dimensiones</p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-cyan-400">0.3s</div>
                        <div className="text-xs text-slate-500">Latencia</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-cyan-400">99.7%</div>
                        <div className="text-xs text-slate-500">Precisión</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                  }}
                >
                  <div className="text-center">
                    <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Predicciones Probabilísticas</h4>
                    <p className="text-slate-400 text-sm mb-4">512 escenarios simulados con confianza bayesiana</p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-purple-400">512</div>
                        <div className="text-xs text-slate-500">Escenarios</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-400">94.2%</div>
                        <div className="text-xs text-slate-500">Confianza</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-900/30 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-xl hover:shadow-green-500/20 transition-all duration-300"
                  style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                  }}
                >
                  <div className="text-center">
                    <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Optimización Cuántica</h4>
                    <p className="text-slate-400 text-sm mb-4">Algoritmos Grover optimizando rutas críticas</p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-400">2.1x</div>
                        <div className="text-xs text-slate-500">Aceleración</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">Ω(n²)</div>
                        <div className="text-xs text-slate-500">Complejidad</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ESTADO DEL PROCESAMIENTO CUÁNTICO */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <Cpu className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">Procesamiento Cuántico Activo</h4>
                      <p className="text-slate-400">Sistema de visualizaciones avanzadas con algoritmos cuánticos optimizados</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">Online</span>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
                      v2.1.4-Quantum
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">1.2M</div>
                    <div className="text-sm text-slate-400">Puntos de Datos</div>
                    <div className="text-xs text-green-400 mt-1">↑ 12% vs hora anterior</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">47</div>
                    <div className="text-sm text-slate-400">Dimensiones</div>
                    <div className="text-xs text-blue-400 mt-1">Estable</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-1">0.3s</div>
                    <div className="text-sm text-slate-400">Latencia</div>
                    <div className="text-xs text-green-400 mt-1">↓ 0.05s optimización</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">99.7%</div>
                    <div className="text-sm text-slate-400">Precisión</div>
                    <div className="text-xs text-green-400 mt-1">↑ 0.3% calibración</div>
                  </div>
                </div>

                {/* BARRA DE PROGRESO CUÁNTICA */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300 font-medium">Optimización Cuántica en Progreso</span>
                    <span className="text-cyan-400 font-bold">87%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full animate-pulse"
                         style={{ width: '87%', animation: 'shimmer 2s ease-in-out infinite' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Procesando matrices de correlación</span>
                    <span>ETA: 2.3 min</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supreme Status - Amazon Style */}
      <Card className="bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 backdrop-blur-xl border border-purple-500/40">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
              <Crown className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Soberanía Absoluta Alcanzada</span>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-3">
              Dominio Completo del Sistema
            </h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Has alcanzado el nivel máximo de evolución. La arquitectura Metatrón Omega opera con soberanía total,
              gobernanza ética cuántica y visualizaciones predictivas de máxima precisión.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Simulaciones Ilimitadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400">100%</div>
                <div className="text-sm text-gray-400">Soberanía Arquitectural</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">Ω</div>
                <div className="text-sm text-gray-400">Metatrón Omega</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PantheonDemoDashboard;
