from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging
import google.generativeai as genai
import PyPDF2
import io
import random
import requests
from typing import Optional, List

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Wiz-Scholar AI API",
    description="AI backend for the Wiz-Scholar application with PDF summarization",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API Configuration with rotation for rate limiting
GEMINI_API_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"), 
    os.getenv("GEMINI_API_KEY_3")
]

# Filter out None values and log configuration
GEMINI_API_KEYS = [key for key in GEMINI_API_KEYS if key and key != "your_first_gemini_api_key_here"]

if GEMINI_API_KEYS:
    logger.info(f"✅ Configured {len(GEMINI_API_KEYS)} Gemini API key(s)")
    # Initialize with first key
    genai.configure(api_key=GEMINI_API_KEYS[0])
else:
    logger.warning("⚠️ No valid Gemini API keys found")

# File upload configuration
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10485760))  # 10MB default
ALLOWED_EXTENSIONS = os.getenv("ALLOWED_EXTENSIONS", "pdf,txt,docx").split(",")

def get_gemini_client():
    """Get a Gemini client with API key rotation for better rate limit handling"""
    if not GEMINI_API_KEYS:
        raise HTTPException(status_code=500, detail="No Gemini API keys configured")
    
    # Rotate through API keys to distribute load
    api_key = random.choice(GEMINI_API_KEYS)
    genai.configure(api_key=api_key)
    # Use the correct Gemini Pro model name with proper prefix
    return genai.GenerativeModel('models/gemini-2.0-flash-exp')

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF content"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

# Data models
class HealthResponse(BaseModel):
    status: str
    message: str
    ai_status: str
    gemini_keys: int

class SummaryRequest(BaseModel):
    text: str
    summary_type: str = "academic"  # academic, brief, detailed, bullet_points
    max_length: Optional[int] = None

class SummaryResponse(BaseModel):
    content: str
    type: str
    wordCount: int
    compressionRatio: float
    timestamp: str
    keyPoints: Optional[List[str]] = None

@app.get("/", response_model=dict)
async def root():
    return {
        "message": "Wiz-Scholar AI Server is running!",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    try:
        ai_status = "ready"
        gemini_keys_count = len(GEMINI_API_KEYS)
        
        if gemini_keys_count == 0:
            ai_status = "no_gemini_keys"
        
        return HealthResponse(
            status="healthy",
            message="AI server is running with PDF summarization capabilities",
            ai_status=ai_status,
            gemini_keys=gemini_keys_count
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/api/summarize")
async def summarize_text(request: SummaryRequest):
    """Summarize text using Gemini AI"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text content is required")
        
        # Get Gemini client
        model = get_gemini_client()
        
        # Create prompt based on summary type
        prompts = {
            "academic": f"""
            Create an academic summary of the following text. Focus on key concepts, theories, and important findings.
            Make it suitable for university students. Keep the summary comprehensive but concise.
            
            Text to summarize:
            {request.text}
            """,
            "brief": f"""
            Create a brief, concise summary of the following text. Highlight only the most important points.

            Text to summarize:
            {request.text}
            """,
            "detailed": f"""
            Create a detailed summary of the following text. Include all major points, examples, and supporting details.
            Organize the information clearly with proper structure.
            
            Text to summarize:
            {request.text}
            """,
            "bullet_points": f"""
            Create a bullet-point summary of the following text. List the key points in a clear, organized format.
            Use bullet points to make it easy to scan and understand.
            
            Text to summarize:
            {request.text}
            """
        }
        
        prompt = prompts.get(request.summary_type, prompts["academic"])
        
        # Generate summary
        response = model.generate_content(prompt)
        summary = response.text
        
        # Calculate metrics
        original_length = len(request.text.split())
        summary_length = len(summary.split())
        compression_ratio = round((summary_length / original_length) * 100, 2) if original_length > 0 else 0
        
        # Extract key points if bullet points type
        key_points = None
        if request.summary_type == "bullet_points":
            key_points = [line.strip().lstrip('•-*').strip() for line in summary.split('\n') if line.strip()]
        
        from datetime import datetime
        
        return SummaryResponse(
            content=summary,
            type=request.summary_type.replace('_', ' ').title(),
            wordCount=summary_length,
            compressionRatio=compression_ratio,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            keyPoints=key_points
        )
        
    except Exception as e:
        logger.error(f"Text summarization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@app.post("/api/summarize-pdf-url")
async def summarize_pdf_from_url(
    pdf_url: str = Form(...),
    summary_type: str = Form("academic"),
    max_length: Optional[int] = Form(None),
    filename: Optional[str] = Form(None)
):
    """Summarize a PDF from a URL (e.g., Cloudinary URL)"""
    try:
        # Download PDF from URL
        logger.info(f"Downloading PDF from URL: {pdf_url}")
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()
        
        # Validate content type
        content_type = response.headers.get('content-type', '')
        if 'pdf' not in content_type.lower() and not pdf_url.lower().endswith('.pdf'):
            logger.warning(f"Unexpected content type: {content_type}")
        
        # Check file size
        pdf_content = response.content
        if len(pdf_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File too large. Max size: {MAX_FILE_SIZE/1024/1024:.1f}MB")
        
        # Extract text from PDF
        text_content = extract_text_from_pdf(pdf_content)
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="No readable text found in PDF")
        
        logger.info(f"Extracted {len(text_content)} characters from PDF")
        
        # Create summary request
        summary_request = SummaryRequest(
            text=text_content,
            summary_type=summary_type,
            max_length=max_length
        )
        
        # Process summary
        summary_response = await summarize_text(summary_request)
        
        logger.info(f"Successfully summarized PDF: {filename}")
        return summary_response
        
    except requests.RequestException as e:
        logger.error(f"Failed to download PDF from URL: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to download PDF: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF URL summarization failed: {e}")
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
