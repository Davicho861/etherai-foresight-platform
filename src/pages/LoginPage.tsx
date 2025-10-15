import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');

      // Store JWT token securely
      window.localStorage.setItem('praevisio_token', data.token);

      // Smooth transition to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);

    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gemini-background text-gemini-text-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gemini-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gemini-accent-yellow/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-gemini-background-secondary backdrop-blur-xl border border-gemini-border rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Header with Gemini-inspired minimalism */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gemini-primary to-gemini-accent-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-gemini-background text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gemini-text-primary to-gemini-text-secondary bg-clip-text text-transparent mb-2">
            Acceso Soberano
          </h1>
          <p className="text-gemini-text-secondary text-sm">Praevisio AI — Portal de Gobernanza</p>
        </motion.div>

        {/* Credentials hint with Gemini style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gemini-background border border-gemini-border-light rounded-lg p-4 mb-6"
        >
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-gemini-success rounded-full mr-2"></span>
            <span className="text-xs font-medium text-gemini-text-secondary uppercase tracking-wide">Credenciales de Desarrollo</span>
          </div>
          <p className="text-sm text-gemini-text-muted">
            Usuario: <span className="font-mono text-gemini-text-primary">admin</span> | Contraseña: <span className="font-mono text-gemini-text-primary">admin</span>
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={submit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gemini-text-secondary mb-2">Usuario</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gemini-background border border-gemini-border text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-primary/50 focus:border-gemini-primary/50 transition-all duration-200"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gemini-text-secondary mb-2">Contraseña</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gemini-background border border-gemini-border text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-primary/50 focus:border-gemini-primary/50 transition-all duration-200"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {/* Error display with Gemini-style design */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="bg-gemini-error/10 border border-gemini-error/50 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <span className="text-gemini-error mr-2">⚠️</span>
                  <span className="text-gemini-error text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button with Gemini-inspired design */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full gemini-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gemini-background/30 border-t-gemini-background rounded-full animate-spin mr-2"></div>
                  Verificando credenciales...
                </>
              ) : (
                <>
                  <span className="mr-2">🔓</span>
                  Acceder al Imperio
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Footer with security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gemini-border"
        >
          <p className="text-xs text-gemini-text-muted text-center">
            🔒 Autenticación JWT segura • Gobernanza soberana • Vigilancia perpetua
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
