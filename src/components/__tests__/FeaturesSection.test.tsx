import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturesSection from '../FeaturesSection';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Database: () => <div data-testid="database-icon" />,
  FileSearch: () => <div data-testid="file-search-icon" />,
  Activity: () => <div data-testid="activity-icon" />
}));

describe('FeaturesSection', () => {
  it('renders without crashing', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Predicciones')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Predicciones')).toBeInTheDocument();
    expect(screen.getByText('que Transforman Decisiones')).toBeInTheDocument();
  });

  it('displays the description', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Praevisio AI integra inteligencia híbrida/)).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Analiza todo')).toBeInTheDocument();
    expect(screen.getByText('Funciona para todos')).toBeInTheDocument();
    expect(screen.getByText('Resultados simples, decisiones claras')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Clima, economía, redes sociales/)).toBeInTheDocument();
    expect(screen.getByText(/Salud, política, economía/)).toBeInTheDocument();
    expect(screen.getByText(/Interfaz intuitiva que traduce/)).toBeInTheDocument();
  });

  it('renders the transformation section', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Transformando Datos en Predicciones Actionables')).toBeInTheDocument();
  });

  it('renders transformation features', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Análisis multivariable de economía, clima, y tendencias sociales')).toBeInTheDocument();
    expect(screen.getByText('Detección temprana de crisis con ventanas de 3-6 meses')).toBeInTheDocument();
    expect(screen.getByText('Recomendaciones personalizadas y accionables')).toBeInTheDocument();
  });

  it('renders the risk analysis demo', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Análisis de Riesgo Climático')).toBeInTheDocument();
    expect(screen.getByText('90% precisión')).toBeInTheDocument();
  });

  it('renders risk indicators', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Riesgo de inundación')).toBeInTheDocument();
    expect(screen.getByText('Impacto económico')).toBeInTheDocument();
    expect(screen.getByText('Preparación social')).toBeInTheDocument();
  });

  it('renders recommendation text', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Recomendación: Implementar medidas/)).toBeInTheDocument();
  });

  it('renders icons correctly', () => {
    render(<FeaturesSection />);
    expect(screen.getByTestId('database-icon')).toBeInTheDocument();
    expect(screen.getByTestId('file-search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
  });
});