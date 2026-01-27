from fastapi import Depends
from ..core.security import get_api_key

async def check_subscription(api_key: str = Depends(get_api_key)):
    """
    Mock Stripe subscription check.
    In a real app, you'd look up the user by API key and check stripe.Subscription.retrieve().
    """
    # Mock logic: If key starts with 'paid_', they are premium.
    # Otherwise they are 'free'.
    is_premium = api_key.startswith("paid_")
    return {"tier": "premium" if is_premium else "free"}
