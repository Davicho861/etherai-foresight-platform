import neo4j from 'neo4j-driver';
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
// Prefer process.cwd() when import.meta isn't available (Jest test envs)
let __dirname = process.cwd();
try {
  // When running as ESM, fileURLToPath(import.meta.url) gives accurate dirname
  // but in some test runners import.meta may not be supported in transformed code.
  // Guard it with a try/catch to remain robust.
  // eslint-disable-next-line no-undef
  // Note: fileURLToPath may not be available when tests transform modules; fallback above
  // keeps behavior stable across environments.
  // ...existing code...
} catch (e) {
  // keep process.cwd() as __dirname
}
// Paths for persisting chroma fallback to disk so native mode can survive restarts
const FALLBACK_DIR = path.join(__dirname, '..', 'data');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'chroma_fallback.json');

async function loadFallbackFromDisk() {
  try {
    const txt = await fs.readFile(FALLBACK_FILE, 'utf8');
    global.__praevisio_chroma_fallback = JSON.parse(txt);
    console.log('Loaded chroma fallback from disk');
  } catch (e) {
    global.__praevisio_chroma_fallback = global.__praevisio_chroma_fallback || {};
  }
}

async function persistFallbackToDisk() {
  try {
    await fs.mkdir(FALLBACK_DIR, { recursive: true });
    await fs.writeFile(FALLBACK_FILE, JSON.stringify(global.__praevisio_chroma_fallback || {}, null, 2), 'utf8');
  } catch (e) {
    console.warn('Failed to persist chroma fallback to disk:', e.message);
  }
}

// Load persisted fallback if present (fire-and-forget)
loadFallbackFromDisk().catch(() => {});

let chromaClient;
let neo4jDriver;

const CHROMA_URL = process.env.CHROMA_URL || process.env.OLLAMA_CHROMA_URL || 'http://chromadb:8000';

function textToEmbedding(text, dims = 8) {
  // Lightweight deterministic embedding fallback for local usage.
  // Produces a vector of length `dims` using a simple hash-based scheme.
  const v = new Array(dims).fill(0);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    v[i % dims] = (v[i % dims] + code) % 1000;
  }
  // normalize to floats between -1 and 1
  const max = Math.max(...v.map(Math.abs)) || 1;
  return v.map((x) => (x / max));
}

