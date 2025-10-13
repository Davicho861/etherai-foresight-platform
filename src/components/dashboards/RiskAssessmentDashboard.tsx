import React from 'react';
import { motion } from 'framer-motion';
import Globe from 'react-globe.gl';

interface Point {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
}

interface Props {
  riskData: any;
}

const RiskAssessmentDashboard: React.FC<Props> = ({ riskData }) => {
  if (!riskData) return <div>Cargando datos de evaluación de riesgos...</div>;

  const globeData: Point[] = [
    { lat: 4.5709, lng: -74.2973, size: 0.8, color: '#EF4444', label: 'Colombia - Alto Riesgo' },
    { lat: -9.1899, lng: -75.0152, size: 0.6, color: '#F59E0B', label: 'Perú - Riesgo Medio' },
    { lat: -14.2350, lng: -51.9253, size: 0.9, color: '#EF4444', label: 'Brasil - Alto Riesgo' },
    { lat: 23.6345, lng: -102.5528, size: 0.7, color: '#F59E0B', label: 'México - Riesgo Medio' },
    { lat: -38.4161, lng: -63.6167, size: 0.5, color: '#10B981', label: 'Argentina - Bajo Riesgo' },
    { lat: -35.6751, lng: -71.5430, size: 0.4, color: '#10B981', label: 'Chile - Bajo Riesgo' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">🌍 Evaluación Global de Riesgos</h2>
        <p className="text-slate-400">Mapa 3D de hotspots sísmicos y sociales</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Mapa Global de Riesgos</h3>
        <div className="h-96 w-full">
          <Globe
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            pointsData={globeData}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointRadius="size"
            pointLabel="label"
            pointAltitude={0.1}
            pointResolution={32}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {globeData.map((point, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{point.label.split(' - ')[0]}</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: point.color }}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">Riesgo Sísmico:</span><span className="text-white font-mono">{(point.size * 100).toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Riesgo Social:</span><span className="text-white font-mono">{Math.floor(Math.random() * 40 + 20)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Riesgo Climático:</span><span className="text-white font-mono">{Math.floor(Math.random() * 30 + 10)}%</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskAssessmentDashboard;
