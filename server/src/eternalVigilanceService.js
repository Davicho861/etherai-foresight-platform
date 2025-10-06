// Servicio ligero de Vigilia Eterna para ejecutarse en el backend (Node)
// Mantiene estado en memoria y ofrece start/stop/state/clear/report
let intervalIds = [];
let subscribers = [];
let state = {
  indices: { globalRisk: 5, stability: 95 },
  flows: {
    preservation: { status: 'IDLE', lastCheck: null },
    knowledge: { status: 'IDLE', opportunities: 0 },
    prophecy: { status: 'IDLE', alerts: 0 },
  },
  events: [],
};

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(new URL(import.meta.url).pathname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'eternal_vigilance.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Error creating data directory:', e);
  }
}

function loadFromDisk() {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw || '{}');
    if (parsed) state = parsed;
  } catch (e) {
    console.error('Error loading state from disk:', e);
  }
}

// load persisted state at module initialization
try {
  loadFromDisk();
} catch (e) {
  console.error('Error during initial state load:', e);
}

function saveToDisk() {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving state to disk:', e);
  }
}

function publish(ev) {
  state.events.unshift(`${new Date().toISOString()} - ${ev}`);
  // notify SSE subscribers
  const payload = JSON.stringify({ event: ev, state });
  subscribers.forEach((res) => {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch (e) {
      console.error('Error publishing to subscriber:', e);
    }
  });
  // persist to disk
  saveToDisk();
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

export function getState() {
  return state;
}

export function subscribe(res) {
  subscribers.push(res);
}

export function unsubscribe(res) {
  subscribers = subscribers.filter(r => r !== res);
}

export function clearState() {
  state = {
    indices: { globalRisk: 5, stability: 95 },
    flows: {
      preservation: { status: 'IDLE', lastCheck: null },
      knowledge: { status: 'IDLE', opportunities: 0 },
      prophecy: { status: 'IDLE', alerts: 0 },
    },
    events: [],
  };
  stop();
  saveToDisk();
}

export function start() {
  stop();
  publish('Vigilia iniciada: Cronos activo (server)');

  const id1 = setInterval(() => {
    state.flows.preservation.status = 'CHECKING';
    state.flows.preservation.lastCheck = new Date().toISOString();
    publish(`Panteón: chequeo de salud ejecutado a ${state.flows.preservation.lastCheck}`);
    if (randomInt(10) > 7) {
      publish('Anomalía detectada: iniciando misión de reparación automática');
      state.flows.preservation.status = 'HEALING';
      publish('Misión de reparación completada');
      state.flows.preservation.status = 'IDLE';
    } else {
      state.flows.preservation.status = 'IDLE';
    }
  }, 60000);

  const id2 = setInterval(() => {
    state.flows.knowledge.status = 'SCANNING';
    const found = randomInt(5) === 0;
    if (found) {
      state.flows.knowledge.opportunities += 1;
      publish('Kairós: nueva oportunidad detectada - proponiendo Misión de Expansión');
    }
    state.flows.knowledge.status = 'IDLE';
  }, 30000);

  const id3 = setInterval(() => {
    state.flows.prophecy.status = 'RUNNING';
    const delta = randomInt(5) - 2;
    state.indices.globalRisk = Math.max(0, Math.min(100, state.indices.globalRisk + delta));
    if (state.indices.globalRisk > 70 && randomInt(3) === 0) {
      state.flows.prophecy.alerts += 1;
      publish(`Alerta Predictiva automática: índice de riesgo ${state.indices.globalRisk}% superó umbral`);
    }
    publish(`Profecía: índice global de riesgo ${state.indices.globalRisk}% (delta ${delta})`);
    state.flows.prophecy.status = 'IDLE';
  }, 10000);

  intervalIds = [id1, id2, id3];
  saveToDisk();
}

export function stop() {
  intervalIds.forEach(id => clearInterval(id));
  intervalIds = [];
  publish('Vigilia detenida: Cronos en reposo (server)');
  saveToDisk();
}

export function generateReport() {
  const header = '# ETERNAL_VIGILANCE_REPORT (server)\n\n';
  const body = state.events.map((e, i) => `${i + 1}. ${e}`).join('\n');
  return header + '\n' + body;
}

export function emitEvent(msg) {
  publish(msg);
}

export default {
  getState,
  start,
  stop,
  clearState,
  generateReport,
  emitEvent,
};
