# AgroSense Agent - Complete Setup Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Local Development](#local-development)
3. [Adding Azure OpenAI](#adding-azure-openai)
4. [Deployment](#deployment)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)
- A code editor (VS Code recommended)

### Installation (5 minutes)

1. **Extract the project** (if you received a ZIP file):
```bash
unzip agrosense-agent.zip
cd agrosense-agent
```

2. **Install all dependencies**:
```bash
npm install
cd backend
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

3. **Start the backend server** (in one terminal):
```bash
npm run backend
```

You should see:
```
🌾 AgroSense Agent backend running on port 5000
📊 Mode: MOCK
🔗 API endpoint: http://localhost:5000/api
```

4. **Start the frontend** (in another terminal):
```bash
npm run dev
```

You should see:
```
  VITE v5.4.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

5. **Open your browser** to `http://localhost:5173`

You're now running AgroSense Agent in mock mode!

---

## Local Development

### Backend Development

The backend runs on port 5000 by default. To change this:

1. Edit `backend/.env`:
```env
PORT=3000  # Change to your preferred port
```

2. Update frontend `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### Frontend Development

The frontend uses Vite's hot reload - changes appear instantly in the browser.

**Key files to modify:**
- `src/App.jsx` - Main application layout
- `src/components/ChatWidget.jsx` - Chat interface
- `src/components/Dashboard.jsx` - Analytics dashboard
- `src/components/Header.jsx` - Header component

### Testing the API

Use curl or Postman to test endpoints:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Get market price
curl "http://localhost:5000/api/market-prices?crop=maize&state=Kano"

# Get forecast
curl "http://localhost:5000/api/forecast?crop=rice&state=Kaduna"

# Get weather
curl "http://localhost:5000/api/weather?state=Katsina"

# Send chat message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the price of maize in Kano?"}'
```

---

## Adding Azure OpenAI

### Step 1: Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure OpenAI"
4. Click "Create"
5. Fill in:
   - **Resource group**: Create new or use existing
   - **Region**: Choose closest to you
   - **Name**: Choose a unique name (e.g., `agrosense-openai`)
   - **Pricing tier**: Standard S0

6. Click "Review + Create", then "Create"

### Step 2: Deploy a Model

1. Once created, go to your Azure OpenAI resource
2. Click "Go to Azure OpenAI Studio"
3. Click "Deployments" in the left sidebar
4. Click "Create new deployment"
5. Select:
   - **Model**: gpt-4o-mini
   - **Deployment name**: gpt-4o-mini (remember this!)
   - **Model version**: Latest
6. Click "Create"

### Step 3: Get Your Credentials

1. In Azure OpenAI Studio, click your deployment
2. Copy the **Endpoint** (looks like: `https://your-resource.openai.azure.com/`)
3. Go back to Azure Portal
4. Click "Keys and Endpoint" in the left sidebar
5. Copy **KEY 1**

### Step 4: Configure Backend

1. Edit `backend/.env`:
```env
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_REGION=eastus  # or your region
PORT=5000
```

2. **Restart the backend server**:
```bash
# Stop the server (Ctrl+C)
# Start it again
npm run backend
```

You should now see:
```
📊 Mode: LIVE (Azure)
```

The chat will now use real AI responses!

---

## Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. Follow the prompts:
   - Link to existing project? **No**
   - Project name: **agrosense-agent**
   - Directory: **./** (current directory)
   - Override settings? **No**

4. **Add environment variable** in Vercel dashboard:
   - Go to your project settings
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Click "Save"

5. **Redeploy**:
```bash
vercel --prod
```

### Backend Deployment (Render)

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository (GitHub/GitLab)
   - Or use "Deploy from Git URL"

3. **Configure service**:
   - **Name**: agrosense-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add environment variables**:
   - `AZURE_OPENAI_KEY` = your key
   - `AZURE_OPENAI_ENDPOINT` = your endpoint
   - `AZURE_OPENAI_DEPLOYMENT` = gpt-4o-mini
   - `PORT` = 5000

5. Click "Create Web Service"

6. **Copy your backend URL** (e.g., `https://agrosense-backend.onrender.com`)

7. **Update frontend** `.env` and redeploy:
```env
VITE_API_URL=https://agrosense-backend.onrender.com/api
```

### Backend Deployment (Heroku)

1. **Install Heroku CLI**:
```bash
npm install -g heroku
```

2. **Login**:
```bash
heroku login
```

3. **Create app**:
```bash
heroku create agrosense-backend
```

4. **Set environment variables**:
```bash
heroku config:set AZURE_OPENAI_KEY=your_key
heroku config:set AZURE_OPENAI_ENDPOINT=your_endpoint
heroku config:set AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

5. **Deploy**:
```bash
git subtree push --prefix backend heroku main
```

If not using git, create a temporary repo:
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add heroku https://git.heroku.com/agrosense-backend.git
git push heroku main
```

---

## Testing

### Manual Testing

Test the forecast logic:
```bash
node -e "const fc = require('./backend/controllers/forecastController'); console.log(fc.calculateForecast(45000, 2.5));"
```

### Using Jest (Optional)

1. Install Jest in backend:
```bash
cd backend
npm install --save-dev jest@29.7.0
```

2. Run tests:
```bash
npm test
```

### Frontend Testing

1. Open browser console (F12)
2. Check for errors
3. Test voice features (requires HTTPS or localhost)
4. Test chat functionality
5. Test dashboard statistics

---

## Troubleshooting

### Backend Issues

**Problem**: Port already in use
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**Problem**: Cannot find module
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

**Problem**: Azure OpenAI errors
- Check API key is correct
- Verify endpoint URL format: `https://YOUR-RESOURCE.openai.azure.com/`
- Ensure deployment name matches exactly
- Check Azure resource is not paused/stopped
- Verify you have quota available

### Frontend Issues

**Problem**: API calls failing
- Check backend is running
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors
- Ensure no typos in environment variables

**Problem**: Voice features not working
- Use Chrome or Edge browser
- Grant microphone permissions
- Use HTTPS or localhost (required for Web Speech API)
- Check browser console for errors

**Problem**: Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### General Issues

**Problem**: Changes not appearing
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Restart dev server
- Clear browser cache
- Check correct .env file is being used

**Problem**: Mock data not loading
- Verify `backend/data/market.json` exists
- Check file permissions
- Ensure no JSON syntax errors

---

## Advanced Configuration

### Adding New Crops

1. Edit `backend/data/market.json`:
```json
{
  "prices": {
    "Kano": {
      "yam": {
        "price": 35000,
        "unit": "100kg bag",
        "lastUpdate": "2025-11-19",
        "change": 1.5
      }
    }
  },
  "buyers": {
    "yam": [
      {
        "name": "Yam Traders Co-op",
        "contact": "+234 800 XXX XXXX",
        "location": "Kano"
      }
    ]
  }
}
```

2. Update `backend/server.js` to include new crop in config

3. Restart backend

### Adding New States

1. Add state data to `backend/data/market.json`
2. Add weather data to `backend/data/weather.json`
3. Update config endpoint in `backend/server.js`
4. Restart backend

### Customizing AI Prompts

Edit `backend/services/openaiService.js`:
```javascript
const systemPrompt = {
  role: 'system',
  content: `Your custom system prompt here...`
};
```

### Customizing UI Colors

Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      }
    }
  }
}
```

Then update component classes from `green-600` to `primary`.

---

## Support & Resources

- **Documentation**: See README.md
- **API Reference**: Check backend/routes/ files
- **Azure OpenAI Docs**: https://learn.microsoft.com/azure/ai-services/openai/
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

## Next Steps

1. ✅ Set up local environment
2. ✅ Test mock mode
3. ⬜ Add Azure OpenAI credentials
4. ⬜ Test live mode
5. ⬜ Customize UI branding
6. ⬜ Deploy to production
7. ⬜ Add custom crops/states
8. ⬜ Collect user feedback

**Happy farming!** 🌾
