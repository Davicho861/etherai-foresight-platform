import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import XaiExplainModal from './XaiExplainModal';

const data = [
  { region: 'Colombia', value: 85 },
  { region: 'Perú', value: 72 },
  { region: 'Argentina', value: 68 },
  { region: 'Chile', value: 74 },
  { region: 'Brasil', value: 60 }
];

const COLORS = ['#00D4FF', '#7C3AED', '#FF6B00', '#FFD700', '#FF0080'];

const CommunityResilienceWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ metric: string; value: any; context: string } | null>(null);

  const handleExplain = (region: string, val: number) => {
    setSelected({ metric: 'resilienceIndex', value: val, context: 'CommunityResilience' });
    setOpen(true);
  };

  return (
    <motion.div layout className="praevisio-card">
      <div className="flex items-center justify-between">
        <h4 className="praevisio-title">Resiliencia Comunitaria</h4>
        <button onClick={() => handleExplain('Regional', 75)} className="text-amber-200">✨</button>
      </div>

      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="region" innerRadius={30} outerRadius={60} paddingAngle={4}>
              {data.map((entry, idx) => (
                <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm praevisio-small">
        {data.map(d => (
          <div key={d.region} className="flex items-center justify-between">
            <div>{d.region}</div>
            <div className="font-semibold">{d.value}</div>
          </div>
        ))}
      </div>

      {selected && (
        <XaiExplainModal open={open} onClose={() => setOpen(false)} metric={selected.metric} value={selected.value} context={selected.context} />
      )}
    </motion.div>
  );
};

export default CommunityResilienceWidget;
