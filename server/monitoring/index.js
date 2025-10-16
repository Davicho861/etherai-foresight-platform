import express from 'express';

let client;
try {
  client = await import('prom-client');
} catch (e) {
  client = null;
}

const app = express();

if (client) {
  client.collectDefaultMetrics({ timeout: 5000 });
}

// Custom metric for coverage ratio (value should be updated by external script)
export const coverageGauge = client ? new client.Gauge({ name: 'coverage_ratio', help: 'Test coverage percent' }) : { set: () => {} };

app.get('/metrics', async (req, res) => {
  try {
    if (!client) return res.status(200).send('# prometheus metrics stub - prom-client not installed\n');
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex.message);
  }
});

export function startMetricsServer(port = 3000) {
  const server = app.listen(port, () => {
    console.log(`[monitoring] Metrics server listening on http://localhost:${port}/metrics`);
  });
  return server;
}

// If run directly, start
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  startMetricsServer(3000);
}
