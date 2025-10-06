import React from 'react';

const MetatronPanelWidget: React.FC<{ state: any }> = ({ state }) => {
  const indices = state?.indices || { globalRisk: 0, stability: 100 };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Índices de Riesgo Global</h2>
          <div className="text-sm text-gray-300">Actualizados en tiempo real</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-400">{indices.globalRisk}%</div>
          <div className="text-xs text-gray-400">Estabilidad: {indices.stability}%</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Auto-preservación</div>
          <div className="text-xl font-bold">{state?.flows?.preservation?.status || 'IDLE'}</div>
        </div>
        <div className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Conocimiento</div>
          <div className="text-xl font-bold">{state?.flows?.knowledge?.status || 'IDLE'}</div>
        </div>
        <div className="bg-etherblue-dark/50 rounded p-4">
          <div className="text-sm text-gray-300">Profecía</div>
          <div className="text-xl font-bold">{state?.flows?.prophecy?.status || 'IDLE'}</div>
        </div>
      </div>
    </div>
  );
};

export default MetatronPanelWidget;
