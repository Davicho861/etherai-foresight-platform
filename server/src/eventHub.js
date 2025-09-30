// Simple publish/subscribe event hub for mission events
const subscribers = new Map();

export function subscribe(missionId, cb) {
  if (!subscribers.has(missionId)) subscribers.set(missionId, new Set());
  subscribers.get(missionId).add(cb);
  return () => {
    const s = subscribers.get(missionId);
    if (s) {
      s.delete(cb);
      if (s.size === 0) subscribers.delete(missionId);
    }
  };
}

export function publish(missionId, event) {
  const s = subscribers.get(missionId);
  if (!s) return;
  for (const cb of s) {
    try {
      cb(event);
    } catch (e) {
      // ignore subscriber errors
    }
  }
}

export default { subscribe, publish };
