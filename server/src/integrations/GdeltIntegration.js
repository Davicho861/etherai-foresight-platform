import { CircuitBreaker, retryWithBackoff, fetchWithTimeout, isJsonResponse } from '../utils/resilience.js';
import safeFetch from '../lib/safeFetch.js';

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
          // GDELT expects two-letter country codes in many queries; map common ISO3 -> ISO2
          const iso3ToIso2 = (iso3) => {
            if (!iso3) return '';
            const map = {
              COL: 'CO', PER: 'PE', BRA: 'BR', MEX: 'MX', ARG: 'AR', CHL: 'CL'
            };
            const c = String(iso3).toUpperCase();
            return map[c] || c.slice(0, 2);
          };
          const countryFilter = `sourcecountry:${iso3ToIso2(country)}`;

          const startDateTime = startDate.replace(/-/g, '') + '000000';
          const endDateTime = endDate.replace(/-/g, '') + '235959';

          const url = `${this.baseUrl}?query=${encodeURIComponent(`${query} ${countryFilter}`)}&startdatetime=${startDateTime}&enddatetime=${endDateTime}&mode=artlist&format=json&maxrecords=250`;

          // Use safeFetch to get parsed JSON with retries and timeout. Add Accept header to favor JSON responses.
          let data;
          try {
            data = await safeFetch(url, { headers: { 'User-Agent': 'Praevisio/1.0 (+https://praevisio.local)', Accept: 'application/json' } }, { timeout: 20000, retries });
          } catch (err) {
            // convert known cases into expressive errors for retry logic
            if (err.message && err.message.includes('429')) {
              throw new Error(`GDELT API rate limit exceeded: ${err.message}`);
            }
            throw err;
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