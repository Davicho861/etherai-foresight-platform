# DEMO UI OVERHAUL

Objetivo
--------
Reconstruir la página `/demo` para convertirla en un Centro de Mando de élite con un panel de navegación persistente a la izquierda y un área de visualización a la derecha. Interfaz con tema oscuro, tipografía Inter y acentos cyan/verde. Integrar micro-animaciones con framer-motion.

Arquitectura de Componentes
---------------------------
- SidebarNav
  - CountryList
  - AccessLevelSelector
- CountryDashboard
  - MissionCard (lista de misiones)

Descripción de Componentes
--------------------------
- SidebarNav: Panel izquierdo fijo. Muestra:
  - Buscador rápido
  - Selector de nivel de acceso: Público, Corporativo, Estado
  - Lista de países agrupados por continente (CountryList)
  - Estado seleccionado: country, accessLevel

- CountryList: Subcomponente de SidebarNav. Agrupa países por continente y los muestra en secciones colapsables.

- AccessLevelSelector: Control para filtrar las misiones por nivel de acceso.

- CountryDashboard: Panel derecho. Recibe `selectedCountry` y `accessLevel` como props. Muestra:
  - Bandera grande y nombre
  - Estadísticas clave (población, riesgo, GDP sintético)
  - Listado de `MissionCard` filtradas por `accessLevel`

- MissionCard: Tarjeta de misión con título, resumen, probabilidad, tags y botón "Iniciar".

Flujo de Datos
--------------
1. Usuario selecciona un `accessLevel` en `SidebarNav`.
2. Usuario hace clic en un país en `CountryList`.
3. `SidebarNav` actualiza el estado global local (contexto del componente padre en `DemoPage`).
4. `CountryDashboard` recibe `selectedCountry` y `accessLevel` como props y re-renderiza mostrando las misiones filtradas.
5. Al hacer clic en "Iniciar" en `MissionCard`, se dispara la vista de ejecución del agente (integración existente) mediante la ruta/handler correspondiente.

Estética y Animaciones
---------------------
- Tema oscuro base: grises profundos (#0b0f12, #0f1720), superficies elevadas con gradientes sutiles.
- Tipografía: Inter.
- Colores de acento: Cyan neón (#00f5d4) y verde brillante para acciones.
- Micro-animaciones con `framer-motion`: entrada del dashboard, hover en MissionCard, transiciones entre países.

Requisitos y Dependencias
-------------------------
- Añadir `framer-motion` a `package.json`.
- Usar utilidades de Tailwind ya presentes en el repo.
- Generar pruebas E2E automáticamente tras la implementación.

Plan de ejecución
-----------------
1. Implementar layout en `src/pages/DemoPage.tsx`.
2. Crear componentes en `src/components/demo/`.
3. Añadir estilos y animaciones.
4. Generar test E2E y ejecutar `npm run validate`.
5. Levantar en modo persistente `npm run dev:live`.

Notas
-----
- Asumo que los datos de países y misiones vienen de un hook o API existente en `src/lib` o `src/hooks`; si no, se creará un mock local para la demo.
- Mantendré compatibilidad con el enrutamiento existente y patrones de estilo del repositorio.
