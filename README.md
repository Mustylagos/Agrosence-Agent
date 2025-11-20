# AgroSense Agent — Agricultural Market & Climate Advisor

Professional, hackathon‑ready README for the AgroSense Agent project. This document is tailored for judges and reviewers: it explains the problem, the solution, architecture, exact commands for running locally, how to enable live AI (Azure), deployment instructions, and demo assets.

Summary
-------
AgroSense Agent is an African-focused, full‑stack AI assistant that helps smallholder farmers make better selling and planting decisions by combining: market price data, rule-based forecasting, multilingual chat (English + Hausa), and optional Azure OpenAI for richer responses. The system defaults to a safe mock mode so you can demo without cloud keys.

Why it matters
--------------
- Problem: farmers lack timely market signals and buyer access → lose income to middlemen.
- Impact: the app surfaces local prices, short-term forecasts, and buyer suggestions — helping farmers choose when and where to sell.

Highlights
----------
- Local-first: mock JSON datasets in `backend/data/` let the app run offline and reliably for demos.
- Multilingual: English + Hausa auto-detection in chat (see `openaiService.js` mock and prompt).
- Voice-ready: frontend uses Web Speech API for mic input and TTS.
- Safer demos: Azure OpenAI is optional — leave keys empty to demo mock behavior.

Project layout (key files)
-------------------------
- `backend/server.js` — Express server, route mounting, health & config endpoints
- `backend/routes/*.js` — `market`, `forecast`, `weather`, `chat` endpoints
- `backend/controllers/forecastController.js` — forecasting logic reading `backend/data/market.json`
- `backend/services/openaiService.js` — Azure OpenAI client + mock fallback (system prompt lives here)
- `backend/data/market.json`, `backend/data/weather.json` — canonical mock data used throughout the app
- `src/components/ChatWidget.jsx` — frontend chat UI and mic controls
- `src/services/api.js` — frontend ↔ backend requester (VITE_API_URL)

Quick Start — expert & exam-ready (Windows PowerShell)
--------------------------------------------------
Follow these exact commands. Replace `path\to` with your local path.

1) Create local `.env` files (do not commit keys)
backend/.env (create `backend\.env`)
```powershell
PORT=5000

# Azure (leave blank for mock mode)
AZURE_OPENAI_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_REGION=

COGNITIVE_KEY=
COGNITIVE_ENDPOINT=
COGNITIVE_REGION=
```

frontend/.env (create `frontend\.env` or project root `.env` depending on layout)
```powershell
VITE_API_URL=http://localhost:5000/api
```

2) Backend: install & run (development)
```powershell
cd "path\to\AgrosenceAi-main\backend"
npm install
npm run dev
```
- Expected: console prints server URL and Mode (MOCK or LIVE).

3) Frontend: install & run (project root)
```powershell
cd "path\to\AgrosenceAi-main"
npm install
npm run dev
```
- Open the Vite URL (usually http://localhost:5173). Test: ask about maize price in Kano (English) and Hausa.

4) Run backend tests (sanity check)
```powershell
cd "path\to\AgrosenceAi-main\backend"
npm test
```

Deployment (quick hackathon setup)
---------------------------------
Backend → Render (fast and simple)
  - Create a Render Web Service, connect your GitHub repo.
  - Set the service root to `backend/`.
  - Build command: `npm install`
  - Start command: `npm start`
  - Add env vars via Render Dashboard (do not store secrets in GitHub).

Frontend → Vercel
  - Import the same GitHub repo and set the project root to `frontend` (or project root).
  - Add env var `VITE_API_URL` pointing to your Render backend URL.

Turning on Live AI (Azure) — safe steps
--------------------------------------
1. In Azure, create an OpenAI resource and deploy `gpt-4o-mini` (or equivalent) and a Cognitive Services resource (Translator + Speech).
2. Add these environment variables in Render (or paste into local `backend/.env` for local dev):
   - `AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`, `AZURE_REGION`
   - `COGNITIVE_KEY`, `COGNITIVE_ENDPOINT`, `COGNITIVE_REGION`
3. Restart the backend. The server will detect keys and print `Mode: LIVE`.

API reference (examples)
------------------------
- Health: GET `/api/health` — returns `{ status, mode, services }`
- Config: GET `/api/config` — returns `mode`, supported states & crops
- Market prices: GET `/api/market-prices?crop=maize&state=Kano`
- Forecast: GET `/api/forecast?crop=maize&state=Kano` — returns `forecast`, `suggestedBuyers`, `dataSource`
- Chat: POST `/api/chat` with body `{ message, history }` — returns assistant reply

