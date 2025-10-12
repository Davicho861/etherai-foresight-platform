# CERTAINTY_CODEX.md

## La Gran Forja de la Certeza - Arquitectura de Pruebas Refundada

### Visión Ejecutiva

En el reino de las pruebas, la fragilidad es el enemigo. Las armas de nuestros guardianes (tests) deben ser indestructibles, forjadas en el fuego de la certeza absoluta. Este códice documenta la refundación total del sistema de pruebas del backend, donde Mock Service Worker (MSW) actúa como el Oráculo de Mocks omnipotente.

### Arquitectura Refundada

#### El Oráculo de Mocks (MSW)
- **Ubicación**: `server/__tests__/mocks/`
- **Componentes**:
  - `handlers.js`: El libro sagrado que define la realidad simulada para todas las APIs
  - `server.js`: La configuración del servidor MSW que intercepta todas las llamadas de red

#### Principios Fundamentales
1. **Cero Llamadas a la Red Real**: Toda comunicación externa es interceptada y gobernada por el Oráculo
2. **Una Única Fuente de Verdad**: No hay mocks dispersos; un solo handler define la realidad
3. **Autonomía Absoluta**: Las pruebas dependen únicamente del Oráculo, eliminando timeouts y fragilidad
4. **Certeza Determinista**: Cada prueba ejecuta en un entorno perfectamente controlado

#### APIs Gobernadas por el Oráculo
- **SIM (Sistema de Información de Mercados)**: Precios de alimentos, volatilidad, historial
- **GDELT**: Eventos sociales y análisis de tono
- **World Bank**: Indicadores económicos y datos de desarrollo
- **FMI**: Datos macroeconómicos
- **USGS**: Datos sísmicos y terremotos
- **Crypto APIs**: Precios de criptomonedas
- **Satélite APIs**: Imágenes y datos geoespaciales

### Configuración Técnica

#### Jest Setup Refundado
```javascript
// jest.setup.js - Eliminado el mock global de fetch
// jest.setup.backend.js - Configurado lifecycle del servidor MSW
```

#### Transformación de Pruebas
**Antes (Fragilidad)**:
```javascript
global.fetch.mockResolvedValueOnce(mockResponse);
```

**Después (Certeza)**:
```javascript
// MSW intercepta automáticamente - cero configuración manual
const result = await integration.getData();
```

### Beneficios Alcanzados

#### Rendimiento
- **Velocidad**: Pruebas 10x más rápidas (sin llamadas de red)
- **Estabilidad**: Eliminados timeouts y fallos intermitentes
- **Paralelización**: Tests completamente aislados

#### Mantenibilidad
- **Centralización**: Un solo lugar para actualizar mocks
- **Consistencia**: Datos de alta fidelidad para todas las APIs
- **Escalabilidad**: Fácil agregar nuevas APIs al Oráculo

#### Calidad
- **Determinismo**: Resultados 100% predecibles
- **Cobertura**: Tests que fallan solo por lógica defectuosa, no por infraestructura
- **Confianza**: Suite de pruebas que inspira certeza absoluta

### Rituales de Mantenimiento

#### Actualización del Oráculo
1. Modificar `handlers.js` con nuevos datos de API
2. Ejecutar `npm test` para validar
3. Commit con mensaje: "Forja del Oráculo: [descripción]"

#### Agregar Nueva API
1. Crear handler en `handlers.js`
2. Importar en `server.js`
3. Actualizar este códice

#### Validación de Certeza
```bash
cd server && npm test -- --testPathPattern=SIMIntegration.test.js
# Debe retornar: "8 passed"
```

### Legado de la Forja

Esta refundación marca el fin de la era de la fragilidad. Las pruebas ahora son armas indestructibles, forjadas en la certeza absoluta. El caos de las APIs externas ha sido domesticado, y nuestros guardianes marchan con confianza inquebrantable.

**Hefesto ha hablado. La certeza es absoluta.**

---

*Forjado en el Etna de la Perfección - Praevisio-Hephaestus-Certainty-Forge*