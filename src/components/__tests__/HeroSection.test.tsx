import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../HeroSection';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Play: () => <div data-testid="play-icon" />
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn()
  }
}));

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: mockScrollIntoView
});

// Mock getElementById
const mockGetElementById = jest.fn();
document.getElementById = mockGetElementById;

// Mock requestAnimationFrame and canvas for animation
beforeEach(() => {
  // Mock requestAnimationFrame
  global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));

  // Mock window resize event
  jest.spyOn(window, 'addEventListener').mockImplementation();
  jest.spyOn(window, 'removeEventListener').mockImplementation();

  // Mock canvas context
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1
  })) as any;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
    expect(screen.getByText('Anticipa el Futuro,')).toBeInTheDocument();
    expect(screen.getByText('Actúa Hoy')).toBeInTheDocument();
  });

  it('displays the main heading and description', () => {
    render(<HeroSection />);
    expect(screen.getByText('Anticipa el Futuro,')).toBeInTheDocument();
    expect(screen.getByText('Actúa Hoy')).toBeInTheDocument();
    expect(screen.getByText(/Praevisio AI: Inteligencia anticipatoria/)).toBeInTheDocument();
  });

  it('shows the precision badge', () => {
    render(<HeroSection />);
    expect(screen.getByText('IA Predictiva del 90% de Precisión')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<HeroSection />);
    expect(screen.getByText('Actúa Antes de la Próxima Crisis')).toBeInTheDocument();
    expect(screen.getByText('Explorar Soluciones')).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<HeroSection />);
    expect(screen.getByText('Precisión del 90%')).toBeInTheDocument();
    expect(screen.getByText('IA Explicable')).toBeInTheDocument();
    expect(screen.getByText('Adaptable')).toBeInTheDocument();
  });

  it('renders video button', () => {
    render(<HeroSection />);
    expect(screen.getByText('Ver video (90 seg)')).toBeInTheDocument();
  });

  it('opens video modal when video button is clicked', async () => {
    render(<HeroSection />);
    const videoButton = screen.getByText('Ver video (90 seg)');

    fireEvent.click(videoButton);

    await waitFor(() => {
      expect(screen.getByText('Praevisio AI en Acción')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Video')).toBeInTheDocument();
    });
  });

  it('closes video modal when close button is clicked', async () => {
    render(<HeroSection />);
    const videoButton = screen.getByText('Ver video (90 seg)');

    fireEvent.click(videoButton);

    await waitFor(() => {
      expect(screen.getByText('Cerrar Video')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Cerrar Video');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Praevisio AI en Acción')).not.toBeInTheDocument();
    });
  });

  it('closes video modal when clicking outside', async () => {
    render(<HeroSection />);
    const videoButton = screen.getByText('Ver video (90 seg)');

    fireEvent.click(videoButton);

    await waitFor(() => {
      expect(screen.getByText('Praevisio AI en Acción')).toBeInTheDocument();
    });

    // Click on the modal backdrop (the fixed div with bg-black/80)
    const modalBackdrop = screen.getByText('Praevisio AI en Acción').closest('.fixed');
    fireEvent.click(modalBackdrop!);

    await waitFor(() => {
      expect(screen.queryByText('Praevisio AI en Acción')).not.toBeInTheDocument();
    });
  });

  it('handles CTA button click', async () => {
    const { toast } = require('sonner');
    const mockElement = { scrollIntoView: mockScrollIntoView };
    mockGetElementById.mockReturnValue(mockElement as any);

    render(<HeroSection />);
    const ctaButton = screen.getByText('Actúa Antes de la Próxima Crisis');

    fireEvent.click(ctaButton);

    expect(toast.info).toHaveBeenCalledWith('Preparando tu experiencia con Praevisio AI');

    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  it('renders canvas element', () => {
    render(<HeroSection />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders icons correctly', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
  });
});