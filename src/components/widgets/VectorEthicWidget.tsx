import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import XaiExplainModal from './XaiExplainModal';

const data = [
  { subject: 'Transparencia', A: 80 },
  { subject: 'Equidad', A: 70 },
  { subject: 'Privacidad', A: 75 },
  { subject: 'Responsabilidad', A: 68 },
  { subject: 'Seguridad', A: 78 }
];

const VectorEthicWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<any>(null);

  const handleExplain = (subject: string, val: number) => {
    setSel({ metric: subject, value: val, context: 'VectorEthic' });
    setOpen(true);
  };

  return (
    <div className="praevisio-card">
      <div className="flex items-center justify-between">
        <h4 className="praevisio-title">Vector Ético</h4>
        <button onClick={() => handleExplain('Transparencia', 80)} className="text-amber-200">✨</button>
      </div>

      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius={60}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Ética" dataKey="A" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {sel && <XaiExplainModal open={open} onClose={() => setOpen(false)} metric={sel.metric} value={sel.value} context={sel.context} />}
    </div>
  );
};

export default VectorEthicWidget;
