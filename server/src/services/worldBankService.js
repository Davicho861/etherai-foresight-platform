import WorldBankIntegration from '../integrations/WorldBankIntegration.js';

/**
 * @fileoverview Service for fetching World Bank data, now integrated with real API.
 * Fetches food security data from World Bank API for LATAM countries.
 */

const worldBank = new WorldBankIntegration();

/**
 * Fetches the global food security index for LATAM countries.
 * Now uses the new serverless endpoint /api/global-risk/food-security
 * @returns {Promise<object>} A promise that resolves to the food security data.
 */
export const getFoodSecurityIndex = async () => {
  try {
    // In native dev mode, prefer a local mock to avoid external network dependencies
    if (process.env.NATIVE_DEV_MODE === 'true') {
      const MOCK_PORT = process.env.WORLDBANK_MOCK_PORT || 4010;
      const resp = await fetch(`http://localhost:${MOCK_PORT}/v2/country/latam/indicators/SH.STA.UNDR`);
      if (!resp.ok) throw new Error(`Mock returned ${resp.status}`);
      const body = await resp.json();
      // Transform mock into expected endpoint shape
      const rawList = (body && body.data) || [];
      const endpointData = { data: rawList, summary: { averageValue: rawList.reduce((s, it) => s + (it.value || 0), 0) / Math.max(1, rawList.length) } };
      // reuse transformation below
      return (async () => {
        const raw = endpointData || {};
        const rawListInner = Array.isArray(raw.data) ? raw.data : [];
        const countries = rawListInner.map(item => item && item.country).filter(Boolean).map(c => c.slice(0,3).toUpperCase());
        const year = rawListInner.length > 0 ? parseInt(rawListInner[0]?.year || '2024') : 2024;
        const dataObj = rawListInner.reduce((acc, item) => {
          if (!item || !item.country) return acc;
          const code = (item.country || '').slice(0,3).toUpperCase();
          acc[code] = { value: (typeof item.value === 'number') ? item.value : Number(item.value) || null, year: item.year || String(year), country: item.country || null };
          return acc;
        }, {});
        return {
          countries,
          year,
          source: 'World Bank Mock',
          data: dataObj,
          globalAverage: raw.summary && typeof raw.summary.averageValue === 'number' ? raw.summary.averageValue : calculateGlobalAverage(dataObj)
        };
      })();
    }

    // Use the new serverless endpoint instead of direct API calls
    const API_BASE = process.env.API_BASE || 'http://localhost:4000';
    const response = await fetch(`${API_BASE}/api/global-risk/food-security`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token'}`
      }
    });

    if (!response.ok) {
      throw new Error(`Food security endpoint returned ${response.status}`);
    }

    const endpointData = await response.json();

    // Defensive: validate endpointData shape
    const raw = endpointData || {};
    const rawList = Array.isArray(raw.data) ? raw.data : [];
    const countries = rawList.map(item => item && item.countryCode).filter(Boolean);
    const year = rawList.length > 0 ? parseInt(rawList[0]?.year || '2024') : 2024;
    const dataObj = rawList.reduce((acc, item) => {
      if (!item || !item.countryCode) return acc;
      acc[item.countryCode] = {
        value: (typeof item.value === 'number') ? item.value : Number(item.value) || null,
        year: item.year || String(year),
        country: item.country || null
      };
      return acc;
    }, {});
    const transformedData = {
      countries,
      year,
      source: "World Bank API via Serverless Endpoint - SN.ITK.DEFC.ZS",
      data: dataObj,
      globalAverage: (raw.summary && typeof raw.summary.averageValue === 'number') ? raw.summary.averageValue : calculateGlobalAverage(dataObj)
    };

    return transformedData;
  } catch (error) {
    console.error('Error in getFoodSecurityIndex:', error);
    // Fallback to mock data if endpoint fails
    return {
      countries: ['COL', 'PER', 'ARG'],
      year: 2024,
      source: "Fallback Mock Data",
      data: {
        COL: { value: 5.2, year: '2024', country: 'Colombia' },
        PER: { value: 7.1, year: '2024', country: 'Peru' },
        ARG: { value: 4.8, year: '2024', country: 'Argentina' }
      },
      globalAverage: 5.7,
      error: error.message
    };
  }
};

/**
 * Calculates global average from country data.
 * @param {object} data - Country data object
 * @returns {number} Global average
 */
function calculateGlobalAverage(data) {
  const values = Object.values(data).filter(item => item.value !== null && !item.error).map(item => item.value);
  if (values.length === 0) return null;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}