Testing notes & common fixes
----------------------------
- Mic/Voice: Web Speech API works on HTTPS or localhost (Chrome/Edge recommended).
- CORS: backend has `app.use(cors())` in `backend/server.js`. If you see CORS errors, confirm frontend `VITE_API_URL` matches backend.
- Port conflicts: change `PORT` in `backend/.env` if 5000 is in use.

Hackathon submission checklist
-----------------------------
- Public frontend URL (Vercel)
- Public backend URL (Render)
- Public GitHub repo (MIT license included)
- 3-minute demo video (YouTube link)
- Short README and pitch deck (presentable slides)

What I changed / added
----------------------
- Professional Quick Start and deployment notes.
- `.github/copilot-instructions.md` (AI agent guide) — see repo for details.
- I can add demo script, pitch deck text, and pre-filled form answers if you want them included in `docs/`.

Next recommended steps (I will do these if you confirm):
1. Add polished `docs/DEMO_SCRIPT.md` (word-for-word 3-minute script) — good for rehearsals.
2. Add `docs/DECK.md` (10-slide pitch deck text) — copy/paste into PowerPoint.
3. Add `docs/FORMS.md` (sample hackathon form answers).
4. Add placeholder `.env` files to the repo (empty keys) so teammates can quickly run the app locally.

If you'd like, I will now create the demo script, deck, forms, and placeholder `.env` files and then prepare the repo for final submission. Say `GO ALL` to proceed to create all assets, or pick one: `DEMO`, `DECK`, `FORMS`, `ENV`, `TEST`.

Thank you — ready when you say which asset to produce next.
## Usage

### Mock Mode (Default)

The system works out of the box with mock data. No Azure keys required.

Features available:
- Market price queries
- Weather information
- Price forecasts
- Basic AI responses using rule-based logic

### Live Mode (Azure OpenAI)

To enable live AI features:

1. Create an Azure OpenAI resource in Azure Portal
2. Deploy a GPT-4o-mini model
3. Copy your API key and endpoint
4. Add them to `backend/.env`:

```env
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

5. Restart the backend server

The system will automatically detect Azure configuration and switch to live mode.

## API Endpoints

### Market Prices
```
GET /api/market-prices?crop=maize&state=Kano
```

### Price Forecast
```
GET /api/forecast?crop=maize&state=Kano
```

### Weather Alert
```
GET /api/weather?state=Kano
```

### Chat
```
POST /api/chat
Body: { "message": "What is the price of maize?", "history": [] }
```

### Health Check
```
GET /api/health
```

### System Config
```
GET /api/config
```

## Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from project root:
```bash
vercel
```

3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL

### Backend Deployment (Render/Heroku)

#### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard

#### Heroku

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create app:
```bash
heroku create agrosense-backend
```

3. Deploy:
```bash
git subtree push --prefix backend heroku main
```

4. Set environment variables:
```bash
heroku config:set AZURE_OPENAI_KEY=your_key
heroku config:set AZURE_OPENAI_ENDPOINT=your_endpoint
```

## Voice Features

The application uses browser-based Web Speech API:

- **Voice Input**: Click the microphone button to speak your query
- **Text-to-Speech**: Click the speaker icon to hear responses read aloud
- **Browser Support**: Works best in Chrome, Edge, and Safari

## Supported Data

**States:** Kano, Kaduna, Katsina, Sokoto, Kebbi

**Crops:** Maize, Rice, Tomato, Sorghum, Cowpea

**Languages:** English, Hausa (auto-detected)

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## Development

### Adding New Crops

1. Update `backend/data/market.json` with new crop data
2. Add buyer information in the `buyers` section
3. Update supported crops list in `backend/server.js`

### Adding New States

1. Update `backend/data/market.json` with state data
2. Update `backend/data/weather.json` with weather info
3. Update supported states list in `backend/server.js`

### Customizing AI Responses

Edit the system prompt in `backend/services/openaiService.js`:
```javascript
const systemPrompt = {
  role: 'system',
  content: 'Your custom prompt here...'
};
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js version (18+)
- Check `.env` file exists in backend directory

### Frontend can't connect to backend
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Check for CORS issues in browser console

### Voice features not working
- Ensure using HTTPS or localhost
- Check browser compatibility (Chrome/Edge recommended)
- Grant microphone permissions when prompted

### Azure OpenAI not working
- Verify API key and endpoint are correct
- Check deployment name matches your Azure resource
- Ensure API quota is not exceeded

## Export Instructions

To export this project:

1. Create a ZIP archive:
```bash
zip -r agrosense-agent.zip . -x "node_modules/*" "dist/*" ".git/*"
```

2. Share the ZIP file

3. To use:
```bash
unzip agrosense-agent.zip
cd agrosense-agent
# Follow Quick Start instructions above
```

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please contact the development team.

---

**Built for smallholder farmers in Northern Nigeria** 🌾
