import { useState, useCallback } from 'react';

interface XaiResponse {
  success?: boolean;
  explanation?: string;
  confidence?: number;
  sources?: string[];
  oracle?: string;
}

export default function useXaiExplain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<XaiResponse | null>(null);

  const explain = useCallback(async (metric: string, value: any, context: string) => {
    setLoading(true);
    setError(null);
    setLast(null);
    try {
      const res = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'XAI request failed');
      setLast(body);
      return body as XaiResponse;
    } catch (err: any) {
      console.error('useXaiExplain error:', err);
      setError(err.message || 'XAI error');
      const fallback = {
        explanation: err.message || 'No explanation available',
        confidence: 0,
        sources: [],
        oracle: 'Apolo Prime - fallback'
      } as XaiResponse;
      setLast(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, []);

  return { explain, loading, error, last };
}
