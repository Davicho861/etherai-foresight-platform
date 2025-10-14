import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

// Cargar componentes y simulador dinámicamente para evitar errores en SSR/build
let FlowsStatus: any = () => <div>FlowsStatus no disponible</div>;
let MetatronPanelWidget: any = () => <div>MetatronPanelWidget no disponible</div>;
let startSimulator: (() => void) | null = null;
let stopSimulator: (() => void) | null = null;
 
let subscribeEvents: ((_: (_: string) => void) => void) | null = null;
let getCurrentState: (() => any) | null = null;
let downloadReport: (() => void) | null = null;

try {
  const sim = require('../lib/eternalVigilanceSimulator');
  startSimulator = sim.startSimulator;
  stopSimulator = sim.stopSimulator;
  subscribeEvents = sim.subscribeEvents;
  getCurrentState = sim.getCurrentState;
  downloadReport = sim.downloadReport;
} catch (e) {
  console.error('Error loading simulator:', e);
  // noop - fallback no-op implementations
  startSimulator = () => undefined;
  stopSimulator = () => undefined;
  subscribeEvents = () => undefined;
  getCurrentState = () => ({ indices: { globalRisk: 0, stability: 100 }, flows: {} });
  downloadReport = () => undefined;
}

try {
  FlowsStatus = require('../components/metatron/FlowsStatus').default;
  MetatronPanelWidget = require('../components/metatron/MetatronPanelWidget').default;
} catch (e) {
  console.error('Error loading Metatron components:', e);
  // minimal fallbacks if components are not yet resolvable
  FlowsStatus = () => <div>FlowsStatus no disponible</div>;
  MetatronPanelWidget = () => <div>MetatronPanelWidget no disponible</div>;
}

const MetatronPanel: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<any>(null);
  const [sseConnected, setSseConnected] = useState(false);
  const [emitMessage, setEmitMessage] = useState('');

  useEffect(() => {
    const handler = (message: string) => {
      setEvents(prev => [message, ...prev].slice(0, 200));
    };
    if (subscribeEvents) subscribeEvents(handler);
    let es: EventSource | null = null;

    (async () => {
      if (typeof window === 'undefined' || !window.EventSource) return;
      try {
        // Request a short-lived token from the server (requires Authorization)
        // server will set a cookie with the token so EventSource can use it
        try {
          await fetch('/api/eternal-vigilance/token', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-token' } });
        } catch (err) {
          console.error('Failed to fetch SSE token', err);
        }
        // Open EventSource without token in URL; cookie will be sent automatically
        const streamUrl = `/api/eternal-vigilance/stream`;
        es = new EventSource(streamUrl);
        es.onopen = () => {
          setSseConnected(true);
          (window as any).eventSourceReady = true;
        };
        es.onerror = () => setSseConnected(false);
        es.onmessage = (m) => {
          try {
            const parsed = JSON.parse(m.data);
            const evText = parsed?.event ? parsed.event : JSON.stringify(parsed);
            handler(`[SSE] ${evText}`);
            // update local state snapshot
            setState(parsed.state || getCurrentState?.());
          } catch {
            handler(`[SSE] ${m.data}`);
          }
        };
      } catch (err) {
        console.error('Error setting up EventSource:', err);
      }
    })();

    return () => {
      if (es) es.close();
    };
  }, []);

  const toggleVigilance = () => {
    if (running) {
      stopSimulator?.();
      setRunning(false);
    } else {
      startSimulator?.();
      setRunning(true);
    }
  };

  const handleEmit = async () => {
    if (!emitMessage) return;
    try {
      await fetch('/api/eternal-vigilance/emit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer demo-token' },
        body: JSON.stringify({ event: emitMessage }),
      });
      setEmitMessage('');
    } catch (err) {
      console.error('Error emitting event:', err);
    }
  };

  const handleDownload = () => {
    if (downloadReport) downloadReport();
  };

  useEffect(() => {
    const s = getCurrentState?.();
    if (s) setState(s);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Metatrón - Centro de Operaciones</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <MetatronPanelWidget
              running={running}
              toggleVigilance={toggleVigilance}
              emitMessage={emitMessage}
              setEmitMessage={setEmitMessage}
              handleEmit={handleEmit}
              handleDownload={handleDownload}
              sseConnected={sseConnected}
              events={events}
              state={state}
            />
          </div>
          <div>
            {state && <FlowsStatus flows={state.flows} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MetatronPanel;
