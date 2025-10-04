import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import ConsciousnessHealthWidget from './generated/ConsciousnessHealthWidget';

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

const MetatronPanel: React.FC = () => {
  const [activeMission, setActiveMission] = useState<MissionContract | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [oracleLogs, setOracleLogs] = useState<OraclePrediction[]>([]);
  const [consciousnessGraph, setConsciousnessGraph] = useState<any[]>([]);

  useEffect(() => {
    // Simular datos iniciales
    setActiveMission({
      id: 'genesis-omega',
      title: 'Misión Génesis Omega',
      description: 'Principio de Auto-Suficiencia: Diseñar e implementar un nuevo Agente Guardián Tyche',
      status: 'running',
      crew: 'PlanningCrew',
      progress: 45
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
            Panel de Metatrón
          </h1>
          <p className="text-xl text-gray-300">
            La interfaz definitiva del sistema soberano
          </p>
        </div>

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