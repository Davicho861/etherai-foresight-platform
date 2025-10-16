/**
 * Sistema de respuestas API estandarizadas
 * - Formato consistente
 * - Manejo de metadatos
 * - Validación de respuestas
 */

// Utilidades de respuesta
const createSuccessResponse = (data, metadata = {}) => {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    source: metadata.source || 'Praevisio-Aion',
    data,
    ...(metadata.pagination && { pagination: metadata.pagination }),
    ...(process.env.NODE_ENV === 'test' && { isMock: true })
  };
};

const createErrorResponse = (error, metadata = {}) => {
  const response = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message,
      ...(error.details && { details: error.details })
    },
    timestamp: new Date().toISOString(),
    source: metadata.source || 'Praevisio-Aion',
    ...(process.env.NODE_ENV === 'test' && { isMock: true })
  };

  if (metadata.service) {
    response.service = metadata.service;
    response.fallback = {
      enabled: true,
      source: `${metadata.service} - Error Fallback`
    };
  }

  return response;
};

// Middleware de respuestas estandarizadas
const standardResponse = (req, res, next) => {
  // Envolver los métodos de respuesta para estandarizar
  const originalJson = res.json;
  const originalSend = res.send;

  // Sobreescribir res.json
  res.json = function(data) {
    // Si ya es una respuesta estandarizada, no la modificar
    if (data && (data.success === true || data.success === false)) {
      return originalJson.call(this, data);
    }

    // Crear respuesta estandarizada
    const response = createSuccessResponse(data, {
      source: req.get('x-source') || 'Praevisio-Aion'
    });

    return originalJson.call(this, response);
  };

  // Sobreescribir res.send para manejar respuestas no-JSON
  res.send = function(data) {
    // Si es JSON, usar res.json
    if (typeof data === 'object') {
      return res.json(data);
    }
    return originalSend.call(this, data);
  };

  // Agregar métodos de utilidad
  res.success = function(data, metadata = {}) {
    return this.json(createSuccessResponse(data, metadata));
  };

  res.error = function(error, metadata = {}) {
    const statusCode = error.statusCode || 500;
    return this.status(statusCode).json(createErrorResponse(error, metadata));
  };

  next();
};

// Validación de respuestas
const validateResponse = (schema) => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      try {
        // Validar respuesta contra el schema
        if (schema) {
          const { error } = schema.validate(data);
          if (error) {
            throw new Error(`Invalid response format: ${error.message}`);
          }
        }
        return originalJson.call(this, data);
      } catch (err) {
        next(err);
      }
    };
    
    next();
  };
};

module.exports = {
  standardResponse,
  validateResponse,
  createSuccessResponse,
  createErrorResponse
};