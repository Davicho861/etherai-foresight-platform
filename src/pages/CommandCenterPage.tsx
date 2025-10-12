import React, { useState, useEffect } from 'react';
import MissionGallery from '../components/MissionGallery';
import TaskReplayViewer from '../components/TaskReplayViewer';
import AutoPreservationWidget from '../components/AutoPreservationWidget';
import KnowledgeFlowWidget from '../components/KnowledgeFlowWidget';
import ProphecyFlowWidget from '../components/ProphecyFlowWidget';

interface MissionLog {
  id: string;
  title: string;
  objective: string;
  status: string;
  timestamp: number;
  ethicalVector: number[];
  crewSteps: {
    planning: Array<{
      timestamp: number;
      content: string;
      agent: string;
    }>;
    development: Array<{
      timestamp: number;
      content: string;
      agent: string;
    }>;
    quality: Array<{
      timestamp: number;
      content: string;
      agent: string;
    }>;
  };
  oracleDecisions: Array<{
    timestamp: number;
    content: string;
    agent: string;
    prediction?: {
      riskLevel: string;
      confidence: number;
      timeHorizon: string;
    };
  }>;
  ethicalCouncil: Array<{
    timestamp: number;
    content: string;
    agent: string;
    assessment?: {
      socialImpact: string;
      transparency: string;
      fairness: string;
    };
  }>;
  causalWeaving: Array<{
    from: string;
    to: string;
    weight: number;
  }>;
  visualizations: {
    riskMap?: {
      type: string;
      data: any;
      description: string;
    };
    predictionChart?: {
      type: string;
      data: any;
      description: string;
    };
    ethicalGauge?: {
      type: string;
      value: number;
      description: string;
    };
  };
  fullLog: Array<{
    timestamp: number;
    phase: string;
    agent: string;
    content: string;
    metadata?: any;
  }>;
}

const CommandCenterPage: React.FC = () => {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionLog | null>(null);
  const [loadingReplay, setLoadingReplay] = useState(false);

  useEffect(() => {
    const fetchMissionReplay = async () => {
      if (!selectedMissionId) {
        setSelectedMission(null);
        return;
      }

      setLoadingReplay(true);
      try {
        const response = await fetch(`/api/missions/replay/${selectedMissionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mission replay');
        }
        const data = await response.json();
        setSelectedMission(data.mission);
      } catch (error) {
        console.error('Error fetching mission replay:', error);
        setSelectedMission(null);
      } finally {
        setLoadingReplay(false);
      }
    };

    fetchMissionReplay();
  }, [selectedMissionId]);

  const handleMissionSelect = (missionId: string | null) => {
    setSelectedMissionId(missionId);
  };

  return (
    <div className="min-h-screen bg-etherblue-dark text-white flex">
      {/* Sidebar - Galería de Misiones */}
      <div className="w-1/4 min-w-[300px] max-w-[400px] bg-etherblue-dark/95 border-r border-gray-700 p-6 overflow-hidden flex flex-col">
        <AutoPreservationWidget />
        <KnowledgeFlowWidget />
        <ProphecyFlowWidget />
        <MissionGallery
          onMissionSelect={handleMissionSelect}
          selectedMissionId={selectedMissionId}
        />
      </div>

      {/* Panel de Contenido - Visor de Task Replay */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full">
          <TaskReplayViewer
            mission={selectedMission}
            loading={loadingReplay}
          />
        </div>
      </div>
    </div>
  );
};

export default CommandCenterPage;