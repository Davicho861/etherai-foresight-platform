import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

const SERVER_DIR = process.cwd();

async function runJestFocal() {
  return new Promise((resolve) => {
    const jest = spawn('npm', ['test', '--runInBand', '--testPathPattern=globalRiskRoutes'], {
      cwd: SERVER_DIR,
      stdio: 'pipe'
    });

    let output = '';
    jest.stdout.on('data', (data) => output += data.toString());
    jest.stderr.on('data', (data) => output += data.toString());

    jest.on('close', (code) => {
      resolve({ code, output });
    });
  });
}

async function runJestFull() {
  return new Promise((resolve) => {
    const jest = spawn('npm', ['test', '--json', '--coverage'], {
      cwd: SERVER_DIR,
      stdio: 'pipe'
    });

    let output = '';
    jest.stdout.on('data', (data) => output += data.toString());
    jest.stderr.on('data', (data) => output += data.toString());

    jest.on('close', (code) => {
      resolve({ code, output });
    });
  });
}

async function runAudit() {
  return new Promise((resolve) => {
    const audit = spawn('npm', ['audit', '--json'], {
      cwd: SERVER_DIR,
      stdio: 'pipe'
    });

    let output = '';
    audit.stdout.on('data', (data) => output += data.toString());
    audit.stderr.on('data', (data) => output += data.toString());

    audit.on('close', (code) => {
      resolve({ code, output });
    });
  });
}

async function runStartNative() {
  return new Promise((resolve) => {
    const start = spawn('npm', ['run', 'start:native'], {
      cwd: SERVER_DIR,
      stdio: 'pipe'
    });

    let output = '';
    start.stdout.on('data', (data) => output += data.toString());
    start.stderr.on('data', (data) => output += data.toString());

    // If running in an environment without a DB, allow DB_MOCK to short-circuit
    if (process.env.DB_MOCK === 'true') {
      // let the process run shortly and then assume success
      setTimeout(() => {
        try { start.kill('SIGTERM'); } catch (e) {}
        resolve({ code: 0, output: output + '\n[DB_MOCK] start short-circuited' });
      }, 2000);
    } else {
      setTimeout(() => {
        start.kill('SIGTERM');
        resolve({ code: 0, output }); // Assume success if no crash in 30s
      }, 30000);
    }

    start.on('close', (code) => {
      resolve({ code, output });
    });
  });
}

async function checkCoverage() {
  try {
    const coveragePath = path.join(SERVER_DIR, 'coverage', 'coverage-summary.json');
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
    const linesPct = coverage.total.lines.pct;
    return linesPct >= 90;
  } catch (e) {
    return false;
  }
}

async function checkAudit() {
  try {
    const auditPath = path.join(SERVER_DIR, 'audit_report.json');
    const audit = JSON.parse(readFileSync(auditPath, 'utf8'));
    return audit.metadata.vulnerabilities.total === 0;
  } catch (e) {
    return false;
  }
}

async function divineLoop() {
  console.log('🔥 ARES-III: Loop Eterno de Imperio Iniciado 🔥');

  let cycle = 0;
  const maxCycles = 50; // Prevent infinite loops

  while (cycle < maxCycles) {
    cycle++;
    console.log(`\n⚡ Ciclo ${cycle}: Escáner Divino`);

    // Run focal tests
    const focalResult = await runJestFocal();
    const focalPassed = focalResult.code === 0;

    // Run full tests with coverage
    const fullResult = await runJestFull();
    const fullPassed = fullResult.code === 0;

    // Check coverage
    const coverageGood = await checkCoverage();

    // Check audit
    const auditGood = await checkAudit();

    // Test start:native
    const startResult = await runStartNative();
    const startGood = startResult.code === 0;

    console.log(`📊 Estado: Focal=${focalPassed}, Full=${fullPassed}, Coverage>=90=${coverageGood}, Audit=0=${auditGood}, Start=${startGood}`);

    if (focalPassed && fullPassed && coverageGood && auditGood && startGood) {
      console.log('🎉 IMPERIO ETERNO ALCANZADO! Victoria Divina!');
      break;
    }

    // If not perfect, fix issues
    if (!auditGood) {
      console.log('🔧 Aplicando audit fix...');
      spawn('npm', ['audit', 'fix', '--force'], { cwd: SERVER_DIR, stdio: 'inherit' }).on('close', () => {});
    }

    // Wait before next cycle
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  if (cycle >= maxCycles) {
    console.log('⚠️ Máximo ciclos alcanzado. Requiere intervención manual.');
  }
}

// Run the divine loop
divineLoop().catch(console.error);