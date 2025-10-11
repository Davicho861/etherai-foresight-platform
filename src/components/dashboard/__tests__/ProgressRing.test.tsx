import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressRing from '../ProgressRing';

describe('ProgressRing', () => {
  test('renders SVG with default props', () => {
    const { container } = render(<ProgressRing progress={50} />);

  const svg = container.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveAttribute('width', '80');
  expect(svg).toHaveAttribute('height', '80');
  });

  test('renders SVG with custom size', () => {
    const { container } = render(<ProgressRing progress={50} size={100} />);

  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('width', '100');
  expect(svg).toHaveAttribute('height', '100');
  });

  test('renders SVG with custom stroke', () => {
    const { container } = render(<ProgressRing progress={50} stroke={10} />);

  const svg = container.querySelector('svg');
  expect(svg).toBeInTheDocument();
  });

  test('renders background circle', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const backgroundCircle = container.querySelector('circle[stroke="#1f2937"]');
    expect(backgroundCircle).toBeInTheDocument();
    expect(backgroundCircle).toHaveAttribute('r', '36'); // (80 - 8) / 2 = 36
    expect(backgroundCircle).toHaveAttribute('stroke-width', '8');
  });

  test('renders progress circle with correct dash properties', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const progressCircle = container.querySelector('circle[stroke="url(#praevisioGradient)"]');
    expect(progressCircle).toBeInTheDocument();
    expect(progressCircle).toHaveAttribute('r', '36');
    expect(progressCircle).toHaveAttribute('stroke-width', '8');
    expect(progressCircle).toHaveAttribute('stroke-linecap', 'round');
    expect(progressCircle).toHaveAttribute('transform', 'rotate(-90)');
  });

  test('calculates correct stroke dash array and offset for 50% progress', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const progressCircle = container.querySelector('circle[stroke="url(#praevisioGradient)"]');
    const radius = 36; // (80 - 8) / 2
    const circumference = 2 * Math.PI * radius; // ≈ 226.194671
    const expectedOffset = circumference - (50 / 100) * circumference; // ≈ 113.097

    expect(progressCircle).toHaveAttribute('stroke-dasharray', `${circumference} ${circumference}`);
    expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset.toString());
  });

  test('calculates correct stroke dash offset for 0% progress', () => {
    const { container } = render(<ProgressRing progress={0} />);

    const progressCircle = container.querySelector('circle[stroke="url(#praevisioGradient)"]');
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const expectedOffset = circumference; // Full circumference for 0%

    expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset.toString());
  });

  test('calculates correct stroke dash offset for 100% progress', () => {
    const { container } = render(<ProgressRing progress={100} />);

    const progressCircle = container.querySelector('circle[stroke="url(#praevisioGradient)"]');
    const expectedOffset = '0'; // 0 for 100%

    expect(progressCircle).toHaveAttribute('stroke-dashoffset', expectedOffset);
  });

  test('renders gradient definition', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const gradient = container.querySelector('linearGradient[id="praevisioGradient"]');
    expect(gradient).toBeInTheDocument();

    const stops = gradient?.querySelectorAll('stop');
    expect(stops).toHaveLength(2);
    expect(stops?.[0]).toHaveAttribute('offset', '0%');
    expect(stops?.[0]).toHaveAttribute('stop-color', '#06b6d4');
    expect(stops?.[1]).toHaveAttribute('offset', '100%');
    expect(stops?.[1]).toHaveAttribute('stop-color', '#7c3aed');
  });

  test('renders children in center', () => {
    render(
      <ProgressRing progress={50}>
        <span>Test Content</span>
      </ProgressRing>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders foreignObject with correct dimensions', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const foreignObject = container.querySelector('foreignObject');
    expect(foreignObject).toBeInTheDocument();
    expect(foreignObject).toHaveAttribute('x', '-36'); // -radius
    expect(foreignObject).toHaveAttribute('y', '-36');
    expect(foreignObject).toHaveAttribute('width', '80');
    expect(foreignObject).toHaveAttribute('height', '80');
  });

  test('applies correct transform to group', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const group = container.querySelector('g');
    expect(group).toHaveAttribute('transform', 'translate(40, 40)'); // size/2 = 40
  });

  test('handles custom size calculations', () => {
    const { container } = render(<ProgressRing progress={25} size={120} stroke={12} />);

    const backgroundCircle = container.querySelector('circle[stroke="#1f2937"]');
    expect(backgroundCircle).toHaveAttribute('r', '54'); // (120 - 12) / 2 = 54

    const foreignObject = container.querySelector('foreignObject');
    expect(foreignObject).toHaveAttribute('x', '-54');
    expect(foreignObject).toHaveAttribute('y', '-54');
    expect(foreignObject).toHaveAttribute('width', '120');
    expect(foreignObject).toHaveAttribute('height', '120');

    const group = container.querySelector('g');
    expect(group).toHaveAttribute('transform', 'translate(60, 60)'); // 120/2 = 60
  });

  test('renders with block class', () => {
    const { container } = render(<ProgressRing progress={50} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('block');
  });

  test('renders children with center styling', () => {
    const { container } = render(
      <ProgressRing progress={50}>
        <div>Test</div>
      </ProgressRing>
    );

    const centerDiv = container.querySelector('.flex.items-center.justify-center.text-center');
    expect(centerDiv).toBeInTheDocument();
  });

  test('handles progress values outside 0-100 range', () => {
    // Test with progress > 100
    const { container: container1 } = render(<ProgressRing progress={150} />);
    const progressCircle1 = container1.querySelector('circle[stroke="url(#praevisioGradient)"]');
    expect(progressCircle1).toHaveAttribute('stroke-dashoffset', '0'); // Should be 0

    // Test with progress < 0
    const { container: container2 } = render(<ProgressRing progress={-10} />);
    const progressCircle2 = container2.querySelector('circle[stroke="url(#praevisioGradient)"]');
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    expect(progressCircle2).toHaveAttribute('stroke-dashoffset', circumference.toString()); // Should be full
  });
});