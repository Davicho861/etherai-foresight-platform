# Arquitectura Serverless de Praevisio AI

## Visión General

Praevisio AI ha evolucionado a una arquitectura completamente nativa de la nube, eliminando Docker y adoptando funciones serverless para lograr despliegues instantáneos y escalabilidad automática.

## Componentes Arquitectónicos

### 1. Backend Serverless (Railway + Vercel Functions)

**Ubicación:** `api/` (directorio raíz)

**Funciones Implementadas:**
- `api/predict.js` - Predicciones de riesgo por país
- `api/platform-status.js` - Estado del sistema
- `api/seismic.js` - Datos sísmicos en tiempo real
- `api/dashboard.js` - Resumen del dashboard
- `api/pricing-plans.js` - Planes de precios dinámicos

**Características:**
- Cada endpoint es una función serverless individual
- Escalabilidad automática por demanda
- Latencia ultra-baja en la red Edge de Vercel
- Integración nativa con Railway para base de datos

### 2. Frontend en la Red Edge (Vercel)

**Configuración:** `vercel.json`
```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x"
    }
  },
  "regions": ["iad1"],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Beneficios:**
- Despliegue global instantáneo
- CDN integrado
- Optimización automática de imágenes y assets

### 3. Pipeline de CI/CD Instantáneo

**Archivo:** `.github/workflows/ci.yml`

**Flujo:**
1. **Push/PR:** Lint + tests unitarios (ultra-rápidos)
2. **Merge a main:**
   - Despliegue backend a Railway
   - Despliegue frontend a Vercel
   - Ejecución de E2E tests contra producción
   - Tiempo total: ~5-10 minutos

## Ventajas de la Nueva Arquitectura

### Velocidad
- **Hot-Reloading Global:** Cambios en main se reflejan en producción en segundos
- **Despliegues Paralelos:** Backend y frontend se despliegan simultáneamente
- **Tests Automatizados:** Validación inmediata en URLs de producción

### Escalabilidad
- **Serverless:** Paga solo por ejecución, escala automáticamente
- **Edge Computing:** Contenido servido desde el punto más cercano al usuario
- **Base de Datos:** Railway maneja escalabilidad automática

### Simplicidad
- **Sin Docker:** Eliminación de complejidad de contenedores
- **IaC Nativo:** Toda infraestructura definida como código
- **Mantenimiento Cero:** Plataformas gestionan actualizaciones y seguridad

## Migración desde Docker

### Archivos Eliminados
- `docker-compose.yml`
- `Dockerfile`, `Dockerfile.backend`, `Dockerfile.frontend`
- `.dockerignore`
- Scripts dependientes: `validate_local.sh`, `wait-for-services.sh`

### Scripts package.json Modificados
- Eliminados: `dev:live`, `validate`
- Arquitectura local simplificada

### Rutas Convertidas
Cada archivo en `server/src/routes/` convertido a función serverless en `api/`

## Seguridad y Rendimiento

### Autenticación
- Bearer tokens para API
- Variables de entorno seguras
- Rate limiting automático

### Monitoreo
- Logs integrados en Vercel/Railway
- Alertas automáticas
- Health checks en `/api/platform-status`

## Próximos Pasos

1. **Optimización Continua:** Monitoreo de latencias y costos
2. **Expansión de Funciones:** Más endpoints serverless según demanda
3. **Integraciones Avanzadas:** Webhooks, streaming en tiempo real
4. **Multi-Cloud:** Evaluación de otros proveedores (AWS Lambda, Cloudflare Workers)

## Conclusión

Esta arquitectura representa la evolución natural de Praevisio AI hacia la nube nativa, logrando la promesa de "commit a main = manifestación global en segundos". La eliminación de Docker ha simplificado drásticamente la operación mientras mantiene la robustez y escalabilidad requeridas para una plataforma de IA crítica.