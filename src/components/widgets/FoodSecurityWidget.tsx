import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import XaiExplainModal from './XaiExplainModal';

const series = [
  { time: 'Jan', value: 72 },
  { time: 'Feb', value: 70 },
  { time: 'Mar', value: 68 },
  { time: 'Apr', value: 69 },
  { time: 'May', value: 71 },
  { time: 'Jun', value: 73 }
];

const FoodSecurityWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedVal, setSelectedVal] = useState<number | null>(null);

  return (
    <div className="praevisio-card">
      <div className="flex items-center justify-between">
        <h4 className="praevisio-title">Seguridad Alimentaria</h4>
        <button onClick={() => { setSelectedVal(71); setOpen(true); }} className="text-amber-200">✨</button>
      </div>

      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

  <div className="mt-3 praevisio-small">Tendencia estable con leves fluctuaciones estacionales.</div>

      {selectedVal !== null && (
        <XaiExplainModal open={open} onClose={() => setOpen(false)} metric={'foodSecurityIndex'} value={selectedVal} context={'FoodSecurity'} />
      )}
    </div>
  );
};

export default FoodSecurityWidget;
