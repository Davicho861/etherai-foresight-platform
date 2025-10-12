export function analyzeSeismicActivity(data) {
  if (!data || !data.features) return [];

  return data.features.map(feature => {
    const { properties, geometry, id } = feature;
    const magnitude = properties.mag || 0;
    const riskScore = Math.min(100, Math.round((magnitude / 10) * 100) + (properties.tsunami ? 20 : 0));

    return {
      id: id,
      place: properties.place,
      magnitude: magnitude,
      depth: geometry.coordinates[2],
      time: properties.time,
      url: properties.url,
      tsunami: { warning: properties.tsunami },
      riskScore,
    };
  });
}
