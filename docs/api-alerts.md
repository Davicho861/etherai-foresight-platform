# API de Alertas - Praevisio AI

## Descripción General

La API de Alertas permite gestionar alertas de riesgos en tiempo real para América Latina, enfocándose en amenazas socio-económicas, climáticas y de seguridad.

## Endpoints

### GET /api/alerts

Lista todas las alertas activas con posibilidad de filtrado.

**Parámetros de Query (opcionales):**
- `region`: Filtrar por región (ej: Colombia, Argentina)
- `severity`: Filtrar por severidad (HIGH, MEDIUM, LOW)
- `type`: Filtrar por tipo (CLIMATE, ECONOMIC, SECURITY)

**Respuesta:**
```json
{
  "alerts": [
    {
      "id": 1,
      "title": "Riesgo Climático Extremo en Colombia",
      "description": "Aumento significativo en precipitaciones...",
      "severity": "HIGH",
      "region": "Colombia",
      "type": "CLIMATE",
      "timestamp": "2025-10-05T02:00:00Z",
      "status": "ACTIVE"
    }
  ],
  "total": 1,
  "filters": {
    "region": null,
    "severity": null,
    "type": null
  }
}
```

### GET /api/alerts/:id

Obtiene una alerta específica por ID.

**Parámetros:**
- `id`: ID numérico de la alerta

**Respuesta (éxito):**
```json
{
  "id": 1,
  "title": "Riesgo Climático Extremo en Colombia",
  "description": "Aumento significativo en precipitaciones en la región andina...",
  "severity": "HIGH",
  "region": "Colombia",
  "type": "CLIMATE",
  "timestamp": "2025-10-05T02:00:00Z",
  "status": "ACTIVE"
}
```

**Respuesta (error 404):**
```json
{
  "error": "Alert not found"
}
```

### POST /api/alerts

Crea una nueva alerta. Requiere autenticación Bearer token.

**Cuerpo de la solicitud:**
```json
{
  "title": "Nueva Alerta",
  "description": "Descripción detallada del riesgo",
  "severity": "HIGH",
  "region": "Colombia",
  "type": "CLIMATE"
}
```

**Campos requeridos:**
- `title`: Título de la alerta
- `description`: Descripción detallada
- `severity`: Severidad (HIGH, MEDIUM, LOW)
- `region`: Región afectada
- `type`: Tipo de riesgo (CLIMATE, ECONOMIC, SECURITY)

**Respuesta (éxito 201):**
```json
{
  "id": 3,
  "title": "Nueva Alerta",
  "description": "Descripción detallada del riesgo",
  "severity": "HIGH",
  "region": "Colombia",
  "type": "CLIMATE",
  "timestamp": "2025-10-05T02:15:00Z",
  "status": "ACTIVE"
}
```

**Respuesta (error 400):**
```json
{
  "error": "Missing required fields"
}
```

## Autenticación

Los endpoints GET son públicos, pero POST requiere autenticación Bearer token en el header `Authorization: Bearer <token>`.

## Códigos de Estado

- `200`: Éxito (GET)
- `201`: Creado (POST)
- `400`: Solicitud inválida
- `401`: No autorizado
- `403`: Prohibido
- `404`: No encontrado

## Ejemplos de Uso

### Listar alertas de alta severidad en Colombia
```
GET /api/alerts?region=Colombia&severity=HIGH
```

### Crear nueva alerta climática
```
POST /api/alerts
Authorization: Bearer your-token-here
Content-Type: application/json

{
  "title": "Sequía Extrema en Brasil",
  "description": "Condiciones de sequía severa afectan la agricultura",
  "severity": "HIGH",
  "region": "Brasil",
  "type": "CLIMATE"
}
```

---

*Documentación generada automáticamente por Aion - Praevisio-Aion-Eternal-Vigilance*