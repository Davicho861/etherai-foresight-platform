import { CircuitBreaker, retryWithBackoff, fetchWithTimeout, isJsonResponse } from '../utils/resilience.js';

class GdeltIntegration {
  constructor() {
    this.baseUrl = 'https://api.gdeltproject.org/api/v2/doc/doc';
    this.circuitBreaker = new CircuitBreaker(5, 600000); // 5 failures, 10 min recovery (GDELT rate limits are stricter)
  }

  async getSocialEvents(country, startDate, endDate) {
    try {
      const result = await this.circuitBreaker.execute(async () => {
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
        }, 3, 5000, 30000); // 3 retries, base delay 5s, max 30s for rate limits
      });

      return result;

    } catch (error) {
      console.log(`GDELT API failed for ${country} (${startDate}-${endDate}): ${error.message}. Using mock data.`);

      // Fallback to mock data for robustness
      const mockEventCount = Math.floor(Math.random() * 10);
      const mockIntensity = mockEventCount * 1.5;
      return {
        country,
        period: { start: startDate, end: endDate },
        eventCount: mockEventCount,
        socialIntensity: mockIntensity,
        articles: [],
        isMock: true,
        note: 'Using mock data due to API error',
        error: error.message
      };
    }
  }
}

export default GdeltIntegration;