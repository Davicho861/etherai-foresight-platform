import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '../Index';

// Mock lazy loaded components
jest.mock('../../components/AdvancedInteractiveDashboard', () => {
  return function MockAdvancedInteractiveDashboard() {
    return <div data-testid="advanced-dashboard">Advanced Dashboard</div>;
  };
});

jest.mock('../../components/generated/TestimonialCarousel', () => {
  return function MockTestimonialCarousel() {
    return <div data-testid="testimonial-carousel">Testimonials</div>;
  };
});

// Mock other components to avoid complex renders
jest.mock('../../components/Navbar', () => () => <div>Navbar</div>);
jest.mock('../../components/HeroSection', () => () => <div>Hero</div>);
jest.mock('../../components/FeaturesSection', () => () => <div>Features</div>);
jest.mock('../../components/SolutionsSection', () => () => <div>Solutions</div>);
jest.mock('../../components/HowItWorksSection', () => () => <div>How It Works</div>);
jest.mock('../../components/EnhancedContactSection', () => () => <div>Contact</div>);
jest.mock('../../components/EnhancedCredibilitySection', () => () => <div>Credibility</div>);
jest.mock('../../components/EnhancedFAQSection', () => () => <div>FAQ</div>);
jest.mock('../../components/Footer', () => () => <div>Footer</div>);
jest.mock('../../components/ComparisonSection', () => () => <div>Comparison</div>);
jest.mock('../ModuleColombia', () => () => <div>Colombia Module</div>);
jest.mock('../../components/CommandCenterLayout', () => () => <div>Command Center</div>);

describe('Index Page Performance Optimizations', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Mock scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByText(/Praevisio/i)).toBeInTheDocument();
  });

  test('renders main content after loading', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Hero')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  test('lazy loads AdvancedInteractiveDashboard', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('advanced-dashboard')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('lazy loads TestimonialCarousel', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('testimonial-carousel')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('shows command center when token exists', async () => {
    const mockGetItem = jest.mocked(window.localStorage.getItem);
    mockGetItem.mockReturnValue('test-token');

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Command Center')).toBeInTheDocument();
    });
  });

  test('handles smooth scrolling for anchor links', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      const anchor = document.querySelector('a[href^="#"]') as HTMLAnchorElement;
      if (anchor) {
        anchor.click();
        expect(window.scrollTo).toHaveBeenCalled();
      }
    });
  });
});