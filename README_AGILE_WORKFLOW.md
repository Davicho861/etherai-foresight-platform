# Desarrollo Ágil "Bare Metal" - Praevisio AI

## Filosofía de Desarrollo

Este proyecto adopta un enfoque de desarrollo **ágil puro** enfocado en la velocidad y la retroalimentación visual inmediata. La infraestructura pesada (Docker, pruebas E2E complejas) se ha pospuesto hasta que la funcionalidad y la UI estén 100% completas y aprobadas.

### Principios Clave

- **Velocidad Máxima**: Cualquier cosa que ralentice el ciclo "codificar → ver" se elimina o archiva.
- **Retroalimentación Instantánea**: Entorno de desarrollo nativo con hot-reloading para frontend y backend.
- **Autonomía Total**: Libertad para reescribir, eliminar y crear lo necesario para lograr la demo perfecta.
- **Construir Primero, Blindar Después**: Desarrollo puro seguido de validación y blindaje.

## Entorno de Desarrollo

### Comando Único de Ignición
```bash
npm start
```

Este comando lanza simultáneamente:
- **Frontend**: Vite dev server con hot-reloading
- **Backend**: Node.js con nodemon para hot-reloading

### Estructura del Proyecto
- `src/`: Código fuente del frontend (React + TypeScript)
- `server/`: API backend (Node.js + Express)
- `infra_backup/`: Infraestructura archivada (Docker, scripts de validación)

### Dependencias
- Todas las dependencias están instaladas localmente
- No se requieren contenedores para desarrollo
- Hot-reloading automático en cambios

## Flujo de Trabajo

1. **Codificar**: Realiza cambios en el código
2. **Ver**: Los cambios se reflejan automáticamente en `localhost`
3. **Iterar**: Ajusta basado en la retroalimentación visual inmediata
4. **Perfeccionar**: Refina hasta lograr la experiencia deseada

## Demo de Élite

La demo actual incluye:
- **Mapa Interactivo**: Visualización de riesgos por país en América Latina
- **Métricas Animadas**: KPIs con animaciones suaves
- **Galería de Misiones**: Task Replay con efecto de escritura en tiempo real
- **Selector de País**: Interfaz para explorar datos predictivos
- **Gráficos Interactivos**: Evolución de precisión y volumen de predicciones

## Próximos Pasos

Una vez que la demo esté 100% funcional y visualmente espectacular:
1. Restaurar infraestructura de Docker desde `infra_backup/`
2. Implementar pruebas E2E
3. Configurar CI/CD
4. Despliegue en producción

## Notas Técnicas

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion para animaciones
- **Mapas**: React Simple Maps
- **Gráficos**: Recharts
- **Backend**: Node.js + Express con Prisma
- **Base de Datos**: SQLite para desarrollo (configurable)

¡La velocidad es la única ley! 🚀