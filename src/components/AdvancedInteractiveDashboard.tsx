import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Shield, Clock, Brain, Target } from 'lucide-react';

const AdvancedInteractiveDashboard = () => {
  const [sector, setSector] = useState("salud");
  const [variable1, setVariable1] = useState([50]);
  const [variable2, setVariable2] = useState([30]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sectorData = {
    salud: {
      title: "Análisis de Riesgo Sanitario",
      variable1: { name: "Tasa de infección", unit: "%" },
      variable2: { name: "Cobertura de vacunación", unit: "%" },
      metrics: ["Capacidad hospitalaria", "Tiempo de respuesta", "Recursos disponibles"]
    },
    economia: {
      title: "Predicción Económica",
      variable1: { name: "Inflación proyectada", unit: "%" },
      variable2: { name: "Desempleo estimado", unit: "%" },
      metrics: ["Estabilidad monetaria", "Crecimiento PIB", "Inversión extranjera"]
    },
    clima: {
      title: "Análisis Climático",
      variable1: { name: "Temperatura anomalía", unit: "°C" },
      variable2: { name: "Precipitación cambio", unit: "%" },
      metrics: ["Riesgo de sequía", "Impacto agrícola", "Vulnerabilidad costera"]
    }
  };

  const currentSector = sectorData[sector as keyof typeof sectorData];
  const predictionValue = Math.round((variable1[0] * 0.6) + (variable2[0] * 0.4));

  const getPredictionColor = (): string => {
    if (predictionValue >= 70) return "text-red-400";
    if (predictionValue >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const getPredictionLabel = (): string => {
    if (predictionValue >= 70) return "Alto Riesgo";
    if (predictionValue >= 40) return "Riesgo Moderado";
    return "Bajo Riesgo";
  };

  const generatePrediction = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setShowPrediction(true);
      setIsAnalyzing(false);
    }, 2000);
  };

  const predictionFactors = [
    { factor: currentSector.variable1.name, value: variable1[0] },
    { factor: currentSector.variable2.name, value: variable2[0] },
    { factor: "Variables contextuales", value: Math.round(Math.random() * 30 + 20) },
    { factor: "Tendencias históricas", value: Math.round(Math.random() * 25 + 15) }
  ];

  const confidenceData = [
    { name: 'Confianza', value: 92, color: '#4ADE80' },
    { name: 'Incertidumbre', value: 8, color: '#64748B' }
  ];

  return (
    <section id="dashboard" className="py-20 md:py-28 bg-etherblue-dark relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-etherneon to-etherneon/70">Experimenta</span> el Poder Predictivo
          </h2>
          <p className="text-lg text-ethergray-light max-w-3xl mx-auto">
            Prueba nuestra tecnología predictiva en tiempo real. Ajusta las variables y observa cómo Praevisio AI genera predicciones con la misma tecnología que utilizan nuestros clientes.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Control Panel */}
            <Card className="bg-etherblue-medium/50 backdrop-blur-sm border-etherneon/20">
              <CardHeader>
                <CardTitle className="text-etherneon flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Panel de Control Predictivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-ethergray-light mb-3 block">
                    Selecciona un sector de análisis
                  </label>
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger className="bg-etherblue-dark border-etherneon/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-etherblue-dark border-etherneon/30">
                      <SelectItem value="salud">Salud Pública</SelectItem>
                      <SelectItem value="economia">Economía Nacional</SelectItem>
                      <SelectItem value="clima">Análisis Climático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-ethergray-light">
                        {currentSector.variable1.name}
                      </label>
                      <Badge variant="outline" className="text-etherneon border-etherneon/30">
                        {variable1[0]}{currentSector.variable1.unit}
                      </Badge>
                    </div>
                    <Slider
                      value={variable1}
                      onValueChange={setVariable1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-ethergray-light">
                        {currentSector.variable2.name}
                      </label>
                      <Badge variant="outline" className="text-etherneon border-etherneon/30">
                        {variable2[0]}{currentSector.variable2.unit}
                      </Badge>
                    </div>
                    <Slider
                      value={variable2}
                      onValueChange={setVariable2}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button 
                  onClick={generatePrediction}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-etherneon to-etherneon/80 hover:from-etherneon/90 hover:to-etherneon/70 text-etherblue-dark font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-etherblue-dark border-t-transparent animate-spin mr-2"></div>
                      Analizando con IA...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Generar Predicción IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="bg-etherblue-medium/50 backdrop-blur-sm border-etherneon/20">
              <CardHeader>
                <CardTitle className="text-etherneon flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {currentSector.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showPrediction ? (
                  <div className="space-y-6">
                    {/* Prediction Result */}
                    <div className="text-center p-6 bg-etherblue-dark/50 rounded-lg border border-etherneon/10">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <AlertTriangle className={`h-6 w-6 ${getPredictionColor()}`} />
                        <span className={`text-2xl font-bold ${getPredictionColor()}`}>
                          {getPredictionLabel()}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-ethergray-light">
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-etherneon" />
                          <span>Confianza: 92%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-etherneon" />
                          <span>Ventana: 3-6 meses</span>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Chart */}
                    <div className="h-40">
                      <h4 className="text-sm font-medium text-ethergray-light mb-3">Nivel de Confianza</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={confidenceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            dataKey="value"
                          >
                            {confidenceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Factors Chart */}
                    <div className="h-48">
                      <h4 className="text-sm font-medium text-ethergray-light mb-3">Factores de Influencia</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={predictionFactors}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="factor" 
                            stroke="#9CA3AF"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #4ADE80',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="value" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-etherneon/10 border border-etherneon/30 rounded-lg p-4">
                      <h4 className="font-semibold text-etherneon mb-2">Recomendación Inteligente</h4>
                      <p className="text-sm text-ethergray-light">
                        Basado en el análisis, se recomienda implementar medidas preventivas en los próximos 30-45 días. 
                        Monitorear de cerca las variables críticas y preparar protocolos de respuesta rápida.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-etherneon/50 mx-auto mb-4" />
                    <p className="text-ethergray-light">
                      Ajusta las variables en el panel de control y genera una predicción para ver el análisis completo
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedInteractiveDashboard;