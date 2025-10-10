import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Function to fetch seismic data
const fetchSeismicActivity = async () => {
  const res = await fetch('/api/seismic/activity', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('praevisio_token') || 'demo-token'}`,
    },
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const SeismicMapWidget: React.FC = () => {
  const [magnitudeFilter, setMagnitudeFilter] = useState<number>(4.0);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [seismicData, setSeismicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSeismicActivity();
        setSeismicData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching seismic data:', err);
        setError('Error al cargar datos sísmicos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refetch every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter events by magnitude and focus on LATAM region
  const filteredEvents = seismicData?.filter((event: any) => {
    const mag = event.properties?.mag || 0;
    const [lon, lat] = event.geometry?.coordinates || [0, 0];

    // Focus on LATAM: roughly -120 to -30 longitude, -60 to 30 latitude
    const inLatam = lon >= -120 && lon <= -30 && lat >= -60 && lat <= 30;

    return mag >= magnitudeFilter && inLatam;
  }) || [];

  const getMarkerColor = (magnitude: number) => {
    if (magnitude >= 7.0) return '#EF4444'; // Red for major
    if (magnitude >= 6.0) return '#F59E0B'; // Orange for strong
    if (magnitude >= 5.0) return '#FCD34D'; // Yellow for moderate
    return '#10B981'; // Green for light
  };

  const getMarkerSize = (magnitude: number) => {
    return Math.max(magnitude * 2, 3);
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Monitoreo Sísmico LATAM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-300">Cargando datos sísmicos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">No se pudo cargar la actividad sísmica.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Monitoreo Sísmico LATAM</CardTitle>
            <p className="text-gray-400 text-sm">Eventos sísmicos en tiempo real</p>
          </div>
          <Select value={magnitudeFilter.toString()} onValueChange={(value) => setMagnitudeFilter(parseFloat(value))}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="3.0">M ≥ 3.0</SelectItem>
              <SelectItem value="4.0">M ≥ 4.0</SelectItem>
              <SelectItem value="5.0">M ≥ 5.0</SelectItem>
              <SelectItem value="6.0">M ≥ 6.0</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: "300px" }} data-testid="seismic-map">
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
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#374151"
                    stroke="#4B5563"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {filteredEvents.map((event: any) => {
              const [lon, lat] = event.geometry.coordinates;
              const mag = event.properties.mag;
              return (
                <Marker
                  key={event.id}
                  coordinates={[lon, lat]}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <circle
                    r={getMarkerSize(mag)}
                    fill={getMarkerColor(mag)}
                    stroke="#FFF"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {hoveredEvent && (
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            <h4 className="text-white font-semibold">
              M{hoveredEvent.properties.mag.toFixed(1)} - {hoveredEvent.properties.place}
            </h4>
            <p className="text-gray-300 text-sm">
              {new Date(hoveredEvent.properties.time).toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs">
              Profundidad: {hoveredEvent.geometry.coordinates[2]?.toFixed(1)} km
            </p>
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-bold text-white mb-2">Eventos Recientes (M ≥ {magnitudeFilter}):</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {filteredEvents.slice(0, 10).map((event: any) => (
              <div key={event.id} className="text-sm text-gray-300 flex justify-between">
                <span>M{event.properties.mag.toFixed(1)} - {event.properties.place.split(',')[0]}</span>
                <span className="text-gray-500">
                  {new Date(event.properties.time).toLocaleDateString()}
                </span>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <p className="text-gray-500 text-sm">No hay eventos sísmicos recientes que cumplan los criterios.</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-gray-400">
          <span>🟢 Ligero (3.0-4.9)</span>
          <span>🟡 Moderado (5.0-5.9)</span>
          <span>🟠 Fuerte (6.0-6.9)</span>
          <span>🔴 Mayor (7.0+)</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeismicMapWidget;