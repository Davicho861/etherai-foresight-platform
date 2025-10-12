// CommonJS MSW handlers - deterministic, minimal and shape-compatible
// Export: module.exports = { handlers }
const { http, HttpResponse } = require('msw');

// Handlers used by backend tests. Keep shapes minimal but compatible with integrations.
// Note: All req.url.searchParams.get() calls are now inside the handler functions to avoid import-time execution
const handlers = [
  // SIM current price
   http.get('https://sim.minagri.gob.pe/api/v1/precios', ({ request }) => {
     const url = new URL(request.url);
     const product = url.searchParams.get('producto') || '';
     const productLower = product.toLowerCase();
     const mapping = {
       rice: { precio_actual: 4.5, unidad: 'PEN/kg', fecha: '2024-10-07', fuente: 'SIM MINAGRI' },
       potatoes: { precio_actual: 2.2, unidad: 'PEN/kg', fecha: '2024-10-07', fuente: 'SIM MINAGRI' },
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
         maxPrice: data.precio_actual * 1.2,
         minPrice: data.precio_actual * 0.8,
         isMock: false
       }
     });
   }),

  // SIM history
   http.get('https://sim.minagri.gob.pe/api/v1/precios/historico', ({ request }) => {
     const url = new URL(request.url);
     const product = url.searchParams.get('producto') || '';
     const productLower = product.toLowerCase();
     const base = { rice: 4.5, potatoes: 2.2, corn: 3.1, beans: 5.8 }[productLower] || 3.0;
     const precios = [];
     for (let i = 5; i >= 0; i--) {
       const d = new Date(); d.setDate(d.getDate() - i);
       precios.push({ fecha: d.toISOString().split('T')[0], precio: Math.round((base + (Math.random() - 0.5) * 0.4) * 100) / 100, volumen: Math.floor(Math.random() * 1000) + 100 });
     }
     return HttpResponse.json({ precios });
   }),

  // SIM volatility
   http.get('https://sim.minagri.gob.pe/api/v1/volatilidad', ({ request }) => {
     const url = new URL(request.url);
     const product = url.searchParams.get('producto') || '';
     const productLower = product.toLowerCase();
     const vols = { rice: { indice_volatilidad: 0.12, nivel_riesgo: 'medium' }, potatoes: { indice_volatilidad: 0.18, nivel_riesgo: 'high' }, corn: { indice_volatilidad: 0.15, nivel_riesgo: 'medium' }, beans: { indice_volatilidad: 0.09, nivel_riesgo: 'low' } };
     return HttpResponse.json(vols[productLower] || { indice_volatilidad: 0.15, nivel_riesgo: 'medium' });
   }),

  // World Bank generic indicator (array [meta, data])
  http.get('https://api.worldbank.org/v2/country/:country/indicator/:indicator', ({ params }) => {
    const { country, indicator } = params;
    const data = [ { page: 1, pages: 1, per_page: 50 }, [ { country: { id: country.toUpperCase(), value: 'MockCountry' }, indicator: { id: indicator, value: indicator }, date: '2023', value: 7.5 } ] ];
    return HttpResponse.json(data);
  }),

  // World Bank food security data for service
  http.get('https://api.worldbank.org/v2/country/:country/indicator/SN.ITK.DEFC.ZS', ({ params }) => {
    const { country } = params;
    const data = [ { page: 1, pages: 1, per_page: 50 }, [ { country: { id: country.toUpperCase(), value: 'MockCountry' }, indicator: { id: 'SN.ITK.DEFC.ZS', value: 'Prevalence of undernourishment' }, date: '2023', value: 7.5 } ] ];
    return HttpResponse.json({
      countries: ['ARG', 'COL', 'PER', 'BRA', 'CHL', 'ECU']
    });
  }),


  // CoinGecko markets list
  http.get('https://api.coingecko.com/api/v3/coins/markets', ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get('ids') || 'bitcoin';
    const list = ids.split(',').map(id => ({ id, symbol: id.slice(0, 3).toLowerCase(), current_price: id === 'bitcoin' ? 50000 : 2500 }));
    return HttpResponse.json(list);
  }),

  // CoinGecko market chart (historical)
  http.get('https://api.coingecko.com/api/v3/coins/:id/market_chart', () => {
    const prices = [[1609459200000, 50000], [1609545600000, 51000]];
    return HttpResponse.json({ prices });
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
      note: 'Mock data for testing'
    });
  }),

  // IMF minimal
  http.get('https://www.imf.org/external/datamapper/api/v1/:path*', () => HttpResponse.json({ values: { PER: { 2023: 268.5 } } })),

  // USGS earthquake
  http.get('https://earthquake.usgs.gov/fdsnws/event/1/query', () => HttpResponse.json({ features: [{ properties: { mag: 5.2, place: 'Test Location', time: Date.now(), tsunami: 0 }, geometry: { coordinates: [-75.0, -10.0, 10.0] } }] })),

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

  // Generic API fallback for any unmatched requests (returns mock data)
  http.get('*', ({ request }) => {
    console.log(`MSW: Unhandled request to ${request.url}`);
    return HttpResponse.json({ error: 'Mock not implemented', url: request.url });
  }),

  // Health endpoint
  http.get('http://127.0.0.1:3000/api/health', () => HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() })),

  // Platform status
  http.get('http://127.0.0.1:3000/api/platform-status', () => HttpResponse.json({ status: 'active', version: '1.0.0' })),

  // Ethical assessment
  http.get('http://127.0.0.1:3000/api/ethical-assessment', () => HttpResponse.json({ success: true, assessment: 'Low Ethical Concern' })),

  // Module test endpoint
  http.get('http://127.0.0.1:3000/api/module/test', () => HttpResponse.json({ ok: true })),

  // LLM endpoint
  http.post('http://127.0.0.1:3000/api/llm', () => HttpResponse.json({ response: 'Mock LLM response' })),

  // Dashboard overview
  http.get('http://127.0.0.1:3000/api/dashboard/overview', () => HttpResponse.json({
    kpis: { modelAccuracy: 0.95, predictionCount: 100 },
    analysisModules: [],
    predictiveInsights: [],
    criticalSignals: []
  })),

  // Eternal vigilance state
  http.get('http://127.0.0.1:3000/api/eternal-vigilance/state', () => HttpResponse.json({
    indices: { globalRisk: 0.5, ethicalScore: 0.8 },
    activeModules: []
  })),

  // Consciousness
  http.get('http://127.0.0.1:3000/api/consciousness', () => HttpResponse.json({
    source: 'local',
    items: []
  })),

  // Demo full-state
  http.get('http://127.0.0.1:3000/api/demo/full-state', () => HttpResponse.json({
    kpis: { totalPredictions: 100 },
    countries: [],
    chartData: []
  })),

  // Demo live-state
  http.get('http://127.0.0.1:3000/api/demo/live-state', () => HttpResponse.json({
    kpis: { activePredictions: 50 },
    countries: [],
    communityResilience: {},
    foodSecurity: {},
    global: { crypto: {}, seismic: {} }
  })),

  // Mission replays
  http.get('http://127.0.0.1:3000/api/demo/mission-replays', () => HttpResponse.json({
    taskReplays: [{ id: '1', status: 'completed' }]
  })),

  // Seismic activity
  http.get('http://127.0.0.1:3000/api/seismic/activity', () => HttpResponse.json([
    { id: 'test1', magnitude: 5.2, location: 'Test Location', riskScore: 0.8 }
  ])),

  // Seismic risk
  http.get('http://127.0.0.1:3000/api/seismic/risk', () => HttpResponse.json({
    overallRisk: 0.5,
    eventCount: 1,
    maxMagnitude: 6.0,
    highRiskZones: []
  })),

  // Food resilience prices
  http.get('http://127.0.0.1:3000/api/food-resilience/prices', () => HttpResponse.json({
    country: 'Peru',
    prices: [
      { product: 'rice', price: 4.5, volatility: 0.1 },
      { product: 'potatoes', price: 2.2, volatility: 0.15 },
      { product: 'corn', price: 3.1, volatility: 0.12 },
      { product: 'beans', price: 5.8, volatility: 0.08 }
    ],
    summary: { averageVolatility: 0.1125 }
  })),

  // Food resilience supply chain
  http.get('http://127.0.0.1:3000/api/food-resilience/supply-chain', () => HttpResponse.json({
    country: 'Peru',
    routes: [
      { origin: 'Lima', destination: 'Cusco', cost: 100, time: 5 },
      { origin: 'Cusco', destination: 'Arequipa', cost: 80, time: 3 },
      { origin: 'Arequipa', destination: 'Tacna', cost: 120, time: 4 },
      { origin: 'Tacna', destination: 'Puno', cost: 90, time: 6 }
    ],
    optimization: { recommendedRoutes: [] }
  })),

  // Global risk food security
  http.get('http://127.0.0.1:3000/api/global-risk/food-security', () => HttpResponse.json({
    success: true,
    source: 'Praevisio-Aion-Simulated-WorldBank',
    data: { countries: ['COL', 'PER', 'ARG', 'BRA', 'CHL', 'ECU'] }
  })),

  // Global risk climate extremes
  http.get('http://127.0.0.1:3000/api/global-risk/climate-extremes', () => HttpResponse.json({
    success: true,
    source: 'Praevisio-Aion-NASA-POWER-Integration',
    data: { extremes: [] }
  })),

  // GDELT events
  http.get('http://127.0.0.1:3000/api/gdelt/events', ({ request }) => {
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
  http.get('http://127.0.0.1:3000/api/eternal-vigilance/stream', () => {
    return new HttpResponse(
      'data: {"event":"init","data":{"indices":{"globalRisk":0.5}}}\n\n',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      }
    );
  }),

  // Eternal vigilance token
  http.post('http://127.0.0.1:3000/api/eternal-vigilance/token', () => HttpResponse.json({ token: 'temp-token-123' })),

  // Pricing plans
  http.get('http://127.0.0.1:3000/api/pricing-plans', () => HttpResponse.json({
    currency: 'EUR',
    segments: {
      default: {
        plans: [{ id: 'p1', name: 'Basic', price: 10 }]
      }
    }
  })),

  // Pricing
  http.get('http://127.0.0.1:3000/api/pricing', () => HttpResponse.json({
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
];

module.exports = { handlers };