from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import lesson, webhooks

app = FastAPI(
    title="AI Lesson Planner API",
    description="A modular backend for generating educational content.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(lesson.router)
app.include_router(webhooks.router)

@app.get("/health")
def health_check():
    return {"status": "online", "service": "AI Lesson Planner"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
