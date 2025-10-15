import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface CSODashboardProps {
  csoData: any;
  requestDivineExplanation: (_metric: string, _value: any, _context: string) => void;
}

const CSODashboard: React.FC<CSODashboardProps> = ({
  csoData,
  requestDivineExplanation
}) => {
  const [_selectedMetric, _setSelectedMetric] = useState<string | null>(null);
  const [xaiLoading, setXaiLoading] = useState(false);
  const [xaiError, setXaiError] = useState<string | null>(null);
  const [xaiContent, setXaiContent] = useState<string | null>(null);

  // small fetch helper for fallback XAI calls
  const fetchJson = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText || 'Fetch failed');
    return res.json();
  };

  const [meta, setMeta] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    fetchJson('/api/metrics/meta')
      .then(data => { if (mounted) setMeta(data); })
      .catch(() => { /* ignore - meta is optional */ });
    return () => { mounted = false; };
  }, []);

  // DATOS REALES DEL CSO - CONEXIÓN CON BACKEND
  // Nota: eliminar defaults para evitar mocks; mostrar placeholders cuando falten datos.
  const vulnerabilityCount = csoData && typeof csoData.vulnerabilityCount !== 'undefined' ? csoData.vulnerabilityCount : null;
  const securityPosture = csoData && typeof csoData.securityPosture !== 'undefined' ? csoData.securityPosture : null;
  const auditCompliance = csoData && typeof csoData.auditCompliance !== 'undefined' ? csoData.auditCompliance : null;
  const threatDetection = csoData && typeof csoData.threatDetection !== 'undefined' ? csoData.threatDetection : null;
  const incidentResponse = csoData && typeof csoData.incidentResponse !== 'undefined' ? csoData.incidentResponse : null;
  const dataProtection = csoData && typeof csoData.dataProtection !== 'undefined' ? csoData.dataProtection : null;
  const accessControl = csoData && typeof csoData.accessControl !== 'undefined' ? csoData.accessControl : null;
  const securityAwareness = csoData && typeof csoData.securityAwareness !== 'undefined' ? csoData.securityAwareness : null;

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO CSO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-[color:var(--text-primary)] mb-2">
          🔒 Santuario de Seguridad - CSO
        </h1>
        <p className="text-slate-400 text-xl">
          Perfil de seguridad soberano - Protección del imperio
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS DE SEGURIDAD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CONTEO DE VULNERABILIDADES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🚨</div>
              <button
                onClick={async () => {
                  _setSelectedMetric('vulnerabilityCount');
                  setXaiLoading(true);
                  setXaiError(null);
                  setXaiContent(null);
                  try {
                    if (requestDivineExplanation) {
                      // allow parent to handle explanation (may open modal externally)
                      await Promise.resolve(requestDivineExplanation('vulnerabilityCount', vulnerabilityCount, 'CSODashboard'));
                    } else {
                      const resp = await fetchJson('/api/xai/explain?metric=vulnerabilityCount&context=CSODashboard');
                      setXaiContent(resp?.explanation || JSON.stringify(resp));
                    }
                  } catch (err: any) {
                    setXaiError(err?.message || 'Error al pedir explicación');
                  } finally {
                    setXaiLoading(false);
                  }
                }}
                className="text-red-400 hover:text-red-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Vulnerabilidades</h3>
              <div className="text-4xl font-bold text-red-400">
                {vulnerabilityCount ?? '—'}
              </div>
              <p className="text-sm text-slate-400">Dependencias críticas</p>
            </div>
          </div>
        </motion.div>

        {/* POSTURA DE SEGURIDAD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🛡️</div>
              <button
                onClick={async () => {
                  _setSelectedMetric('securityPosture');
                  setXaiLoading(true);
                  setXaiError(null);
                  setXaiContent(null);
                  try {
                    if (requestDivineExplanation) {
                      await Promise.resolve(requestDivineExplanation('securityPosture', securityPosture, 'CSODashboard'));
                    } else {
                      const resp = await fetchJson('/api/xai/explain?metric=securityPosture&context=CSODashboard');
                      setXaiContent(resp?.explanation || JSON.stringify(resp));
                    }
                  } catch (err: any) {
                    setXaiError(err?.message || 'Error al pedir explicación');
                  } finally {
                    setXaiLoading(false);
                  }
                }}
                className="text-green-400 hover:text-green-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Postura de Seguridad</h3>
              <div className="text-4xl font-bold text-green-400">
                {securityPosture !== null ? `${securityPosture}%` : '—'}
              </div>
              <p className="text-sm text-slate-400">Madurez de seguridad</p>
            </div>
          </div>
        </motion.div>

        {/* CUMPLIMIENTO DE AUDITORÍAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📋</div>
              <button
                onClick={async () => {
                  _setSelectedMetric('auditCompliance');
                  setXaiLoading(true);
                  setXaiError(null);
                  setXaiContent(null);
                  try {
                    if (requestDivineExplanation) {
                      await Promise.resolve(requestDivineExplanation('auditCompliance', auditCompliance, 'CSODashboard'));
                    } else {
                      const resp = await fetchJson('/api/xai/explain?metric=auditCompliance&context=CSODashboard');
                      setXaiContent(resp?.explanation || JSON.stringify(resp));
                    }
                  } catch (err: any) {
                    setXaiError(err?.message || 'Error al pedir explicación');
                  } finally {
                    setXaiLoading(false);
                  }
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Cumplimiento</h3>
              <div className="text-4xl font-bold text-blue-400">
                {auditCompliance !== null ? `${auditCompliance}%` : '—'}
              </div>
              <p className="text-sm text-slate-400">Auditorías de seguridad</p>
            </div>
          </div>
        </motion.div>

        {/* DETECCIÓN DE AMENAZAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🔍</div>
              <button
                onClick={async () => {
                  _setSelectedMetric('threatDetection');
                  setXaiLoading(true);
                  setXaiError(null);
                  setXaiContent(null);
                  try {
                    if (requestDivineExplanation) {
                      await Promise.resolve(requestDivineExplanation('threatDetection', threatDetection, 'CSODashboard'));
                    } else {
                      const resp = await fetchJson('/api/xai/explain?metric=threatDetection&context=CSODashboard');
                      setXaiContent(resp?.explanation || JSON.stringify(resp));
                    }
                  } catch (err: any) {
                    setXaiError(err?.message || 'Error al pedir explicación');
                  } finally {
                    setXaiLoading(false);
                  }
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Detección de Amenazas</h3>
              <div className="text-4xl font-bold text-purple-400">
                {threatDetection !== null ? `${threatDetection}%` : '—'}
              </div>
              <p className="text-sm text-slate-400">Cobertura de monitoreo</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RESPUESTA A INCIDENTES Y PROTECCIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TIEMPO DE RESPUESTA A INCIDENTES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-orange-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🚨</span>
            Respuesta a Incidentes
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{incidentResponse ?? '—'}</div>
            <p className="text-slate-400">Tiempo promedio de respuesta</p>
          </div>
        </motion.div>

        {/* PROTECCIÓN DE DATOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-cyan-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 116, 144, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🔐</span>
            Protección de Datos
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">{dataProtection !== null ? `${dataProtection}%` : '—'}</div>
            <p className="text-slate-400">Encriptación y protección</p>
          </div>
        </motion.div>
      </div>

      {/* CONTROL DE ACCESO Y CONCIENCIA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-8 rounded-2xl border border-pink-400/30"
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(190, 24, 93, 0.05) 100%)',
          backdropFilter: 'blur(15px) saturate(150%)',
          WebkitBackdropFilter: 'blur(15px) saturate(150%)'
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">👥</span>
          Control de Acceso & Conciencia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Control de Acceso:</span>
              <span className="font-mono text-green-400">{accessControl !== null ? `${accessControl}%` : '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Conciencia de Seguridad:</span>
              <span className="font-mono text-blue-400">{securityAwareness !== null ? `${securityAwareness}%` : '—'}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">
              { (accessControl !== null && securityAwareness !== null) ? `${Math.round((accessControl + securityAwareness) / 2)}%` : '—' }
            </div>
            <p className="text-slate-400">Índice de Seguridad Humana</p>
          </div>
        </div>
      </motion.div>

      {/* CERTIFICACIÓN DE REALIDAD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center py-4 border-t border-slate-700/50"
      >
        <div className="text-xs text-slate-500">
          🔒 Certificado por Apolo Prime - Seguridad 100% real del imperio
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {meta?.lastUpdated ? new Date(meta.lastUpdated).toLocaleString() : 'Desconocida'}
        </div>
      </motion.div>
      {/* XAI Modal */}
  {_selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { _setSelectedMetric(null); setXaiContent(null); setXaiError(null); }} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-2xl w-full p-6 rounded-2xl bg-[color:var(--card)] border border-[color:var(--border)] shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-bold text-[color:var(--text-primary)]">Explicación XAI — {_selectedMetric}</h4>
              <button className="text-[color:var(--text-secondary)]" onClick={() => { _setSelectedMetric(null); setXaiContent(null); setXaiError(null); }}>Cerrar</button>
            </div>

            <div className="min-h-[120px]">
              {xaiLoading && <div className="text-slate-400">Cargando explicación...</div>}
              {xaiError && <div className="text-rose-400">Error: {xaiError}</div>}
              {xaiContent && <div className="prose text-slate-200" dangerouslySetInnerHTML={{ __html: xaiContent }} />}
              {!xaiLoading && !xaiError && !xaiContent && (
                <div className="text-slate-400">Pulse ✨ en la métrica para solicitar una explicación.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CSODashboard;