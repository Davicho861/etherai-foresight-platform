import React, { useState, useEffect } from 'react';

const KnowledgeFlowWidget: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/knowledge');
        setIsActive(response.ok);
      } catch {
        setIsActive(false);
      }
    };
    checkStatus();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Flujo de Conocimiento</h3>
      <div className="flex items-center">
        <div
          className={`w-4 h-4 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
        ></div>
        <span>{isActive ? 'Activo' : 'Inactivo'}</span>
      </div>
    </div>
  );
};

export default KnowledgeFlowWidget;