/**
 * Sistema de manejo de errores unificado para el backend
 * - Errores estandarizados
 * - Respuestas consistentes
 * - Manejo de casos de fallo
 */

// Tipos de error personalizados
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

class ServiceError extends AppError {
  constructor(message, service) {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.service = service;
  }
}

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // En desarrollo, enviar el stack trace
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    success: false,
    status: err.status,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack }),
    ...(err.service && { service: err.service }),
    path: req.originalUrl,
    method: req.method
  };

  // Log del error en desarrollo
  if (isDevelopment) {
    console.error('Error:', {
      ...errorResponse,
      stack: err.stack
    });
  }

  // Errores específicos de servicios externos
  if (err.service) {
    errorResponse.fallback = {
      enabled: true,
      source: `${err.service} - Error Fallback`
    };
  }

  // Manejar timeouts
  if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
    errorResponse.code = 'REQUEST_TIMEOUT';
    err.statusCode = 408;
  }

  // Manejar errores de validación
  if (err instanceof ValidationError) {
    if (err.errors) {
      errorResponse.errors = err.errors;
    }
  }

  // Si estamos en test, asegurar que los errores siempre tengan una estructura consistente
  if (process.env.NODE_ENV === 'test') {
    errorResponse.isMock = true;
    errorResponse.mockType = 'error';
  }

  return res.status(err.statusCode).json(errorResponse);
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ServiceError,
  errorHandler
};