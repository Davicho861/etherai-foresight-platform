# Praevisio AI — Beta (entrega)

Este documento resume cómo probar la versión Beta localmente, estimados de tiempo por prompt y siguientes pasos recomendados.

Cómo probar localmente (resumen)
1. Instalar dependencias frontend

```bash
npm install
```

2. Instalar dependencias del servidor

```bash
cd server
npm install
```

3. Levantar el servidor

```bash
cd server
npm run dev
```

4. Levantar el frontend (en la raíz del repo)

```bash
npm run dev
```

5. Abrir `http://localhost:5173` y probar el Dashboard Interactivo. El botón "Generar Predicción" realizará una petición a `http://localhost:4000/api/predict`.

Estimados por prompt (approx.)
- Prompt 1 (Frontend visual): 2-4 días
- Prompt 2 (Backend API): 3-6 días
- Prompt 3 (Integración): 1-3 días
- Prompt 4 (Módulo LATAM Colombia): 7-14 días
- Prompt 5 (QA/tests): 3-6 días
- Prompt 6 (Despliegue): 2-4 días

Siguientes pasos sugeridos
- Ejecutar los comandos de instalación y levantar la app localmente.
- Revisar y ajustar la UI del Dashboard si se desea (colores, textos, etiquetas).
- Proveer claves para integraciones reales (si se quiere conectar Open-Meteo, Twitter/GDELT, etc.).
- Configurar CI que ejecute tests y lint.

Contacto y soporte
- Este repo contiene artefactos iniciales. Para despliegues o integraciones avanzadas, coordinar con el equipo de infraestructura.
