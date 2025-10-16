import { readFileSync as _readFileSync } from 'fs';
import MetatronAgent from './server/src/agents.js';

const telos = new MetatronAgent('Telos');
const result = await telos.run();
console.log(JSON.stringify(result, null, 2));