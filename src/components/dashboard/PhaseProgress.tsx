import React from 'react';

type Phase = {
  name: string;
  progress: number;
  status: string;
};

const PhaseProgress: React.FC<{ phases: Phase[] }> = ({ phases }) => {
  return (
    <div className="space-y-3">
      {phases.map((p) => (
        <div key={p.name} className="flex items-center justify-between">
          <div className="w-1/3 text-sm text-gray-300">{p.name}</div>
          <div className="flex-1 px-4">
            <div className="h-3 bg-gray-700 rounded overflow-hidden">
              <div
                className={`h-3 rounded bg-gradient-to-r from-cyan-400 to-violet-600`}
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
          <div className="w-20 text-right text-sm text-gray-200">{p.progress}%</div>
        </div>
      ))}
    </div>
  );
};

export default PhaseProgress;
