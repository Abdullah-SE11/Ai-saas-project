from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import lesson, webhooks
from .core.logging import logger

app = FastAPI(
    title="AI Lesson Planner API",
    description="A modular backend for generating educational content.",
    version="1.0.0"
)

# CORS Configuration - Loosened for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("AI Lesson Planner API is starting up...")

from fastapi.staticfiles import StaticFiles

# Include Routers
app.include_router(lesson.router)
app.include_router(webhooks.router)

# Serve Frontend
# Note: This assumes uvicorn is run from the 'backend' directory
app.mount("/", StaticFiles(directory="../frontend", html=True), name="static")

@app.get("/health")
def health_check():
    return {"status": "online", "service": "AI Lesson Planner"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
