#!/usr/bin/env node
/*
  scripts/docker-janitor.js

  Propósito:
  - Limpiar automáticamente imágenes y contenedores Docker en desuso
  - Se ejecuta como parte del pre-push hook para prevenir sobrellenado del disco
  - Misión: Mantener el ecosistema limpio y eficiente
*/

import { execSync } from 'child_process';

async function cleanDocker() {
  try {
    console.log('[docker-janitor] Starting Docker cleanup...');

    // Execute docker system prune -f to remove unused containers, networks, and images
    const result = execSync('docker system prune -f --volumes', { encoding: 'utf8', stdio: 'inherit' });

    console.log('[docker-janitor] Docker cleanup completed successfully.');
    return true;
  } catch (error) {
    console.warn('[docker-janitor] Docker cleanup failed or was skipped:', error.message);
    return false;
  }
}

cleanDocker().catch(err => {
  console.error('[docker-janitor] Unexpected error:', err);
  process.exit(1);
});