import React from 'react';

const CronosWidget: React.FC = () => {
  return (
    <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Estado de Cronos</h3>
      <div className="text-sm text-gray-300">
        Cronos está operativo y monitoreando el tiempo.
      </div>
    </div>
  );
};

export default CronosWidget;