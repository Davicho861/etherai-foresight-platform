import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

// Lazy load C-Suite Divine Dashboards for performance optimization
const CEODashboard = React.lazy(() => import('../components/dashboards/CEODashboard'));
const CFODashboard = React.lazy(() => import('../components/dashboards/CFODashboard'));
const CMODashboard = React.lazy(() => import('../components/dashboards/CMODashboard'));
const CTODashboard = React.lazy(() => import('../components/dashboards/CTODashboard'));
const CIODashboard = React.lazy(() => import('../components/dashboards/CIODashboard'));
const COODashboard = React.lazy(() => import('../components/dashboards/COODashboard'));
const CSODashboard = React.lazy(() => import('../components/dashboards/CSODashboard'));

type SDLCFile = { filename: string; sections: Array<{ title: string; content: string }>; };
type KanbanColumn = { name: string; tasks: string[] };

const COLORS = ['#00D4FF', '#FF6B00', '#FFD700', '#FF0080', '#00FF80'];

const SDLCModule: React.FC<{
  title: string;
  roles?: string[];
  kpis?: Record<string, any>;
  status?: string;
  excerpt?: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ title, roles, kpis, status, excerpt, isActive, onClick }) => {
  return (
    <div
      className={`bg-gradient-to-b from-etherblue-800 to-etherblue-700 border border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-etherneon/20 ${
        isActive ? 'ring-2 ring-etherneon shadow-lg shadow-etherneon/30' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${status === 'Healthy' ? 'bg-green-500 text-black' : 'bg-yellow-600 text-black'}`}>
          {status || 'Optimizando'}
        </span>
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

const KanbanTask: React.FC<{
  task: any;
  isDragging?: boolean;
}> = ({ task, isDragging }) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Divine': return 'border-etherneon bg-etherneon/10';
      case 'High': return 'border-red-400 bg-red-400/10';
      case 'Medium': return 'border-yellow-400 bg-yellow-400/10';
      case 'Low': return 'border-gray-400 bg-gray-400/10';
      default: return 'border-gray-600 bg-gray-600/10';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-gradient-to-r from-etherblue-700 to-etherblue-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all border ${getPriorityColor(task.priority)} cursor-grab active:cursor-grabbing`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="font-semibold text-sm mb-1">{task.title}</div>
      {task.description && (
        <div className="text-xs text-gray-300 mb-2 line-clamp-2">{task.description}</div>
      )}
      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-1 rounded ${task.priority === 'Divine' ? 'bg-etherneon/20 text-etherneon' : 'bg-gray-600 text-gray-300'}`}>
          {task.priority || 'Medium'}
        </span>
        {task.assignee && (
          <span className="text-gray-400">👤 {task.assignee}</span>
        )}
      </div>
    </motion.div>
  );
};

