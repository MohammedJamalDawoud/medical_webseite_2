"""FastAPI main application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Telemedicine Patient Portal API",
    description="Educational telemedicine platform API for patient-doctor interactions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Telemedicine Patient Portal API",
        "version": "1.0.0",
        "docs": "/docs",
        "warning": "This is an educational demo. Not for real medical use."
    }

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Import and register routers
from routers import (
    auth,
    doctors,
    appointments,
    prescriptions,
    reports,
    lab_results,
    health_content,
    symptom_checker
)

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(prescriptions.router)
app.include_router(reports.router)
app.include_router(lab_results.router)
app.include_router(health_content.router)
app.include_router(symptom_checker.router)


# Startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    print("🚀 Telemedicine API starting...")
    print(f"📊 Database: {settings.DATABASE_URL}")
    print(f"🔧 Debug mode: {settings.DEBUG}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    print("👋 Telemedicine API shutting down...")
