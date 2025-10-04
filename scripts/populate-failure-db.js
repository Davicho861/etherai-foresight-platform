#!/usr/bin/env node
/*
  scripts/populate-failure-db.js

  Propósito:
  - Poblar la base de datos ChromaDB con patrones de fallo históricos
  - Leer RUNBOOK_DE_ERRORES_COMUNES.md y extraer errores comunes
  - Incluir lecciones aprendidas de la conversación actual
  - Alimentar la colección 'failure_patterns' para el Oráculo precognitivo
*/

import fs from 'fs/promises';
import path from 'path';
import { getChromaClient } from '../server/src/database.js';

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

async function parseRunbook(runbookPath) {
  const content = await fs.readFile(runbookPath, 'utf8');
  const lines = content.split('\n');
  const errors = [];

  let inTable = false;
  for (const line of lines) {
    if (line.startsWith('| Error |')) {
      inTable = true;
      continue;
    }
    if (inTable && line.startsWith('|-------|')) continue;
    if (inTable && line.startsWith('| ')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 4) {
        errors.push({
          error: parts[1],
          cause: parts[2],
          solution: parts[3]
        });
      }
    }
  }
  return errors;
}

async function populateFailurePatterns() {
  // For host execution, use localhost instead of chromadb service name
  const CHROMA_URL = 'http://localhost:8000';
  const client = {
    url: CHROMA_URL,
    async isAlive() {
      try {
        const resp = await fetch(`${this.url}/api/v1/heartbeat`, { method: 'GET' });
        return resp.ok;
      } catch (e) {
        return false;
      }
    },
    async ensureCollection(name) {
      try {
        await fetch(`${this.url}/api/collections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }
  };

  const alive = await client.isAlive();
  if (!alive) {
    console.log('[populate-failure-db] ChromaDB not reachable, skipping population');
    return;
  }

  const collectionName = 'failure_patterns';

  // Ensure collection exists
  await client.ensureCollection(collectionName);

  // Leer RUNBOOK
  const runbookPath = path.join(process.cwd(), 'docs', '03_OPERACIONES', 'RUNBOOK_DE_ERRORES_COMUNES.md');
  const runbookErrors = await parseRunbook(runbookPath);

  // Añadir errores del RUNBOOK
  for (const err of runbookErrors) {
    const text = `${err.error}: ${err.cause} - ${err.solution}`;
    const id = `runbook_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const embedding = textToEmbedding(text, 8);
    const metadata = {
      source: 'runbook',
      error: err.error,
      cause: err.cause,
      solution: err.solution,
      timestamp: new Date().toISOString()
    };

    try {
      const body = {
        ids: [id],
        embeddings: [embedding],
        metadatas: [metadata],
        documents: [text],
      };
      await fetch(`${client.url}/api/collections/${encodeURIComponent(collectionName)}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log(`[populate-failure-db] Added runbook error: ${err.error}`);
    } catch (e) {
      console.warn(`[populate-failure-db] Failed to add runbook error: ${e.message}`);
    }
  }

  // Añadir lecciones de la conversación (resumidas)
  const conversationLessons = [
    {
      error: 'Conflicto de Peer Dependency con react-simple-maps@1.0.0',
      cause: 'Versión incompatible causando conflictos históricos',
      solution: 'Usar versión compatible ^3.0.0'
    },
    {
      error: 'ERESOLVE en npm install',
      cause: 'Dependencias conflictivas entre workspaces',
      solution: 'Unificar dependencias con script unify-deps.js y usar --legacy-peer-deps'
    },
    {
      error: 'Fallas en E2E tests por ERR_CONNECTION_REFUSED',
      cause: 'Orquestación de servicios Docker incompleta',
      solution: 'Usar npm run validate con docker-compose atómico'
    }
  ];

  for (const lesson of conversationLessons) {
    const text = `${lesson.error}: ${lesson.cause} - ${lesson.solution}`;
    const id = `conversation_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const embedding = textToEmbedding(text, 8);
    const metadata = {
      source: 'conversation',
      error: lesson.error,
      cause: lesson.cause,
      solution: lesson.solution,
      timestamp: new Date().toISOString()
    };

    try {
      const body = {
        ids: [id],
        embeddings: [embedding],
        metadatas: [metadata],
        documents: [text],
      };
      await fetch(`${client.url}/api/collections/${encodeURIComponent(collectionName)}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log(`[populate-failure-db] Added conversation lesson: ${lesson.error}`);
    } catch (e) {
      console.warn(`[populate-failure-db] Failed to add conversation lesson: ${e.message}`);
    }
  }

  console.log('[populate-failure-db] Population completed');
}

populateFailurePatterns().catch(err => {
  console.error('[populate-failure-db] Error:', err);
  process.exit(1);
});