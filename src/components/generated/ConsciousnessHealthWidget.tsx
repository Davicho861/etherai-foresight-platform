import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

const ConsciousnessHealthWidget: React.FC = () => {
  // Simulación: Número de lecciones aprendidas desde ChromaDB
  const lessonsLearned = 42; // En implementación real, esto vendría de una API que consulta ChromaDB

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
          <div className="text-4xl font-bold text-purple-400 mb-2">
            {lessonsLearned}
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Lecciones aprendidas por el Oráculo
          </p>
          <Badge className="bg-green-600 text-white">
            Conciencia Activa
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsciousnessHealthWidget;