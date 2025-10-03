import React from 'react';
import MissionCard from './MissionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AccessLevel = 'public' | 'corporate' | 'state';

interface Props {
  countryCode: string | null;
  countries: Record<string, any>;
  accessLevel: AccessLevel;
  missionsByLevel: Record<string, any>;
  onStartMission: (mission: any) => void;
}

const CountryDashboard: React.FC<Props> = ({ countryCode, countries, accessLevel, missionsByLevel, onStartMission }) => {
  if (!countryCode) {
    return (
        <div data-testid="country-placeholder" className="p-8 text-center text-gray-400">Selecciona un país para ver su dashboard</div>
    );
  }

  const country = countries[countryCode];
  const missionsForCountry = missionsByLevel[accessLevel] && missionsByLevel[accessLevel][countryCode] ? [missionsByLevel[accessLevel][countryCode]] : [];

  return (
      <main data-testid={`country-dashboard-${countryCode}`} className="p-6 flex-1">
      <div className="mb-6">
          <h2 data-testid={`country-header-${countryCode}`} className="text-2xl font-bold flex items-center space-x-3"><span className="text-3xl">{country.flag}</span><span>{country.name}</span></h2>
          <div data-testid={`country-stats-${countryCode}`} className="text-sm text-gray-400">Población: {(country.population / 1000000).toFixed(1)}M • PIB: ${(country.gdp / 1000).toFixed(0)}B • Estabilidad: {country.stability}/10</div>
      </div>

        <div data-testid="mission-gallery" className="space-y-4">
        {missionsForCountry.length === 0 && (
            <Card className="bg-gray-900 text-white p-4" data-testid="no-missions-card">
            <CardHeader>
              <CardTitle>No hay misiones disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">Cambia el nivel de acceso o selecciona otro país.</div>
            </CardContent>
          </Card>
        )}

        {missionsForCountry.map((m: any) => (
            <div key={m.id} className="mission-card-wrap">
              <MissionCard mission={m} onStart={onStartMission} />
            </div>
        ))}
      </div>
    </main>
  );
};

export default CountryDashboard;
