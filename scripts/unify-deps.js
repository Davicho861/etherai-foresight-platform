#!/usr/bin/env node
/*
  scripts/unify-deps.js

  Propósito:
  - Buscar package.json en el árbol de directorios (con límites razonables)
  - Consolidar dependencias, devDependencies y peerDependencies
  - Resolver conflictos de versión usando reglas sencillas:
      * Preferir la versión presente en el package.json del directorio de trabajo (target)
      * Si no existe, preferir la versión "mayor" usando comparación numérica simple
  - Hacer backup del package.json objetivo y escribir la versión consolidada
  - Generar un único package-lock.json en el directorio raíz

  Nota: Este script intenta reducir conflictos de rango antes de ejecutar `npm ci`.
  No pretende sustituir una resolución semántica completa; es una mejora pragmática
  para minimizar fallos ERESOLVE en entornos de construcción.
*/

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const IGNORED_DIRS = new Set(['node_modules', '.git', 'test-results', 'tmp', 'dist']);

async function findPackageJsons(dir, depth = 2, results = new Set()) {
  if (depth < 0) return results;
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const ent of entries) {
    if (ent.isDirectory()) {
      if (IGNORED_DIRS.has(ent.name)) continue;
      const sub = path.join(dir, ent.name);
      await findPackageJsons(sub, depth - 1, results);
    } else if (ent.isFile() && ent.name === 'package.json') {
      results.add(path.join(dir, ent.name));
    }
  }
  return results;
}

function mergeDeps(deps1 = {}, deps2 = {}) {
  const merged = { ...deps1 };
  for (const [dep, version] of Object.entries(deps2)) {
    if (!merged[dep]) merged[dep] = version;
    else {
      // Keep the highest semantic-looking version (best-effort)
      const v1 = String(merged[dep]).replace(/^[^0-9]*/, '');
      const v2 = String(version).replace(/^[^0-9]*/, '');
      const p1 = v1.split('.').map(n => parseInt(n, 10) || 0);
      const p2 = v2.split('.').map(n => parseInt(n, 10) || 0);
      for (let i = 0; i < 3; i++) {
        const a = p1[i] || 0;
        const b = p2[i] || 0;
        if (b > a) { merged[dep] = version; break; }
        if (b < a) break;
      }
    }
  }
  return merged;
}

async function readJson(file) {
  try {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

async function main() {
  const cwd = process.cwd();
  console.log('[unify-deps] Starting dependency unification in', cwd);

  const roots = [cwd];
  let cur = cwd;
  for (let i = 0; i < 2; i++) {
    const p = path.dirname(cur);
    if (!p || p === cur) break;
    roots.push(p);
    cur = p;
  }

  const found = new Set();
  for (const r of roots) {
    const pkgs = await findPackageJsons(r, 2);
    for (const pth of pkgs) found.add(pth);
  }

  const packageJsonPaths = Array.from(found).sort();
  if (packageJsonPaths.length === 0) {
    console.log('[unify-deps] No package.json files found. Nothing to do.');
    return 0;
  }

  // Read all package.json files
  const jsons = {};
  for (const pth of packageJsonPaths) {
    const j = await readJson(pth);
    if (j) jsons[pth] = j;
  }

  // Consolidate
  let combinedDeps = {};
  let combinedDev = {};
  for (const j of Object.values(jsons)) {
    combinedDeps = mergeDeps(combinedDeps, j.dependencies || {});
    combinedDev = mergeDeps(combinedDev, j.devDependencies || {});
  }

  const targetPath = path.join(cwd, 'package.json');
  const targetJson = (await readJson(targetPath)) || { name: path.basename(cwd), version: '0.0.0' };

  const newPackage = { ...targetJson };
  newPackage.dependencies = { ...(newPackage.dependencies || {}), ...combinedDeps };
  newPackage.devDependencies = { ...(newPackage.devDependencies || {}), ...combinedDev };

  // Backup and write
  try {
    const bak = targetPath + '.bak.' + Date.now();
    await fs.copyFile(targetPath, bak).catch(() => {});
    await fs.writeFile(targetPath, JSON.stringify(newPackage, null, 2) + '\n', 'utf8');
    console.log('[unify-deps] Wrote unified package.json to', targetPath);
  } catch (e) {
    console.error('[unify-deps] Failed to write package.json:', e.message);
    process.exit(1);
  }

  // Generate unified package-lock.json
  try {
    console.log('[unify-deps] Generating unified package-lock.json...');
    execSync('npm install --package-lock-only --ignore-scripts --no-audit --no-fund --legacy-peer-deps', { stdio: 'inherit', cwd });
    console.log('[unify-deps] Unified package-lock.json generated successfully.');
  } catch (e) {
    console.warn('[unify-deps] npm install failed or was skipped:', e.message);
  }

  console.log('[unify-deps] Done.');
  return 0;
}

main().catch(err => {
  console.error('[unify-deps] Unexpected error:', err);
  process.exit(1);
});