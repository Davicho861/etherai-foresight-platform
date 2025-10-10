import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskReplay {
  id: string;
  title: string;
  description: string;
  fullText: string;
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

const MissionGallery: React.FC = () => {
  const [taskReplays, setTaskReplays] = useState<TaskReplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReplay, setSelectedReplay] = useState<TaskReplay | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchMissionReplays = async () => {
      try {
        const response = await fetch('/api/demo/mission-replays');
        if (!response.ok) {
          throw new Error('Failed to fetch mission replays');
        }
        const data = await response.json();
        setTaskReplays(data.taskReplays || []);
      } catch (error) {
        console.error('Error fetching mission replays:', error);
        // Fallback to empty array
        setTaskReplays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionReplays();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400">
        Cargando replays de misiones...
      </div>
    );
  }

  const handleReplaySelect = (replay: TaskReplay) => {
    setSelectedReplay(replay);
    setIsTyping(true);
    // Reset typing after completion
    setTimeout(() => setIsTyping(false), replay.fullText.length * 50 + 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {taskReplays.map((replay, idx) => {
        // Ensure a stable unique key: prefer replay.id but fallback to id+index if needed
        const key = replay.id ? `${replay.id}-${idx}` : `replay-${idx}`;
        return (
          <Card
            key={key}
            className="bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => handleReplaySelect(replay)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{replay.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">{replay.description}</p>
            </CardContent>
          </Card>
        );
      })}

      {selectedReplay && (
        <div className="col-span-full mt-8">
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-xl">{selectedReplay.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg leading-relaxed font-mono">
                {isTyping ? (
                  <TypewriterText text={selectedReplay.fullText} />
                ) : (
                  selectedReplay.fullText
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MissionGallery;