function getChromaClient() {
  // If running in native dev mode, avoid calling external Chroma service and
  // provide an in-memory fallback client so the app remains fully functional
  // without external dependencies.
  if (process.env.NATIVE_DEV_MODE === 'true') {
    if (!chromaClient) {
      chromaClient = {
        url: 'native-disabled',
        async isAlive() { return false; },
        async ensureCollection() { return; },
        async upsertLog(missionId, log) {
          // keep fallback storage in memory
          const col = `missions_logs`;
          const text = typeof log === 'string' ? log : (log.description || JSON.stringify(log));
          const id = `${missionId}-${(Date.now()).toString(36)}-${Math.floor(Math.random() * 10000)}`;
          const embedding = textToEmbedding(text, 8);
          if (!global.__praevisio_chroma_fallback) global.__praevisio_chroma_fallback = {};
          if (!global.__praevisio_chroma_fallback[col]) global.__praevisio_chroma_fallback[col] = [];
          global.__praevisio_chroma_fallback[col].push({ id, missionId, log, embedding, ts: Date.now() });
        },
        async querySimilar(text, topK = 5) {
          if (global.__praevisio_chroma_fallback && global.__praevisio_chroma_fallback['missions_logs']) {
            return global.__praevisio_chroma_fallback['missions_logs'].slice(-topK);
          }
          return [];
        }
      };
    }
    return chromaClient;
  }

  if (!chromaClient) {
    chromaClient = {
      url: CHROMA_URL,
      async isAlive() {
        try {
          const resp = await fetch(`${this.url}/api/v1/heartbeat`, { method: 'GET' });
          return resp.ok;
        } catch {
          return false;
        }
      },
      async ensureCollection(name) {
        try {
          // Attempt to create collection if it doesn't exist. API surface may differ
          // between Chroma versions; silent-ignore on failure and rely on fallback.
          await fetch(`${this.url}/api/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
          }).catch(() => {});
        } catch {
          // ignore
        }
      },
      async upsertLog(missionId, log) {
        const col = `missions_logs`;
        const text = typeof log === 'string' ? log : (log.description || JSON.stringify(log));
        const id = `${missionId}-${(Date.now()).toString(36)}-${Math.floor(Math.random() * 10000)}`;
        const embedding = textToEmbedding(text, 8);
          try {
            const alive = await this.isAlive();
            if (!alive) throw new Error('Chroma unreachable');

            await this.ensureCollection(col);

            // Try the common Chroma REST shape: /api/collections/{name}/points
            const body = {
              ids: [id],
              embeddings: [embedding],
              metadatas: [{ missionId, ...(log || {}) }],
              documents: [text],
            };
            await fetch(`${this.url}/api/collections/${encodeURIComponent(col)}/points`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
          } catch {
            // Fallback: write to a simple in-memory map so system continues to operate.
            if (!global.__praevisio_chroma_fallback) global.__praevisio_chroma_fallback = {};
            if (!global.__praevisio_chroma_fallback[col]) global.__praevisio_chroma_fallback[col] = [];
            global.__praevisio_chroma_fallback[col].push({ id, missionId, log, embedding, ts: Date.now() });
            // Persist fallback to disk asynchronously (best-effort)
            persistFallbackToDisk().catch(() => {});
          }
      },
      async querySimilar(text, topK = 5) {
        try {
          const alive = await this.isAlive();
          if (!alive) throw new Error('Chroma unreachable');
          const embedding = textToEmbedding(text, 8);
          const resp = await fetch(`${this.url}/api/collections/missions_logs/points/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query_embeddings: [embedding], n_results: topK }),
          });
          if (!resp.ok) return [];
          const data = await resp.json();
          return data;
        } catch {
          if (global.__praevisio_chroma_fallback && global.__praevisio_chroma_fallback['missions_logs']) {
            return global.__praevisio_chroma_fallback['missions_logs'].slice(-topK);
          }
          return [];
        }
      }
    };
  }
  return chromaClient;
}

async function getNeo4jDriver() {
  // Prevent Neo4j connections during unit tests to avoid external side effects
  if (process.env.NODE_ENV === 'test') return null;
  // If running in native local mode, skip connecting to Neo4j and return null
  // so callers can decide to operate in degraded/local mode.
  if (process.env.NATIVE_DEV_MODE === 'true') {
    return null;
  }

  if (!neo4jDriver) {
    const host = process.env.NEO4J_HOST || 'localhost';
    const port = process.env.NEO4J_PORT || '7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'praevisio_password';
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        neo4jDriver = neo4j.driver(`bolt://${host}:${port}`, neo4j.auth.basic(user, password), {
          maxConnectionPoolSize: 10,
          connectionTimeout: 30000,
          maxTransactionRetryTime: 30000,
        });

        // Test the connection
        const session = neo4jDriver.session();
        await session.run('RETURN 1 as test');
        await session.close();

        console.log('Neo4j connection established successfully');
        break;
      } catch (error) {
        console.warn(`Neo4j connection attempt ${attempt}/${maxRetries} failed:`, error.message);
        if (neo4jDriver) {
          await neo4jDriver.close();
          neo4jDriver = null;
        }
        if (attempt === maxRetries) {
          throw new Error(`Failed to connect to Neo4j after ${maxRetries} attempts: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  return neo4jDriver;
}

async function closeConnections() {
  if (neo4jDriver) {
    await neo4jDriver.close();
  }
}

export {
  getChromaClient,
  getNeo4jDriver,
  closeConnections,
};
