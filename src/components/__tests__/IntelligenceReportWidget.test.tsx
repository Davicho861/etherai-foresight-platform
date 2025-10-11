import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IntelligenceReportWidget from '../IntelligenceReportWidget';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('IntelligenceReportWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    test('renders loading state initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<IntelligenceReportWidget />);

      expect(screen.getByText('Cargando informe de inteligencia...')).toBeInTheDocument();
    });
  });

  describe('Data Loaded State', () => {
    test('renders report title and content when fetch succeeds', async () => {
      const mockReportContent = '# Intelligence Report\n\nThis is a test report content.';
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(mockReportContent)
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(screen.getByText('Informe de Inteligencia Predictiva - LATAM')).toBeInTheDocument();
      });

      expect(screen.getByText((content) => content.includes('# Intelligence Report'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('This is a test report content.'))).toBeInTheDocument();
    });

    test('renders report with proper styling', async () => {
      const mockReportContent = 'Test report content';
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(mockReportContent)
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(screen.getByText('Informe de Inteligencia Predictiva - LATAM')).toBeInTheDocument();
      });

      const container = screen.getByText('Informe de Inteligencia Predictiva - LATAM').parentElement;
      expect(container).toHaveClass('bg-etherblue-dark/60', 'border', 'border-gray-700', 'rounded-lg', 'p-6');

      const title = screen.getByText('Informe de Inteligencia Predictiva - LATAM');
      expect(title).toHaveClass('text-lg', 'font-bold', 'mb-4');

      const content = screen.getByText(mockReportContent);
      expect(content).toHaveClass('text-sm', 'whitespace-pre-wrap');
    });
  });

  describe('Error Handling', () => {
    test('handles fetch error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network error'));

      render(<IntelligenceReportWidget />);

      // Should remain in loading state since error doesn't change state
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading report:', expect.any(Error));
      });

      // Component should still show loading since error doesn't update state
      expect(screen.getByText('Cargando informe de inteligencia...')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('handles non-ok response gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: false,
        text: () => Promise.reject(new Error('Not found'))
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error loading report:', expect.any(Error));
      });

      expect(screen.getByText('Cargando informe de inteligencia...')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Fetch Behavior', () => {
    test('fetches the correct URL', async () => {
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve('content')
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/INTELLIGENCE_REPORT_001.md');
      });
    });

    test('fetches data on mount', async () => {
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve('content')
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Report Content Rendering', () => {
    test('renders markdown content with preserved formatting', async () => {
      const mockReportContent = `# Header\n\n- List item 1\n- List item 2\n\n**Bold text**`;
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(mockReportContent)
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        const contentElement = screen.getByText((content: string) => content.includes('# Header') && content.includes('**Bold text**'));
        expect(contentElement).toHaveClass('whitespace-pre-wrap');
      });
    });

    test('renders empty report content', async () => {
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(' ')
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(screen.getByText('Informe de Inteligencia Predictiva - LATAM')).toBeInTheDocument();
        // Empty content should still render the container
        const contentDivs = screen.getAllByRole('generic');
        const contentDiv = contentDivs.find(div => div.className.includes('text-sm') && div.className.includes('whitespace-pre-wrap'));
        expect(contentDiv).toBeInTheDocument();
      });
    });

    test('renders report with special characters', async () => {
      const mockReportContent = 'Report with éñüñ and 中文';
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve(mockReportContent)
      });

      render(<IntelligenceReportWidget />);

      await waitFor(() => {
        expect(screen.getByText(mockReportContent)).toBeInTheDocument();
      });
    });
  });
});