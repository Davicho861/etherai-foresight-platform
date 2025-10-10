import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ResilienceData {
  country: string;
  socialEvents: number;
  resilienceScore: number;
  recommendations: string[];
  period: { startDate: string; endDate: string };
}

interface CommunityResilienceResponse {
  resilienceAnalysis: { [key: string]: ResilienceData };
  globalResilienceAssessment: any;
  timestamp: string;
}

const CommunityResilienceWidget: React.FC = () => {
  const [resilienceData, setResilienceData] = useState<CommunityResilienceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('praevisio_token') || 'demo-token';
        const response = await fetch('/api/community-resilience', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setResilienceData(data.data);
        }
      } catch (error) {
        console.error('Error fetching resilience data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCountryColor = (countryCode: string) => {
    if (!resilienceData) return '#DDD';
    const countryData = resilienceData.resilienceAnalysis[countryCode];
    if (!countryData) return '#DDD';

    const score = countryData.resilienceScore;
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getTooltipContent = (countryCode: string) => {
    if (!resilienceData) return '';
    const countryData = resilienceData.resilienceAnalysis[countryCode];
    if (!countryData) return `${countryCode}: Sin datos`;

    return `
      <div style="max-width: 200px;">
        <strong>${countryData.country}</strong><br/>
        Resiliencia: ${countryData.resilienceScore.toFixed(1)}/100<br/>
        Eventos Sociales: ${countryData.socialEvents}<br/>
        <br/>
        <strong>Recomendaciones:</strong><br/>
        ${countryData.recommendations.slice(0, 2).join('<br/>')}
      </div>
    `;
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-300">Cargando resiliencia comunitaria...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Resiliencia Comunitaria LATAM</CardTitle>
        <p className="text-gray-400 text-sm">Mapa interactivo de fortaleza social</p>
      </CardHeader>
      <CardContent>
        <div className="h-64" data-testid="resilience-map">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 300,
              center: [-60, -15]
            }}
            className="w-full h-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A3;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryColor(countryCode)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#60A5FA' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => setHoveredCountry(countryCode)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <span>🟢 Alta Resiliencia (80-100)</span>
          <span>🟡 Media Resiliencia (60-79)</span>
          <span>🔴 Baja Resiliencia (0-59)</span>
        </div>
        {hoveredCountry && (
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            {(() => {
              const countryData = resilienceData?.resilienceAnalysis[hoveredCountry];
              if (!countryData) return <p className="text-gray-300">Sin datos para {hoveredCountry}</p>;
              return (
                <div>
                  <h4 className="text-white font-semibold">{countryData.country}</h4>
                  <p className="text-gray-300">Resiliencia: {countryData.resilienceScore.toFixed(1)}/100</p>
                  <p className="text-gray-300">Eventos Sociales: {countryData.socialEvents}</p>
                  <div className="mt-2">
                    <p className="text-gray-400 text-sm">Recomendaciones:</p>
                    <ul className="text-xs text-gray-400 list-disc list-inside">
                      {countryData.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityResilienceWidget;