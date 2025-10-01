import React from 'react';

const ModuleCard: React.FC<{ name: string; status: string; lastRun?: string }> = ({ name, status, lastRun }) => {
  return (
    <div className="p-3 bg-gray-800 rounded border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="font-medium">{name}</div>
        <div className={`text-sm ${status === 'running' ? 'text-amber-400' : status === 'ready' ? 'text-green-400' : 'text-gray-400'}`}>{status}</div>
      </div>
      {lastRun && <div className="text-xs text-gray-400">Última ejecución: {lastRun}</div>}
    </div>
  );
};

export default ModuleCard;
import React from 'react';

type Props = {
  name: string;
  type: string;
  status: string;
  currentTask?: string;
  progress: number;
};

const ModuleCard: React.FC<Props> = ({ name, type, status, currentTask, progress }) => {
  return (
    <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-4 w-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-300">{type}</div>
          <div className="text-lg font-semibold">{name}</div>
          {currentTask && <div className="text-sm text-gray-400 mt-1">{currentTask}</div>}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">{status}</div>
          <div className="text-xl font-bold">{progress}%</div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
