import React, { useState } from 'react';
import MissionGallery from '../components/MissionGallery';
import CommunityResilienceWidget from '../components/CommunityResilienceWidget';
import SeismicMapWidget from '../components/SeismicMapWidget';
import FoodSecurityDashboard from '../components/FoodSecurityDashboard';
import EthicalVectorDisplay from '../components/EthicalVectorDisplay';
import TaskReplayViewer from '../components/TaskReplayViewer';

const DashboardPage: React.FC = () => {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  const handleMissionSelect = (missionId: string | null) => {
    setSelectedMissionId(missionId);
  };

  return (
    <div className="min-h-screen bg-etherblue-dark text-white flex">
      {/* Sidebar Izquierdo (~30%) */}
      <div className="w-1/3 bg-etherblue-dark/80 border-r border-gray-700 p-6 overflow-y-auto">
        <MissionGallery
          onMissionSelect={handleMissionSelect}
          selectedMissionId={selectedMissionId}
        />
      </div>

      {/* Panel de Contenido Derecho (~70%) */}
      <div className="w-2/3 flex flex-col">
        {/* Panel Superior: Widgets */}
        <div className="flex-1 p-6 bg-etherblue-dark/60 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="space-y-6">
              <CommunityResilienceWidget />
              <SeismicMapWidget />
            </div>
            <div className="space-y-6">
              <FoodSecurityDashboard />
              <EthicalVectorDisplay />
            </div>
          </div>
        </div>

        {/* Panel Inferior: TaskReplayViewer */}
        <div className="flex-1 bg-etherblue-dark/40 border-t border-gray-700">
          <TaskReplayViewer missionId={selectedMissionId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
