import express from 'express';
import MetatronAgent from '../agents.js';

const router = express.Router();

// GET /api/community-resilience - Get community resilience analysis
router.get('/', async (req, res) => {
  try {
    const { countries = 'COL,PER,ARG', days = 30 } = req.query;
    const countriesArray = countries.split(',').map(c => c.trim().toUpperCase());

    const agent = new MetatronAgent('CommunityResilienceAgent');
    const result = await agent.run({ countries: countriesArray, days: parseInt(days) });

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[CommunityResilience] Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/community-resilience/report - Generate and return resilience report
router.get('/report', async (req, res) => {
  try {
    const { countries = 'COL,PER,ARG', days = 30 } = req.query;
    const countriesArray = countries.split(',').map(c => c.trim().toUpperCase());

    const agent = new MetatronAgent('CommunityResilienceAgent');
    const analysis = await agent.run({ countries: countriesArray, days: parseInt(days) });

    // Generate report content
    const reportContent = `# COMMUNITY_RESILIENCE_REPORT.md

## Análisis de Resiliencia Comunitaria en LATAM

### Timestamp
${new Date().toISOString()}

### Análisis por País
${Object.entries(analysis.resilienceAnalysis).map(([country, data]) => `#### ${country}
- Eventos Sociales: ${data.socialEvents}
- Puntaje de Resiliencia: ${data.resilienceScore.toFixed(1)}/100
- Recomendaciones: ${data.recommendations.join(', ')}
- Período: ${data.period.startDate} a ${data.period.endDate}
`).join('\n')}

### Evaluación Global
- Resiliencia Promedio: ${analysis.globalResilienceAssessment.averageResilience.toFixed(1)}/100
- Países con Baja Resiliencia: ${analysis.globalResilienceAssessment.lowResilienceCountries}
- Evaluación: ${analysis.globalResilienceAssessment.assessment}
- Recomendaciones Globales: ${analysis.globalResilienceAssessment.globalRecommendations.join(', ')}

Generado por CommunityResilienceAgent - Praevisio AI
`;

    res.json({
      success: true,
      report: reportContent,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[CommunityResilience Report] Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;