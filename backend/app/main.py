from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import stations, observations
import app.models  # Ensure models are loaded into Base metadata


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on application startup."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for SkyGuard AI - Automatic Weather Station (AWS) Quality & Anomaly Monitoring Platform",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS) for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(stations.router)
app.include_router(observations.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
