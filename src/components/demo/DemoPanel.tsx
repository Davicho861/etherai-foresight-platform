import React, { useEffect, useState } from 'react';
import AnimatedMetric from '@/components/AnimatedMetrics';
import SeismicMapWidget from '@/components/SeismicMapWidget';
import ConsciousnessHealthWidget from '@/components/generated/ConsciousnessHealthWidget';
import TaskReplayViewer from '@/components/TaskReplayViewer';
import MetatronPanelWidget from '@/components/metatron/MetatronPanelWidget';
import EthicalVectorDisplay from '@/components/EthicalVectorDisplay';
import ClimateWidget from '@/components/ClimateWidget';
import ProphecyWidget from '@/components/ProphecyWidget';
import MissionGallery from '@/components/MissionGallery';

const DemoPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'pantheon'>('starter');

  // Mock data for widgets
  const mockData = {
    kpis: {
      precision: 90,
      predictions: 120,
      monitoring: 24,
      coverage: 6
    },
    seismicData: [],
    ethicalAssessment: {
      success: true,
      data: {
        vector: [25, 70, 55],
        overallScore: 50,
        assessment: 'Medium Ethical Concern',
        timestamp: new Date().toISOString()
      },
      isMock: true
    }
  };

  useEffect(() => {
    let mounted = true;
    // Simulate fetching a prediction from backend
    setTimeout(() => {
      if (!mounted) return;
      setResult('Probabilidad de crisis alimentaria en PER: 12% (estimación)');
      setLoading(false);
    }, 600);
    return () => { mounted = false; };
  }, []);

  // Determine which widgets to show based on selectedPlan
  const widgetsForPlan = (plan: 'starter' | 'growth' | 'pantheon') => {
    switch (plan) {
      case 'starter':
        return {
          kpis: true,
          seismic: true,
          causal: false,
          taskReplays: false,
          simulation: false,
          ethical: false,
          predictive: false
        };
      case 'growth':
        return {
          kpis: true,
          seismic: true,
          causal: true,
          taskReplays: true,
          simulation: false,
          ethical: false,
          predictive: false
        };
      case 'pantheon':
        return {
          kpis: true,
          seismic: true,
          causal: true,
          taskReplays: true,
          simulation: true,
          ethical: true,
          predictive: true
        };
      default:
        return {
          kpis: true,
          seismic: true,
          causal: false,
          taskReplays: false,
          simulation: false,
          ethical: false,
          predictive: false
        };
    }
  };

  const activeWidgets = widgetsForPlan(selectedPlan);

  return (
    <div className="bg-white/3 p-4 rounded">
      <div className="mb-4">
        <p className="text-sm mb-2">Ver Demo como:</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPlan('starter')}
            className={`px-4 py-2 rounded transition-colors ${
              selectedPlan === 'starter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Starter
          </button>
          <button
            onClick={() => setSelectedPlan('growth')}
            className={`px-4 py-2 rounded transition-colors ${
              selectedPlan === 'growth'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Growth
          </button>
          <button
            onClick={() => setSelectedPlan('pantheon')}
            className={`px-4 py-2 rounded transition-colors ${
              selectedPlan === 'pantheon'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Panteón
          </button>
        </div>
      </div>

      {loading ? (
        <div>Cargando demo...</div>
      ) : (
        <div className="space-y-6">
          {/* KPIs Generales */}
          {activeWidgets.kpis && (
            <div>
              <h4 className="text-lg font-semibold mb-2">KPIs Generales</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <AnimatedMetric value={mockData.kpis.precision} suffix="%" />
                  <p className="text-sm text-gray-600">Precisión</p>
                </div>
                <div className="text-center">
                  <AnimatedMetric value={mockData.kpis.predictions} suffix="K" />
                  <p className="text-sm text-gray-600">Predicciones</p>
                </div>
              </div>
            </div>
          )}

          {/* Mapa de Riesgo Simple */}
          {activeWidgets.seismic && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Mapa de Riesgo Sísmico</h4>
              <SeismicMapWidget seismicData={mockData.seismicData} />
            </div>
          )}

          {/* Análisis Causal */}
          {activeWidgets.causal && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Análisis Causal</h4>
              <ConsciousnessHealthWidget />
            </div>
          )}

          {/* Task Replays */}
          {activeWidgets.taskReplays && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Task Replays</h4>
              <MissionGallery />
            </div>
          )}

          {/* Simulación Interactiva */}
          {activeWidgets.simulation && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Simulación Interactiva</h4>
              <MetatronPanelWidget running={false} toggleVigilance={() => {}} emitMessage="" setEmitMessage={() => {}} handleEmit={() => {}} handleDownload={() => {}} sseConnected={true} events={[]} />
            </div>
          )}

          {/* Vector Ético Detallado */}
          {activeWidgets.ethical && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Vector Ético Detallado</h4>
              <EthicalVectorDisplay ethicalAssessment={mockData.ethicalAssessment} />
            </div>
          )}

          {/* Análisis Predictivos Avanzados */}
          {activeWidgets.predictive && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Análisis Predictivos Avanzados</h4>
              <ClimateWidget />
            </div>
          )}

          {/* Demo predictivo original */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Demo predictivo</h4>
            <div className="text-sm">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPanel;
