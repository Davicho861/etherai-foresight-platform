import MetatronAgent from './server/src/agents.js';

async function runCommunityResilienceAnalysis() {
  const agent = new MetatronAgent('CommunityResilienceAgent');

  try {
    const result = await agent.run({
      countries: ['COL', 'PER', 'ARG'],
      days: 30
    });

    console.log('Análisis de Resiliencia Comunitaria completado:');
    console.log(JSON.stringify(result, null, 2));

    // Generar reporte
    const fs = await import('fs');
    const report = `# COMMUNITY_RESILIENCE_REPORT.md

## Análisis de Resiliencia Comunitaria en LATAM

### Timestamp
${result.timestamp}

### Análisis por País
${Object.entries(result.resilienceAnalysis).map(([country, data]) =>
  `#### ${country}
- Eventos Sociales: ${data.socialEvents}
- Puntaje de Resiliencia: ${data.resilienceScore.toFixed(1)}/100
- Recomendaciones: ${data.recommendations.join(', ')}
- Período: ${data.period.startDate} a ${data.period.endDate}
${data.isMock ? '- **Nota:** Datos simulados utilizados' : ''}
`
).join('\n')}

### Evaluación Global
- Resiliencia Promedio: ${result.globalResilienceAssessment.averageResilience.toFixed(1)}/100
- Países con Baja Resiliencia: ${result.globalResilienceAssessment.lowResilienceCountries}
- Evaluación: ${result.globalResilienceAssessment.assessment}
- Recomendaciones Globales: ${result.globalResilienceAssessment.globalRecommendations.join(', ')}

Generado por CommunityResilienceAgent - Praevisio AI
`;

    fs.writeFileSync('COMMUNITY_RESILIENCE_REPORT.md', report);
    console.log('Reporte generado: COMMUNITY_RESILIENCE_REPORT.md');

  } catch (error) {
    console.error('Error ejecutando análisis de resiliencia:', error);
  }
}

runCommunityResilienceAnalysis();