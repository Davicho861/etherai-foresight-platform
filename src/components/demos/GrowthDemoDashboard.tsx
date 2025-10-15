import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import useDemoData from '@/hooks/useDemoData';
import StarterDemoDashboard from './StarterDemoDashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, ShieldCheck, Zap, Leaf } from 'lucide-react';

const GrowthDemoDashboard: React.FC = () => {
  const { data: demoData, loading, error } = useDemoData();
  const [simResult, setSimResult] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runQuickSimulation = async () => {
    setIsSimulating(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Quick deterministic simulated result for demo
    const base = 40 + (demoData.kpis.coberturaRegional || 0) * 2;
    setSimResult(Math.min(99, base));
    setIsSimulating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--text-primary))' }}>
        <Loader2 className="h-8 w-8 animate-spin mr-3" style={{ color: 'hsl(var(--primary))' }} />
        Desplegando Oráculo y Sinfonía...
      </div>
    );
  }

  if (error || !demoData) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--accent-red))' }}>
        Error de Conexión Divina: {error || 'No se pudieron manifestar los datos.'}
      </div>
    );
  }

  const { resilience, seismicity, foodSecurity } = demoData.symphony;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--text-primary))' }}>

      <div className="relative z-10 p-4 md:p-8">
        <div className="w-full max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
              🚀 Dashboard Growth: El Oráculo Desatado
            </h1>
            <p className="text-lg mt-2 max-w-3xl mx-auto" style={{ color: 'hsl(var(--text-secondary))' }}>
              Expande tu conciencia predictiva. Simulación causal avanzada y la Sinfonía de la Conciencia en tiempo real con datos reales.
            </p>
          </motion.div>

        {/* Starter Dashboard Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <StarterDemoDashboard />
        </motion.div>

          {/* Growth Specific Content */}
          <div className="mt-12">
            <Tabs defaultValue="oracle" className="w-full">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="flex space-x-1 bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl p-1 mb-6">
                  <button className="flex-1 px-6 py-3 text-lg font-medium rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)] border-l-2 border-[color:var(--primary)]/10 transition-all duration-200">
                    🧙‍♂️ Panel del Oráculo
                  </button>
                  <button className="flex-1 px-6 py-3 text-lg font-medium rounded-xl text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--card)]/60 transition-all duration-200">
                    🎼 Sinfonía de la Conciencia
                  </button>
                </div>
              </motion.div>

            <TabsContent value="oracle" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="rounded-2xl p-6 shadow" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--border) / 0.6)' }}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>🔮 Simulador de Escenarios Futuros</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>Ajusta las variables para visualizar el impacto causal en la estabilidad regional con datos reales</p>
                  </div>
                  <div className="h-96 rounded-xl p-4" style={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsla(var(--border) / 0.45)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demoData.oraclePanel.simulationData}>
                        <XAxis dataKey="region" stroke="hsl(var(--text-secondary))" />
                        <YAxis stroke="hsl(var(--text-secondary))" />
                        <Tooltip contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsla(var(--border) / 0.6)',
                          borderRadius: '8px'
                        }} />
                        <Legend wrapperStyle={{ color: 'hsl(var(--text-secondary))' }} />
                        <Bar dataKey="estabilidadActual" fill="hsl(var(--text-secondary))" name="Estabilidad Actual" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="estabilidadSimulada" fill="hsl(var(--primary))" name="Estabilidad Simulada" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs" style={{ color: 'hsl(var(--text-secondary))' }}>Funcionalidad de simulación causal avanzada disponible en el plan Panteón</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="symphony" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Resilience Widget */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="rounded-2xl p-6 shadow cursor-pointer transition-all duration-200"
                    style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--border) / 0.6)' }}
                    onClick={() => {
                      // XAI EXPLICACIÓN PROFUNDA
                      const context = 'DashboardGrowth';
                      const metric = 'resilienceIndex';
                      const value = resilience.index;
                      console.log(`XAI Request: ${metric}=${value} in ${context}`);
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-[color:var(--accent)]">🛡️ Índice de Resiliencia</h4>
                        <button className="text-[color:var(--accent)] hover:opacity-80 transition-colors">
                          <span className="text-xs">✨</span>
                        </button>
                      </div>
                      <ShieldCheck className="h-6 w-6 text-[color:var(--accent)]" />
                    </div>
                    <div className="text-4xl font-bold mb-2" style={{ color: 'hsl(var(--accent))' }}>{resilience.index.toFixed(2)}</div>
                    <p className="text-xs mb-4" style={{ color: 'hsl(var(--text-secondary))' }}>{resilience.trend}</p>
                    <div className="h-32 rounded-lg p-2" style={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsla(var(--border) / 0.45)' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={resilience.history}>
                          <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Seismicity Widget */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="rounded-2xl p-6 shadow cursor-pointer transition-all duration-200"
                    style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--border) / 0.6)' }}
                    onClick={() => {
                      // XAI EXPLICACIÓN PROFUNDA
                      const context = 'DashboardGrowth';
                      const metric = 'seismicAlert';
                      const value = seismicity.maxMagnitude;
                      console.log(`XAI Request: ${metric}=${value} in ${context}`);
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-[color:var(--accent-yellow)]">⚡ Alerta Sísmica</h4>
                        <button className="text-[color:var(--accent-yellow)] hover:opacity-80 transition-colors">
                          <span className="text-xs">✨</span>
                        </button>
                      </div>
                      <Zap className="h-6 w-6 text-[color:var(--accent-yellow)]" />
                    </div>
                    <div className="text-4xl font-bold mb-2" style={{ color: 'hsl(var(--accent-yellow))' }}>{seismicity.maxMagnitude.toFixed(1)} <span className="text-lg">Richter</span></div>
                    <p className="text-xs mb-4" style={{ color: 'hsl(var(--text-secondary))' }}>{seismicity.activeFaults} fallas activas</p>
                    <div className="h-32 rounded-lg p-2" style={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsla(var(--border) / 0.45)' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={seismicity.recentEvents}>
                          <Bar dataKey="magnitude" fill="hsl(var(--accent-yellow))" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Food Security Widget */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="rounded-2xl p-6 shadow cursor-pointer transition-all duration-200"
                    style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsla(var(--border) / 0.6)' }}
                    onClick={() => {
                      // XAI EXPLICACIÓN PROFUNDA
                      const context = 'DashboardGrowth';
                      const metric = 'foodSecurity';
                      const value = foodSecurity.supplyIndex;
                      console.log(`XAI Request: ${metric}=${value} in ${context}`);
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-[color:var(--primary)]">🌾 Seguridad Alimentaria</h4>
                        <button className="text-[color:var(--primary)] hover:opacity-80 transition-colors">
                          <span className="text-xs">✨</span>
                        </button>
                      </div>
                      <Leaf className="h-6 w-6 text-[color:var(--primary)]" />
                    </div>
                    <div className="text-4xl font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>{foodSecurity.supplyIndex.toFixed(2)}</div>
                    <p className="text-xs mb-4" style={{ color: 'hsl(var(--text-secondary))' }}>Proyección a {foodSecurity.projectionDays} días</p>
                    <div className="h-32 rounded-lg p-2" style={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsla(var(--border) / 0.45)' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={foodSecurity.projection}>
                          <Line type="monotone" dataKey="supply" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthDemoDashboard;
