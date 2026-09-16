"""
FastAPI application — Customer Churn Prediction API.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import CustomerInput, PredictionResponse
from app.services import predictor


# ---------------------------------------------------------------------------
# Lifespan — load model once at startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup, clean up on shutdown."""
    predictor.load_model()
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Customer Churn Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS_RAW = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://customer-churn-prediction-usingml.vercel.app,*",
)
raw_origins = [o.strip() for o in ALLOWED_ORIGINS_RAW.split(",") if o.strip()]
if "*" in raw_origins:
    ALLOWED_ORIGINS = ["*"]
else:
    ALLOWED_ORIGINS = raw_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handler — never expose stack traces to clients
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Error during {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again."},
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
async def root():
    """Root endpoint for quick verification."""
    return {
        "status": "ok",
        "service": "Customer Churn Prediction API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
async def health():
    """Health check."""
    return {"status": "ok"}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict_churn(customer: CustomerInput):
    """Accept customer data and return churn prediction."""
    result = predictor.predict(customer)
    return result
