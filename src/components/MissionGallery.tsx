import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskReplay {
  id: string;
  title: string;
  description: string;
  fullText: string;
}

const taskReplays: TaskReplay[] = [
  {
    id: '1',
    title: 'Análisis de Mercado Colombia',
    description: 'Predicción de tendencias económicas',
    fullText: 'Iniciando análisis predictivo del mercado colombiano. Evaluando indicadores económicos clave: PIB, inflación y tasas de interés. Integrando datos de fuentes múltiples para generar pronósticos precisos con 90% de accuracy.'
  },
  {
    id: '2',
    title: 'Evaluación de Riesgos Perú',
    description: 'Análisis de estabilidad financiera',
    fullText: 'Ejecutando evaluación de riesgos financieros en proyectos peruanos. Analizando volatilidad del mercado, exposición crediticia y factores geopolíticos. Generando recomendaciones basadas en modelos predictivos avanzados.'
  },
  {
    id: '3',
    title: 'Monitoreo de Deforestación Brasil',
    description: 'Protección ambiental predictiva',
    fullText: 'Activando sistema de monitoreo predictivo para deforestación ilegal en la Amazonía. Utilizando datos satelitales, patrones históricos y algoritmos de machine learning para anticipar áreas de riesgo.'
  },
  {
    id: '4',
    title: 'Optimización Logística México',
    description: 'Eficiencia en cadena de suministro',
    fullText: 'Optimizando rutas logísticas en territorio mexicano. Analizando tráfico, condiciones climáticas y demanda de mercado para minimizar costos y maximizar eficiencia en la cadena de suministro.'
  }
];

const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

const MissionGallery: React.FC = () => {
  const [selectedReplay, setSelectedReplay] = useState<TaskReplay | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleReplaySelect = (replay: TaskReplay) => {
    setSelectedReplay(replay);
    setIsTyping(true);
    // Reset typing after completion
    setTimeout(() => setIsTyping(false), replay.fullText.length * 50 + 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {taskReplays.map((replay) => (
        <Card
          key={replay.id}
          className="bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => handleReplaySelect(replay)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{replay.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">{replay.description}</p>
          </CardContent>
        </Card>
      ))}

      {selectedReplay && (
        <div className="col-span-full mt-8">
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-xl">{selectedReplay.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg leading-relaxed font-mono">
                {isTyping ? (
                  <TypewriterText text={selectedReplay.fullText} />
                ) : (
                  selectedReplay.fullText
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MissionGallery;