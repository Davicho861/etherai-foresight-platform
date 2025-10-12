import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, CheckCircle } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  objective: string;
  result: string;
  ethicalVector: number[];
  timestamp: number;
  status: string;
}

interface MissionGalleryProps {
  onMissionSelect?: (missionId: string | null) => void;
  selectedMissionId?: string | null;
}

const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

const MissionGallery: React.FC<MissionGalleryProps> = ({ onMissionSelect, selectedMissionId }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/missions/replays');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setMissions(data.missions || []);
      } catch (error) {
        console.error('Error fetching missions:', error);
        setError('Error al cargar las misiones. Inténtalo de nuevo más tarde.');
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleMissionSelect = (mission: Mission) => {
    if (onMissionSelect) {
      onMissionSelect(selectedMissionId === mission.id ? null : mission.id);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-etherneon mx-auto mb-2"></div>
        Cargando misiones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        <div className="text-2xl mb-2">⚠️</div>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold text-etherneon mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2" />
        Galería de Misiones
      </h2>

      {missions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay misiones disponibles
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((mission) => (
            <Card
              key={mission.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedMissionId === mission.id
                  ? 'bg-etherblue-600 border-etherneon shadow-lg'
                  : 'bg-etherblue-dark/60 border-gray-700 hover:bg-etherblue-dark/80'
              }`}
              onClick={() => handleMissionSelect(mission)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm text-white leading-tight">
                    {mission.title}
                  </CardTitle>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    mission.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-600 text-black'
                  }`}>
                    {mission.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {mission.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                  {mission.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(mission.timestamp)}
                  </div>
                  <div className="text-right">
                    <div>Ético: {Math.round(mission.ethicalVector[0] * 100)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionGallery;