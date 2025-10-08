import React from 'react';

const FlowsStatus: React.FC<{ flows: any }> = ({ flows }) => {
  const getStatusColor = (active: boolean) => active ? 'text-green-400' : 'text-red-400';
  const getStatusText = (active: boolean) => active ? 'Activo' : 'Inactivo';

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">Estado de Flujos Perpetuos - Aion</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-3">
          <div className="flex items-center justify-between">
            <strong className="text-white">Auto-Preservación</strong>
            <span className={`text-sm ${getStatusColor(flows?.autoPreservation?.active)}`}>
              {getStatusText(flows?.autoPreservation?.active)}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Última ejecución: {flows?.autoPreservation?.lastRun ? new Date(flows.autoPreservation.lastRun).toLocaleTimeString() : 'Nunca'}
          </div>
        </div>

        <div className="border-l-4 border-purple-500 pl-3">
          <div className="flex items-center justify-between">
            <strong className="text-white">Conocimiento (Kairós)</strong>
            <span className={`text-sm ${getStatusColor(flows?.knowledge?.active)}`}>
              {getStatusText(flows?.knowledge?.active)}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Última ejecución: {flows?.knowledge?.lastRun ? new Date(flows.knowledge.lastRun).toLocaleTimeString() : 'Nunca'}
          </div>
        </div>

        <div className="border-l-4 border-yellow-500 pl-3">
          <div className="flex items-center justify-between">
            <strong className="text-white">Profecía (Apolo)</strong>
            <span className={`text-sm ${getStatusColor(flows?.prophecy?.active)}`}>
              {getStatusText(flows?.prophecy?.active)}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Última ejecución: {flows?.prophecy?.lastRun ? new Date(flows.prophecy.lastRun).toLocaleTimeString() : 'Nunca'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowsStatus;
