import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EthicalVector {
  vector: [number, number, number]; // [humanImpact, environmentalSustainability, socialEquity]
  overallScore: number;
  assessment: string;
  timestamp: string;
}

interface EthicalAssessmentResponse {
  success: boolean;
  data: EthicalVector;
}

const EthicalVectorDisplay: React.FC = () => {
  const [ethicalData, setEthicalData] = useState<EthicalVector | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('praevisio_token') || 'demo-token';
        const response = await fetch('/api/ethical-assessment', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: EthicalAssessmentResponse = await response.json();
          setEthicalData(data.data);
        } else {
          throw new Error('Failed to fetch ethical assessment');
        }
      } catch (err) {
        console.error('Error fetching ethical assessment:', err);
        setError('Error al cargar evaluación ética');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAssessmentColor = (assessment: string) => {
    if (assessment.includes('Low')) return 'text-green-400';
    if (assessment.includes('Medium')) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-300">Cargando evaluación ética...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !ethicalData) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-400">{error || 'No hay datos éticos disponibles'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [humanImpact, environmentalSustainability, socialEquity] = ethicalData.vector;

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Vector Ético - IA Explicable</CardTitle>
        <p className="text-gray-400 text-sm">
          Evaluación ética de la última predicción importante
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Última actualización: {new Date(ethicalData.timestamp).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Assessment */}
        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
          <div className={`text-4xl font-bold ${getAssessmentColor(ethicalData.assessment)}`}>
            {ethicalData.overallScore.toFixed(1)}%
          </div>
          <div className={`text-lg font-semibold ${getAssessmentColor(ethicalData.assessment)}`}>
            {ethicalData.assessment}
          </div>
          <p className="text-gray-400 text-sm mt-1">Puntuación Ética General</p>
        </div>

        {/* Ethical Vector Components */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Impacto Humano</span>
              <span className={`font-bold ${getScoreColor(humanImpact)}`}>
                {humanImpact.toFixed(1)}%
              </span>
            </div>
            <Progress value={humanImpact} className="h-3" />
            <p className="text-xs text-gray-400 mt-1">
              Evaluación del impacto potencial en poblaciones humanas
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Sostenibilidad Ambiental</span>
              <span className={`font-bold ${getScoreColor(environmentalSustainability)}`}>
                {environmentalSustainability.toFixed(1)}%
              </span>
            </div>
            <Progress value={environmentalSustainability} className="h-3" />
            <p className="text-xs text-gray-400 mt-1">
              Medida de sostenibilidad y respeto al medio ambiente
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Equidad Social</span>
              <span className={`font-bold ${getScoreColor(socialEquity)}`}>
                {socialEquity.toFixed(1)}%
              </span>
            </div>
            <Progress value={socialEquity} className="h-3" />
            <p className="text-xs text-gray-400 mt-1">
              Evaluación de equidad en la distribución de riesgos y beneficios
            </p>
          </div>
        </div>

        {/* Vector Visualization */}
        <div className="p-4 bg-gray-700/30 rounded-lg">
          <h4 className="text-white font-semibold mb-3">Vector Ético Completo</h4>
          <div className="flex items-end justify-center space-x-2 h-20">
            <div className="flex flex-col items-center">
              <div
                className="w-8 bg-red-500 rounded-t"
                style={{ height: `${humanImpact * 0.8}px` }}
              ></div>
              <span className="text-xs text-gray-400 mt-1">Humano</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 bg-green-500 rounded-t"
                style={{ height: `${environmentalSustainability * 0.8}px` }}
              ></div>
              <span className="text-xs text-gray-400 mt-1">Ambiental</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 bg-blue-500 rounded-t"
                style={{ height: `${socialEquity * 0.8}px` }}
              ></div>
              <span className="text-xs text-gray-400 mt-1">Social</span>
            </div>
          </div>
        </div>

        {/* Ethical Guidelines */}
        <div className="text-xs text-gray-400 space-y-1">
          <p><strong>Directrices Éticas:</strong></p>
          <p>• Impacto Humano: Prioriza la reducción de riesgos para poblaciones vulnerables</p>
          <p>• Sostenibilidad Ambiental: Minimiza el impacto ecológico de las predicciones</p>
          <p>• Equidad Social: Asegura distribución justa de beneficios y riesgos</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EthicalVectorDisplay;