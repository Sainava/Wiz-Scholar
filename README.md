# 🧙‍♂️ Wiz Scholar – Magical PDF Summarizer ✨

**Wiz Scholar** is an enchanted document analysis platform that transforms PDFs into intelligent summaries using cutting-edge AI technology and a Harry Potter-inspired UI. It features drag-and-drop uploads, magical animations, and intelligent PDF understanding powered by Google Gemini AI.

---

## ✨ Features

- 🎨 **Themed Magical UI** — Mystical interface with Hogwarts-inspired styling
- 📤 **Smart PDF Upload** — Drag-and-drop with magical float animations
- 🤖 **AI-Powered Summarization** — Summaries powered by Gemini Pro models
- 🔍 **Interactive PDF Viewer** — View uploaded files with in-browser preview
- ☁️ **Secure Cloud Storage** — Uploads managed through Cloudinary
- ⚡ **Real-time Processing** — Live progress indicators with magical effects
- 📱 **Responsive Design** — Optimized for desktop and mobile
- 🏗️ **Three-Server Architecture** — Clear separation of concerns

---

## 🧠 Architecture Overview

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ React Client │───▶ Express Server │───▶ AI Server │
│ Port: 3000 │ │ Port: 5001 │ │ Port: 8001 │
│ • UI & Upload │ │ • API Routing │ │ • Gemini AI │
│ • PDF Viewer │ │ • File Mgmt │ │ • Text Proc. │
└───────────────┘ └───────────────┘ └───────────────┘

yaml
Copy
Edit

---

## 🚀 Quick Start (All-in-One Script)

```bash
git clone https://github.com/Sainava/Wiz-Scholar.git
cd Wiz-Scholar

chmod +x start-wiz-scholar.sh
./start-wiz-scholar.sh
This starts:

🤖 AI Server (8001)

🚀 Express Server (5001)

⚛️ React Client (3000)

To stop everything:

bash
Copy
Edit
./stop-wiz-scholar.sh
🛠️ Manual Setup Guide
1. Prerequisites
Node.js 18+

Python 3.8+

MongoDB (local or Atlas)

Cloudinary account

Google Gemini API Keys

2. Install Dependencies
bash
Copy
Edit
# Frontend
cd client && npm install && cd ..

# Backend
cd server && npm install && cd ..

# AI Server
cd ai_server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
3. Environment Configuration
client/.env

ini
Copy
Edit
VITE_SERVER_URL=http://localhost:5001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
server/.env

ini
Copy
Edit
MONGODB_URI=mongodb://localhost:27017/wiz-scholar
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
AI_SERVER_URL=http://localhost:8001
PORT=5001
CORS_ORIGIN=http://localhost:3000
ai_server/.env

ini
Copy
Edit
GEMINI_API_KEY_1=your_primary_gemini_key
GEMINI_API_KEY_2=your_backup_key
HOST=0.0.0.0
PORT=8001
DEBUG=True
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,txt,docx
4. Start Servers (Individually)
bash
Copy
Edit
# Terminal 1: AI Server
cd ai_server && source venv/bin/activate && python main.py

# Terminal 2: Express Server
cd server && npm start

# Terminal 3: React Client
cd client && npm run dev
🎯 System Flow
📄 PDF Upload Process
User uploads PDF via drag-and-drop

React sends file to Express (port 5001)

Express uploads to Cloudinary

Cloudinary URL is stored in MongoDB

React displays PDF in built-in viewer

🧠 AI Summarization Process
User selects summary type

Express proxies request to AI Server

AI Server:

Downloads PDF

Extracts text

Sends prompt to Gemini

Returns summary to Express

Express sends result to frontend

🌈 Theming & UI
🪄 Color Palette
css
Copy
Edit
:root {
  --primary: hsl(45 100% 65%);     /* Hogwarts Gold */
  --accent: hsl(270 60% 45%);      /* Mystical Purple */
  --background: hsl(220 30% 5%);   /* Deep Night Sky */
  --foreground: hsl(45 100% 85%);  /* Golden Text */
}
✨ Animations
css
Copy
Edit
@keyframes magicalFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes magicalPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
📊 API Reference
Express Server (localhost:5001)
Endpoint	Method	Description
/api/pdf/upload	POST	Upload PDF to Cloudinary
/api/pdf/:id	GET	Retrieve PDF metadata
/api/pdf/summarize	POST	Proxy summarization request to AI
/api/pdf/proxy/:url	GET	CORS-safe PDF fetch proxy
/health	GET	Health check

AI Server (localhost:8001)
Endpoint	Method	Description
/summarize	POST	Generate AI summary (Gemini)
/extract-text	POST	Extract raw text from PDF
/health	GET	Health check

🧪 Project Structure
bash
Copy
Edit
Wiz-Scholar/
├── client/           # React frontend
├── server/           # Express backend
├── ai_server/        # FastAPI AI service
├── start-wiz-scholar.sh
├── stop-wiz-scholar.sh
└── docs/
    └── ARCHITECTURE_GUIDE.md
🌍 Deployment
Frontend
bash
Copy
Edit
cd client
npm run build
# Deploy /dist to Vercel, Netlify, or other CDN
Backend & AI Server
Deploy Express server to Railway / Render / Heroku

Deploy AI Server to Google Cloud Run or GPU instance

Use MongoDB Atlas for production DB

Secure all environment variables

🤝 Contributing
Fork the repository

Create a branch: git checkout -b feature/awesome-feature

Follow the theme guidelines

Test across all 3 servers

Submit a Pull Request

📄 License
Licensed under the MIT License.

🙏 Acknowledgments
Google Gemini AI for advanced summarization

Cloudinary for file storage

MongoDB Atlas for document DB

FastAPI for scalable Python APIs

React & Vite for modern frontend tooling

🧙 Built with magical thinking and AI wizardry.
Visit the enchanted castle: http://localhost:3000
