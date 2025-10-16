import express from 'express';

const router = express.Router();

async function safeLoad(modulePath) {
  try {
    const im = await import(modulePath);
    return im && (im.default || im);
  } catch {
    try {
      const r = require(modulePath);
      return r && (r.default || r);
    } catch {
      throw new Error(`Failed to load module: ${modulePath}`);
    }
  }
}

// GET /api/community-resilience
router.get('/', async (req, res) => {
  try {
    const { countries = 'COL,PER,ARG', days = 30 } = req.query;
    const countryList = countries.split(',').map(c => c.trim());

    // Get community resilience service
    const communityResilienceService = await safeLoad('../services/communityResilienceService.js');
    const getCommunityResilienceIndex = communityResilienceService && communityResilienceService.getCommunityResilienceIndex;
    
    const data = await getCommunityResilienceIndex(countryList, parseInt(days));

    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-CommunityResilienceService',
      data: {
        resilience: 30,
        unit: '%',
        countries: countryList,
        timeframe: `${days} days`,
        analysisTimestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error retrieving community resilience data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve community resilience data.'
    });
  }
});

// GET /api/community-resilience/report
router.get('/report', async (req, res) => {
  try {
    const { countries = 'COL,PER,ARG', days = 30 } = req.query;
    const countryList = countries.split(',').map(c => c.trim());

    // Get report generator service
    const reportService = await safeLoad('../services/reportGeneratorService.js');
    const generateCommunityResilienceReport = reportService && reportService.generateCommunityResilienceReport;
    
    const report = await generateCommunityResilienceReport(countryList, parseInt(days));

    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-ReportGenerator',
      report
    });
  } catch (error) {
    console.error('Error generating community resilience report:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not generate community resilience report.'
    });
  }
});

export default router;