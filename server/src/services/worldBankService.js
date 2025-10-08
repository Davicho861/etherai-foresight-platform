/**
 * @fileoverview Mock service for fetching World Bank data.
 * In a real-world scenario, this service would make API calls to the World Bank's data portal.
 * For this simulation, it returns static, pre-defined data representing the food security index.
 */

const mockFoodSecurityData = {
  country: "Global",
  year: 2025,
  index: 78.4,
  source: "Simulated World Bank Data",
  indicators: [
    { name: "Affordability", score: 85.2 },
    { name: "Availability", score: 75.1 },
    { name: "Quality and Safety", score: 88.9 },
    { name: "Natural Resources & Resilience", score: 64.5 },
  ],
};

/**
 * Fetches the global food security index.
 * @returns {Promise<object>} A promise that resolves to the mock food security data.
 */
export const getFoodSecurityIndex = async () => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockFoodSecurityData;
};
