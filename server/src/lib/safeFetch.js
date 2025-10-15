// Minimal safeFetch helper: timeout, retries, JSON parse guard
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const USER_AGENTS = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Praevisio/1.0 (+https://praevisio.local)'
];

async function safeFetch(url, opts = {}, { timeout = 8000, retries = 2 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const headers = { ...(opts.headers || {}), 'Accept': 'application/json, text/plain, */*', 'User-Agent': USER_AGENTS[attempt % USER_AGENTS.length] };
      const res = await fetch(url, { ...opts, headers, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) {
          // Try to safely read body/text for error reporting. Some test mocks may not
          // implement res.text(), so guard against that.
          let errText = '';
          if (res && typeof res.text === 'function') {
            errText = await res.text().catch(() => '');
          } else if (res && typeof res.json === 'function') {
            try {
              const j = await res.json();
              errText = typeof j === 'string' ? j : JSON.stringify(j);
            } catch (_e) {
              errText = '';
            }
          }
          // Log raw error response for debugging
          try {
            const logPath = path.resolve(process.cwd(), 'tmp', 'integration_errors.log');
            fs.mkdirSync(path.dirname(logPath), { recursive: true });
            const entry = `[${new Date().toISOString()}] HTTP ${res.status} GET ${url} \n${errText.slice(0,200)}\n\n`;
            fs.appendFileSync(logPath, entry);
          } catch (e) {
            // ignore logging errors
          }
          throw new Error(`HTTP ${res.status}: ${errText}`);
      }
        // Detect content-type in a defensive way: test mocks may supply headers as a
        // simple object without a .get() method. Prefer headers.get if available.
        let ct = '';
        try {
          if (res && res.headers) {
            if (typeof res.headers.get === 'function') {
              ct = res.headers.get('content-type') || '';
            } else if (res.headers['content-type']) {
              ct = res.headers['content-type'];
            }
          }
        } catch (e) {
          ct = '';
        }

        // Some mocks simply provide a json() method but no headers — assume JSON
        if (!ct && res && typeof res.json === 'function') {
          ct = 'application/json';
        }

        if (ct && ct.toLowerCase().includes('application/json')) {
          try {
            return await (typeof res.json === 'function' ? res.json() : Promise.resolve(null));
          } catch (parseErr) {
            // Log invalid JSON parse for debugging
            try {
              const logPath = path.resolve(process.cwd(), 'tmp', 'integration_errors.log');
              fs.mkdirSync(path.dirname(logPath), { recursive: true });
              const entry = `[${new Date().toISOString()}] Invalid JSON GET ${url} \nparseError: ${parseErr && parseErr.message ? parseErr.message : String(parseErr)}\n\n`;
              fs.appendFileSync(logPath, entry);
            } catch (e) {}
            throw new Error(`Invalid JSON response: ${parseErr && parseErr.message ? parseErr.message : String(parseErr)}`);
          }
        }

        // If we received a non-JSON body (likely HTML blocking page), try to read text()
        let bodyText = '';
        if (res && typeof res.text === 'function') {
          bodyText = await res.text().catch(() => '');
        } else if (res && typeof res.json === 'function') {
          try {
            const j = await res.json();
            bodyText = typeof j === 'string' ? j : JSON.stringify(j);
          } catch (_e) {
            bodyText = '';
          }
        }
        // Log non-JSON body for debugging (first 2000 chars)
        try {
          const logPath = path.resolve(process.cwd(), 'tmp', 'integration_errors.log');
          fs.mkdirSync(path.dirname(logPath), { recursive: true });
          const entry = `[${new Date().toISOString()}] Non-JSON GET ${url} \ncontent-type: ${ct} \nbody: ${bodyText.slice(0,2000)}\n\n`;
          fs.appendFileSync(logPath, entry);
        } catch (e) {}
        throw new Error(`Non-JSON response (content-type: ${ct}): ${bodyText.slice(0, 200)}`);
    } catch (err) {
      clearTimeout(id);
      if (attempt === retries) throw err;
      // exponential-ish backoff with jitter
      const delay = 300 + attempt * 500 + Math.floor(Math.random() * 200);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

export default safeFetch;
