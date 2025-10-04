import { subscribeAll } from '../eventHub.js';
import { getChromaClient } from '../database.js';

class ChroniclerAgent {
  constructor() {
    this.client = getChromaClient();
    this.init();
  }

  init() {
    // Subscribe to all events and persist failures
    this.unsub = subscribeAll(async (ev) => {
      try {
        if (ev && ev.status && ev.status === 'error') {
          await this.recordFailure(ev);
        }
        // Also inspect tasks with status 'error' embedded
        if (ev && ev.taskId && ev.status === 'error') {
          await this.recordFailure(ev);
        }
      } catch (e) {
        console.warn('[Chronicler] failed to record failure:', e.message);
      }
    });
  }

  async recordFailure(event) {
    const client = this.client;
    const doc = {
      id: `failure_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      error: event.description || event.error || JSON.stringify(event),
      metadata: {
        missionId: event.missionId || null,
        taskId: event.taskId || null,
        timestamp: new Date().toISOString(),
      }
    };

    try {
      // If the client is not usable (missing Chroma API methods), fall back to local file storage
      const clientUsable = client && typeof client.getOrCreateCollection === 'function' && !client.mock;
      if (clientUsable) {
        const collection = await client.getOrCreateCollection({ name: 'failure_patterns' });
        await collection.add({ documents: [doc.error], metadatas: [doc.metadata], ids: [doc.id] });
        console.log('[Chronicler] Recorded failure to ChromaDB:', doc.id);
        return;
      }

      // Fallback: append to local file
      const fs = await import('fs/promises');
      const path = await import('path');
      const p = path.join(process.cwd(), 'server', 'data', 'failure_patterns.jsonl');
      const line = JSON.stringify(doc) + '\n';
      await fs.mkdir(path.dirname(p), { recursive: true }).catch(() => {});
      await fs.appendFile(p, line, 'utf8');
      console.log('[Chronicler] Recorded failure to local file:', p);
    } catch (e) {
      console.warn('[Chronicler] error while persisting failure:', e.message);
    }
  }

  shutdown() {
    if (this.unsub) this.unsub();
  }
}

const chronicler = new ChroniclerAgent();
export default chronicler;
