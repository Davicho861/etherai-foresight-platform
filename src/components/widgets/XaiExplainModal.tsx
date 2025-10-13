import React, { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  metric: string;
  value: string | number;
  context: string;
};

const XaiExplainModal: React.FC<Props> = ({ open, onClose, metric, value, context }) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const fetchExplain = async () => {
      setLoading(true);
      setError(null);
      setExplanation(null);
      try {
        const res = await fetch('/api/xai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metric, value, context }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        setExplanation(json.explanation || json.explain || 'El Oráculo no devolvió explicación.');
      } catch (err: any) {
        // Fallback: generar explicación local de alta fidelidad
        const fallback = `El Oráculo (fallback) interpreta que ${metric} = ${value} en ${context} sugiere cambios relevantes en las condiciones operativas; revise tendencias y alertas relacionadas.`;
        setExplanation(fallback);
        setError(err?.message || 'Error generando explicación');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchExplain();
    return () => { mounted = false; };
  }, [open, metric, value, context]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-2xl w-full praevisio-card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold praevisio-title">Explicación del Oráculo ✨</h3>
            <div className="text-sm praevisio-small">{context} — {metric}: <span className="font-medium text-white">{String(value)}</span></div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white">✖</button>
        </div>

        <div className="mt-4">
          {loading && <div className="text-gray-300">Generando interpretación del Oráculo…</div>}
          {!loading && explanation && (
            <div className="prose prose-invert text-gray-200 leading-relaxed">{explanation}</div>
          )}
          {!loading && error && (
            <div className="mt-3 text-sm text-yellow-300">Nota: explicación desde fallback. ({error})</div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="praevisio-cta">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default XaiExplainModal;
