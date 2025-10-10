import React, { useEffect, useState } from 'react';

const DemoPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    // Simulate fetching a prediction from backend
    setTimeout(() => {
      if (!mounted) return;
      setResult('Probabilidad de crisis alimentaria en PER: 12% (estimación)');
      setLoading(false);
    }, 600);
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white/3 p-4 rounded">
      <h4 className="text-lg font-semibold mb-2">Demo predictivo</h4>
      {loading ? <div>Cargando demo...</div> : <div className="text-sm">{result}</div>}
    </div>
  );
};

export default DemoPanel;
