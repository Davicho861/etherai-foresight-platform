import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface SeismicActivityWidgetProps {
  seismicData?: any[];
}

const SeismicActivityWidget: React.FC<SeismicActivityWidgetProps> = ({ seismicData }) => {

  // If no seismicData is provided, show informative state
  if (!seismicData || !seismicData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de Actividad Sísmica Global</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-300">Datos sísmicos no disponibles (orquestador)</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoreo de Actividad Sísmica Global (USGS)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: "auto" }}>
          <ComposableMap projectionConfig={{ scale: 147 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />)
              }
            </Geographies>
            {seismicData.map(event => {
              const [lon, lat] = event.geometry.coordinates;
              return (
                <Marker key={event.id} coordinates={[lon, lat]}>
                  <circle r={Math.max(event.properties.mag / 2, 2)} fill="rgba(255, 87, 51, 0.6)" stroke="#FFF" strokeWidth={0.5} />
                </Marker>
              );
            })}
          </ComposableMap>
        </div>
        <div className="mt-4">
          <h4 className="font-bold">Eventos Significativos Recientes:</h4>
          <ul className="list-disc pl-5 mt-2 text-sm">
            {seismicData.slice(0, 5).map(event => (
              <li key={event.id}>
                <strong>M{event.properties.mag.toFixed(1)}</strong> - {event.properties.place}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeismicActivityWidget;
