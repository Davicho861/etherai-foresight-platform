import express from 'express';
const app = express();
const port = process.env.WORLDBANK_MOCK_PORT || 4010;

// Simple mock for undernourishment data used by getFoodSecurityIndex
app.get('/v2/country/:country/indicators/SH.STA.UNDR', (req, res) => {
  const { country } = req.params;
  // Return a small static series
  res.json({
    country,
    indicator: 'Undernourishment',
    data: [
      { year: 2020, value: 6.1 },
      { year: 2021, value: 5.8 },
      { year: 2022, value: 5.7 }
    ]
  });
});

app.listen(port, () => {
  console.log(`WorldBank mock listening on http://localhost:${port}`);
});

export default app;
