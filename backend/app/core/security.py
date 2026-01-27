from fastapi import Header, HTTPException

async def get_api_key(authorization: str = Header(...)):
    """
    Extracts the API key from the Authorization header (Bearer <key>).
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format. Expected 'Bearer <API_KEY>'")
    
    api_key = authorization.split(" ")[1]
    # In a real app, you would validate this key against your database.
    # For now, we accept any non-empty key to allow the demo to run if the user provides one.
    if not api_key:
        raise HTTPException(status_code=401, detail="Missing API Key")
    return api_key
