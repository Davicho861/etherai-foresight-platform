// simple helper that calls an external function and falls back on error
async function callWithFallback(externalCall, fallback) {
  try {
    const res = await externalCall();
    return { ok: true, value: res };
  } catch (err) {
    return { ok: false, error: String(err), value: typeof fallback === 'function' ? await fallback() : fallback };
  }
}

module.exports = { callWithFallback };
