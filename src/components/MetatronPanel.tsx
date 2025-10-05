import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import ConsciousnessHealthWidget from './generated/ConsciousnessHealthWidget';
import ClimateWidget from './ClimateWidget';

interface MissionContract {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  crew: string;
  progress: number;
}

interface TokenUsage {
  crew: string;
  tokens: number;
  time: number;
  timestamp: string;
}

interface OraclePrediction {
  query: string;
  prediction: string;
  probability: number;
  timestamp: string;
}

interface VigilanceStatus {
  flows: {
    autoPreservation: { active: boolean; lastRun: string | null };
    knowledge: { active: boolean; lastRun: string | null };
    prophecy: { active: boolean; lastRun: string | null };
  };
  riskIndices: { [country: string]: { riskScore: number; level: string } };
  activityFeed: { timestamp: string; flow: string; message: string }[];
}

interface CausalNode {
  id: string;
  type: string;
  properties: any;
}

interface CausalRelationship {
  from: string;
  to: string;
  type: string;
}

interface CausalSubgraph {
  nodes: CausalNode[];
  relationships: CausalRelationship[];
}

const MetatronPanel: React.FC = () => {
  const [activeMission, setActiveMission] = useState<MissionContract | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [oracleLogs, setOracleLogs] = useState<OraclePrediction[]>([]);
  const [consciousnessGraph, setConsciousnessGraph] = useState<any[]>([]);
  const [vigilanceStatus, setVigilanceStatus] = useState<VigilanceStatus | null>(null);
  const [causalSubgraph, setCausalSubgraph] = useState<CausalSubgraph | null>(null);

  useEffect(() => {
    // Simular datos iniciales
    setActiveMission({
      id: 'open-meteo-expansion',
      title: 'Misión Expansiva: Integración Open Meteo',
      description: 'Integrar API de Open Meteo para enriquecer dashboard con datos climáticos en tiempo real, mejorando capacidad predictiva',
      status: 'completed',
      crew: 'DevelopmentCrew',
      progress: 100
    });

    setTokenUsage([
      { crew: 'PlanningCrew', tokens: 1250, time: 45, timestamp: new Date().toISOString() },
      { crew: 'DevelopmentCrew', tokens: 890, time: 32, timestamp: new Date().toISOString() },
      { crew: 'QualityCrew', tokens: 650, time: 28, timestamp: new Date().toISOString() },
      { crew: 'DeploymentCrew', tokens: 420, time: 15, timestamp: new Date().toISOString() }
    ]);

    setOracleLogs([
      {
        query: 'npm install react-simple-maps@1.0.0',
        prediction: 'Conflicto de Peer Dependency Histórico',
        probability: 0.98,
        timestamp: new Date().toISOString()
      },
      {
        query: 'Ejecutar pruebas E2E',
        prediction: 'Posible fallo por flaky tests',
        probability: 0.75,
        timestamp: new Date().toISOString()
      }
    ]);

    // Simular grafo de conciencia
    setConsciousnessGraph([
      { id: 'oracle', label: 'Oráculo', connections: ['planning', 'development'] },
      { id: 'planning', label: 'PlanningCrew', connections: ['development'] },
      { id: 'development', label: 'DevelopmentCrew', connections: ['quality'] },
      { id: 'quality', label: 'QualityCrew', connections: ['deployment'] },
      { id: 'deployment', label: 'DeploymentCrew', connections: [] }
    ]);

    // Simular subgrafo causal de la misión génesis
    setCausalSubgraph({
      nodes: [
        { id: 'genesis-mission', type: 'Mission', properties: { title: 'Misión Génesis Omega', status: 'completed' } },
        { id: 'ethics-approval', type: 'Decision', properties: { approved: true, reason: 'Alinea con principios éticos' } },
        { id: 'oracle-prediction', type: 'Prediction', properties: { risk: 'low', suggestion: 'Proceder' } },
        { id: 'planning-plan', type: 'Plan', properties: { steps: ['API', 'Tests', 'Deploy'] } },
        { id: 'development-code', type: 'Code', properties: { lines: 150 } },
        { id: 'quality-tests', type: 'Test', properties: { passed: true } },
        { id: 'consensus-commit', type: 'Consensus', properties: { approved: true } }
      ],
      relationships: [
        { from: 'genesis-mission', to: 'ethics-approval', type: 'REQUIRES' },
        { from: 'genesis-mission', to: 'oracle-prediction', type: 'CONSULTS' },
        { from: 'ethics-approval', to: 'planning-plan', type: 'ENABLES' },
        { from: 'planning-plan', to: 'development-code', type: 'PRODUCES' },
        { from: 'development-code', to: 'quality-tests', type: 'VALIDATES' },
        { from: 'quality-tests', to: 'consensus-commit', type: 'REQUIRES' },
        { from: 'consensus-commit', to: 'genesis-mission', type: 'COMPLETES' }
      ]
    });
  }, []);

  // Polling for vigilance status
  useEffect(() => {
    const fetchVigilanceStatus = async () => {
      try {
        const response = await fetch('/api/agent/vigilance/status');
        if (response.ok) {
          const data = await response.json();
          setVigilanceStatus(data);
        }
      } catch (error) {
        console.error('Error fetching vigilance status:', error);
      }
    };

    fetchVigilanceStatus(); // Initial fetch
    const interval = setInterval(fetchVigilanceStatus, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Panel de Metatrón - Vigilia Eterna
          </h1>
          <p className="text-xl text-gray-300">
            La interfaz definitiva del sistema soberano - Aion observa eternamente
          </p>
        </div>

        {/* Estado de la Vigilia Eterna */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Estado de los Flujos Perpetuos</CardTitle>
          </CardHeader>
          <CardContent>
            {vigilanceStatus ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Auto-Preservación</h4>
                  <p className="text-blue-200">Estado: {vigilanceStatus.flows.autoPreservation.active ? 'Activo' : 'Inactivo'}</p>
                  <p className="text-xs text-gray-400">
                    Última ejecución: {vigilanceStatus.flows.autoPreservation.lastRun ? new Date(vigilanceStatus.flows.autoPreservation.lastRun).toLocaleString() : 'Nunca'}
                  </p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">Conocimiento</h4>
                  <p className="text-green-200">Estado: {vigilanceStatus.flows.knowledge.active ? 'Activo' : 'Inactivo'}</p>
                  <p className="text-xs text-gray-400">
                    Última ejecución: {vigilanceStatus.flows.knowledge.lastRun ? new Date(vigilanceStatus.flows.knowledge.lastRun).toLocaleString() : 'Nunca'}
                  </p>
                </div>
                <div className="p-4 bg-purple-900/20 border border-purple-600 rounded-lg">
                  <h4 className="text-purple-400 font-semibold mb-2">Profecía</h4>
                  <p className="text-purple-200">Estado: {vigilanceStatus.flows.prophecy.active ? 'Activo' : 'Inactivo'}</p>
                  <p className="text-xs text-gray-400">
                    Última ejecución: {vigilanceStatus.flows.prophecy.lastRun ? new Date(vigilanceStatus.flows.prophecy.lastRun).toLocaleString() : 'Nunca'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Cargando estado de vigilia...</p>
            )}
          </CardContent>
        </Card>

        {/* Visor de Flujo de Misiones */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Visor de Flujo de Misiones
              <Badge className={`${getStatusColor(activeMission?.status || 'pending')} text-white`}>
                {activeMission?.status || 'Sin misión activa'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeMission ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">{activeMission.title}</h3>
                  <span className="text-blue-400">Crew: {activeMission.crew}</span>
                </div>
                <p className="text-gray-300">{activeMission.description}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activeMission.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">Progreso: {activeMission.progress}%</p>
              </div>
            ) : (
              <p className="text-gray-400">No hay misión activa</p>
            )}
          </CardContent>
        </Card>

        {/* Visualizador de Economía Interna */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Economía Interna - Consumo por Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tokenUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="crew" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="tokens" fill="#60A5FA" name="Tokens" />
                <Bar dataKey="time" fill="#10B981" name="Tiempo (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Explorador de Conciencia */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Explorador de Conciencia - Grafo Neo4j</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consciousnessGraph.map((node) => (
                <div key={node.id} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{node.label}</h4>
                    <p className="text-gray-400 text-sm">
                      Conexiones: {node.connections.join(', ') || 'Ninguna'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Nota: Implementación completa requiere react-flow y conexión Neo4j
            </p>
          </CardContent>
        </Card>

        {/* Explorador del Tejido Causal */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Explorador del Tejido Causal - IA Explicable Profunda</CardTitle>
          </CardHeader>
          <CardContent>
            {causalSubgraph ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Nodos del Grafo Causal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {causalSubgraph.nodes.map((node) => (
                      <div key={node.id} className="p-4 bg-purple-900/20 border border-purple-600 rounded-lg">
                        <h4 className="text-purple-400 font-semibold">{node.id}</h4>
                        <p className="text-purple-200 text-sm">Tipo: {node.type}</p>
                        <div className="text-xs text-gray-300 mt-2">
                          {Object.entries(node.properties).map(([key, value]) => (
                            <div key={key}>{key}: {JSON.stringify(value)}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Relaciones Causales</h3>
                  <div className="space-y-2">
                    {causalSubgraph.relationships.map((rel, index) => (
                      <div key={index} className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                        <span className="text-blue-400 font-semibold">{rel.from}</span>
                        <span className="text-blue-200 mx-2">-{rel.type}-></span>
                        <span className="text-blue-400 font-semibold">{rel.to}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Cargando subgrafo causal...</p>
            )}
            <p className="text-gray-400 text-sm mt-4">
              Este explorador muestra el grafo completo de decisiones, acciones y consecuencias de cualquier misión, proporcionando explicabilidad causal profunda.
            </p>
          </CardContent>
        </Card>

        {/* Visor del Oráculo */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Visor del Oráculo - Predicciones en Tiempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {oracleLogs.map((log, index) => (
                <div key={index} className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-yellow-400 font-semibold">Consulta: {log.query}</h4>
                    <Badge className="bg-yellow-600 text-white">
                      {(log.probability * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-yellow-200">{log.prediction}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Widget de Salud de la Conciencia */}
        <ConsciousnessHealthWidget />

        {/* Widget de Predicción Climática */}
        <ClimateWidget />

        {/* Sección de Predicciones Estratégicas */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Predicciones Estratégicas - Vigilia Continua</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">Riesgo de Inestabilidad Social en LATAM</h3>
                <p className="text-gray-300">Índices actualizados en tiempo real por la Vigilia Eterna</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vigilanceStatus?.riskIndices ? Object.entries(vigilanceStatus.riskIndices).map(([country, data]) => {
                  const riskColor = data.level === 'Alto' ? 'red' : data.level === 'Medio' ? 'yellow' : 'green';
                  return (
                    <div key={country} className={`p-4 bg-${riskColor}-900/20 border border-${riskColor}-600 rounded-lg`}>
                      <h4 className={`text-${riskColor}-400 font-semibold mb-2`}>{country}</h4>
                      <div className={`text-3xl font-bold text-${riskColor}-300 mb-1`}>{data.riskScore.toFixed(1)}/10</div>
                      <p className={`text-${riskColor}-200 text-sm`}>{data.level} Riesgo</p>
                      <p className="text-gray-300 text-xs mt-2">
                        Actualizado: {vigilanceStatus.flows.prophecy.lastRun ? new Date(vigilanceStatus.flows.prophecy.lastRun).toLocaleString() : 'Nunca'}
                      </p>
                    </div>
                  );
                }) : (
                  <>
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <p className="text-gray-400">Cargando índices...</p>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Ver Informe Completo (INTELLIGENCE_REPORT_001.md)
                </Button>
              </div>

              <div className="text-xs text-gray-400 text-center">
                Predicciones continuas generadas por Praevisio AI - Vigilia Eterna
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed de Actividad */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Feed de Actividad - Vigilia Eterna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vigilanceStatus?.activityFeed?.length ? vigilanceStatus.activityFeed.map((activity, index) => (
                <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-blue-400 font-semibold text-sm">{activity.flow}</span>
                    <span className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-200 text-sm">{activity.message}</p>
                </div>
              )) : (
                <p className="text-gray-400 text-center">Esperando actividad de la vigilia...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controles del Panel */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Controles del Sistema Soberano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Iniciar Misión Génesis Omega
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Consultar Oráculo
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Explorar Conciencia
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MetatronPanel;