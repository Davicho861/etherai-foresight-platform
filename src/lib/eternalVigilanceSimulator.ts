// Simulador muy ligero para emular flujos perpetuos en el frontend

 
type EventHandler = (_event: string) => void;
let handlers: EventHandler[] = [];
let intervalIds: number[] = [];
let state: any = {
  indices: { globalRisk: 5, stability: 95 },
  flows: {
    preservation: { status: 'IDLE', lastCheck: null },
    knowledge: { status: 'IDLE', opportunities: 0 },
    prophecy: { status: 'IDLE', alerts: 0 },
  },
  events: [] as string[],
};

const STORAGE_KEY = 'praevisio.eternal_vigilance_state_v1';

function loadFromStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed) {
      state = parsed;
    }
  } catch (e) {
    console.error('Failed to load state from storage', e);
  }
}

function saveToStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to storage', e);
  }
}

function subscribeEvents(fn: EventHandler) {
  handlers.push(fn);
}

function publish(ev: string) {
  state.events.unshift(ev);
  handlers.forEach(h => h(ev));
  // persistimos cambios de estado automáticamente
  saveToStorage();
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function startSimulator() {
  stopSimulator();
  publish('Vigilia iniciada: Cronos activo');

  // Auto-preservación: cada 60s
  const id1 = window.setInterval(() => {
    state.flows.preservation.status = 'CHECKING';
    state.flows.preservation.lastCheck = new Date().toISOString();
    publish(`Panteón: chequeo de salud ejecutado a ${state.flows.preservation.lastCheck}`);
    // aleatorio: detectar anomalía
    if (randomInt(10) > 7) {
      publish('Anomalía detectada: iniciando misión de reparación automática');
      state.flows.preservation.status = 'HEALING';
      publish('Misión de reparación completada');
      state.flows.preservation.status = 'IDLE';
    } else {
      state.flows.preservation.status = 'IDLE';
    }
  }, 60000);

  // Conocimiento: cada 30s
  const id2 = window.setInterval(() => {
    state.flows.knowledge.status = 'SCANNING';
    const found = randomInt(5) === 0;
    if (found) {
      state.flows.knowledge.opportunities += 1;
      publish('Kairós: nueva oportunidad detectada - proponiendo Misión de Expansión');
    }
    state.flows.knowledge.status = 'IDLE';
  }, 30000);

  // Profecía: cada 10s
  const id3 = window.setInterval(() => {
    state.flows.prophecy.status = 'RUNNING';
    // fluctuación de índice
    const delta = randomInt(5) - 2; // -2..2
    state.indices.globalRisk = Math.max(0, Math.min(100, state.indices.globalRisk + delta));
    if (state.indices.globalRisk > 70 && randomInt(3) === 0) {
      state.flows.prophecy.alerts += 1;
      publish(`Alerta Predictiva automática: índice de riesgo ${state.indices.globalRisk}% superó umbral`);
    }
    // publicar cambio
    publish(`Profecía: índice global de riesgo ${state.indices.globalRisk}% (delta ${delta})`);
    state.flows.prophecy.status = 'IDLE';
  }, 10000);

  intervalIds = [id1, id2, id3];
  saveToStorage();
}

export function stopSimulator() {
  intervalIds.forEach(id => clearInterval(id));
  intervalIds = [];
  publish('Vigilia detenida: Cronos en reposo');
  saveToStorage();
}

export function getCurrentState() {
  return state;
}

export function clearPersistence() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear persistence', e);
  }
}

export function downloadReport() {
  const header = '# ETERNAL_VIGILANCE_REPORT\n\n';
  const body = state.events.map((e: string, i: number) => `${i + 1}. ${e}`).join('\n');
  const content = header + '\n' + body;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ETERNAL_VIGILANCE_REPORT.md';
  a.click();
  URL.revokeObjectURL(url);
}

export { subscribeEvents };

// cargar estado en la inicialización si está disponible
try {
  loadFromStorage();
} catch (e) {
  console.error('Failed to load initial state', e);
}
