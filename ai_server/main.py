from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Wiz-Scholar AI API",
    description="AI backend for the Wiz-Scholar application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class HealthResponse(BaseModel):
    status: str
    message: str
    ai_status: str

class QueryRequest(BaseModel):
    query: str
    context: str = ""

class QueryResponse(BaseModel):
    response: str
    confidence: float
    model_used: str

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
        if not os.getenv("OPENAI_API_KEY"):
            ai_status = "no_api_key"
        
        return HealthResponse(
            status="healthy",
            message="AI server is running",
            ai_status=ai_status
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        response = f"AI processed your query: '{request.query}'"
        
        return QueryResponse(
            response=response,
            confidence=0.95,
            model_used="placeholder-model"
        )
    except Exception as e:
        logger.error(f"Query processing failed: {e}")
        raise HTTPException(status_code=500, detail="Query processing failed")

@app.get("/api/models")
async def list_models():
    return {
        "models": [
            {"id": "placeholder", "name": "Placeholder Model", "status": "available"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
