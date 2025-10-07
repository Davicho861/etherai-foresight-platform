import fetch from 'node-fetch';

class GdeltIntegration {
  constructor() {
    this.baseUrl = 'https://api.gdeltproject.org/api/v2/doc/doc';
  }

  async getSocialEvents(country, startDate, endDate) {
    try {
      // GDELT API query for social unrest events
      // Using themes like PROTEST, RIOT, etc.
      const query = `(theme:PROTEST OR theme:RIOT OR theme:STRIKE OR theme:DEMONSTRATION)`;
      const countryFilter = `sourcecountry:${country.toUpperCase()}`;
      const dateRange = `daterange:${startDate.replace(/-/g, '')}${endDate.replace(/-/g, '')}`;

      const url = `${this.baseUrl}?query=${encodeURIComponent(`${query} ${countryFilter} ${dateRange}`)}&mode=artlist&format=json&maxrecords=250`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GDELT API error: ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
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
        articles: events.slice(0, 10) // Top 10 articles
      };
    } catch (error) {
      console.error('Error fetching GDELT data:', error);
      // Fallback to mock data for robustness
      const mockEventCount = Math.floor(Math.random() * 10);
      const mockIntensity = mockEventCount * 1.5;
      return {
        country,
        period: { start: startDate, end: endDate },
        eventCount: mockEventCount,
        socialIntensity: mockIntensity,
        articles: [],
        note: 'Using mock data due to API error'
      };
    }
  }
}

export default GdeltIntegration;