/**
 * Utilidades de resiliencia para APIs externas
 * Incluye retry logic, circuit breaker y timeouts
 */

class CircuitBreaker {
  constructor(failureThreshold = 3, recoveryTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeout = recoveryTimeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000, maxDelay = 10000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff with jitter
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${totalDelay.toFixed(0)}ms: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }

  throw lastError;
}

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();

  // Create a timeout promise that rejects after `timeout` ms.
  // We still call controller.abort() to keep behavior when real fetch supports it,
  // but also race the fetch against this timeout so mocked fetches that ignore
  // the signal don't hang the test.
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      try { controller.abort(); } catch (e) {}
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });

  try {
    const response = await Promise.race([
      fetch(url, { ...options, signal: controller.signal }),
      timeoutPromise
    ]);

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // If the fetch was aborted and produced an AbortError, normalize the message
    if (error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

function isJsonResponse(response) {
  const contentType = response.headers.get('content-type');
  return !!(contentType && contentType.includes('application/json'));
}

export { CircuitBreaker, retryWithBackoff, fetchWithTimeout, isJsonResponse };