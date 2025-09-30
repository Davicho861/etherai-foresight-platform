import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import playwright from 'playwright';

const execFileAsync = promisify(execFile);

// Search tool (kept simple / fallback)
export const searchTool = tool(
  async ({ query }) => {
    // Simple placeholder search — agents should prefer WebBrowserTool for real browsing
    return `Resultados para: ${query}`;
  },
  {
    name: 'search',
    description: 'Buscar información en la web (placeholder). Preferir WebBrowserTool para navegación real.',
    schema: z.object({ query: z.string() }),
  }
);

// Web browser tool using Playwright
export const webBrowserTool = tool(
  async ({ action, url, selector }) => {
    // action: 'browse' | 'extractText' | 'click'
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      if (action === 'browse') {
        await page.goto(url, { waitUntil: 'networkidle' });
        const content = await page.content();
        // publish event if missionId present in URL as query param
        return content;
      }
      if (action === 'extractText') {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForSelector(selector, { timeout: 5000 });
        const text = await page.textContent(selector);
        return text || '';
      }
      if (action === 'click') {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.click(selector);
        return `Clicked selector ${selector} on ${url}`;
      }
      return `Unsupported action: ${action}`;
    } finally {
      await page.close();
      await context.close();
      await browser.close();
    }
  },
  {
    name: 'web_browser',
    description: 'Navegador web controlado (Playwright). Acciones: browse(url), extractText(url, selector), click(url, selector).',
    schema: z.object({ action: z.string(), url: z.string().optional(), selector: z.string().optional() }),
  }
);

// File system tool for exchanging artifacts between agents
export const fileSystemTool = tool(
  async ({ missionId, op, filename, content }) => {
    const base = path.join('/tmp/missions', missionId);
    await fs.mkdir(base, { recursive: true });
    const filePath = path.join(base, filename || 'artifact.txt');
    if (op === 'write') {
      await fs.writeFile(filePath, content || '', 'utf8');
      return `Wrote file ${filePath}`;
    }
    if (op === 'read') {
      const exists = await fs.stat(filePath).then(() => true).catch(() => false);
      if (!exists) return `No such file: ${filePath}`;
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    }
    if (op === 'list') {
      const files = await fs.readdir(base).catch(() => []);
      return files.join('\n');
    }
    return `Unsupported op: ${op}`;
  },
  {
    name: 'file_system',
    description: 'Leer/escribir/listar archivos en /tmp/missions/{missionId} para intercambio entre agentes.',
    schema: z.object({ missionId: z.string(), op: z.string(), filename: z.string().optional(), content: z.string().optional() }),
  }
);

// Code interpreter tool: write code to temp dir and execute with Python
export const codeInterpreterTool = tool(
  async ({ missionId, code, filename = 'script.py', timeoutSeconds = 15 }) => {
    const base = path.join('/tmp/missions', missionId);
    await fs.mkdir(base, { recursive: true });
    const filePath = path.join(base, filename);
    await fs.writeFile(filePath, code, 'utf8');

    // Execute with system python (must be available in the environment)
    try {
      const { stdout, stderr } = await execFileAsync('python3', [filePath], { timeout: timeoutSeconds * 1000 });
      if (stderr && stderr.length > 0) {
        return `STDERR:\n${stderr}\nSTDOUT:\n${stdout}`;
      }
      return stdout || 'No output';
    } catch (err) {
      // err may include stdout/stderr
      const out = err.stdout || '';
      const e = err.stderr || err.message;
      return `Error running python: ${e}\nOutput:\n${out}`;
    }
  },
  {
    name: 'code_interpreter',
    description: 'Ejecuta scripts Python en /tmp/missions/{missionId}. Puede usar pandas/numpy si están instalados en el sistema. Timeout controlado.',
    schema: z.object({ missionId: z.string(), code: z.string(), filename: z.string().optional(), timeoutSeconds: z.number().optional() }),
  }
);

export default {
  searchTool,
  webBrowserTool,
  fileSystemTool,
  codeInterpreterTool,
};
