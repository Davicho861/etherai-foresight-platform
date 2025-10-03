import React from 'react';
import { Button } from '@/components/ui/button';

interface Mission {
  id: string;
  title: string;
  description: string;
}

interface Props {
  mission: Mission;
  onStart: (mission: Mission) => void;
}

const MissionCard: React.FC<Props> = ({ mission, onStart }) => {
  return (
    <div data-testid={`mission-card-${mission.id}`} className="bg-gray-800 p-4 rounded border border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div data-testid={`mission-title-${mission.id}`} className="text-lg font-semibold">{mission.title}</div>
          <div data-testid={`mission-desc-${mission.id}`} className="text-sm text-gray-400">{mission.description}</div>
        </div>
        <div>
          <Button data-testid={`mission-start-${mission.id}`} onClick={() => onStart(mission)} variant="outline">Iniciar</Button>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
