import React, { useEffect, useRef, useState } from 'react';
import SidebarNav from '@/components/demo/SidebarNav';
import CountryDashboard from '@/components/demo/CountryDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const countryData = {
  ARG: { name: 'Argentina', flag: '🇦🇷', population: 45100000, gdp: 450000, stability: 6.2 },
  COL: { name: 'Colombia', flag: '🇨🇴', population: 50890000, gdp: 320000, stability: 6.8 },
  PER: { name: 'Perú', flag: '🇵🇪', population: 33200000, gdp: 220000, stability: 6.0 }
};

const missionsByLevel = {
  public: {
    ARG: { id: 'climate-change', title: 'Cambio Climático', description: 'Analizar impactos del cambio climático en Argentina' },
    COL: { id: 'social-stability', title: 'Inestabilidad Social', description: 'Evaluar estabilidad social en Colombia' }
  },
  corporate: {},
  state: {}
};

const DemoPage: React.FC = () => {
  const [accessLevel, setAccessLevel] = useState<'public' | 'corporate' | 'state'>('public');
  const [selectedCountry, setSelectedCountry] = useState<string | null>('COL');
  const [missionLogs, setMissionLogs] = useState<any[]>([]);
  const [runningMissionId, setRunningMissionId] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, []);

  const startMission = async (mission: any) => {
    try {
      setMissionLogs([]);
      const resp = await fetch('/api/agent/start-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: `${mission.title} - ${mission.description} [pais:${selectedCountry}]` })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setMissionLogs((s) => [...s, { level: 'error', message: data.error || 'failed to start mission' }]);
        return;
      }
      const { missionId } = data;
      setRunningMissionId(missionId);

      const url = `/api/agent/mission/${missionId}/stream`;
      if (esRef.current) {
        esRef.current.close();
      }
      const es = new EventSource(url);
      esRef.current = es;
      es.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          setMissionLogs((s) => [...s, parsed]);
        } catch (e) {
          setMissionLogs((s) => [...s, { message: ev.data }]);
        }
      };
      es.onerror = () => setMissionLogs((s) => [...s, { level: 'warn', message: 'Stream connection error' }]);
    } catch (err: any) {
      setMissionLogs((s) => [...s, { level: 'error', message: err.message || String(err) }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050609] text-white flex">
      <SidebarNav countries={countryData} accessLevel={accessLevel} onChangeAccess={(l) => setAccessLevel(l)} onSelectCountry={(c) => setSelectedCountry(c)} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Praevisio AI - Centro de Mando (Ares) — Versión completa (archivada)</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-transparent rounded p-4">
              <CountryDashboard countryCode={selectedCountry} countries={countryData} accessLevel={accessLevel} missionsByLevel={missionsByLevel} onStartMission={startMission} />
            </div>
            <aside className="space-y-4">
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Mission Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-300">Estado de la misión: {runningMissionId ? <span className="text-emerald-400">En ejecución</span> : <span className="text-yellow-300">Inactiva</span>}</div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;