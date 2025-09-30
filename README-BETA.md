Praevisio AI — Beta local run

Este README describe cómo levantar la versión Beta localmente (frontend + servidor de API mínimo).

Requisitos
- Node 18+ (o Bun/pnpm según preferencia)
- npm instalado

Pasos (local)

1) Instalar dependencias del frontend

```bash
npm install
```

2) Instalar dependencias del servidor

```bash
cd server
npm install
```

3) Levantar el servidor (por defecto en http://localhost:4000)

```bash
cd server
npm run dev
```

4) Levantar el frontend (Vite)

```bash
cd ..
npm run dev
```

Variables de entorno
- `VITE_API_BASE_URL` — URL base del API (por defecto `http://localhost:4000`).

Endpoints principales
- POST /api/predict — cuerpo: { country: string, parameters: { infectionRate, protestIndex, economicIndex, temperature } }
- POST /api/contact — cuerpo: { name, email, organization?, message?, interestedModule? }

Notas
- El servidor incluido es una demo en memoria para propósitos de desarrollo. No usar en producción.
- Integraciones externas y despliegue deben manejarse con cuidado y con claves en variables de entorno del servidor.
