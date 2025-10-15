import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLiveState from '../hooks/useLiveState';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { BarChart3, TrendingUp, AlertTriangle, MapPin, Users, Activity, Zap, Shield } from 'lucide-react';

// Importar estilos Gemini
import '../styles/gemini.css';

interface DashboardData {
  kpis?: {
    precisionPromedio: number;
    prediccionesDiarias: number;
    monitoreoContinuo: number;
    coberturaRegional: number;
  };
  countries?: any[];
  communityResilience?: any;
  foodSecurity?: any;
  ethicalAssessment?: any;
  global?: any;
}

const Dashboard: React.FC = () => {
  const { data: liveState, loading, error, refresh } = useLiveState();
  const [activeTab, setActiveTab] = useState('overview');

  // Datos del backend
  const dashboardData: DashboardData = liveState || {};

  // KPIs principales
  const kpis = dashboardData.kpis || {
    precisionPromedio: 90,
    prediccionesDiarias: 120,
    monitoreoContinuo: 24,
    coberturaRegional: 6
  };

  // Componente de KPI Card
  const KPICard = ({ title, value, unit, icon: Icon, trend, color = 'primary' }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: any;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gemini-card gemini-fade-in"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gemini-text-secondary">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-gemini-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gemini-text-primary">
          {value}{unit}
        </div>
        {trend && (
          <p className="text-xs text-gemini-text-muted">
            {trend === 'up' && '↗️ +2.5%'}
            {trend === 'down' && '↘️ -1.2%'}
            {trend === 'stable' && '→ Estable'}
          </p>
        )}
      </CardContent>
    </motion.div>
  );

  // Componente de Widget de Riesgo
  const RiskWidget = ({ title, level, description, icon: Icon }: {
    title: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    icon: any;
  }) => {
    const levelColors = {
      low: 'success',
      medium: 'warning',
      high: 'error'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gemini-card"
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-gemini-${levelColors[level]}/10`}>
              <Icon className={`h-6 w-6 text-gemini-${levelColors[level]}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gemini-text-primary">{title}</h3>
              <p className="text-sm text-gemini-text-secondary">{description}</p>
              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-2 border-gemini-${levelColors[level]} text-gemini-${levelColors[level]}`}>
                Nivel {level === 'low' ? 'Bajo' : level === 'medium' ? 'Medio' : 'Alto'}
              </div>
            </div>
          </div>
        </CardContent>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gemini-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-gemini-primary/20 border-t-gemini-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-gemini-accent-yellow/20 border-t-gemini-accent-yellow rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-bold text-gemini-text-primary mb-2">Cargando Dashboard Soberano</h3>
          <p className="text-gemini-text-secondary">Estableciendo conexión con la realidad predictiva</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gemini-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gemini-card max-w-lg mx-auto"
        >
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-gemini-error mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gemini-text-primary mb-2">Error de Conexión</h3>
            <p className="text-gemini-text-secondary mb-4">{error}</p>
            <Button onClick={refresh} className="gemini-button-primary">
              Reintentar Conexión
            </Button>
          </CardContent>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gemini-background text-gemini-text-primary">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gemini-border bg-gemini-background-secondary/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gemini-text-primary">
                🏛️ Dashboard Soberano
              </h1>
              <p className="text-gemini-text-secondary">
                Visión predictiva con el alma de Gemini
              </p>
            </div>
            <Button onClick={refresh} variant="outline" className="border-gemini-border text-gemini-text-primary hover:bg-gemini-primary/10">
              <Activity className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Layout Bipartito */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <Card className="gemini-card">
                <CardHeader>
                  <CardTitle className="text-gemini-text-primary">Navegación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={activeTab === 'overview' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'overview'
                        ? 'bg-gemini-primary text-gemini-background'
                        : 'text-gemini-text-primary hover:bg-gemini-primary/10'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Visión General
                  </Button>
                  <Button
                    variant={activeTab === 'predictive' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'predictive'
                        ? 'bg-gemini-primary text-gemini-background'
                        : 'text-gemini-text-primary hover:bg-gemini-primary/10'
                    }`}
                    onClick={() => setActiveTab('predictive')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Análisis Predictivo
                  </Button>
                  <Button
                    variant={activeTab === 'risks' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'risks'
                        ? 'bg-gemini-primary text-gemini-background'
                        : 'text-gemini-text-primary hover:bg-gemini-primary/10'
                    }`}
                    onClick={() => setActiveTab('risks')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Evaluación de Riesgos
                  </Button>
                  <Button
                    variant={activeTab === 'logistics' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === 'logistics'
                        ? 'bg-gemini-primary text-gemini-background'
                        : 'text-gemini-text-primary hover:bg-gemini-primary/10'
                    }`}
                    onClick={() => setActiveTab('logistics')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Optimización Logística
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Panel de Contenido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* KPIs Principales */}
                  <div>
                    <h2 className="text-2xl font-bold text-gemini-text-primary mb-6">
                      📊 Indicadores Clave de Rendimiento
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <KPICard
                        title="Precisión Promedio"
                        value={kpis.precisionPromedio}
                        unit="%"
                        icon={Zap}
                        trend="up"
                        color="primary"
                      />
                      <KPICard
                        title="Predicciones Diarias"
                        value={kpis.prediccionesDiarias}
                        icon={Activity}
                        trend="up"
                        color="success"
                      />
                      <KPICard
                        title="Monitoreo Continuo"
                        value={kpis.monitoreoContinuo}
                        unit="h"
                        icon={Shield}
                        trend="stable"
                        color="warning"
                      />
                      <KPICard
                        title="Cobertura Regional"
                        value={kpis.coberturaRegional}
                        icon={MapPin}
                        trend="up"
                        color="primary"
                      />
                    </div>
                  </div>

                  {/* Estado General */}
                  <Card className="gemini-card">
                    <CardHeader>
                      <CardTitle className="text-gemini-text-primary">Estado del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gemini-text-secondary">Conectividad Backend</span>
                            <span className="text-gemini-success">100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gemini-text-secondary">Procesamiento de Datos</span>
                            <span className="text-gemini-success">95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gemini-text-secondary">Modelos Predictivos</span>
                            <span className="text-gemini-warning">87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'predictive' && (
                <motion.div
                  key="predictive"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold text-gemini-text-primary">
                    🔮 Análisis Predictivo
                  </h2>
                  <Card className="gemini-card">
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="h-16 w-16 text-gemini-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gemini-text-primary mb-2">
                        Motor Predictivo Activo
                      </h3>
                      <p className="text-gemini-text-secondary">
                        Procesando datos en tiempo real para generar predicciones precisas
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'risks' && (
                <motion.div
                  key="risks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold text-gemini-text-primary">
                    ⚠️ Evaluación de Riesgos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RiskWidget
                      title="Riesgo Sísmico"
                      level="medium"
                      description="Actividad moderada detectada en zona costera"
                      icon={AlertTriangle}
                    />
                    <RiskWidget
                      title="Riesgo Climático"
                      level="low"
                      description="Condiciones meteorológicas estables"
                      icon={Zap}
                    />
                    <RiskWidget
                      title="Riesgo Social"
                      level="low"
                      description="Estabilidad comunitaria mantenida"
                      icon={Users}
                    />
                    <RiskWidget
                      title="Riesgo Logístico"
                      level="high"
                      description="Interrupciones en cadena de suministro detectadas"
                      icon={MapPin}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'logistics' && (
                <motion.div
                  key="logistics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold text-gemini-text-primary">
                    🚛 Optimización Logística
                  </h2>
                  <Card className="gemini-card">
                    <CardContent className="p-8 text-center">
                      <MapPin className="h-16 w-16 text-gemini-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gemini-text-primary mb-2">
                        Sistema de Optimización Activo
                      </h3>
                      <p className="text-gemini-text-secondary">
                        Optimizando rutas y recursos para máxima eficiencia
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;