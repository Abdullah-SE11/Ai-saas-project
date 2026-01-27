import os
from fastapi import Header, HTTPException, status, Depends
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
    if len(token) < 5:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    
    return token

from ..services.stripe_service import StripeService, UsageTracker

async def check_usage_limits(api_key: str = Depends(get_api_key)):
    # In a real app, you'd look up the customer_id associated with this api_key
    # Mocking a customer_id for demonstration
    customer_id = "cus_mock_123" 
    
    tier = StripeService.get_subscription_tier(customer_id)
    
    if not UsageTracker.can_generate(api_key, tier):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Daily limit reached for free tier. Please upgrade to Pro."
        )
    
    return {"tier": tier, "user_id": api_key}
