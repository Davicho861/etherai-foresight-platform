import React from 'react';

const NativeModeBanner: React.FC = () => {
  const isNative = process.env.NATIVE_DEV_MODE === 'true' || (window && (window as any).__NATIVE_DEV_MODE === true);
  if (!isNative) return null;
  return (
    <div style={{ background: '#fff7ed', color: '#92400e', padding: '6px 12px', textAlign: 'center', borderBottom: '1px solid #fcd34d' }}>
      <strong>Modo Nativo</strong> — Praevisio AI se está ejecutando en modo local (hot-reload, SQLite, servicios IA en fallback).
    </div>
  );
};

export default NativeModeBanner;
