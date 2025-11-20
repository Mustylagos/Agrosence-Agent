# Export & Distribution Instructions

## Creating a ZIP Archive

### Option 1: Using Command Line (Mac/Linux)

```bash
# Navigate to the project directory
cd /path/to/agrosense-agent

# Create ZIP excluding node_modules and build artifacts
zip -r agrosense-agent.zip . \
  -x "node_modules/*" \
  -x "backend/node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x "*.log"
```

### Option 2: Using Command Line (Windows PowerShell)

```powershell
# Create ZIP using PowerShell
Compress-Archive -Path * -DestinationPath agrosense-agent.zip -Exclude node_modules, backend/node_modules, dist, .git
```

### Option 3: Using GUI

1. **Mac**: Right-click the folder → "Compress"
2. **Windows**: Right-click the folder → "Send to" → "Compressed (zipped) folder"
3. **Linux**: Right-click the folder → "Compress" → Choose ZIP format

**Note**: Manually delete `node_modules`, `backend/node_modules`, and `dist` folders before compressing to reduce file size.

---

## Sharing the Project

### File Size Expectations

- **Without node_modules**: ~5-10 MB
- **With node_modules**: ~200-300 MB

**Recommendation**: Always share without node_modules. Recipients can run `npm install` to restore dependencies.

### Distribution Methods

1. **Email**: For files under 25 MB (no node_modules)
2. **Cloud Storage**: Google Drive, Dropbox, OneDrive
3. **File Transfer**: WeTransfer, SendAnywhere
4. **GitHub**: Create a repository (recommended for collaboration)
5. **USB Drive**: For offline transfer

---

## Recipient Instructions

Include these instructions when sharing:

### For Recipients

1. **Extract the ZIP file**:
   - Right-click → "Extract All" (Windows)
   - Double-click (Mac)
   - Use `unzip agrosense-agent.zip` (Linux)

2. **Open in VS Code**:
   ```bash
   cd agrosense-agent
   code .
   ```

3. **Install dependencies**:
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

4. **Read the documentation**:
   - `README.md` - Overview and features
   - `SETUP_GUIDE.md` - Detailed setup instructions
   - `backend/.env.example` - Configuration template

5. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   npm run backend

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**:
   - Open browser to `http://localhost:5173`

---

## GitHub Distribution

### Creating a GitHub Repository

1. **Create repository** on GitHub (without initializing)

2. **Push the project**:
```bash
cd agrosense-agent

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AgroSense Agent MVP"

# Add remote
git remote add origin https://github.com/yourusername/agrosense-agent.git

# Push
git push -u origin main
```

3. **Add a .gitignore**:
```
node_modules/
backend/node_modules/
dist/
.env
backend/.env
*.log
.DS_Store
```

### Cloning Instructions for Recipients

```bash
git clone https://github.com/yourusername/agrosense-agent.git
cd agrosense-agent
npm run install:all
```

---

## Pre-Export Checklist

Before exporting, verify:

- ✅ All `.env` files have `.example` versions
- ✅ No sensitive data (API keys, passwords) in code
- ✅ `node_modules` excluded from ZIP
- ✅ `dist` folder excluded from ZIP
- ✅ README.md is up to date
- ✅ License file is included
- ✅ Setup instructions are clear
- ✅ Project builds successfully (`npm run build`)
- ✅ Backend starts without errors
- ✅ Mock mode works (no Azure keys required)

### Quick Verification

```bash
# Test build
npm run build

# Verify backend
cd backend
npm start &
sleep 2
curl http://localhost:5000/api/health
killall node

# Check file size
du -sh .
```

---

## Adding Azure Keys Later

### For Recipients Without Azure Account

The project works fully in **mock mode** without any Azure credentials. All features are available:
- Market prices
- Weather alerts
- Price forecasts
- Basic AI chat (rule-based)

### For Recipients With Azure Account

1. Follow the "Adding Azure OpenAI" section in `SETUP_GUIDE.md`

2. Create `backend/.env` from `backend/.env.example`

3. Add your credentials:
```env
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=your_endpoint_here
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

4. Restart backend - it will automatically detect and use Azure OpenAI

---

## Verification After Export

### Sender Checklist

1. Extract the ZIP in a new location
2. Follow recipient instructions
3. Verify everything works
4. Test both mock and live modes (if you have Azure keys)
5. Ensure no errors in console

### Testing Script

```bash
# Extract to temp directory
mkdir /tmp/test-export
cp agrosense-agent.zip /tmp/test-export/
cd /tmp/test-export
unzip agrosense-agent.zip

# Follow setup
npm install
cd backend && npm install && cd ..

# Start services
npm run backend &
npm run dev &

# Wait and test
sleep 5
curl http://localhost:5000/api/health
open http://localhost:5173

# Cleanup
killall node
cd /tmp
rm -rf test-export
```

---

## Common Questions

**Q: Why is the ZIP so large?**
A: If over 100 MB, you likely included `node_modules`. Delete them and re-zip.

**Q: Can I deploy without Azure?**
A: Yes! Mock mode is fully functional. Azure is optional for enhanced AI features.

**Q: How do recipients get started?**
A: Send them to `SETUP_GUIDE.md` for step-by-step instructions.

**Q: What if they don't have Node.js?**
A: Include this link: https://nodejs.org/en/download/ (recommend LTS version)

**Q: Can I share on social media?**
A: Yes, but use GitHub or file hosting. Don't include API keys.

**Q: How do I update the distributed version?**
A: Make changes, re-zip, and share new version with version number (e.g., agrosense-v2.zip)

---

## Version Control Best Practices

When sharing updates:

1. Use semantic versioning (v1.0.0, v1.1.0, etc.)
2. Include CHANGELOG.md with updates
3. Tag releases in git
4. Notify recipients of breaking changes
5. Provide migration guides if needed

### Example CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2025-11-19
### Added
- Initial release
- Mock data support
- Azure OpenAI integration
- Voice features
- Dashboard analytics
- English & Hausa language support

## [1.1.0] - Future
### Planned
- Additional crops
- SMS notifications
- Mobile app version
```

---

## Support for Recipients

Provide support channels:
- Email: support@agrosense.example.com
- Documentation: Link to SETUP_GUIDE.md
- Issues: GitHub Issues page
- Video: Consider creating a setup walkthrough video

---

Ready to export and share! 🚀
