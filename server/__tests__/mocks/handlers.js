// CommonJS MSW handlers - Sistema de mocks optimizado
const { http, HttpResponse } = require('msw');

/**
 * Sistema de Mocks Optimizado
 * - Handlers deterministas
 * - Respuestas consistentes
 * - Manejo de errores robusto
 */

// Utilidades para mocks
const generateMockTimestamp = () => new Date().toISOString();
const generateMockId = () => `mock-${Math.random().toString(36).substr(2, 9)}`;

// Mocks predefinidos para servicios
const DEFAULT_MOCKS = {
  // Servicios externos
  'PandemicsService': {
    source: 'PandemicsService - Error Fallback',
    error: 'Service unavailable',
    timestamp: generateMockTimestamp()
  },
  'GeopoliticalInstabilityService': {
    source: 'GeopoliticalInstabilityService - Error Fallback',
    error: 'Service unavailable',
    timestamp: generateMockTimestamp()
  },
  'EconomicInstabilityService': {
    source: 'EconomicInstabilityService - Error Fallback',
    error: 'Service unavailable',
    timestamp: generateMockTimestamp()
  },
  'CybersecurityService': {
    source: 'CybersecurityService - Error Fallback',
    error: 'Service unavailable',
    timestamp: generateMockTimestamp()
  }
};
// Handlers optimizados
const handlers = [
  // USGS Seismic Activity
  http.get('https://earthquake.usgs.gov/fdsnws/event/1/query', async ({ request }) => {
    const mockData = {
      events: [
        {
          id: 'mock-1',
          magnitude: 4.5,
          place: 'Mock Seismic Region - Test Location',
          time: Date.now(),
          coordinates: [-74.2973, 4.5709, 10],
          url: 'https://example.com/mock-earthquake-1',
          tsunami: 0,
          significance: 50
        },
        {
          id: 'mock-2',
          magnitude: 3.2,
          place: 'Another Mock Location',
          time: Date.now() - 3600000,
          coordinates: [-75, -10, 15],
          url: 'https://example.com/mock-earthquake-2',
          tsunami: 0,
          significance: 25
        }
      ],
      summary: {
        totalEvents: 2,
        maxMagnitude: 4.5,
        lastUpdated: new Date().toISOString(),
        source: 'High-Fidelity Mock Data - USGS API Unavailable'
      },
      isMock: true,
      note: 'Real-time seismic data simulation - API unavailable'
    };

    return HttpResponse.json(mockData);
  }),

  // Climate Extremes
  http.get('*/api/climate-extremes', async () => {
    const mockData = {
      extremes: [
        {
          country: 'Colombia',
          countryCode: 'COL',
          avgMaxTemp: 28.5,
          avgMinTemp: 18.2,
          avgHumidity: 75.2,
          totalPrecipitation: 150.3,
          extremeEvents: 3,
          riskLevel: 'medium',
          timestamp: '2025-10-10T18:00:00.000Z',
          period: 'Last 30 days'
        },
        {
          country: 'Peru',
          countryCode: 'PER',
          avgMaxTemp: 25.8,
          avgMinTemp: 15.6,
          avgHumidity: 68.9,
          totalPrecipitation: 85.7,
          extremeEvents: 2,
          riskLevel: 'low',
          timestamp: '2025-10-10T18:00:00.000Z',
          period: 'Last 30 days'
        }
      ]
    };

    return HttpResponse.json(mockData);
  }),

  // Food Security
  http.get('*/api/global-risk/food-security', async () => {
    const mockData = {
      countries: ['COL', 'PER', 'ARG'],
      data: {
        COL: {
          country: 'Colombia',
          value: 5.2,
          year: '2024'
        },
        PER: {
          country: 'Peru',
          value: 7.1,
          year: '2024'
        },
        ARG: {
          country: 'Argentina',
          value: 4.8,
          year: '2024'
        }
      },
      globalAverage: 5.7,
      source: 'World Bank API - SN.ITK.DEFC.ZS',
      year: 2024
    };

    return HttpResponse.json(mockData);
  }),

  // Crypto Volatility
  http.get('*/api/global-risk/crypto-volatility', async () => {
    const mockData = {
      success: true,
      data: {
        value: 45,
        marketData: [
          { id: 'bitcoin', price_change_percentage_24h: -2.5 },
          { id: 'ethereum', price_change_percentage_24h: 1.2 }
        ],
        analysis: {
          totalCryptos: 2,
          averageVolatility: 1.85,
          riskAssessment: 'Moderate'
        },
        timestamp: new Date().toISOString()
      },
      source: 'CryptoService',
      timestamp: new Date().toISOString()
    };

    return HttpResponse.json(mockData);
  }),

  // Community Resilience
  http.get('*/api/global-risk/community-resilience', async ({ request }) => {
    const url = new URL(request.url);
    const countries = url.searchParams.get('countries')?.split(',') || ['COL'];
    const scenario = url.searchParams.get('scenario') || 'default';

    // Dynamic value calculation based on scenario
    const scenarioMap = {
      high: 95,
      low: 15,
      extreme: 65,
      default: 45
    };
    const value = scenarioMap[scenario] || 45;

    const mockData = {
      success: true,
      data: {
        value,
        indicators: {
          socialCohesion: 0.75,
          infrastructureQuality: 0.65,
          economicStability: 0.70,
          healthcareAccess: 0.80
        },
        countries: countries.map(code => ({
          code,
          indicators: {
            socialCohesion: Math.random() * 0.3 + 0.5,
            infrastructureQuality: Math.random() * 0.3 + 0.5,
            economicStability: Math.random() * 0.3 + 0.5,
            healthcareAccess: Math.random() * 0.3 + 0.5
          }
        }))
      },
      timestamp: new Date().toISOString()
    };

    return HttpResponse.json(mockData);
  }),

  // SDLC Deployment Metrics
  http.get('*/api/sdlc/deployment', async () => {
    const mockData = {
      success: true,
      data: {
        deploymentFrequency: {
          value: 8.5,
          trend: 'increasing',
          unit: 'deployments/week'
        },
        leadTime: {
          value: 2.3,
          trend: 'stable',
          unit: 'days'
        },
        changeFailureRate: {
          value: 3.2,
          trend: 'decreasing',
          unit: 'percentage'
        },
        timeToRestore: {
          value: 45,
          trend: 'improving',
          unit: 'minutes'
        }
      }
    };

    return HttpResponse.json(mockData);
  }),

  // Price Prediction
  http.post('*/api/food-resilience/predict', async ({ request }) => {
    const body = await request.json();

    const mockData = {
      success: true,
      product: body.product,
      predictedPrice: 4.8,
      confidence: 0.85,
      factors: [
        { name: 'seasonality', impact: 0.3 },
        { name: 'weather', impact: 0.2 },
        { name: 'supply', impact: 0.25 }
      ],
      timestamp: new Date().toISOString()
    };

    return HttpResponse.json(mockData);
  }),

  // SSE Stream Authentication
  http.get('*/api/eternal-vigilance/stream', async ({ request }) => {
    const headers = request.headers;
    if (!headers.get('Cookie')?.includes('sse_token=')) {
      return new Response(null, {
        status: 401,
        statusText: 'Unauthorized'
      });
    }

    return new Response(
      'data: {"event":"init","data":{"authenticated":true}}\n\n',
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }),

  // Token Generation
  http.post('*/api/eternal-vigilance/token', async () => {
    return HttpResponse.json({
      success: true,
      token: 'GEN-TOKEN',
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    });
  }),

  // Demo Full State
  http.get('*/api/demo/full-state', async () => {
    const mockData = {
      kpis: {
        riskIndex: 65,
        resilienceScore: 75,
        alertCount: 3
      },
      countries: [
        {
          code: 'COL',
          name: 'Colombia',
          risks: {
            food: 45,
            climate: 60,
            geopolitical: 55
          }
        },
        {
          code: 'PER',
          name: 'Peru',
          risks: {
            food: 40,
            climate: 50,
            geopolitical: 45
          }
        }
      ],
      timestamp: new Date().toISOString()
    };

    return HttpResponse.json(mockData);
  }),

  http.get('*/api/prices/:product', ({ params }) => {
    const { product } = params;
    const productLower = product.toLowerCase();
    const mapping = {
      corn: { precio_actual: 3.1, unidad: 'PEN/kg', fecha: '2024-10-07', fuente: 'SIM MINAGRI' },
      beans: { precio_actual: 5.8, unidad: 'PEN/kg', fecha: '2024-10-07', fuente: 'SIM MINAGRI' }
    };
    const data = mapping[productLower] || { precio_actual: 3.0, unidad: 'PEN/kg', fecha: '2024-10-07', fuente: 'SIM MINAGRI' };
    return HttpResponse.json({
      product,
      region: 'Lima',
      priceData: {
        currentPrice: data.precio_actual,
          unit: data.unidad,
          date: data.fecha,
          source: data.fuente,
          averagePrice: data.precio_actual,
          maxPrice: Math.round(data.precio_actual * 1.2 * 100) / 100,
          minPrice: Math.round(data.precio_actual * 0.8 * 100) / 100,
          isMock: true
        }
      });
    }),

  // SIM history
    http.get('https://sim.minagri.gob.pe/api/v1/precios/historico', ({ request }) => {
      const url = new URL(request.url);
      const product = url.searchParams.get('producto') || '';
      const productLower = product.toLowerCase();
      const base = { rice: 4.5, potatoes: 2.2, corn: 3.1, beans: 5.8 }[productLower] || 3.0;
      // deterministic historic series (stable for tests)
      const precios = [];
      const fixedBase = base;
      const today = new Date('2025-10-10');
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        precios.push({ fecha: d.toISOString().split('T')[0], precio: Math.round((fixedBase + 0.05 * (i - 2)) * 100) / 100, volumen: 200 + i * 10 });
      }
      return HttpResponse.json({ precios, isMock: true });
    }),

  // SIM volatility
    http.get('https://sim.minagri.gob.pe/api/v1/volatilidad', ({ request }) => {
      const url = new URL(request.url);
      const product = url.searchParams.get('producto') || '';
      const productLower = product.toLowerCase();
     const vols = { rice: { indice_volatilidad: 0.12, nivel_riesgo: 'medium' }, potatoes: { indice_volatilidad: 0.18, nivel_riesgo: 'high' }, corn: { indice_volatilidad: 0.15, nivel_riesgo: 'medium' }, beans: { indice_volatilidad: 0.09, nivel_riesgo: 'low' } };
     const v = vols[productLower] || { indice_volatilidad: 0.15, nivel_riesgo: 'medium' };
     return HttpResponse.json({ ...v, isMock: true });
    }),

  // World Bank generic indicator (array [meta, data])
  http.get('https://api.worldbank.org/v2/country/:country/indicator/:indicator', ({ params }) => {
    const { country, indicator } = params;
    const data = [ { page: 1, pages: 1, per_page: 50 }, [ { country: { id: country.toUpperCase(), value: 'MockCountry' }, indicator: { id: indicator, value: indicator }, date: '2023', value: 7.5 } ] ];
    return HttpResponse.json({ data, isMock: true });
  }),

  // World Bank food security data for service
  http.get('https://api.worldbank.org/v2/country/:country/indicator/SN.ITK.DEFC.ZS', ({ params }) => {
    const { country } = params;
    // Return a structured data mapping expected by server handlers/tests
    const countries = ['ARG', 'COL', 'PER', 'BRA', 'CHL', 'ECU'];
    const data = {};
    countries.forEach((c) => {
      data[c] = { country: c === 'ARG' ? 'Argentina' : c === 'COL' ? 'Colombia' : c === 'PER' ? 'Peru' : 'MockCountry', value: 5.0, year: '2024' };
    });
    return HttpResponse.json({ countries, data, indicator: 'SN.ITK.DEFC.ZS', period: { startYear: '2020', endYear: '2024' }, isMock: true });
  }),


  // CoinGecko markets list
  http.get('https://api.coingecko.com/api/v3/coins/markets', ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get('ids') || 'bitcoin';
    const list = ids.split(',').map((id) => ({ id, symbol: id.slice(0, 3).toLowerCase(), current_price: id === 'bitcoin' ? 50000 : 2500, price_change_percentage_24h: id === 'bitcoin' ? -2.5 : 1.2 }));
    return HttpResponse.json({ list, isMock: true });
  }),

  // CoinGecko market chart (historical)
  http.get('https://api.coingecko.com/api/v3/coins/:id/market_chart', () => {
    const prices = [[1609459200000, 50000], [1609545600000, 51000]];
    return HttpResponse.json({ prices, isMock: true });
  }),

  // Open-Meteo minimal daily shape
  http.get('https://api.open-meteo.com/v1/forecast', ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get('start_date') || '2024-01-01';
    const end = url.searchParams.get('end_date') || '2024-01-02';
    const time = [start, end];
    const temperature_2m_max = [25, 26];
    const temperature_2m_min = [15, 14];
    return HttpResponse.json({ daily: { time, temperature_2m_max, temperature_2m_min } });
  }),

  // GDELT
  http.get('https://api.gdeltproject.org/api/v2/doc/doc', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    return HttpResponse.json({
      articles: [{ title: 'Sample', url: 'https://example.com', date: '2024-10-07', tone: 2.5 }],
      isMock: true,
      eventCount: 12,
      note: 'Mock data for testing'
    });
  }),

  // IMF minimal
  http.get('https://www.imf.org/external/datamapper/api/v1/:path*', () => HttpResponse.json({ values: { PER: { 2023: 268.5 } } })),

  // USGS earthquake
  // USGS earthquake - provide 'place' field and deterministic time
  http.get('https://earthquake.usgs.gov/fdsnws/event/1/query', () => HttpResponse.json({ features: [{ properties: { mag: 5.2, place: 'Test Location', time: new Date('2025-10-10T12:00:00.000Z').getTime(), tsunami: 0 }, geometry: { coordinates: [-75.0, -10.0, 10.0] } }] , isMock: true })),

  // NASA imagery minimal
  http.get('https://api.nasa.gov/planetary/earth/:path*', ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.includes('imagery')) {
      return HttpResponse.json({
        imagery: { url: 'https://example.com/satellite-image.jpg', date: '2024-10-07' },
        isMock: true,
        ndviData: Array.from({ length: 3 }, (_, i) => ({ date: `2024-01-0${i + 1}`, ndvi: Math.random() }))
      });
    }
    return HttpResponse.json({ imagery: { url: 'https://example.com/satellite-image.jpg', date: '2024-10-07' } });
  }),

  // NASA POWER API for climate data (used by SatelliteIntegration)
  http.get('https://power.larc.nasa.gov/api/temporal/daily/point', ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get('start') || '20240101';
    const end = url.searchParams.get('end') || '20240102';
    const lat = url.searchParams.get('latitude') || '4.7110';
    const lon = url.searchParams.get('longitude') || '-74.0721';

    // Generate mock climate data
    const time = [];
    const temperature_2m_max = [];
    const temperature_2m_min = [];
    const precipitation_sum = [];

    const startDate = new Date(start.slice(0,4), start.slice(4,6)-1, start.slice(6,8));
    const endDate = new Date(end.slice(0,4), end.slice(4,6)-1, end.slice(6,8));

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      time.push(d.toISOString().split('T')[0]);
      temperature_2m_max.push(25 + Math.random() * 10); // 25-35°C
      temperature_2m_min.push(15 + Math.random() * 10); // 15-25°C
      precipitation_sum.push(Math.random() * 20); // 0-20mm
    }

    return HttpResponse.json({
      properties: {
        parameter: {
          T2M_MAX: Object.fromEntries(temperature_2m_max.map((v, i) => [time[i].replace(/-/g, ''), v])),
          T2M_MIN: Object.fromEntries(temperature_2m_min.map((v, i) => [time[i].replace(/-/g, ''), v])),
          PRECTOTCORR: Object.fromEntries(precipitation_sum.map((v, i) => [time[i].replace(/-/g, ''), v]))
        }
      }
    });
  }),

  // USGS Earthquake API (detailed version for seismic routes)
  http.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson', () => HttpResponse.json({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          mag: 5.2,
          place: '100km S of Lima, Peru',
          time: Date.now(),
          tsunami: 0,
          sig: 650,
          url: 'https://earthquake.usgs.gov/earthquakes/eventpage/test123'
        },
        geometry: {
          type: 'Point',
          coordinates: [-76.5, -12.0, 10.0]
        }
      },
      {
        type: 'Feature',
        properties: {
          mag: 4.8,
          place: 'Offshore Colombia',
          time: Date.now() - 86400000,
          tsunami: 0,
          sig: 350,
          url: 'https://earthquake.usgs.gov/earthquakes/eventpage/test456'
        },
        geometry: {
          type: 'Point',
          coordinates: [-75.0, 4.0, 5.0]
        }
      }
    ]
  })),

  // (moved) Generic API fallback for any unmatched requests is at the end of this file

  // Local app endpoints are intentionally NOT mocked here so route handlers inside
  // the app can be exercised directly by tests. External integrations remain mocked above.

  // Internal app endpoints should be handled by the express app during tests.
  // Keep external integration handlers above; do NOT mock internal routes here.

  // Seismic activity (match any host/port)
  // Seismic activity (match any host/port) - include 'place' for compatibility
  http.get('*/api/seismic/activity', () => HttpResponse.json([
    { id: 'test1', magnitude: 5.2, place: 'Test Location', location: 'Test Location', riskScore: 0.8 }
  ],), { status: 200 }),

  // Seismic risk (match any host/port)
  http.get('*/api/seismic/risk', () => HttpResponse.json({
    overallRisk: 0.5,
    eventCount: 1,
    maxMagnitude: 6.0,
    highRiskZones: []
  })),

  // Food resilience prices (match any host/port)
  http.get('*/api/food-resilience/prices', () => HttpResponse.json({
    country: 'Peru',
    prices: [
      { product: 'rice', price: 4.5, volatility: 0.1 },
      { product: 'potatoes', price: 2.2, volatility: 0.15 },
      { product: 'corn', price: 3.1, volatility: 0.12 },
      { product: 'beans', price: 5.8, volatility: 0.08 }
    ],
    summary: { averageVolatility: 0.1125 }
  })),

  // Food resilience supply chain (match any host/port)
  http.get('*/api/food-resilience/supply-chain', () => HttpResponse.json({
    country: 'Peru',
    routes: [
      { origin: 'Lima', destination: 'Cusco', cost: 100, time: 5 },
      { origin: 'Cusco', destination: 'Arequipa', cost: 80, time: 3 },
      { origin: 'Arequipa', destination: 'Tacna', cost: 120, time: 4 },
      { origin: 'Tacna', destination: 'Puno', cost: 90, time: 6 }
    ],
    optimization: { recommendedRoutes: [] }
  })),

  // Global risk food security (match any host/port)
  http.get('*/api/global-risk/food-security', () => HttpResponse.json({
    success: true,
    source: 'Praevisio-Aion-Simulated-WorldBank',
    data: { countries: ['COL', 'PER', 'ARG', 'BRA', 'CHL', 'ECU'] }
  })),

  // Global risk climate extremes (match any host/port)
  http.get('*/api/global-risk/climate-extremes', () => HttpResponse.json({
    success: true,
    source: 'Praevisio-Aion-NASA-POWER-Integration',
    data: { extremes: [] }
  })),

  // GDELT events (match any host/port)
  http.get('*/api/gdelt/events', ({ request }) => {
    const url = new URL(request.url);
    const country = url.searchParams.get('country') || 'COL';
    const startDate = url.searchParams.get('startDate') || '2025-01-01';
    const endDate = url.searchParams.get('endDate') || '2025-01-02';
    return HttpResponse.json({
      country,
      articles: [{ title: 'Test Article', url: 'https://example.com', date: startDate, tone: 2.5 }]
    });
  }),

  // Eternal vigilance stream (SSE)
  http.get('*/api/eternal-vigilance/stream', () => {
    return new HttpResponse('data: {"event":"init","data":{"indices":{"globalRisk":0.5}}}\n\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  }),

  // Eternal vigilance token (match any host/port)
  http.post('*/api/eternal-vigilance/token', () => HttpResponse.json({ token: 'temp-token-123' })),

  // Pricing plans (match any host/port)
  http.get('*/api/pricing-plans', () => HttpResponse.json({
    currency: 'EUR',
    segments: {
      default: {
        plans: [{ id: 'p1', name: 'Basic', price: 10 }]
      }
    }
  })),

  // Pricing (match any host/port)
  http.get('*/api/pricing', () => HttpResponse.json({
    currency: 'USD',
    segments: {
      default: { name: 'Default' }
    }
  })),

  // USGS significant day
  http.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson', () => HttpResponse.json({
    type: 'FeatureCollection',
    features: [{ properties: { mag: 5.2, place: 'Test Location' }, geometry: { coordinates: [-75.0, -10.0, 10.0] } }]
  }))

  // Generic API fallback for any unmatched requests (returns mock data)
  , http.get('*', ({ request }) => {
    try {
      const u = new URL(request.url);
      const host = u.hostname;
      if (host === '127.0.0.1' || host === 'localhost' || host === '::1') {
        // do not mock requests to the local app - let them hit the real Express server
        return undefined;
      }
    } catch (e) {
      // if URL parsing fails, fall through to logging
    }
    console.log(`MSW: Unhandled external request to ${request.url}`);
    return HttpResponse.json({ error: 'Mock not implemented', url: request.url });
  })
];

module.exports = { handlers };