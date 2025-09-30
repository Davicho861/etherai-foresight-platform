# Praevisio Server — Desarrollo (demo)

Este servidor es un API demo en memoria para la Beta local de Praevisio AI.

Endpoints

- POST /api/predict
  - Descripción: recibe parámetros del dashboard y devuelve una predicción simulada.
  - Payload ejemplo:
    {
      "country": "Colombia",
      "parameters": { "infectionRate": 50, "protestIndex": 30, "economicIndex": 20 }
    }
  - Respuesta ejemplo:
    {
      "predictionId": "pred_xxxxxx",
      "country": "Colombia",
      "risk": "medium",
      "confidence": 0.78,
      "factors": [{"name":"Infection rate","weight":0.5,"value":50}],
      "generatedAt": "2025-09-28T12:00:00Z",
      "score": 48
    }

- POST /api/contact
  - Descripción: guarda una solicitud de demo/contacto en memoria.
  - Payload ejemplo:
    { "name": "Juan", "email": "juan@example.com", "organization": "Org", "message": "Quiero demo", "interestedModule": "Colombia" }
  - Respuesta ejemplo: { "status":"saved", "id":"c_xxxxxx", "createdAt":"..." }

Levantar localmente

```bash
cd server
npm install
node src/index.js
```

Notas
- Este servidor es para desarrollo y demo. No usar en producción.
- Para integraciones reales, sustituir los mocks por llamadas a APIs reales y almacenar datos en una base de datos.
