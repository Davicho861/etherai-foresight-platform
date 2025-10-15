# PANTHEON_SHIELD_CODEX

## Legión Inmortal de Praevisio AI - Estrategia de Pruebas para el Panteón de Valor

### Visión General
Este códice documenta la forja de la Legión Inmortal, una suite de pruebas indestructibles diseñada para proteger el Panteón de Valor - la página de precios de Praevisio AI. La legión fue creada bajo el mando de Ares, el Comandante de la Legión Inmortal, para aniquilar los tests obsoletos y forjar desde cero una nueva era de blindaje funcional.

### Arquitectura de la Legión

#### 1. Renderizado Soberano
**Objetivo:** Verificar que el título sagrado "Panteón de Valor - Praevisio AI" se renderice correctamente, proclamando la supremacía del templo.

**Implementación:**
- Test asíncrono que espera la carga completa de datos
- Verificación directa del texto del título principal
- Asegura que la fachada del templo esté intacta

#### 2. Demos Parametrizadas
**Objetivo:** Proteger las puertas sagradas que llevan a las demos personalizadas, asegurando que cada plan abra su portal correspondiente.

**Implementación:**
- Simulación de clic en el botón "Ver Demo de este Plan" del plan Growth
- Verificación de apertura del modal (DialogContent)
- Validación de que DemoPage recibe la prop `plan="growth"` correcta
- Mockeo estratégico de DemoPage para evitar dependencias externas

#### 3. Calculadora Soberana
**Objetivo:** Blindar el oráculo de cálculo que permite a los usuarios forjar su combo perfecto, con IA explicable que revela el valor oculto.

**Implementación:**
- Tests de cálculo total con selección de planes y features
- Verificación de actualizaciones en tiempo real del total
- Validación de explicaciones de IA para planes y características seleccionadas
- Uso de data-testid para acceso directo a elementos calculados

#### 4. Robustez (Fallo de API)
**Objetivo:** Asegurar que incluso ante fallos en la carga de datos del protocolo global, el templo mantenga su dignidad con estados de error elegantes.

**Implementación:**
- Simulación de fallo en carga de GLOBAL_OFFERING_PROTOCOL.json
- Verificación de mensaje de error apropiado
- Uso de prop protocolOverride para forzar estados de error

### Tecnologías y Herramientas

#### React Testing Library
- Enfoque en pruebas de usuario reales
- Queries semánticas para elementos accesibles
- Interacciones naturales (fireEvent.click)

#### Jest DOM
- Matchers personalizados para assertions de DOM
- Verificaciones de presencia y contenido

#### Mocks Estratégicos
- Mock de GLOBAL_OFFERING_PROTOCOL.json para datos consistentes
- Mock de DemoPage para aislamiento de pruebas
- Polyfills para IntersectionObserver en entorno de pruebas

### Estrategia de Ejecución

#### Comando de Invocación
```bash
npm test -- --testPathPattern=PricingPage.test.tsx
```

#### Cobertura de Pruebas
- ✅ Renderizado soberano
- ✅ Demos parametrizadas
- ✅ Calculadora soberana (cálculos + IA explicable)
- ✅ Robustez ante fallos

#### Métricas de Victoria
- 5 tests en verde
- Cobertura completa de funcionalidades críticas
- Tiempo de ejecución < 1 segundo
- Sin dependencias externas en pruebas unitarias

### Protocolos de Mantenimiento

#### Actualización de Mocks
- Mantener mocks sincronizados con cambios en GLOBAL_OFFERING_PROTOCOL.json
- Actualizar mocks de componentes cuando cambien interfaces

#### Expansión de la Legión
- Agregar tests para nuevos planes o features
- Mantener patrón de nomenclatura consistente
- Documentar nuevos guardianes en este códice

#### Vigilancia Continua
- Ejecutar tests en cada commit
- Monitorear fallos en CI/CD
- Actualizar estrategia según evolución del Panteón

### Legado de Ares

Esta legión no es un parche temporal, sino una fortaleza eterna. Cada test es un guerrero inmortal, forjado para resistir el paso del tiempo y los cambios en el código. El Panteón de Valor ahora está protegido por guardianes que no fallan, que no se corrompen, que no negocian su deber.

**Victoria proclamada: La Legión Inmortal protege el Panteón para toda la eternidad.**

---

*Forjado en el fuego de la refactorización, templado en las aguas del testing riguroso, consagrado por la victoria total.*