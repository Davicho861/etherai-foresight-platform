#!/usr/bin/env node
// scripts/import_kanban_to_backend.js
// Lee data/kanban.json y crea tareas en el backend via /api/kanban/tasks

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const root = process.cwd();
const kanbanPath = path.join(root, 'data', 'kanban.json');
const API_BASE = process.env.API_BASE || 'http://localhost:4000';

async function createTask(task, columnName, dryRun = false) {
  const payload = {
    title: task.title,
    description: task.title,
    status: columnName,
    priority: task.priority || 'Medium',
    metadata: { link: task.link || null }
  };

  if (dryRun) {
    return { dryRun: true, payload };
  }

  const res = await fetch(`${API_BASE}/api/kanban/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create task: ${res.status} ${text}`);
  }

  return res.json();
}

async function main() {
  if (!fs.existsSync(kanbanPath)) {
    console.error('No se encontró data/kanban.json. Genera primero con npm run generate:kanban');
    process.exit(1);
  }

  const raw = fs.readFileSync(kanbanPath, 'utf8');
  const json = JSON.parse(raw);
  const columns = json.columns || [];

  console.log('Importando kanban a', API_BASE);

  const dryRun = process.env.DRY_RUN === '1' || process.argv.includes('--dry');

  // Fetch existing board to deduplicate
  let existing = { columns: [] };
  try {
    const bRes = await fetch(`${API_BASE}/api/kanban/board`);
    if (bRes.ok) existing = await bRes.json();
  } catch (err) {
    console.warn('No se pudo leer tablero existente:', err.message);
  }

  // Flatten existing tasks by title -> { id, title, status }
  const existingMap = new Map();
  for (const c of (existing.columns || [])) {
    for (const t of (c.tasks || [])) {
      existingMap.set(String(t.title).trim().toLowerCase(), { ...t, status: c.name });
    }
  }

  for (const col of columns) {
    const colName = col.name;
    for (const t of (col.tasks || [])) {
      try {
        const key = String(t.title).trim().toLowerCase();
        const found = existingMap.get(key);
        if (found) {
          // If exists but status differs, update via PUT
          if (found.status !== colName) {
            if (dryRun) {
              console.log('[dry-run] Would update task:', found.id, '->', colName);
            } else {
              const updRes = await fetch(`${API_BASE}/api/kanban/tasks/${found.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: colName })
              });
              if (!updRes.ok) {
                const txt = await updRes.text();
                throw new Error(`Failed updating task ${found.id}: ${updRes.status} ${txt}`);
              }
              console.log('Actualizada:', found.id);
            }
          } else {
            console.log('Ya existe y está en la columna correcta:', found.id);
          }
        } else {
          const created = await createTask(t, colName, dryRun);
          if (dryRun) {
            console.log('[dry-run] Would create:', created.payload.title);
          } else {
            console.log('Creada:', created.id || created.title || '[ok]');
          }
        }
      } catch (err) {
        console.error('Error al procesar tarea', t.title, err.message);
      }
    }
  }

  console.log('Importación finalizada.');
}

main().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
