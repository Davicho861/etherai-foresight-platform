#!/usr/bin/env node
/**
 * scripts/sync_kanban_to_issues.js
 *
 * Lee `docs/PROJECT_KANBAN.md`, crea Issues en GitHub para cada tarea no convertida,
 * crea etiquetas según convenciones y reemplaza el texto en el Kanban por enlaces a los Issues.
 *
 * Requisitos de ejecución:
 *   - Node 18+
 *   - export GITHUB_TOKEN=ghp_... (con permisos repo)
 *   - export GITHUB_REPOSITORY=owner/repo (opcional, intenta inferir desde git)
 *
 * Uso:
 *   node scripts/sync_kanban_to_issues.js
 */

import fs from 'fs/promises';
import process from 'process';
import { execSync } from 'child_process';

const KANBAN_PATH = 'docs/PROJECT_KANBAN.md';

function slugLabel(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s:_-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

async function detectRepo() {
  const envRepo = process.env.GITHUB_REPOSITORY;
  if (envRepo) return envRepo;
  try {
    const origin = execSync('git config --get remote.origin.url').toString().trim();
    // origin can be git@github.com:owner/repo.git or https://github.com/owner/repo.git
    const m = origin.match(/[:/]([^/]+\/[^/.]+)(?:\.git)?$/);
    if (m) return m[1];
  } catch {
    // ignore
  }
  throw new Error('No GITHUB_REPOSITORY env var and cannot infer from git. Set GITHUB_REPOSITORY=owner/repo');
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Missing GITHUB_TOKEN environment variable. Export a token with repo permissions.');
    process.exit(1);
  }
  const repo = await detectRepo();
  const [owner, repoName] = repo.split('/');
  const apiBase = `https://api.github.com/repos/${owner}/${repoName}`;

  let content = await fs.readFile(KANBAN_PATH, 'utf8');

  // We'll instead find the first markdown table (| ... |) after '## Tablero Kanban'
  const kanbanIdx = content.indexOf('## Tablero Kanban');
  if (kanbanIdx === -1) {
    console.error('No se encontró la sección "## Tablero Kanban" en', KANBAN_PATH);
    process.exit(1);
  }
  const tableStart = content.indexOf('|', kanbanIdx);
  if (tableStart === -1) {
    // No table found, nothing to sync
    process.exit(1);
  }

  // Extract table block until a blank line followed by '---' or end of file
  const rest = content.slice(tableStart);
  const endMatch = rest.match(/\n\n---|\n\n## |\n\n$/);
  let tableBlock = '';
  if (endMatch) {
    tableBlock = rest.slice(0, endMatch.index);
  } else {
    tableBlock = rest;
  }

  const rows = tableBlock.split('\n').filter(Boolean);
  if (rows.length < 2) {
    console.error('Tabla Kanban no encontrada o demasiado pequeña.');
    process.exit(1);
  }

  // The rows start with header, separator, then data rows
  const dataRows = rows.slice(2);

  let updatedTable = rows.slice(0, 2).join('\n') + '\n';

  for (const row of dataRows) {
    // Split cells by '|', trim
    const cells = row.split('|').slice(1, -1).map(c => c.trim());
    const newCells = [];
    for (const cell of cells) {
      if (!cell) { newCells.push(''); continue; }
      // If cell already contains a GitHub link, keep
      if (cell.match(/https:\/\/github.com\/.+\/issues\/[0-9]+/)) {
        newCells.push(cell);
        continue;
      }
      // Split multiple tasks by ' | ' or newline
      const tasks = cell.split(/\n|\\n/).map(t => t.trim()).filter(Boolean);
      const newTasks = [];
      for (const task of tasks) {
        // Try to parse tags like [High][Backend]
        const tagMatches = [...task.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
        const text = task.replace(/\[[^\]]+\]/g, '').trim();
        if (!text) continue;

        // Create labels from tags
        const labels = tagMatches.map(tag => {
          const t = tag.toLowerCase();
          if (t.match(/p0|p1|priority|high|critical/)) return 'priority:high';
          if (t.match(/p2|p3|medium|low/)) return 'priority:medium';
          // area tags
          return slugLabel(tag);
        });

        // Create or find issue via GitHub API
        console.log('Creating issue for:', text);
        const issueResp = await fetch(apiBase + '/issues', {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'praevisio-aegis-script'
          },
          body: JSON.stringify({
            title: text,
            body: `Tarea sincronizada desde docs/PROJECT_KANBAN.md\n\nOriginal cell: ${cell}`,
            labels: labels
          })
        });
        if (!issueResp.ok) {
          const err = await issueResp.text();
          console.error('Error creando issue:', issueResp.status, err);
          process.exit(1);
        }
        const issue = await issueResp.json();
        const link = `[${text}](${issue.html_url})`;
        newTasks.push(link);

        // Ensure labels exist (best-effort)
        for (const lbl of labels) {
          const labelName = lbl;
          await fetch(apiBase + '/labels/' + encodeURIComponent(labelName), {
            method: 'PATCH',
            headers: {
              Authorization: `token ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: labelName })
          }).catch(() => {/* ignore */});
        }
      }
      newCells.push(newTasks.join('<br/>'));
    }
    updatedTable += '| ' + newCells.join(' | ') + ' |\n';
  }

  // Replace original table in content
  const beforeTable = content.slice(0, tableStart);
  const afterTable = content.slice(tableStart + tableBlock.length);
  const newContent = beforeTable + updatedTable + afterTable;

  await fs.writeFile(KANBAN_PATH, newContent, 'utf8');
  console.log('Actualizado', KANBAN_PATH, 'con enlaces a Issues.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
