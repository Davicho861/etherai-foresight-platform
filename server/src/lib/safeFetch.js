// Minimal safeFetch helper: timeout, retries, JSON parse guard
import fetch from 'node-fetch';

async function safeFetch(url, opts = {}, { timeout = 8000, retries = 2 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          return await res.json();
        } catch (e) {
          throw new Error('Invalid JSON response');
        }
      }
      return await res.text();
    } catch (err) {
      clearTimeout(id);
      if (attempt === retries) throw err;
      // small backoff
      await new Promise(r => setTimeout(r, 300 + attempt * 200));
    }
  }
}

export default safeFetch;
