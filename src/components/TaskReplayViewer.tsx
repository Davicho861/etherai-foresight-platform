import React, { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: number;
  content: string;
  agent: string;
  phase?: string;
  prediction?: any;
  assessment?: any;
}

interface MissionLog {
  id: string;
  title: string;
  objective: string;
  status: string;
  timestamp: number;
  ethicalVector: number[];
  crewSteps: {
    planning: LogEntry[];
    development: LogEntry[];
    quality: LogEntry[];
  };
  oracleDecisions: LogEntry[];
  ethicalCouncil: LogEntry[];
  causalWeaving: { from: string; to: string; weight: number }[];
  visualizations: any;
  fullLog: LogEntry[];
}

interface TaskReplayViewerProps {
  missionId?: string;
}

const TaskReplayViewer: React.FC<TaskReplayViewerProps> = ({ missionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missionLog, setMissionLog] = useState<MissionLog | null>(null);

  useEffect(() => {
    if (missionId) {
      fetchMissionLog(missionId);
    } else {
      setMissionLog(null);
      setError(null);
    }
  }, [missionId]);

  const fetchMissionLog = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/missions/replay/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mission log');
      }
      const data = await response.json();
      setMissionLog(data.mission);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!missionId) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-etherblue-dark to-etherblue-DEFAULT">
        <div className="text-center animate-fade-in">
          <div className="text-etherneon text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Centro de Mando Soberano</h2>
          <p className="text-ethergray-light">Selecciona una misión para ver su replay completo</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-etherblue-dark">
        <div className="text-center animate-pulse-glow">
          <div className="text-etherneon text-4xl mb-4">⚡</div>
          <p className="text-white">Cargando log de misión...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-etherblue-dark">
        <div className="text-center animate-fade-in">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-white">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!missionLog) {
    return (
      <div className="flex items-center justify-center h-full bg-etherblue-dark">
        <div className="text-center animate-fade-in">
          <p className="text-ethergray-light">No se encontró el log de la misión</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-etherblue-dark to-etherblue-DEFAULT p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-etherblue-light/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-etherneon/20 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">{missionLog.title}</h1>
          <p className="text-ethergray-light mb-4">{missionLog.objective}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-etherneon/20 text-etherneon px-3 py-1 rounded-full">
              Estado: {missionLog.status}
            </span>
            <span className="text-ethergray-light">
              {new Date(missionLog.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Crew Steps */}
        <div className="bg-etherblue-light/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-etherneon/10 animate-fade-in-right">
          <h2 className="text-2xl font-bold text-etherneon mb-4">Pasos del Crew</h2>
          <div className="space-y-4">
            {Object.entries(missionLog.crewSteps).map(([phase, stepsArray]) => (
              <div key={phase} className="bg-etherblue-DEFAULT/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white capitalize mb-2">{phase}</h3>
                {(stepsArray as LogEntry[]).map((step, index) => (
                  <div key={index} className="text-ethergray-light mb-2 p-2 bg-etherblue-dark/50 rounded">
                    <span className="text-etherneon font-medium">{step.agent}:</span> {step.content}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Oracle Decisions */}
        <div className="bg-etherblue-light/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-etherneon/10 animate-fade-in-left">
          <h2 className="text-2xl font-bold text-etherneon mb-4">Decisiones del Oráculo</h2>
          <div className="space-y-4">
            {missionLog.oracleDecisions.map((decision: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-etherneon/10 to-etherblue-DEFAULT/50 p-4 rounded-lg border-l-4 border-etherneon">
                <p className="text-white">{decision.content}</p>
                {decision.prediction && (
                  <div className="mt-2 text-sm text-ethergray-light">
                    <span>Riesgo: {decision.prediction.riskLevel}</span> |
                    <span> Confianza: {(decision.prediction.confidence * 100).toFixed(0)}%</span> |
                    <span> Horizonte: {decision.prediction.timeHorizon}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Council */}
        <div className="bg-etherblue-light/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-etherneon/10 animate-fade-in-right">
          <h2 className="text-2xl font-bold text-etherneon mb-4">Evaluaciones del Consejo de Ética</h2>
          <div className="space-y-4">
            {missionLog.ethicalCouncil.map((assessment: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-etherblue-DEFAULT/50 to-etherneon/10 p-4 rounded-lg border-l-4 border-etherneon">
                <p className="text-white">{assessment.content}</p>
                {assessment.assessment && (
                  <div className="mt-2 text-sm text-ethergray-light">
                    <span>Impacto Social: {assessment.assessment.socialImpact}</span> |
                    <span> Transparencia: {assessment.assessment.transparency}</span> |
                    <span> Equidad: {assessment.assessment.fairness}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Causal Weaving */}
        <div className="bg-etherblue-light/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-etherneon/10 animate-fade-in-left">
          <h2 className="text-2xl font-bold text-etherneon mb-4">Tejido Causal de la Predicción</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missionLog.causalWeaving.map((link: any, index: number) => (
              <div key={index} className="bg-etherblue-DEFAULT/50 p-4 rounded-lg text-center">
                <div className="text-etherneon font-semibold">{link.from}</div>
                <div className="text-white text-sm my-2">→</div>
                <div className="text-etherneon font-semibold">{link.to}</div>
                <div className="text-ethergray-light text-xs mt-2">
                  Peso: {(link.weight * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Log Timeline */}
        <div className="bg-etherblue-light/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-etherneon/10 animate-fade-in">
          <h2 className="text-2xl font-bold text-etherneon mb-4">Log Completo</h2>
          <div className="space-y-2">
            {missionLog.fullLog.map((log: any, index: number) => (
              <div key={index} className="flex items-start space-x-4 p-3 bg-etherblue-DEFAULT/30 rounded-lg">
                <div className="text-etherneon text-sm font-mono min-w-0 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-white flex-1">
                  <span className="text-etherneon font-medium">[{log.agent}]</span> {log.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReplayViewer;