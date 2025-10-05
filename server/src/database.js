import neo4j from 'neo4j-driver';
import 'dotenv/config';

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
          // For durability, consider writing to disk or a proper Chroma client.
          if (!global.__praevisio_chroma_fallback) global.__praevisio_chroma_fallback = {};
          if (!global.__praevisio_chroma_fallback[col]) global.__praevisio_chroma_fallback[col] = [];
          global.__praevisio_chroma_fallback[col].push({ id, missionId, log, embedding, ts: Date.now() });
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

function getNeo4jDriver() {
  if (!neo4jDriver) {
    neo4jDriver = neo4j.driver('bolt://neo4j:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password'));
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
