## Quick orientation — what this repo is

Short: AgroSense Agent is a small full‑stack app (React + Vite frontend, Node/Express backend) that provides market prices, simple price forecasts, weather alerts and an AI chat assistant for smallholder farmers in Northern Nigeria.

Files to inspect first (most important):
- `backend/server.js` — route registration, health/config endpoints, and error handler.
- `backend/services/openaiService.js` — Azure OpenAI integration and the system prompt (live vs mock behavior).
- `backend/controllers/forecastController.js` — core forecasting logic and how mock market data is consumed.
- `backend/data/market.json` & `backend/data/weather.json` — the mock data shape and examples used across the app.
- `src/services/api.js` — frontend API client (how the frontend calls the backend).
- `src/components/ChatWidget.jsx` — where the chat UI hooks into the API.

## Big picture architecture and data flow (short)
- Frontend (Vite + React) calls REST endpoints under `/api/*` on the Express backend.
- Backend exposes: `/api/market-prices`, `/api/forecast`, `/api/weather`, `/api/chat`, plus `/api/health` and `/api/config` (see `server.js`).
- Forecasts and buyer suggestions come from `backend/data/market.json` and `backend/controllers/forecastController.js` (rule-based forecasting). AI chat responses use `backend/services/openaiService.js` which falls back to rule-based mock responses if Azure keys are not set.

## Developer workflows and exact commands
- Install everything (from project root):
  - `npm run install:all` — installs root + backend dependencies.
- Run frontend dev server (project root):
  - `npm run dev` (Vite). Make sure `VITE_API_URL` points at backend (default `http://localhost:5000/api`).
- Run backend dev server (from project root):
  - `npm run backend:dev` (runs `cd backend && npm run dev` → `nodemon server.js`).
  - Or directly: `cd backend ; npm install ; npm run dev` (Windows PowerShell: use `;` between commands).
- Run backend tests:
  - `cd backend ; npm test` (Jest tests live in `backend/test/`).

## Environment & live vs mock mode
- Backend checks `AZURE_OPENAI_KEY` and `AZURE_OPENAI_ENDPOINT`. If both are present the app uses live Azure OpenAI; otherwise it uses the built-in mock responses in `openaiService.getMockResponse()`.
- Backend example env: `backend/.env.example` — copy to `backend/.env` to run locally.
- Frontend uses `VITE_API_URL` in root `.env` to point to backend API.

## Project conventions & patterns agents should follow
- Routes are mounted as shown in `server.js`: API route file → exported router. Keep naming (`market-prices`, `forecast`, `weather`, `chat`) consistent.
- Crop names are normalized to lowercase in `forecastController.js` (e.g., `maize`, `rice`, `tomato`). Update mock data accordingly.
- Forecast responses contain these keys: `forecast`, `suggestedBuyers`, `dataSource`. `forecast` contains `currentPrice`, `forecastPrice`, `predictedChange`, `confidence`, `recommendation`, `timeframe` (see `calculateForecast`).
- OpenAI usage: the system prompt is embedded in `openaiService.js` as `systemPrompt`. If you need to tune the assistant behavior, edit that prompt there (not the frontend).

## Integration points & external dependencies
- Azure OpenAI (optional): pipeline is in `backend/services/openaiService.js` using Azure REST endpoint and `api-key` header.
- No DB in this repo — data is JSON files under `backend/data/`. Changes to persistent data are done by modifying those JSON files.
- Voice features use the browser Web Speech API — implementation hooks are in `src/components/ChatWidget.jsx` and `backend/services/speechService.js` (placeholder).

## Common tasks with concrete file pointers
- Add a new crop/state: update `backend/data/market.json` and `backend/data/weather.json` and adjust lists in `server.js` if needed.
- Change system prompt or language behavior: edit `backend/services/openaiService.js` → `systemPrompt` content.
- Debugging backend: run `npm run backend:dev` and watch console; server prints mode (LIVE or MOCK) and the API endpoint at startup.
- Update chat response formatting: frontend displays text from `/api/chat` — look at `src/components/ChatWidget.jsx` and `src/services/api.js` for request/response wiring.

## Example API requests (for tests & quick checks)
- Health check: `GET http://localhost:5000/api/health` — returns `{ mode: 'mock'|'live', services: { azure_openai: bool } }` (see `server.js`).
- Forecast example:
  - `GET /api/forecast?crop=maize&state=Kano` → response includes `forecast` and `suggestedBuyers` (see `forecastController.getForecast`).
- Chat example (POST):
  - `POST /api/chat` with `{ message: 'What is the price of maize?', history: [] }` — backend sends the message to OpenAIService or returns a mock text.

## What NOT to change without tests or owner sign-off
- Do not change the forecast algorithm's output keys (client expects them). If you change keys, update `src` components that read them.
- Avoid switching to a database or env layout without adding migration notes — the app is intentionally file-backed for portability.

## Where automated tests live
- Backend Jest tests: `backend/test/` (e.g., `forecast.test.js`). Use `cd backend ; npm test` to run.

## Suggested next edits by an AI agent (small, safe PRs)
1. Add a short unit test that validates `calculateForecast()` edge cases in `forecastController.js` (happy path + negative change). Put the test under `backend/test/`.
2. Add a small README snippet in `backend/` documenting `.env` keys and mock vs live mode (if missing).

If any of the above sections are unclear or you want me to expand an example (API shapes, a test PR, or the exact files to edit), tell me which part and I'll iterate.
