import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import XaiExplainModal from './XaiExplainModal';

const mockEvents = [
  { id: 1, lat: -12.05, lon: -77.03, mag: 4.8, place: 'Lima, Perú' },
  { id: 2, lat: -34.60, lon: -58.38, mag: 3.2, place: 'Buenos Aires, Argentina' },
  { id: 3, lat: -23.55, lon: -46.63, mag: 5.1, place: 'São Paulo, Brasil' }
];

const SeismicMapWidget: React.FC = () => {
  const [events, setEvents] = useState(mockEvents);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    // Simulate pulsing new events
    const t = setInterval(() => {
      setEvents(prev => prev.map(e => ({ ...e, mag: +(e.mag + (Math.random() - 0.5)*0.2).toFixed(1) })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleExplain = (ev: any) => {
    setSelected({ metric: 'magnitude', value: ev.mag, context: 'SeismicMap' });
    setOpen(true);
  };

  return (
    <motion.div layout className="praevisio-card">
      <div className="flex items-center justify-between">
        <h4 className="praevisio-title">Monitoreo Sísmico</h4>
        <div className="text-sm praevisio-small">Eventos recientes</div>
      </div>

      <div className="mt-3 space-y-2 text-sm praevisio-small max-h-40 overflow-y-auto">
        {events.map(ev => (
          <div key={ev.id} className="flex items-center justify-between bg-gray-800/30 p-2 rounded">
            <div>
              <div className="font-medium">{ev.place}</div>
              <div className="text-xs text-gray-400">Lat {ev.lat}, Lon {ev.lon}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">{ev.mag}</div>
              <button onClick={() => handleExplain(ev)} className="text-amber-200">✨</button>
            </div>
          </div>
        ))}
      </div>

      {selected && <XaiExplainModal open={open} onClose={() => setOpen(false)} metric={selected.metric} value={selected.value} context={selected.context} />}
    </motion.div>
  );
};

export default SeismicMapWidget;
