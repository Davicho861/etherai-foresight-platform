
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

type PredictionData = {
  factor: string;
  value: number;
};

const InteractiveDashboard: React.FC = () => {
  const [sector, setSector] = useState("salud");
  const [variable1, setVariable1] = useState(50);
  const [variable2, setVariable2] = useState(30);
  const [showPrediction, setShowPrediction] = useState(false);

  // Datos para los diferentes sectores con mejores ejemplos específicos
  const sectorData = {
    salud: {
      title: "Predicción de Brote Epidémico",
      variable1Name: "Tasa de infección",
      variable2Name: "Cobertura de vacunación",
      result: "Probabilidad de brote epidémico en 3 meses",
      explanation: "El modelo predice una probabilidad moderada de brote debido a la combinación de la tasa de infección actual y la cobertura insuficiente de vacunación, especialmente en zonas urbanas densamente pobladas.",
      caseStudy: "En 2023, predijimos un brote de dengue en Colombia con 5 meses de antelación, permitiendo al Ministerio de Salud implementar medidas preventivas que salvaron miles de vidas.",
      confidence: 87,
      data: [
        { factor: "Clima", value: 35 },
        { factor: "Migraciones", value: 25 },
        { factor: "Histórico", value: 40 }
      ]
    },
    economia: {
      title: "Predicción de Recesión Económica",
      variable1Name: "Índice de desempleo",
      variable2Name: "Inflación",
      result: "Probabilidad de recesión en 6 meses",
      explanation: "El modelo indica un riesgo elevado de recesión basado en el aumento sostenido del desempleo combinado con presiones inflacionarias, agravado por tensiones en mercados internacionales.",
      caseStudy: "Anticipamos una caída del 15% en ventas del sector retail en 2024, permitiendo a una cadena internacional ajustar su producción y ahorrar $5 millones en costos operativos.",
      confidence: 83,
      data: [
        { factor: "Mercados", value: 45 },
        { factor: "Política", value: 30 },
        { factor: "Global", value: 25 }
      ]
    },
    clima: {
      title: "Predicción de Desastre Natural",
      variable1Name: "Temperatura promedio",
      variable2Name: "Nivel de precipitación",
      result: "Probabilidad de inundaciones en 2 meses",
      explanation: "Las condiciones actuales apuntan a un riesgo significativo de inundaciones en zonas costeras y ribereñas debido a la combinación de temperaturas elevadas que aceleran el deshielo y niveles de precipitación por encima de la media.",
      caseStudy: "Detectamos un riesgo de sequía en África Oriental con 4 meses de anticipación, permitiendo a una ONG internacional movilizar agua y alimentos para 10,000 personas vulnerables.",
      confidence: 91,
      data: [
        { factor: "Histórico", value: 30 },
        { factor: "Oceanografía", value: 40 },
        { factor: "Meteorología", value: 30 }
      ]
    }
  };

  // Obtener los datos del sector seleccionado
  const currentSector = sector === "salud" ? sectorData.salud : 
                        sector === "economia" ? sectorData.economia : sectorData.clima;
  
  // Calcular el resultado basado en las variables (simulado)
  const predictionValue = Math.round((variable1 * 0.6) + (variable2 * 0.4));
  
  // Ajustar los colores basados en la predicción
  const getPredictionColor = () => {
    if (predictionValue < 30) return "text-green-400";
    if (predictionValue < 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getPredictionLabel = () => {
    if (predictionValue < 30) return "Bajo";
    if (predictionValue < 70) return "Moderado";
    return "Alto";
  };

  return (
    <div className="bg-etherblue-dark rounded-xl border border-white/10 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6">Dashboard Interactivo: Predicciones en Tiempo Real</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-ethergray-light mb-2">Selecciona un sector</label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="w-full bg-etherblue border-white/10">
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent className="bg-etherblue border-white/10">
                <SelectItem value="salud">Salud</SelectItem>
                <SelectItem value="economia">Economía</SelectItem>
                <SelectItem value="clima">Clima</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-ethergray-light mb-2">
              {currentSector.variable1Name} ({variable1}%)
            </label>
            <Slider 
              value={[variable1]} 
              min={0}
              max={100}
              step={1}
              onValueChange={(vals) => setVariable1(vals[0])}
              className="my-4"
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-ethergray-light mb-2">
              {currentSector.variable2Name} ({variable2}%)
            </label>
            <Slider 
              value={[variable2]} 
              min={0}
              max={100}
              step={1}
              onValueChange={(vals) => setVariable2(vals[0])}
              className="my-4"
            />
          </div>
        </div>
        
        <div className="flex justify-center mb-8">
          <Button 
            className="bg-etherneon hover:bg-etherneon/80 text-etherblue-dark"
            onClick={() => setShowPrediction(true)}
          >
            Generar Predicción
          </Button>
        </div>
        
        {showPrediction && (
          <div className="bg-etherblue rounded-lg p-6 border border-white/10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-bold mb-1">{currentSector.title}</h4>
                <p className="text-sm text-ethergray-light">{currentSector.result}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-etherneon/10 text-etherneon text-sm">
                  Confianza: {currentSector.confidence}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nivel de riesgo</span>
                    <span className={getPredictionColor()}>{getPredictionLabel()}</span>
                  </div>
                  <div className="h-2 bg-ethergray-light/20 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        predictionValue < 30 ? 'bg-green-400' : 
                        predictionValue < 70 ? 'bg-yellow-400' : 'bg-red-400'
                      }`} 
                      style={{width: `${predictionValue}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-etherblue-dark p-4 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between">
                    <h5 className="font-medium mb-3">Explicación IA</h5>
                    <div className="bg-etherneon/10 text-etherneon text-xs px-2 py-1 rounded">IA Explicable</div>
                  </div>
                  <p className="text-sm text-ethergray-light mb-4">{currentSector.explanation}</p>
                  
                  <div className="mb-3">
                    <h6 className="text-xs font-medium text-ethergray-light mb-2">Factores de predicción</h6>
                    <div className="space-y-2">
                      {currentSector.data.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-20 text-xs">{item.factor}</span>
                          <div className="flex-1 h-2 bg-ethergray-light/20 rounded-full ml-2">
                            <div 
                              className={`h-full rounded-full ${
                                index % 3 === 0 ? 'bg-blue-400' : 
                                index % 3 === 1 ? 'bg-purple-400' : 'bg-orange-400'
                              }`}
                              style={{width: `${item.value}%`}}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-etherneon/5 border border-etherneon/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-etherneon mr-2" />
                      <h6 className="text-xs font-medium text-etherneon">Caso de éxito</h6>
                    </div>
                    <p className="text-xs text-ethergray-light">{currentSector.caseStudy}</p>
                  </div>
                </div>
              </div>
              
              <div className="h-64 md:h-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentSector.data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="factor" tick={{ fill: '#A0AEC0' }} />
                    <YAxis tick={{ fill: '#A0AEC0' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568', color: '#A0AEC0' }} 
                    />
                    <Bar dataKey="value" fill="#4ADE80" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                className="border-etherneon text-etherneon hover:bg-etherneon/10"
              >
                Ver Solución Personalizada para {sector === "salud" ? "Salud" : sector === "economia" ? "Economía" : "Clima"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveDashboard;
