import React from 'react';

type Props = {
  size?: number;
  stroke?: number;
  progress: number; // 0-100
  children?: React.ReactNode;
};

const ProgressRing: React.FC<Props> = ({ size = 80, stroke = 8, progress, children }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="block">
      <defs>
        <linearGradient id="praevisioGradient" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} fill="none" stroke="#1f2937" strokeWidth={stroke} />
        <circle
          r={radius}
          fill="none"
          stroke="url(#praevisioGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90)"
        />
        <foreignObject x={-radius} y={-radius} width={size} height={size}>
          <div className="flex items-center justify-center text-center" style={{ width: size, height: size }}>
            {children}
          </div>
        </foreignObject>
      </g>
    </svg>
  );
};

export default ProgressRing;
