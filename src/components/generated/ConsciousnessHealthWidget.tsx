import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2 } from 'lucide-react';

const ConsciousnessHealthWidget: React.FC = () => {
  const [lessonsLearned, setLessonsLearned] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonsLearned = async () => {
      try {
        const response = await fetch('/api/consciousness');
        if (!response.ok) throw new Error('Failed to fetch consciousness data');
        const data = await response.json();
        const count = data.items ? data.items.length : 0;
        setLessonsLearned(count);
      } catch (err) {
        console.error('Error fetching lessons learned:', err);
        setError('Error loading data');
        setLessonsLearned(0); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsLearned();
  }, []);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>Salud de la Conciencia</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
          ) : (
            <div className="text-4xl font-bold text-purple-400 mb-2" data-testid="lessons-count">
              {lessonsLearned !== null ? lessonsLearned : 'N/A'}
            </div>
          )}
          <p className="text-gray-300 text-sm mb-4">
            Lecciones aprendidas por el Oráculo desde ChromaDB
          </p>
          <Badge className={error ? "bg-red-600 text-white" : "bg-green-600 text-white"}>
            {error ? "Error de Conexión" : "Conciencia Activa"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsciousnessHealthWidget;