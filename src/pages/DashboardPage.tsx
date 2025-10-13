import React, { useState, useEffect } from 'react';
import MissionGallery from '../components/MissionGallery';
import CommunityResilienceWidget from '../components/CommunityResilienceWidget';
import SeismicMapWidget from '../components/SeismicMapWidget';
import FoodSecurityDashboard from '../components/FoodSecurityDashboard';
import EthicalVectorDisplay from '../components/EthicalVectorDisplay';
import TaskReplayViewer from '../components/TaskReplayViewer';

type Plan = 'Starter' | 'Growth' | 'Panteón';

const DashboardPage: React.FC = () => {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan>('Starter');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [liveState, setLiveState] = useState<any>(null);

  const handleMissionSelect = (missionId: string | null) => {
    setSelectedMissionId(missionId);
  };

  useEffect(() => {
    let mounted = true;
    const fetchLiveState = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/demo/live-state');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setLiveState(data);
      } catch (err: any) {
        console.error('Error fetching live-state:', err);
        if (mounted) setError(err.message || 'Error desconocido al obtener live-state');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLiveState();

    // poll every 15 seconds for fresher data
    const interval = setInterval(fetchLiveState, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const renderWidgets = () => {
    // Base widgets for Starter
    const starterWidgets = (
      <>
        <CommunityResilienceWidget resilienceData={liveState?.communityResilience} />
        <SeismicMapWidget seismicData={liveState?.global?.seismic} />
        <FoodSecurityDashboard foodSecurityData={liveState?.foodSecurity} />
        <EthicalVectorDisplay ethicalAssessment={liveState?.ethicalAssessment} />
      </>
    );

    if (plan === 'Starter') return starterWidgets;

    // Growth unlocks additional analytical features (we'll keep placeholders if data absent)
    if (plan === 'Growth') {
      return (
        <>
          {starterWidgets}
          {/* Advanced widgets could be added here; placeholders will render until implemented */}
          <div className="bg-gray-800/50 border-gray-700 rounded-lg p-6"> 
            <h3 className="text-white text-lg font-semibold">Análisis Causal (Growth)</h3>
            <p className="text-gray-400 text-sm">Componentes avanzados desbloqueados por Growth</p>
          </div>
        </>
      );
    }

    // Panteón - full experience
    return (
      <>
        {starterWidgets}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-gray-700 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold">Simulador de Escenarios Interactivos (Panteón)</h3>
          <p className="text-gray-400 text-sm">Modo de élite: Modelos avanzados y visualizaciones profundas</p>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-etherblue-dark text-white flex">
      {/* Sidebar Izquierdo (~30%) */}
      <div className="w-1/3 bg-etherblue-dark/80 border-r border-gray-700 p-6 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-etherneon">Dashboard Soberano</h2>
          <p className="text-sm text-gray-400">Selecciona experiencia de plan</p>
          <div className="mt-3 flex space-x-2">
            {(['Starter','Growth','Panteón'] as Plan[]).map(p => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${plan===p ? 'bg-etherneon text-black' : 'bg-gray-700 text-white'}`}
              >{p}</button>
            ))}
          </div>
        </div>

        <MissionGallery
          onMissionSelect={handleMissionSelect}
          selectedMissionId={selectedMissionId}
        />
      </div>

      {/* Panel de Contenido Derecho (~70%) */}
      <div className="w-2/3 flex flex-col">
        {/* Panel Superior: Widgets */}
        <div className="flex-1 p-6 bg-etherblue-dark/60 overflow-y-auto">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">Cargando datos en vivo...</div>
          ) : error ? (
            <div className="w-full h-64 p-6 bg-red-900/20 rounded-lg text-red-200">Error cargando live-state: {error}</div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="space-y-6">
                {renderWidgets()}
              </div>
              <div className="space-y-6">
                {/* Right column reserved for additional contextual widgets or details */}
                <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-full">
                  <h3 className="text-white font-semibold">KPIs</h3>
                  <div className="mt-2 text-gray-300 text-sm">
                    <pre className="text-xs">{JSON.stringify(liveState?.kpis || {}, null, 2)}</pre>
                  </div>
                </div>
                <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-full">
                  <h3 className="text-white font-semibold">Países</h3>
                  <div className="mt-2 text-gray-300 text-sm">
                    {(liveState?.countries || []).map((c: any) => (
                      <div key={c.code} className="flex items-center justify-between">
                        <div>{c.name}</div>
                        <div className="text-xs text-gray-400">{c.code}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Inferior: TaskReplayViewer */}
        <div className="flex-1 bg-etherblue-dark/40 border-t border-gray-700">
          <TaskReplayViewer missionId={selectedMissionId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
