# 📑 PROJECT_CONTEXT.md

## 🎓 Project: Wiz-Scholar

**Architecture:**  
- **Frontend:** React 19 (Vite) — `/client/` — Port: 5173  
- **Backend:** Express.js 5 — `/server/` — Port: 5001  
- **AI Server:** FastAPI (Python) — `/ai_server/` — Port: 8001  
- **Database:** MongoDB Atlas (Cloud)

---

## 📄 What to Implement: PDF Summarizer AI Feature

### 🎯 GOAL

- Users can **upload PDF files**.
- PDF is stored on **Cloudinary** securely.
- FastAPI (or Express) processes PDF text extraction.
- Uses **Gemini 2.5 Pro** models to:
  - **Summarize** PDF contents.
  - **Answer user questions** about the PDF.
  - **Suggest important sections**.
  - Optionally **generate practice questions** from the text.

---

## ⚙️ API Keys & Configs

**✅ Required environment variables:**

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY_1=
GEMINI_API_KEY_2=

OPENAI_API_KEY= # (optional, if fallback needed)
HUGGINGFACE_TOKEN= # (optional)

yaml
Copy
Edit

Store these in:
- `/server/.env` (for Express)
- `/ai_server/.env` (for FastAPI)

NEVER hardcode keys in code. Use `dotenv` in Node and `os.getenv` in Python.

---

## 📂 Expected File Locations

| Component | Path | Purpose |
|-----------|------|---------|
| PDF Upload Frontend | `/client/src/components/PdfUploader.jsx` | File input, calls backend |
| PDF Handling Route | `/server/routes/pdf.js` | Express API endpoint |
| AI Summarizer | `/ai_server/pdf_summarizer.py` | PDF text extraction, Gemini query |

---

## 🧩 Workflow Steps

1️⃣ **User uploads PDF → Frontend sends to Express**  
2️⃣ **Express uploads PDF to Cloudinary** → stores secure URL → responds with Cloudinary URL  
3️⃣ **Frontend sends Cloudinary PDF URL + user query to FastAPI**  
4️⃣ **FastAPI extracts text → sends to Gemini 2.5 Pro → returns summary/answers/questions**

---

## ⚠️ Common Error Handling

- ✅ **CORS Errors:**  
  - Use `cors` middleware in Express:
    ```js
    const cors = require('cors');
    app.use(cors({
      origin: 'http://localhost:5173', // adjust in prod
      credentials: true
    }));
    ```
  - For FastAPI, use:
    ```py
    from fastapi.middleware.cors import CORSMiddleware

    app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
    )
    ```

- ✅ **File Size Limits:**  
  - Set Express `limit` for uploads.
  - Validate file type: only PDFs.

- ✅ **Gemini API Errors:**  
  - Handle rate limits: `429`.
  - Retry failed calls.
  - Log errors clearly.

---

## 🪄 Tips for Copilot / Claude

- **Always get Cloudinary URL** → never store PDF locally.
- Use **secure signed URLs** if needed.
- Use **streams** for large PDF files.
- Use `pdfplumber` or `PyPDF2` in Python for PDF text extraction.
- Chunk large PDFs if needed to keep Gemini prompt size reasonable.
- Add `try/except` in Python and `try/catch` in Node.
- Return clear JSON responses with `success: true` or `false`.

---

## 📌 Example .env Template (`.env.example`)

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY_1=your_gemini_key_1
GEMINI_API_KEY_2=your_gemini_key_2

yaml
Copy
Edit

---

## 🏷️ Suggested Commands

| Script | Description |
|--------|--------------|
| `npm run pdf-test` | Runs a local PDF upload + summarizer test |
| `npm run lint` | Checks code style |
| `npm run dev` | Starts all services in dev mode |
| `python pdf_summarizer.py` | Test FastAPI endpoint locally |

---

## ✅ Requirements Summary for Copilot

- **Frontend**: `PdfUploader.jsx` with drag-and-drop, shows upload progress.
- **Backend (Express)**: `/upload-pdf` route → uploads PDF to Cloudinary → responds with URL.
- **AI Server (FastAPI)**: `/summarize-pdf` POST → accepts PDF URL + question → extracts text → calls Gemini → returns response.
- **Always use .env** for keys.
- **Log errors** and handle CORS properly.

---

## 🗂️ Final Notes

- All code must be modular.
- Separate PDF upload logic from Gemini summarizer.
- Do not hardcode any API keys.
- Make all error messages helpful.
- Keep code readable for multiple AI assistants.

---

**✨ Happy coding — let’s build a smart PDF Summarizer together!**