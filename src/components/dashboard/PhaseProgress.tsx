import React from 'react';

type Phase = { name: string; progress: number; status: string };

const PhaseProgress: React.FC<{ phases: Phase[] }> = ({ phases }) => {
  if (!phases || phases.length === 0) return <div className="text-sm text-gray-400">No hay fases activas</div>;

  return (
    <div className="space-y-3">
      {phases.map((p) => (
        <div key={p.name} className="">
          <div className="flex justify-between mb-1">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-300">{p.progress}%</div>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded overflow-hidden">
            <div style={{ width: `${p.progress}%` }} className={`h-2 ${p.status === 'completed' ? 'bg-green-400' : p.status === 'in_progress' ? 'bg-amber-400' : 'bg-gray-500'}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhaseProgress;
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
