import fetch from 'node-fetch';
import { createApp } from '../server/src/index.js';

(async () => {
  try {
    const app = await createApp({ disableBackgroundTasks: true });
    const server = app.listen(4500, async () => {
      try {
        console.log('Test server running on http://localhost:4500');
        const res = await fetch('http://localhost:4500/api/xai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metric: 'efficiency', value: 85, context: 'LogisticsOptimization' })
        });
        const body = await res.text();
        console.log('XAI response:', body);
      } catch (err) {
        console.error('Request error:', err);
      } finally {
        server.close(() => process.exit(0));
      }
    });
  } catch (err) {
    console.error('Failed to start test server:', err);
    process.exit(1);
  }
})();
