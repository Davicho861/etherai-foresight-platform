function makeId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2,8)}`;
}

function computePrediction(country, parameters) {
  // simple weighted logic for demo purposes
  const { infectionRate = 0, protestIndex = 0, economicIndex = 0, temperature = 0 } = parameters;
  const score = (infectionRate * 0.5) + (protestIndex * 0.3) + (economicIndex * 0.15) + (temperature * 0.05);
  let risk = 'low';
  if (score >= 70) risk = 'high';
  else if (score >= 30) risk = 'medium';

  const confidence = Math.max(0.5, Math.min(0.95, 1 - Math.abs(50 - score) / 100));

  const factors = [];
  const total = infectionRate + protestIndex + economicIndex + temperature || 1;
  if (infectionRate) factors.push({ name: 'Infection rate', weight: +(infectionRate/total).toFixed(2), value: infectionRate });
  if (protestIndex) factors.push({ name: 'Protest index', weight: +(protestIndex/total).toFixed(2), value: protestIndex });
  if (economicIndex) factors.push({ name: 'Economic index', weight: +(economicIndex/total).toFixed(2), value: economicIndex });
  if (temperature) factors.push({ name: 'Temperature', weight: +(temperature/total).toFixed(2), value: temperature });

  return {
    predictionId: makeId('pred'),
    country,
    risk,
    confidence: Number(confidence.toFixed(2)),
    factors,
    generatedAt: new Date().toISOString(),
    score: Math.round(score)
  };
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { country, parameters } = req.body || {};
  if (!country || !parameters) {
    return res.status(400).json({ error: 'country and parameters are required' });
  }

  const result = computePrediction(country, parameters);
  return res.status(200).json(result);
}