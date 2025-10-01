#!/usr/bin/env node
import { execSync } from 'child_process';
import process from 'process';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: develop-feature "Feature description"');
  process.exit(2);
}
const description = args.join(' ');

try {
  console.log('=== Fase 1: Proponiendo plan ===');
  execSync(`npm run propose-plan -- "${description}"`, { stdio: 'inherit' });

  console.log('=== Fase 2: Generando componente ===');
  // Asumir nombre del componente basado en descripción, e.g. "Crear widget de actividad" -> "RecentActivityWidget"
  const componentName = description.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20) + 'Widget';
  execSync(`npm run generate:component -- "${componentName}" "${description}"`, { stdio: 'inherit' });

  console.log('=== Fase 3: Generando test E2E ===');
  // Ruta del test, e.g. /dashboard para widget de dashboard
  const route = '/dashboard'; // Asumir dashboard por defecto, o parsear de descripción
  execSync(`npm run generate:test:e2e -- "${route}" "${description}"`, { stdio: 'inherit' });

  console.log('=== Fase 4: Validando ===');
  execSync('npm run validate', { stdio: 'inherit' });

  console.log('=== Desarrollo Blindado Autónomo completado exitosamente ===');
} catch (err) {
  console.error('Error en el proceso de desarrollo:', err);
  process.exit(1);
}