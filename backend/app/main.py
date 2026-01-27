import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import stripe
from .api import lesson

# Load environment variables
load_dotenv()

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI(title="AI Lesson Planner")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(lesson.router)

# Note: Static files for frontend are no longer served from here. 
# Use the separate frontend directory.

if __name__ == "__main__":
    import uvicorn
    # If running directly, we need to handle import paths or just use uvicorn from root
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
