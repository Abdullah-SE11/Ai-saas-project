import os
from fastapi import Header, HTTPException, status
from dotenv import load_dotenv

load_dotenv()

# In production, this would be a database lookup or a robust validation system.
# For this SaaS architecture, we expect a Bearer Token in the Authorization header.
def get_api_key(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization format. Use 'Bearer <YOUR_TOKEN>'",
        )
    
    token = authorization.split(" ")[1]
    
    # Simple validation: ensuring the token is provided.
    # Replace this with actual database/Stripe verification logic.
    if len(token) < 5:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    
    return token
