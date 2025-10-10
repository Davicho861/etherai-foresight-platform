import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQSection from '../FAQSection';

describe('FAQSection', () => {
  it('renders without crashing', () => {
    render(<FAQSection />);
    expect(screen.getByText('Preguntas')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<FAQSection />);
    expect(screen.getByText('Preguntas')).toBeInTheDocument();
    expect(screen.getByText('Frecuentes')).toBeInTheDocument();
  });

  it('displays the description', () => {
    render(<FAQSection />);
    expect(screen.getByText(/Respuestas a las dudas más comunes/)).toBeInTheDocument();
  });

  it('renders FAQ questions', () => {
    render(<FAQSection />);
    expect(screen.getByText('¿Qué nivel de precisión tienen realmente las predicciones?')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo protegen la seguridad y privacidad de nuestros datos?')).toBeInTheDocument();
    expect(screen.getByText('¿Cuánto tiempo se tarda en implementar Praevisio AI?')).toBeInTheDocument();
    expect(screen.getByText('¿Qué hace diferente a Praevisio AI de otras soluciones predictivas?')).toBeInTheDocument();
    expect(screen.getByText('¿Qué soporte ofrecen después de la implementación?')).toBeInTheDocument();
  });

  it('renders accordion structure', () => {
    render(<FAQSection />);
    // Check that accordion items are rendered
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });
});