// Simple publish/subscribe event hub for mission events
const subscribers = new Map();
const globalSubscribers = new Set();

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

export function subscribeAll(cb) {
  globalSubscribers.add(cb);
  return () => globalSubscribers.delete(cb);
}

export function publish(missionId, event) {
  // Notify mission-specific subscribers
  const s = subscribers.get(missionId);
  if (s) {
    for (const cb of s) {
      try { cb(event); } catch (e) { /* ignore subscriber errors */ }
    }
  }

  // Notify global subscribers
  for (const cb of globalSubscribers) {
    try { cb({ missionId, ...event }); } catch (e) { /* ignore */ }
  }
}

export default { subscribe, subscribeAll, publish };
