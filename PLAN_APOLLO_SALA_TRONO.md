# Plan Maestro: Apolo Prime - La Forja de la Sala del Trono Ordenada

## Visión General
Refundación total de la experiencia del Dashboard SDLC para crear una "Sala del Trono" ordenada e interactiva, con sidebar limpio y dashboards especializados para cada rol del C-Suite y fase del SDLC.

## Arquitectura Actual Analizada
- **SdlcDashboardPage.tsx**: Dashboard funcional pero desordenado con widgets dispersos
- **Sidebar**: Poco claro, sin secciones agrupadas
- **Dashboards C-Suite**: Renderizados inline en lugar de componentes especializados
- **Backend**: Sirve datos reales del SDLC y Kanban

## Plan de Ejecución Detallado

### FASE I: La Forja del Orden (Sidebar y Navegación)

#### 1.1 Re-estructuración Completa del Sidebar
- **Ubicación**: `src/pages/SdlcDashboardPage.tsx`
- **Cambios**:
  - Implementar sidebar izquierdo colapsable, minimalista
  - Crear dos secciones agrupadas y expandibles:
    - **"Consejo Divino"**: Enlaces a dashboards C-Suite (CEO, CFO, CTO, etc.)
    - **"Ciclo de Vida Soberano"**: Enlaces a dashboards SDLC (Planning, Design, etc.)
  - Eliminar completamente widgets/KPIs del sidebar
  - Solo funcionalidad de navegación

#### 1.2 Estado de Navegación
- **Nuevo estado**: `sidebarCollapsed` (booleano)
- **Nuevo estado**: `activeSection` (string: 'c-suite' | 'sdlc' | null)
- **Nuevo estado**: `expandedSections` (Set<string>)

### FASE II: La Manifestación de los Santuarios de Datos

#### 2.1 Dashboard "Vista General" (Default)
- **Vista por defecto** del panel derecho
- **Componentes principales**:
  - Kanban Viviente Interactivo (ocupando espacio principal)
  - Oráculo de Métricas en Tiempo Real (KPIs globales, rediseñado limpio)

#### 2.2 Dashboards C-Suite Especializados
- **Reemplazar renderizado inline** con componentes lazy-loaded
- **Componentes existentes**: CEODashboard, CFODashboard, etc.
- **Mejoras requeridas**:
  - Estética Glassmorphism Cuántico
  - Funcionalidad XAI explicativa (✨)
  - Datos 100% reales del backend

#### 2.3 Dashboards SDLC Especializados
- **Crear nuevos componentes** para cada fase:
  - PlanningDashboard
  - DesignDashboard
  - ImplementationDashboard
  - TestingDashboard
  - DeploymentDashboard
- **Características**:
  - Gráficos interactivos con Recharts
  - Tooltips detallados, filtros, drill-down
  - Estética Glassmorphism Cuántico
  - XAI explicativa en KPIs clave

### FASE III: El Juicio Final

#### 3.1 Verificación de Realidad
- Ejecutar `npm run start:native`
- Certificar navegación impecable
- Verificar datos 100% reales en todos los dashboards

#### 3.2 Certificación de Calidad
- Sistema 100% funcional e interactivo
- Estética profesional y soberana
- Rendimiento óptimo

## Componentes a Crear/Modificar

### Nuevos Componentes SDLC
```
src/components/dashboards/PlanningDashboard.tsx
src/components/dashboards/DesignDashboard.tsx
src/components/dashboards/ImplementationDashboard.tsx
src/components/dashboards/TestingDashboard.tsx
src/components/dashboards/DeploymentDashboard.tsx
```

### Modificaciones Principales
- **SdlcDashboardPage.tsx**: Re-estructuración completa del sidebar y lógica de navegación
- **Dashboards existentes**: Añadir Glassmorphism y XAI explicativa

## Tecnologías Utilizadas
- React + TypeScript
- Tailwind CSS para estilos
- Framer Motion para animaciones
- Recharts para gráficos
- DnD Kit para drag-and-drop
- Lazy loading para performance

## Métricas de Éxito
1. Sidebar limpio con navegación modular impecable
2. Kanban interactivo con drag-and-drop como pieza central
3. Dashboards modulares inmersivos para C-Suite y SDLC
4. Sistema 100% funcional, interactivo y profesional
5. Todos los datos provenientes de consultas en tiempo real

## Próximos Pasos
Cambiar a modo Code para implementar las modificaciones detalladas en este plan.