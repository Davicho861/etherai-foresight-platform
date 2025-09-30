import express from 'express';

const router = express.Router();

// Static pricing plans per the spec
const plans = [
  { id: 'essential', name: 'Essential', price: 'Contactar', description: 'Inteligencia predictiva para equipos y proyectos específicos.', features: ['1 Módulo de País', 'Alertas Básicas', 'Dashboard Estándar', 'Soporte por Email'] },
  { id: 'professional', name: 'Professional', price: 'Contactar', popular: true, description: 'La solución completa para organizaciones que operan a nivel nacional.', features: ['Hasta 5 Módulos de País', 'Alertas Avanzadas con IA Explicativa', 'Dashboard Personalizable', 'Generador de Escenarios (Básico)', 'Soporte Prioritario'] },
  { id: 'elite', name: 'Elite', price: 'Contactar', description: 'Inteligencia estratégica sin límites para gobiernos y corporaciones globales.', features: ['Módulos de País Ilimitados', 'Acceso API Completo', 'Modelos de IA Personalizados', 'Consultoría Estratégica Dedicada', 'Soporte 24/7/365'] }
];

router.get('/', (req, res) => {
  res.json(plans);
});

export default router;
