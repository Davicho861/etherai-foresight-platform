import React from 'react';

const MetatronPanelWidget: React.FC<{
  running: boolean;
  toggleVigilance: () => void;
  emitMessage: string;
  setEmitMessage: React.Dispatch<React.SetStateAction<string>>;
  handleEmit: () => void;
  handleDownload: () => void;
  sseConnected: boolean;
  events: string[];
  state: any;
}> = ({
  running,
  toggleVigilance,
  emitMessage,
  setEmitMessage,
  handleEmit,
  handleDownload,
  sseConnected,
  events,
  state
}) => {
  const indices = state?.indices || { globalRisk: 0, stability: 100 };
  const riskIndices = state?.riskIndices || {};
  const activityFeed = state?.activityFeed || [];

  const getRiskColor = (level: string) => {
  // Small runtime reference to setEmitMessage to avoid unused var lint in typing
  if (typeof setEmitMessage === 'function') {
    // noop reference
    void setEmitMessage;
  }
    switch (level) {
      case 'Alto': return 'text-red-400';
      case 'Medio': return 'text-yellow-400';
      case 'Bajo': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Centro de Operaciones - Aion</h2>
          <div className="text-sm text-gray-300">Vigilia Eterna Activa</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm ${sseConnected ? 'bg-green-600' : 'bg-red-600'}`}>
            {sseConnected ? 'SSE Conectado' : 'SSE Desconectado'}
          </div>
          <button
            onClick={toggleVigilance}
            className={`px-4 py-2 rounded ${running ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold`}
          >
            {running ? 'Detener Vigilia' : 'Iniciar Vigilia'}
          </button>
        </div>
      </div>

      {/* Índices de Riesgo Global */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Índices de Riesgo Global</h3>
            <div className="text-sm text-gray-300">Actualizados en tiempo real por Apolo</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-400">{indices.globalRisk.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Estabilidad Global: {indices.stability.toFixed(1)}%</div>
          </div>
        </div>

        {/* Índices por país */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(riskIndices).map(([country, data]: [string, any]) => (
            <div key={country} className="bg-gray-800 p-4 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{country}</span>
                <span className={`text-sm font-bold ${getRiskColor(data.level)}`}>
                  {data.level}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {data.riskScore.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed de Actividad */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Feed de Actividad - Aion</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activityFeed.slice(0, 20).map((entry: any, index: number) => (
            <div key={index} className="bg-gray-800 p-3 rounded text-sm">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  entry.flow === 'Auto-Preservación' ? 'bg-blue-400' :
                  entry.flow === 'Conocimiento' ? 'bg-purple-400' :
                  entry.flow === 'Profecía' ? 'bg-yellow-400' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className="text-gray-300 text-xs">
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : 'N/A'} - <span className="text-white font-medium">{entry.flow}</span>
                  </div>
                  <div className="text-white">{entry.message || entry}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de debug */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Controles de Comunicación</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={emitMessage}
            onChange={(e) => setEmitMessage(e.target.value)}
            placeholder="Enviar mensaje a Aion..."
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleEmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          >
            Enviar
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold"
          >
            Descargar Reporte
          </button>
        </div>
      </div>

      {/* Eventos SSE recientes */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Eventos SSE Recientes</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto text-sm">
          {events.slice(0, 10).map((event, index) => (
            <div key={index} className="text-gray-300 bg-gray-800 p-2 rounded">
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetatronPanelWidget;
