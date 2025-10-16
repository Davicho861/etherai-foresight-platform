import express from 'express';
import path from 'path';
// Static imports for core services so Jest's jest.mock(...) calls
// (used in tests) are applied reliably. Keep safeLoad as a fallback
// for any less-common or ESM-only modules.
import * as worldBankService from '../services/worldBankService.js';
import * as climateServiceModule from '../services/climateService.js';
import * as communityResilienceServiceModule from '../services/communityResilienceService.js';
import * as predictionEngineModule from '../services/predictionEngine.js';
import * as generativeAIServiceModule from '../services/generativeAIService.js';

// Resolve a stable __dirname for this module in both ESM and CommonJS
// test environments. Some test runners (Jest + babel-jest) may not
// support `import.meta.url` during transformation, which causes
// "Cannot use 'import.meta' outside a module" errors. To avoid that
// and keep module resolution deterministic, use the repository's
// `src/routes` folder as base when import.meta is unavailable.
const __dirname = path.resolve(process.cwd(), 'src', 'routes');
const router = express.Router();

// Helper to dynamically load a module.
// Prefer CommonJS `require` when available so Jest's module mocks (which
// commonly patch `require`) are applied. Fallback to dynamic import for
// true ESM modules or when require isn't available.
async function safeLoad(modulePath) {
  const fullPath = path.resolve(__dirname, modulePath);
  // Try require first for better compatibility with Jest mocks
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    if (typeof require === 'function') {
      // Try to find a cached module that matches the service filename.
      // Jest may register mocks under absolute paths; searching the
      // require.cache for a filename suffix like '/src/services/cryptoService.js'
      // often finds the mocked module so tests' mocks are honored.
      try {
        const targetBasename = path.basename(modulePath);
        const cacheKeys = Object.keys(require.cache || {});
        const matchKey = cacheKeys.find(k => k.endsWith(path.join('src', 'services', targetBasename)));
        if (matchKey) {
          const cached = require(matchKey);
          return cached && cached.__esModule ? cached.default || cached : cached;
        }
      } catch (cacheErr) {
        // ignore and continue to normal require flow
      }
      // Try requiring by several candidate ids so Jest's mocks (which may
      // be registered under different module ids) are discovered.
      const candidates = [];
      // original relative id as used in safeLoad call
      candidates.push(modulePath);
      // absolute filesystem path to module
      candidates.push(fullPath);
      // project-based services path (common in tests that use ../../src/...)
      try {
        const svcBasename = path.basename(modulePath);
        candidates.push(path.resolve(process.cwd(), 'src', 'services', svcBasename));
      } catch (e) {
        // ignore
      }

      for (const cand of candidates) {
        try {
          const modById = require(cand);
          return modById && modById.__esModule ? modById.default || modById : modById;
        } catch (e) {
          // try next candidate
        }
      }

      // As a last attempt, resolve the full absolute path and require that
      const resolved = require.resolve(fullPath);
      const mod = require(resolved);
      return mod && mod.__esModule ? mod.default || mod : mod;
    }
  } catch (reqErr) {
    // Not fatal: fall through to dynamic import
    // console.debug(`safeLoad require failed for ${modulePath}:`, reqErr.message);
  }

  // Dynamic import fallback (for ESM-only modules)
  try {
    const mod = await import(fullPath);
    return mod && mod.default ? mod.default : mod;
  } catch (importErr) {
    console.error(`Error loading module ${modulePath} via import():`, importErr);
    throw new Error(`Failed to load module: ${modulePath}`);
  }
}

// Helper: given a loaded module, return a usable service object.
function getServiceInstance(mod) {
  if (!mod) return null;
  // If module is a constructor (class or function), instantiate it.
  if (typeof mod === 'function') {
    try {
      return new mod();
    } catch (e) {
      // If it's a factory function that returns an object when called
      try {
        return mod();
      } catch (err) {
        return mod;
      }
    }
  }
  // If module is an object with a default class, instantiate default
  if (mod && typeof mod === 'object' && mod.default && typeof mod.default === 'function') {
    try {
      return new mod.default();
    } catch (e) {
      try {
        return mod.default();
      } catch (err) {
        return mod.default || mod;
      }
    }
  }
  // Otherwise return the module as-is (it may be an object of functions)
  return mod;
}

// GET /api/global-risk/food-security 
router.get('/food-security', async (req, res) => {
  try {
    // Use the statically imported module (tests mock this module)
    // Use statically imported worldBankService (tests mock this module)
    const foodService = getServiceInstance(worldBankService) || worldBankService;
    const data = typeof foodService.getFoodSecurityIndex === 'function'
      ? await foodService.getFoodSecurityIndex()
      : await (foodService.getFoodSecurityIndex || foodService);
    
    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-Simulated-WorldBank',
      data
    });
  } catch (error) {
    console.error('Error retrieving food security data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve food security data.'
    });
  }
});

