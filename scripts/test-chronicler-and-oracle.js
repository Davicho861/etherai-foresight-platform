#!/usr/bin/env node
import Oracle from '../server/src/oracle.js';
import { publish } from '../server/src/eventHub.js';

async function run() {
  console.log('Starting local test: Oracle + Chronicler');
  const oracle = new Oracle();
  const prediction = await oracle.predictFailure('npm install react-simple-maps@1.0.0', '{}');
  console.log('Oracle prediction:', prediction);

  if (prediction.probability > 0.5) {
    console.log('Oracle suggests aborting. Emitting error event to trigger Chronicler...');
    publish('test-mission', { taskId: 'sacrifice-test', description: `Blocked by oracle: ${prediction.suggestion}`, status: 'error' });
  } else {
    console.log('Oracle allowed action (simulation).');
  }

  // Give chronicler a moment to write
  await new Promise(r => setTimeout(r, 500));
  console.log('Test complete. Check server/data/failure_patterns.jsonl for recorded entries.');
}

run().catch(e => { console.error(e); process.exit(1); });
