import { CircuitBreaker, retryWithBackoff, fetchWithTimeout, isJsonResponse } from '../utils/resilience.js';

class GdeltIntegration {
  constructor() {
    const native = process.env.NATIVE_DEV_MODE === 'true';
    const forceMocks = process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1';
    const gdeltMockPort = process.env.GDELT_MOCK_PORT || 4020;
    this.baseUrl = native
      ? `http://localhost:${gdeltMockPort}/gdelt/events`
      : (process.env.TEST_MODE === 'true'
        ? 'http://mock-api-server:3001/gdelt' // internal mock server used in CI
        : 'https://api.gdeltproject.org/api/v2/doc/doc');
    this.forceMocks = forceMocks;
    // Use shorter circuit breaker window in tests to avoid long waits/logs
    const isTest = process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true';
    this.circuitBreaker = new CircuitBreaker(isTest ? 1 : 5, isTest ? 1000 : 600000); // failures, recovery ms
  }

  async getSocialEvents(country, startDate, endDate) {
    // If forced mocks are enabled, return a high-fidelity mock immediately
    if (this.forceMocks) {
      return {
        country,
        period: { start: startDate, end: endDate },
        eventCount: 12,
        socialIntensity: 18.5,
        articles: [
          { title: 'Community protest over food prices', url: 'http://example.org/article/1', themes: 'PROTEST;ECONOMY' },
          { title: 'Strike affects supply chains', url: 'http://example.org/article/2', themes: 'STRIKE;ECONOMY' }
        ],
        isMock: true,
        source: 'FORCE_MOCKS:GDELT'
      };
    }
    try {
      const result = await this.circuitBreaker.execute(async () => {
        // Reduce retries/delays when running tests to keep test suites fast and deterministic
        const isTest = process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true' || process.env.CI === 'true';
        const retries = isTest ? 1 : 3;
        const baseDelay = isTest ? 50 : 5000; // ms
        const maxDelay = isTest ? 200 : 30000; // ms

        return await retryWithBackoff(async () => {
          // GDELT API query for social unrest events
          // Using keywords like protest, riot, etc.
          const query = `(protest OR riot OR strike OR demonstration)`;
          const countryFilter = `sourcecountry:${country.toUpperCase()}`;

          const startDateTime = startDate.replace(/-/g, '') + '000000';
          const endDateTime = endDate.replace(/-/g, '') + '235959';

          const url = `${this.baseUrl}?query=${encodeURIComponent(`${query} ${countryFilter}`)}&startdatetime=${startDateTime}&enddatetime=${endDateTime}&mode=artlist&format=json&maxrecords=250`;

          const response = await fetchWithTimeout(url, {}, 20000); // 20s timeout for GDELT

          if (!response.ok) {
            if (response.status === 429) {
              throw new Error(`GDELT API rate limit exceeded: ${response.status}`);
            }
            throw new Error(`GDELT API error: ${response.status} ${response.statusText}`);
          }

          // Check if response is actually JSON
          if (!isJsonResponse(response)) {
            throw new Error(`GDELT API returned non-JSON response: ${response.headers.get('content-type')}`);
          }

          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            throw new Error(`GDELT API returned invalid JSON: ${parseError.message}`);
          }

          // Validate data structure
          if (!data || typeof data !== 'object') {
            throw new Error('GDELT API returned invalid data structure');
          }

          // Process articles to count events
          const events = data.articles || [];
          const eventCount = events.length;

          // Calculate intensity based on number of articles and themes
          let intensity = 0;
          events.forEach(article => {
            if (article.themes) {
              const themes = article.themes.split(';');
              if (themes.includes('PROTEST')) intensity += 2;
              if (themes.includes('RIOT')) intensity += 3;
              if (themes.includes('STRIKE')) intensity += 1.5;
              if (themes.includes('DEMONSTRATION')) intensity += 1;
            }
          });

          return {
            country,
            period: { start: startDate, end: endDate },
            eventCount,
            socialIntensity: intensity,
            articles: events.slice(0, 10), // Top 10 articles
            isMock: false
          };
        }, retries, baseDelay, maxDelay); // configurable retries/delays (shorter in tests)
      });

      return result;

    } catch (error) {
      console.log(`GDELT API failed for ${country} (${startDate}-${endDate}): ${error.message}.`);

      // If forceMocks is enabled at runtime env var (fallback) return mock
      if (process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1') {
        return {
          country,
          period: { start: startDate, end: endDate },
          eventCount: 0,
          socialIntensity: 0,
          articles: [],
          isMock: true,
          source: 'FORCE_MOCKS:GDELT',
          note: `Returned mock due to error: ${error.message}`
        };
      }

      // No fallback to mock data - return error indication
      return {
        country,
        period: { start: startDate, end: endDate },
        eventCount: 0,
        socialIntensity: 0,
        articles: [],
        isMock: false,
        error: error.message,
        note: 'API error - no data available'
      };
    }
  }
}

export default GdeltIntegration;