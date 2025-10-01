import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface FinalReport {
  summary: string;
  aiExplanation: string;
  weights: { [key: string]: number };
  dataSources: string[];
}

const countryData = {
  ARG: { name: 'Argentina', flag: '🇦🇷', population: 45000000, gdp: 450000, stability: 6.5 },
  COL: { name: 'Colombia', flag: '🇨🇴', population: 50000000, gdp: 330000, stability: 5.8 },
  PER: { name: 'Perú', flag: '🇵🇪', population: 33000000, gdp: 230000, stability: 6.2 },
  BRA: { name: 'Brasil', flag: '🇧🇷', population: 215000000, gdp: 1800000, stability: 7.1 },
  EGY: { name: 'Egipto', flag: '🇪🇬', population: 104000000, gdp: 400000, stability: 5.5 },
  USA: { name: 'Estados Unidos', flag: '🇺🇸', population: 331000000, gdp: 21000000, stability: 8.5 },
  CHN: { name: 'China', flag: '🇨🇳', population: 1400000000, gdp: 14300000, stability: 7.8 },
  DEU: { name: 'Alemania', flag: '🇩🇪', population: 83000000, gdp: 3800000, stability: 8.9 },
  JPN: { name: 'Japón', flag: '🇯🇵', population: 126000000, gdp: 4900000, stability: 8.7 },
  MEX: { name: 'México', flag: '🇲🇽', population: 128000000, gdp: 1300000, stability: 6.8 },
  CHL: { name: 'Chile', flag: '🇨🇱', population: 19000000, gdp: 300000, stability: 7.5 },
  ECU: { name: 'Ecuador', flag: '🇪🇨', population: 18000000, gdp: 110000, stability: 6.0 },
  PAN: { name: 'Panamá', flag: '🇵🇦', population: 4300000, gdp: 67000, stability: 7.2 },
  CRI: { name: 'Costa Rica', flag: '🇨🇷', population: 5100000, gdp: 64000, stability: 8.0 },
  URY: { name: 'Uruguay', flag: '🇺🇾', population: 3500000, gdp: 56000, stability: 8.1 },
  PRY: { name: 'Paraguay', flag: '🇵🇾', population: 7100000, gdp: 40000, stability: 6.9 },
  BOL: { name: 'Bolivia', flag: '🇧🇴', population: 12000000, gdp: 43000, stability: 5.9 },
  VEN: { name: 'Venezuela', flag: '🇻🇪', population: 28000000, gdp: 48000, stability: 3.5 },
  GTM: { name: 'Guatemala', flag: '🇬🇹', population: 18000000, gdp: 77000, stability: 6.3 },
  SLV: { name: 'El Salvador', flag: '🇸🇻', population: 6500000, gdp: 27000, stability: 6.5 },
  HND: { name: 'Honduras', flag: '🇭🇳', population: 10000000, gdp: 25000, stability: 5.7 },
  NIC: { name: 'Nicaragua', flag: '🇳🇮', population: 6600000, gdp: 13000, stability: 5.4 },
  BLZ: { name: 'Belice', flag: '🇧🇿', population: 400000, gdp: 1800, stability: 7.0 },
  CAN: { name: 'Canadá', flag: '🇨🇦', population: 38000000, gdp: 1700000, stability: 9.0 },
  ESP: { name: 'España', flag: '🇪🇸', population: 47000000, gdp: 1300000, stability: 7.8 },
  FRA: { name: 'Francia', flag: '🇫🇷', population: 67000000, gdp: 2600000, stability: 7.9 }
};

const accessLevels = {
  public: ['ARG', 'COL', 'PER', 'BRA', 'EGY'],
  corporate: ['ARG', 'COL', 'PER', 'BRA', 'MEX', 'CHL', 'ECU', 'PAN', 'CRI', 'URY', 'PRY', 'BOL', 'VEN', 'GTM', 'SLV', 'DEU', 'JPN'],
  state: ['ARG', 'COL', 'PER', 'BRA', 'MEX', 'CHL', 'ECU', 'PAN', 'CRI', 'URY', 'PRY', 'BOL', 'VEN', 'GTM', 'SLV', 'HND', 'NIC', 'BLZ', 'USA', 'CAN', 'ESP', 'FRA', 'CHN']
};

