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
