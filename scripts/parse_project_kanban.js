#!/usr/bin/env node
// scripts/parse_project_kanban.js
// Lee docs/PROJECT_KANBAN.md y genera data/kanban.json con estructura:
// { columns: [ { name: 'PLANNING', tasks: [ { id, title, link?, priority? } ] }, ... ] }

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const kanbanPaths = [path.join(root, 'docs', 'PROJECT_KANBAN.md'), path.join(root, 'PROJECT_KANBAN.md')];

function findKanbanPath() {
  for (const p of kanbanPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function parseMarkdownTable(content) {
  // Buscamos la primera tabla que contenga columnas PLANNING, DESIGN, IMPLEMENTATION, TESTING, DEPLOYMENT
  const lines = content.split('\n');
  let tableStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\|.*\|/.test(lines[i]) && /PLANNING|DESIGN|IMPLEMENTATION|TESTING|DEPLOYMENT/i.test(lines[i])) {
      tableStart = i;
      break;
    }
  }
  if (tableStart === -1) return null;

  // La tabla puede tener 3+ líneas: header, separator, rows...
  const headerLine = lines[tableStart];
  const separatorLine = lines[tableStart + 1] || '';

  const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);

  // Recolectar filas hasta encontrar una línea vacía
  const rows = [];
  for (let i = tableStart + 2; i < lines.length; i++) {
    const l = lines[i];
    if (!l || !/^\|.*\|/.test(l)) break;
    rows.push(l);
  }

  // Convertir filas a celdas
  const tableCells = rows.map(r => r.split('|').map(c => c.trim()).filter(Boolean));

  // Inicializar columns (normalizar nombres a mayúsculas y mapeos comunes)
  const normalizeHeader = (h) => {
    const key = h.toUpperCase().trim();
    if (/BACKLOG|TODO/i.test(key)) return 'PLANNING';
    if (/PLANNING|PLANIFICACI/i.test(key)) return 'PLANNING';
    if (/DESIGN|DISEÑ|DISEÑO/i.test(key)) return 'DESIGN';
    if (/IMPLEMENTATION|IMPLEMENTACI/i.test(key)) return 'IMPLEMENTATION';
    if (/TESTING|PRUEBAS|QA/i.test(key)) return 'TESTING';
    if (/DEPLOYMENT|DESPLIEGUE|DEPLOY/i.test(key)) return 'DEPLOYMENT';
    return key.replace(/[^A-Z0-9]/g, '_');
  };

  const columns = headers.map(h => ({ name: normalizeHeader(h), tasks: [] }));

  for (const rowCells of tableCells) {
    for (let colIdx = 0; colIdx < headers.length; colIdx++) {
      const cell = rowCells[colIdx] || '';
      // Cada celda puede contener varios enlaces o textos separados por '|' o '<br>' o ' - '
      const items = cell.split(/\n|<br>|,|;|·|\|/).map(s => s.trim()).filter(Boolean);
      for (const it of items) {
        // Extraer posible link y title
        const m = it.match(/\[(.*?)\]\((.*?)\)/);
        let task = null;
        if (m) {
          task = { title: m[1], link: m[2] };
        } else if (it) {
          task = { title: it };
        }
        if (task) {
          // Generar un ID simple basado en el título y la columna
          const safe = `${columns[colIdx].name}-${task.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          task.id = safe;
          // Detectar prioridad si aparece en el texto entre corchetes [High], (Divine) etc.
          const p = it.match(/\[(Divine|High|Medium|Low)\]|\((Divine|High|Medium|Low)\)/i);
          if (p) task.priority = (p[1] || p[2]).replace(/[^a-z]/gi, '');
          columns[colIdx].tasks.push(task);
        }
      }
    }
  }

  return columns;
}

function main() {
  const p = findKanbanPath();
  if (!p) {
    console.error('No se encontró PROJECT_KANBAN.md en rutas esperadas');
    process.exit(1);
  }

  const raw = fs.readFileSync(p, 'utf8');
  const columns = parseMarkdownTable(raw);
  if (!columns) {
    console.error('No se pudo parsear la tabla Kanban desde PROJECT_KANBAN.md');
    process.exit(1);
  }

  const outDir = path.join(root, 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, 'kanban.json');

  fs.writeFileSync(outPath, JSON.stringify({ columns }, null, 2), 'utf8');
  console.log('Kanban JSON generado en', outPath);
}

main();
