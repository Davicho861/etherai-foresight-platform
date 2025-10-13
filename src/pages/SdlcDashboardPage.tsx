import React, { useEffect, useState } from 'react';

type SDLCFile = { filename: string; sections: Array<{ title: string; content: string }>; };

const SDLCModule: React.FC<{ title: string; roles?: string[]; kpis?: Record<string, any>; status?: string; excerpt?: string }> = ({ title, roles, kpis, status, excerpt }) => {
  return (
    <div className="bg-gradient-to-b from-etherblue-800 to-etherblue-700 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${status === 'Healthy' ? 'bg-green-500 text-black' : 'bg-yellow-600 text-black'}`}>{status || 'Optimizando'}</span>
      </div>
      {roles && <div className="mt-2 text-gray-300 text-sm">Responsables: {roles.join(', ')}</div>}
      {excerpt && <div className="mt-3 text-gray-200 text-sm">{excerpt}</div>}
      {kpis && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {Object.entries(kpis).map(([k, v]) => (
            <div key={k} className="bg-etherblue-dark/40 p-2 rounded">
              <div className="text-xs text-gray-400">{k}</div>
              <div className="text-sm font-semibold text-white">{String(v)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const KanbanBoard: React.FC<{ columns: Array<{ name: string; tasks: string[] }> }> = ({ columns }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {columns.map(col => (
        <div key={col.name} className="min-w-[240px] bg-gray-800/30 border border-gray-700 rounded p-3">
          <h5 className="text-white font-semibold mb-2">{col.name}</h5>
          <div className="space-y-2">
            {col.tasks.map((t, i) => (
              <div key={i} className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-2 rounded shadow">
                {t}
              </div>
            ))}
            {col.tasks.length === 0 && <div className="text-gray-400 text-sm">Sin tareas</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

const BoardMemberCard: React.FC<{ name: string; role: string; directive?: string }> = ({ name, role, directive }) => (
  <div className="bg-etherblue-dark/50 border border-gray-700 rounded p-3">
    <div className="text-white font-semibold">{name}</div>
    <div className="text-gray-400 text-sm">{role}</div>
    {directive && <div className="mt-2 text-sm text-gray-300">{directive}</div>}
  </div>
);

const KPIsPanel: React.FC<{ kpis: Record<string, any> }> = ({ kpis }) => (
  <div className="grid grid-cols-2 gap-3">
    {Object.entries(kpis || {}).map(([k, v]) => (
      <div key={k} className="bg-gradient-to-r from-purple-800 to-indigo-800 p-3 rounded">
        <div className="text-xs text-gray-300">{k}</div>
        <div className="text-white font-semibold">{String(v)}</div>
      </div>
    ))}
  </div>
);

const SdlcDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdlcFiles, setSdlcFiles] = useState<SDLCFile[]>([]);
  const [kanban, setKanban] = useState<{ name: string; tasks: string[] }[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchState = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/sdlc/full-state');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        if (!mounted) return;
        setSdlcFiles(j.sdlc || []);
        setKanban((j.kanban && j.kanban.columns) || []);
      } catch (err: any) {
        setError(err.message || 'Error cargando SDLC');
      } finally {
        setLoading(false);
      }
    };
    fetchState();
    return () => { mounted = false; };
  }, []);

  // Map known phases to files by filename heuristic
  const phases = [
    { key: 'PLANNING', fileMatch: '01_PLANNING' },
    { key: 'DESIGN', fileMatch: '02_DESIGN' },
    { key: 'IMPLEMENTATION', fileMatch: '03_IMPLEMENTATION' },
    { key: 'DEPLOYMENT', fileMatch: '04_DEPLOYMENT' },
    { key: 'TESTING', fileMatch: '03_IMPLEMENTATION' },
  ];

  const extractRoleFromSections = (file?: SDLCFile) => {
    if (!file) return [] as string[];
    const roles: string[] = [];
    for (const s of file.sections) {
      if (/CEO|CTO|CFO|CMO|CSO|CIO|Development|Deployment|Crew/i.test(s.title)) {
        const m = s.title.match(/([A-Za-z ,]+)/);
        if (m) roles.push(m[0]);
      }
    }
    return roles.length ? roles : ['Aion'];
  };

  return (
    <div className="min-h-screen bg-etherblue-dark text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-etherneon">Apolo — Espejo de la Soberanía (SDLC)</h1>
      <div className="flex gap-6">
        {/* Left: SDLC modules */}
        <div className="w-1/3 space-y-4">
          {phases.map(p => {
            const f = sdlcFiles.find(sf => sf.filename.includes(p.fileMatch));
            return (
              <SDLCModule
                key={p.key}
                title={p.key}
                roles={extractRoleFromSections(f)}
                kpis={{ 'Estado': 'Saludable', 'Progreso': '—' }}
                status={'Healthy'}
                excerpt={f?.sections?.[0]?.content?.slice(0, 180)}
              />
            );
          })}
        </div>

        {/* Right: Empire State */}
        <div className="flex-1 space-y-4">
          <div className="bg-etherblue-dark/60 border border-gray-700 rounded p-4">
            <h3 className="text-xl font-semibold mb-3">El Kanban Viviente</h3>
            {loading ? <div className="text-gray-400">Cargando kanban...</div> : <KanbanBoard columns={kanban} />}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-etherblue-dark/50 border border-gray-700 rounded p-4">
              <h4 className="text-white font-semibold mb-3">Junta Directiva de Aion</h4>
              <div className="space-y-3">
                {sdlcFiles.slice(0,3).map((f, i) => (
                  <BoardMemberCard key={i} name={f.filename.replace(/_/g, ' ')} role={f.sections?.[0]?.title || 'Miembro'} directive={f.sections?.[0]?.content?.slice(0,120)} />
                ))}
              </div>
            </div>

            <div className="col-span-2 bg-etherblue-dark/50 border border-gray-700 rounded p-4">
              <h4 className="text-white font-semibold mb-3">KPIs de Salud Global del Sistema</h4>
              <KPIsPanel kpis={{ Uptime: '99.99%', 'API Latency': '120ms', 'Flujos Perpetuos': 'Activos' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SdlcDashboardPage;
