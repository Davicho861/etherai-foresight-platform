export interface LiveData {
  kpis: {
    precisionPromedio: number;
    prediccionesDiarias: number;
    monitoreoContinuo: number;
    coberturaRegional: number;
  };
  countries: Array<{
    name: string;
    code: string;
    lat: number;
    lon: number;
    climate?: any;
    social?: any;
    economic?: any;
  }>;
  communityResilience?: any;
  foodSecurity?: any;
  ethicalAssessment?: any;
  global: {
    crypto?: any;
    seismic?: any;
  };
  lastUpdated: string;
}
