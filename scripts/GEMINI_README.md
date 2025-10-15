Gemini capture workflow

This folder contains utilities to capture screenshots for the Gemini visual refactor.

Scripts
-------
- `npm run gemini:screenshots` — Runs the Puppeteer script against an already-running frontend (default http://localhost:3002). Saves captures in `artifacts/gemini_screenshots/`.
- `npm run gemini:verify` — Attempts to start backend+frontend in native dev mode and then runs the screenshots script. Useful for CI or local verification.

Notes
-----
- `gemini:verify` uses `wait-on` to wait for the frontend to be ready before running Puppeteer.
- If ports are in use, kill conflicting processes or change `BACKEND_PORT`/`VITE_PORT` when invoking the script.

Examples
--------
# Run only screenshots (frontend must be running)
npm run gemini:screenshots

# Start stack and run verification
npm run gemini:verify
