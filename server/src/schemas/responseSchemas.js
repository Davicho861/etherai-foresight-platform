/**
 * Esquemas de validación para respuestas API
 * - Estructuras estandarizadas
 * - Validación de tipos
 * - Reglas de negocio
 */

const Joi = require('joi');

// Esquemas base
const baseResponse = Joi.object({
  success: Joi.boolean().required(),
  timestamp: Joi.string().isoDate().required(),
  source: Joi.string().required()
}).unknown(true);

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
  totalPages: Joi.number().integer().min(1).required(),
  totalItems: Joi.number().integer().min(0).required()
});

const errorSchema = Joi.object({
  code: Joi.string().required(),
  message: Joi.string().required(),
  details: Joi.array().items(Joi.object({
    path: Joi.array().items(Joi.string()),
    message: Joi.string()
  })).optional()
});

// Esquemas específicos
const riskIndexResponse = baseResponse.keys({
  data: Joi.object({
    value: Joi.number().min(0).max(100).required(),
    trend: Joi.string().valid('increasing', 'decreasing', 'stable').required(),
    components: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      value: Joi.number().required(),
      weight: Joi.number().required()
    }))
  }).required()
});

const resilienceResponse = baseResponse.keys({
  data: Joi.object({
    value: Joi.number().min(0).max(100).required(),
    indicators: Joi.object({
      socialCohesion: Joi.number().min(0).max(1).required(),
      infrastructureQuality: Joi.number().min(0).max(1).required(),
      economicStability: Joi.number().min(0).max(1).required(),
      healthcareAccess: Joi.number().min(0).max(1).required()
    }).required(),
    countries: Joi.array().items(Joi.object({
      code: Joi.string().length(3).required(),
      indicators: Joi.object({
        socialCohesion: Joi.number().min(0).max(1).required(),
        infrastructureQuality: Joi.number().min(0).max(1).required(),
        economicStability: Joi.number().min(0).max(1).required(),
        healthcareAccess: Joi.number().min(0).max(1).required()
      }).required()
    })).required()
  }).required()
});

const predictionResponse = baseResponse.keys({
  data: Joi.object({
    predictedPrice: Joi.number().positive().required(),
    confidence: Joi.number().min(0).max(1).required(),
    factors: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      impact: Joi.number().min(-1).max(1).required()
    })).required()
  }).required()
});

const seismicResponse = baseResponse.keys({
  data: Joi.object({
    events: Joi.array().items(Joi.object({
      id: Joi.string().required(),
      magnitude: Joi.number().required(),
      place: Joi.string().required(),
      time: Joi.number().required(),
      coordinates: Joi.array().length(3).items(Joi.number()).required(),
      url: Joi.string().uri().required(),
      tsunami: Joi.number().required(),
      significance: Joi.number().required()
    })).required(),
    summary: Joi.object({
      totalEvents: Joi.number().integer().min(0).required(),
      maxMagnitude: Joi.number().required(),
      lastUpdated: Joi.string().isoDate().required(),
      source: Joi.string().required()
    }).required()
  }).required()
});

// Esquema de error estandarizado
const standardErrorResponse = baseResponse.keys({
  success: Joi.boolean().valid(false).required(),
  error: errorSchema.required(),
  service: Joi.string().optional(),
  fallback: Joi.object({
    enabled: Joi.boolean().valid(true).required(),
    source: Joi.string().required()
  }).optional()
});

module.exports = {
  baseResponse,
  paginationSchema,
  errorSchema,
  riskIndexResponse,
  resilienceResponse,
  predictionResponse,
  seismicResponse,
  standardErrorResponse
};