const KanbanColumn: React.FC<{
  column: KanbanColumn;
  tasks: any[];
}> = ({ column, tasks }) => {
  return (
    <div className="min-w-[320px] bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-etherneon font-semibold flex items-center">
          <span className="w-3 h-3 bg-etherneon rounded-full mr-2"></span>
          {column.name}
        </h5>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTask key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-sm italic text-center py-8"
          >
            Sin tareas activas
          </motion.div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<{
  columns: KanbanColumn[];
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
}> = ({ columns, onDragEnd, onDragStart, onDragOver }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
    >
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const columnTasks = col.tasks || [];
          return (
            <KanbanColumn
              key={col.name}
              column={col}
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

const BoardMemberCard: React.FC<{ name: string; role: string; directive?: string; icon?: string }> = ({ name, role, directive, icon }) => (
  <div className="bg-gradient-to-br from-etherblue-dark/60 to-etherblue-800/60 border border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-etherneon/50">
    <div className="flex items-center mb-2">
      {icon && <span className="text-etherneon mr-2">{icon}</span>}
      <div className="text-white font-semibold">{name}</div>
    </div>
    <div className="text-gray-400 text-sm mb-2">{role}</div>
    {directive && <div className="text-sm text-gray-300 leading-relaxed">{directive}</div>}
  </div>
);

const KPIsPanel: React.FC<{ kpis: Record<string, any> }> = ({ kpis }) => (
  <div className="grid grid-cols-2 gap-4">
    {Object.entries(kpis || {}).map(([k, v]) => (
      <div key={k} className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-4 rounded-xl border border-gray-600 hover:border-purple-400/50 transition-colors">
        <div className="text-xs text-gray-300 uppercase tracking-wide">{k}</div>
        <div className="text-white font-bold text-lg">{String(v)}</div>
      </div>
    ))}
  </div>
);

const HealthChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="time" stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" />
      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
      <Line type="monotone" dataKey="uptime" stroke="#00D4FF" strokeWidth={2} />
      <Line type="monotone" dataKey="latency" stroke="#FF6B00" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

const RiskIndexChart: React.FC<{ value: number }> = ({ value }) => {
  const data = [{ name: 'Riesgo', value: value }, { name: 'Seguridad', value: 100 - value }];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6B00' : '#00D4FF'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const ModuleContent: React.FC<{
  activeModule: string;
  sdlcFiles: SDLCFile[];
  kanban: KanbanColumn[];
  kpis: Record<string, any>;
  loading: boolean;
}> = ({ activeModule, sdlcFiles, kanban, kpis, loading }) => {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-etherneon text-xl">Cargando el Panteón de la Gobernanza...</div>
      </div>
    );
  }

  // Wrap dashboard components with Suspense for lazy loading
  const renderDashboard = (DashboardComponent: React.LazyExoticComponent<React.ComponentType<any>>) => (
    <React.Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="text-etherneon text-xl animate-pulse">Cargando dashboard...</div>
      </div>
    }>
      <DashboardComponent />
    </React.Suspense>
  );

  switch (activeModule) {
    case 'CEO':
      return renderDashboard(CEODashboard);
    case 'CFO':
      return renderDashboard(CFODashboard);
    case 'CMO':
      return renderDashboard(CMODashboard);
    case 'CTO':
      return renderDashboard(CTODashboard);
    case 'CIO':
      return renderDashboard(CIODashboard);
    case 'COO':
      return renderDashboard(COODashboard);
    case 'CSO':
      return renderDashboard(CSODashboard);

    default:
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <div className="text-etherneon text-xl">Selecciona un miembro del Consejo Divino</div>
          </div>
        </div>
      );
  }
};

const SdlcDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdlcFiles, setSdlcFiles] = useState<SDLCFile[]>([]);
  const [kanban, setKanban] = useState<KanbanColumn[]>([]);
  const [kpis, setKpis] = useState<Record<string, any>>({});
  const [activeModule, setActiveModule] = useState('OVERVIEW');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draggedTask, setDraggedTask] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const fetchState = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch SDLC data
        const sdlcRes = await fetch('/api/sdlc/full-state');
        if (!sdlcRes.ok) throw new Error(`HTTP ${sdlcRes.status}`);
        const sdlcData = await sdlcRes.json();

        // Fetch Kanban data from new endpoint
        const kanbanRes = await fetch('/api/kanban/board');
        if (!kanbanRes.ok) throw new Error(`Kanban HTTP ${kanbanRes.status}`);
        const kanbanData = await kanbanRes.json();

        if (!mounted) return;

        setSdlcFiles(sdlcData.sdlc || []);
        setKanban(kanbanData.columns || []);
        setKpis(sdlcData.kpis || {
          Uptime: '99.99%',
          'API Latency': '120ms',
          'Flujos Perpetuos': 'Activos',
          'Multi-Domain Risk': '15%'
        });
      } catch (err: any) {
        setError(err.message || 'Error cargando SDLC');
      } finally {
        setLoading(false);
      }
    };
    fetchState();
    return () => { mounted = false; };
  }, []);

  const cSuiteMembers = [
    {
      key: 'CEO',
      title: 'CEO',
      role: 'Chief Executive Officer',
      icon: '👑',
      directive: 'Visión Imperial y Gobernanza Estratégica',
      avatar: '🏛️'
    },
    {
      key: 'CFO',
      title: 'CFO',
      role: 'Chief Financial Officer',
      icon: '💰',
      directive: 'Arquitectura Financiera y Eficiencia de Costos',
      avatar: '🏦'
    },
    {
      key: 'CMO',
      title: 'CMO',
      role: 'Chief Marketing Officer',
      icon: '📈',
      directive: 'Dominio de Mercado y Engagement Global',
      avatar: '🌍'
    },
    {
      key: 'CTO',
      title: 'CTO',
      role: 'Chief Technology Officer',
      icon: '⚡',
      directive: 'Innovación Tecnológica y Arquitectura Digital',
      avatar: '🔬'
    },
    {
      key: 'CIO',
      title: 'CIO',
      role: 'Chief Information Officer',
      icon: '🔗',
      directive: 'Flujos de Datos y Integración de Sistemas',
      avatar: '💾'
    },
    {
      key: 'COO',
      title: 'COO',
      role: 'Chief Operating Officer',
      icon: '⚙️',
      directive: 'Excelencia Operativa y Eficiencia Organizacional',
      avatar: '🏭'
    },
    {
      key: 'CSO',
      title: 'CSO',
      role: 'Chief Security Officer',
      icon: '🛡️',
      directive: 'Blindaje Digital y Protección del Imperio',
      avatar: '🔒'
    },
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

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = kanban.flatMap(col => col.tasks || []).find(t => t.id === active.id);
    setDraggedTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Validar que es una columna válida
    const validStatuses = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT'];
    if (!validStatuses.includes(newStatus)) return;

    try {
      // Actualizar en el backend
      const response = await fetch(`/api/kanban/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Actualizar estado local
      setKanban(prevKanban =>
        prevKanban.map(col => ({
          ...col,
          tasks: col.name === newStatus
            ? [...(col.tasks || []), ...prevKanban.flatMap(c => c.tasks?.filter(t => t.id === taskId) || [])]
            : (col.tasks || []).filter(t => t.id !== taskId)
        }))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Lógica adicional si es necesaria
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-etherblue-dark via-etherblue-900 to-black text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-etherneon flex items-center">
            <span className="mr-3">🏛️</span> Apolo — Panteón de la Gobernanza (SDLC)
          </h1>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-etherneon hover:text-white transition-colors p-2 rounded-lg hover:bg-etherblue-800/50"
          >
            {sidebarCollapsed ? '▶️' : '◀️'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar: C-Suite Divine Council */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} space-y-4`}>
            {cSuiteMembers.map(member => (
              <div
                key={member.key}
                className={`cursor-pointer transition-all duration-300 ${
                  sidebarCollapsed ? 'p-2' : 'p-4'
                } bg-gradient-to-b from-etherblue-800 to-etherblue-700 border border-gray-700 rounded-xl hover:shadow-lg hover:shadow-etherneon/20 ${
                  activeModule === member.key ? 'ring-2 ring-etherneon shadow-lg shadow-etherneon/30' : ''
                }`}
                onClick={() => setActiveModule(member.key)}
              >
                <div className="flex items-center">
                  <span className={`text-2xl ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`}>{member.avatar}</span>
                  {!sidebarCollapsed && (
                    <div>
                      <h4 className="text-white font-semibold">{member.title}</h4>
                      <div className="text-xs text-etherneon font-medium">{member.role}</div>
                      <div className="text-xs text-gray-400 mt-1">{member.directive}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Module Content */}
          <ModuleContent
            activeModule={activeModule}
            sdlcFiles={sdlcFiles}
            kanban={kanban}
            kpis={kpis}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SdlcDashboardPage;
