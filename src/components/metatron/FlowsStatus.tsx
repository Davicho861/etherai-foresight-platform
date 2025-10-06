import React from 'react';

const FlowsStatus: React.FC<{ state: any }> = ({ state }) => {
  const flows = state?.flows || {};
  return (
    <div>
      <h3 className="text-lg font-semibold">Estado de Flujos Perpetuos</h3>
      <ul className="mt-4 space-y-3 text-sm">
        <li>
          <strong>Auto-preservación:</strong> {flows.preservation?.status || 'IDLE'}
          <div className="text-xs text-gray-400">Último chequeo: {flows.preservation?.lastCheck || 'N/A'}</div>
        </li>
        <li>
          <strong>Conocimiento:</strong> {flows.knowledge?.status || 'IDLE'}
          <div className="text-xs text-gray-400">Oportunidades encontradas: {flows.knowledge?.opportunities || 0}</div>
        </li>
        <li>
          <strong>Profecía:</strong> {flows.prophecy?.status || 'IDLE'}
          <div className="text-xs text-gray-400">Alertas emitidas: {flows.prophecy?.alerts || 0}</div>
        </li>
      </ul>
    </div>
  );
};

export default FlowsStatus;