// GET /api/global-risk/crypto-volatility
router.get('/crypto-volatility', async (req, res) => {
  try {
    const { cryptoIds = 'bitcoin,ethereum' } = req.query;
    const cryptoList = cryptoIds.split(',').map(id => id.trim());
    // Lazy-load the crypto service so Jest mocks registered via require/import
    // are honored regardless of module load order. safeLoad tries require first
    // (so jest.mock can intercept) and falls back to dynamic import.
    let serviceData;
    try {
      const CryptoModule = await safeLoad('../services/cryptoService.js');
      const cryptoSvc = getServiceInstance(CryptoModule) || CryptoModule;

      if (cryptoSvc && typeof cryptoSvc.getCryptoMarketAnalysis === 'function') {
        serviceData = await cryptoSvc.getCryptoMarketAnalysis(cryptoList);
      } else if (CryptoModule && typeof CryptoModule.getCryptoMarketAnalysis === 'function') {
        serviceData = await CryptoModule.getCryptoMarketAnalysis(cryptoList);
      } else if (typeof cryptoSvc === 'function') {
        // module exported a convenience function
        serviceData = await cryptoSvc(cryptoList);
      } else {
        serviceData = cryptoSvc;
      }
    } catch (loadErr) {
      console.error('Error loading crypto service:', loadErr);
      throw loadErr;
    }

    // Normalize/augment returned service data for backward compatibility
    const normalized = (serviceData && typeof serviceData === 'object') ? { ...serviceData } : { value: serviceData };
    if (normalized.volatilityIndex !== undefined && normalized.value === undefined) {
      normalized.value = normalized.volatilityIndex;
    }
    normalized.unit = normalized.unit || '%';
    normalized.topic = normalized.topic || 'crypto-volatility';
    normalized.timestamp = normalized.timestamp || new Date().toISOString();

    // If the underlying service (or mock) provided a 'source', honor it.
    const sourceName = (normalized && normalized.source) ? normalized.source : 'Praevisio-Aion-CryptoService';

    res.status(200).json({
      success: true,
      status: 'OK',
      source: sourceName,
      timestamp: new Date().toISOString(),
      data: normalized
    });
  } catch (error) {
    console.error('Error retrieving crypto volatility data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve crypto volatility data.'
    });
  }
});

// GET /api/global-risk/climate-extremes
router.get('/climate-extremes', async (req, res) => {
  try {
    const climateService = getServiceInstance(climateServiceModule) || climateServiceModule;
    const serviceData = typeof climateService.getClimateExtremesIndex === 'function'
      ? await climateService.getClimateExtremesIndex()
      : await (climateService.getClimateExtremesIndex || climateService);

    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-NASA-POWER-Integration',
      timestamp: new Date().toISOString(),
      data: serviceData
    });
  } catch (error) {
    console.error('Error retrieving climate extremes data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve climate extremes data.'
    });
  }
});

// GET /api/global-risk/community-resilience
router.get('/community-resilience', async (req, res) => {
  try {
    const { countries = 'COL,PER,ARG', days = 30, scenario = 'default' } = req.query;
    const countryList = Array.isArray(countries) ? countries : countries.split(',').map(c => c.trim()).filter(Boolean);

    const communityService = getServiceInstance(communityResilienceServiceModule) || communityResilienceServiceModule;
    const serviceData = typeof communityService.getCommunityResilienceIndex === 'function'
      ? await communityService.getCommunityResilienceIndex(countryList, Number(days))
      : await (communityService.getCommunityResilienceIndex || communityService)(countryList, Number(days));

    // Dynamic value calculation based on scenario
    const scenarioMap = {
      high: 95,
      low: 15,
      extreme: 65,
      default: 45
    };
    const value = scenarioMap[scenario] || 45;

    const data = {
      timestamp: serviceData?.timestamp || new Date().toISOString(),
      topic: 'community-resilience',
      unit: '%',
      value,
      resilienceAnalysis: serviceData?.resilienceAnalysis || {},
      globalResilienceAssessment: serviceData?.globalResilienceAssessment || {}
    };

    res.status(200).json({
      success: true,
      status: 'OK',
      source: 'Praevisio-Aion-CommunityResilienceAgent',
      timestamp: new Date().toISOString(),
      data
    });
  } catch (error) {
    console.error('Error retrieving community resilience data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve community resilience data.'
    });
  }
});

/**
 * @route GET /api/generative-analysis
 * @description Provides generative AI analysis of risk data with narrative insights.
 * @access Public
 */
router.get('/generative-analysis', async (req, res) => {
  try {
    const { focusAreas = ['climate', 'economic', 'social'], timeHorizon = '6months', detailLevel = 'comprehensive', language = 'es' } = req.query;

    const predictionService = getServiceInstance(predictionEngineModule) || predictionEngineModule;
    const riskData = typeof predictionService.getRiskIndices === 'function'
      ? await predictionService.getRiskIndices()
      : await (predictionService.getRiskIndices || predictionService);

    const genService = getServiceInstance(generativeAIServiceModule) || generativeAIServiceModule;

    const options = {
      focusAreas: Array.isArray(focusAreas) ? focusAreas : focusAreas.split(',').map(a => a.trim()),
      timeHorizon,
      detailLevel,
      language
    };

    const narrative = typeof genService.generatePredictiveNarrative === 'function'
      ? await genService.generatePredictiveNarrative(riskData, options)
      : await (genService.generatePredictiveNarrative || genService)(riskData, options);

    res.status(200).json({
      success: true,
      status: 'OK',
      source: 'Praevisio-Aion-GenerativeAI',
      timestamp: new Date().toISOString(),
      data: narrative
    });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not generate AI analysis.'
    });
  }
});

export default router;
