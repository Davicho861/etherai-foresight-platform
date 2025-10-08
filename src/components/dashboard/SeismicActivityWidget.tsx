import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

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

const SeismicActivityWidget = () => {
  const { data: seismicData, isLoading, error } = useQuery({
    queryKey: ['seismicActivity'],
    queryFn: fetchSeismicActivity,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de Actividad Sísmica Global</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No se pudo cargar la actividad sísmica.</p>
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
            {seismicData && seismicData.map(event => {
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
            {seismicData && seismicData.slice(0, 5).map(event => (
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