const missionsByLevel = {
  public: {
    ARG: { id: 'climate-change', title: 'Cambio Climático', description: 'Analizar impactos del cambio climático en Argentina' },
    COL: { id: 'social-stability', title: 'Estabilidad Social', description: 'Evaluar estabilidad social en Colombia' },
    PER: { id: 'social-development', title: 'Desarrollo Social', description: 'Analizar desarrollo social en Perú' },
    BRA: { id: 'deforestation-monitoring', title: 'Monitoreo de Deforestación', description: 'Monitoreo Predictivo de Deforestación Ilegal en el Amazonas' },
    EGY: { id: 'nile-agriculture', title: 'Impacto del Nilo en Agricultura', description: 'Predicción de Impacto del Nivel del Nilo en la Agricultura Nacional' }
  },
  corporate: {
    ARG: { id: 'market-analysis', title: 'Análisis de Mercado', description: 'Analizar tendencias del mercado argentino para inversiones' },
    COL: { id: 'sales-prediction', title: 'Predicción de Ventas', description: 'Predecir ventas futuras basadas en datos históricos' },
    PER: { id: 'risk-assessment', title: 'Evaluación de Riesgos', description: 'Evaluar riesgos financieros en proyectos' },
    BRA: { id: 'supply-chain', title: 'Cadena de Suministro', description: 'Analizar riesgos en cadena de suministro brasileña' },
    MEX: { id: 'logistics-optimization', title: 'Optimización Logística', description: 'Optimizar logística en México' },
    CHL: { id: 'market-entry', title: 'Entrada al Mercado', description: 'Evaluar entrada al mercado chileno' },
    ECU: { id: 'trade-risks', title: 'Riesgos Comerciales', description: 'Analizar riesgos comerciales en Ecuador' },
    PAN: { id: 'infrastructure-impact', title: 'Impacto Infraestructura', description: 'Evaluar impacto de infraestructura en Panamá' },
    CRI: { id: 'economic-forecast', title: 'Pronóstico Económico', description: 'Pronosticar economía costarricense' },
    URY: { id: 'investment-opportunities', title: 'Oportunidades de Inversión', description: 'Identificar oportunidades de inversión en Uruguay' },
    PRY: { id: 'market-expansion', title: 'Expansión de Mercado', description: 'Analizar expansión de mercado en Paraguay' },
    BOL: { id: 'supply-disruption', title: 'Disrupción de Suministro', description: 'Evaluar disrupciones en suministro boliviano' },
    VEN: { id: 'market-volatility', title: 'Volatilidad de Mercado', description: 'Analizar volatilidad de mercado venezolano' },
    GTM: { id: 'logistics-network', title: 'Red Logística', description: 'Optimizar red logística en Guatemala' },
    SLV: { id: 'trade-partners', title: 'Socios Comerciales', description: 'Analizar socios comerciales en El Salvador' },
    DEU: { id: 'semiconductor-supply', title: 'Cadena de Suministro Semiconductores', description: 'Riesgo en la Cadena de Suministro de Semiconductores por Inestabilidad en Taiwán' },
    JPN: { id: 'yen-fluctuations', title: 'Fluctuaciones del Yen', description: 'Anticipación de Fluctuaciones del Yen por Políticas del Banco Central' }
  },
  state: {
    ARG: { id: 'national-security', title: 'Seguridad Nacional', description: 'Evaluar amenazas a la seguridad nacional en Argentina' },
    COL: { id: 'social-instability-alert', title: 'Alerta de Inestabilidad Social', description: 'Monitorear alertas de inestabilidad social en Colombia' },
    PER: { id: 'humanitarian-crisis', title: 'Crisis Humanitaria', description: 'Monitorear crisis humanitarias en Perú' },
    BRA: { id: 'regional-security', title: 'Seguridad Regional', description: 'Evaluar seguridad regional en Brasil' },
    MEX: { id: 'border-security', title: 'Seguridad Fronteriza', description: 'Analizar seguridad fronteriza en México' },
    CHL: { id: 'international-relations', title: 'Relaciones Internacionales', description: 'Evaluar relaciones internacionales de Chile' },
    ECU: { id: 'sovereignty-threats', title: 'Amenazas a la Soberanía', description: 'Monitorear amenazas a la soberanía ecuatoriana' },
    PAN: { id: 'strategic-positioning', title: 'Posicionamiento Estratégico', description: 'Analizar posicionamiento estratégico de Panamá' },
    CRI: { id: 'diplomatic-tensions', title: 'Tensiones Diplomáticas', description: 'Evaluar tensiones diplomáticas en Costa Rica' },
    URY: { id: 'regional-influence', title: 'Influencia Regional', description: 'Analizar influencia regional de Uruguay' },
    PRY: { id: 'border-conflicts', title: 'Conflictos Fronterizos', description: 'Monitorear conflictos fronterizos en Paraguay' },
    BOL: { id: 'resource-security', title: 'Seguridad de Recursos', description: 'Evaluar seguridad de recursos en Bolivia' },
    VEN: { id: 'political-instability', title: 'Inestabilidad Política', description: 'Analizar inestabilidad política en Venezuela' },
    GTM: { id: 'internal-security', title: 'Seguridad Interna', description: 'Monitorear seguridad interna en Guatemala' },
    SLV: { id: 'regional-alliances', title: 'Alianzas Regionales', description: 'Evaluar alianzas regionales de El Salvador' },
    HND: { id: 'migration-crisis', title: 'Crisis Migratoria', description: 'Analizar crisis migratoria en Honduras' },
    NIC: { id: 'political-transition', title: 'Transición Política', description: 'Evaluar transición política en Nicaragua' },
    BLZ: { id: 'territorial-disputes', title: 'Disputas Territoriales', description: 'Monitorear disputas territoriales en Belice' },
    USA: { id: 'cyber-threats', title: 'Ciberataques a Infraestructura', description: 'Predicción de Ciberataques a Infraestructura Eléctrica Nacional' },
    CAN: { id: 'north-america-security', title: 'Seguridad Norteamérica', description: 'Evaluar seguridad en Norteamérica' },
    ESP: { id: 'colonial-legacy', title: 'Legado Colonial', description: 'Analizar legado colonial en España' },
    FRA: { id: 'european-stability', title: 'Estabilidad Europea', description: 'Monitorear estabilidad europea' },
    CHN: { id: 'south-china-sea', title: 'Tensiones en Mar de China Meridional', description: 'Análisis Predictivo de Tensiones Geopolíticas en el Mar de China Meridional' }
  }
};

const DemoPage: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<'public' | 'corporate' | 'state'>('public');
  const eventSourceRef = useRef<EventSource | null>(null);

  const demoMissions = [
    { id: 'market-analysis', title: 'Análisis de Mercado', description: 'Analizar tendencias del mercado colombiano para inversiones' },
    { id: 'sales-prediction', title: 'Predicción de Ventas', description: 'Predecir ventas futuras basadas en datos históricos' },
    { id: 'risk-assessment', title: 'Evaluación de Riesgos', description: 'Evaluar riesgos financieros en proyectos' },
    { id: 'competitor-analysis', title: 'Análisis de Competidores', description: 'Analizar estrategias de competidores en el sector' },
  ];

  const startMission = async (mission: typeof demoMissions[0]) => {
    setSelectedMission(mission.id);
    setTasks([]);
    setFinalReport(null);
    setIsStreaming(true);

    // Determine API base in a robust way:
    // 1) import.meta.env (Vite), 2) globalThis.VITE_API_BASE_URL (runtime injection),
    // 3) default to localhost:4000
    const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';

    // normalize: remove trailing slash if present
    const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;

    // Always use absolute URL to prevent requests being routed to the frontend dev server
    const url = `${base}/api/agent/start-mission`;

    // Misiones reales: usar API
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: mission.description }),
      });
      const data = await response.json();
      setMissionId(data.missionId);
    } catch (error) {
      console.error('Error starting mission:', error);
      setTasks([{ id: 'error', description: 'Error al iniciar la misión', status: 'completed' }]);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (missionId) {
      // Determine API base in a robust way:
      // 1) import.meta.env (Vite), 2) globalThis.VITE_API_BASE_URL (runtime injection),
      // 3) default to localhost:4000
      const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
      const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
      const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';

      // normalize: remove trailing slash if present
      const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;

      // Always use absolute URL to prevent requests being routed to the frontend dev server
      const streamUrl = `${base}/api/agent/mission/${missionId}/stream`;

      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.tasks) {
          setTasks(data.tasks);
        } else if (data.status === 'completed') {
          setIsStreaming(false);
          if (data.result) {
            setFinalReport(data.result);
          }
          eventSource.close();
        } else if (data.error) {
          setTasks(prev => [...prev, { id: 'error', description: `Error: ${data.error}`, status: 'completed' }]);
          setIsStreaming(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setTasks(prev => [...prev, { id: 'error', description: 'Error en la conexión del stream', status: 'completed' }]);
        setIsStreaming(false);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [missionId]);

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Praevisio AI - Centro de Mando Predictivo</h1>

        {/* Streaming indicator and Selector de Nivel de Acceso */}
        {isStreaming && (
          <div className="text-center text-sm text-cyan-400 mb-4 animate-pulse">Procesamiento predictivo en curso…</div>
        )}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-1">
            <div className="flex space-x-1">
              {[
                { value: 'public', label: 'Público' },
                { value: 'corporate', label: 'Corporativo' },
                { value: 'state', label: 'Estado' }
              ].map(level => (
                <button
                  key={level.value}
                  onClick={() => setAccessLevel(level.value as 'public' | 'corporate' | 'state')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    accessLevel === level.value
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  data-testid={`access-level-${level.value}`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mapa Interactivo Global */}
        <div className="mb-8">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Mapa Predictivo Global</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(countryData).filter(([code]) => accessLevels[accessLevel].includes(code)).map(([code, country]) => (
                <Button
                  key={code}
                  onClick={() => {
                    setSelectedCountry(code);
                    setIsPanelOpen(true);
                  }}
                  className="p-3 bg-gray-700/50 hover:bg-cyan-600/50 border border-gray-600 hover:border-cyan-400 transition-all duration-200 rounded-lg"
                  data-country={code}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{country.flag}</div>
                    <div className="text-xs font-medium">{country.name}</div>
                    <div className="text-xs text-gray-400 mt-1">Estabilidad: {country.stability}/10</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>


        <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
          <SheetContent side="right" className="bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto border-l border-gray-700">
            <SheetHeader className="border-b border-gray-700 pb-4">
              <SheetTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Panel de Inteligencia Predictiva
              </SheetTitle>
              <div className="text-sm text-gray-400 mt-2">
                Nivel: {accessLevel === 'public' ? 'Público' : accessLevel === 'corporate' ? 'Corporativo' : 'Estado'} | País: {selectedCountry && countryData[selectedCountry as keyof typeof countryData]?.name}
              </div>
            </SheetHeader>
            <div className="mb-6 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
              {accessLevel === 'public' && 'Análisis predictivo enfocado en indicadores socioeconómicos y ambientales.'}
              {accessLevel === 'corporate' && 'Evaluación de riesgos comerciales, cadenas de suministro y oportunidades de mercado.'}
              {accessLevel === 'state' && 'Monitoreo de estabilidad geopolítica, seguridad nacional y respuesta a crisis.'}
            </div>

            {/* Información del País */}
            {selectedCountry && countryData[selectedCountry as keyof typeof countryData] && (
              <Card className="mb-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{countryData[selectedCountry as keyof typeof countryData].flag}</span>
                    <span className="text-lg">{countryData[selectedCountry as keyof typeof countryData].name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-xl font-bold text-cyan-400">{(countryData[selectedCountry as keyof typeof countryData].population / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-400">Población</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-xl font-bold text-green-400">${(countryData[selectedCountry as keyof typeof countryData].gdp / 1000).toFixed(0)}B</div>
                      <div className="text-xs text-gray-400">PIB</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-xl font-bold text-yellow-400">{countryData[selectedCountry as keyof typeof countryData].stability}/10</div>
                      <div className="text-xs text-gray-400">Estabilidad</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Misiones Disponibles */}
            {selectedCountry && missionsByLevel[accessLevel][selectedCountry as keyof typeof missionsByLevel[typeof accessLevel]] && (
              <Card className="mb-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Misiones de Alto Impacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(missionsByLevel[accessLevel]).filter(([code]) => code === selectedCountry).map(([code, mission]) => (
                      <Button key={code} onClick={() => startMission(mission)} variant="outline" className="w-full text-left p-4 bg-gray-700/50 hover:bg-cyan-600/30 border-gray-600 hover:border-cyan-400 text-white transition-all duration-200 rounded-lg">
                        <div>
                          <div className="font-semibold text-cyan-300">{mission.title}</div>
                          <div className="text-sm text-gray-300 mt-1">{mission.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="task-stream">
              <ScrollArea className="h-full">
                {/* Plan de Tareas Visual */}
                  {tasks.length > 0 && (
                  <Card className="mb-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Plan de Tareas Predictivas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/30">
                            {getTaskIcon(task.status)}
                            <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : task.status === 'in_progress' ? 'text-cyan-300' : 'text-gray-300'}`}>
                              {task.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Controles de Usuario */}
              {selectedMission && (
                <div className="flex space-x-4 mb-6">
                  <Button variant="outline" onClick={() => setFinalReport({ summary: 'Saltando a resultados...', aiExplanation: '', weights: {}, dataSources: [] })}>
                    Saltar a los resultados
                  </Button>
                  <Button variant="outline">
                    Hazlo tú mismo
                  </Button>
                </div>
              )}

              {/* Vista de Final Report */}
              {finalReport && (
                <div className="space-y-6">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Resumen Ejecutivo Predictivo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{finalReport.summary}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Explicación de la IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{finalReport.aiExplanation}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Ponderaciones del Modelo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {Object.entries(finalReport.weights).map(([key, value]) => (
                          <li key={key} className="flex justify-between p-2 bg-gray-700/30 rounded">
                            <span className="text-gray-300">{key}</span>
                            <span className="font-bold text-cyan-400">{(value * 100).toFixed(1)}%</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Fuentes de Datos Inteligentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {finalReport.dataSources.map((source, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <span className="text-gray-300">{source}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DemoPage;