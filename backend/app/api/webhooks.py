import os
import stripe
from fastapi import APIRouter, Request, Header, HTTPException
from ..services.stripe_service import UsageTracker

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Here you would link the Stripe Customer ID to your User in your database
        print(f"Payment successful for session: {session.id}")
        
    elif event['type'] == 'customer.subscription.deleted':
        # Handle subscription cancellation
        subscription = event['data']['object']
        print(f"Subscription deleted: {subscription.id}")

    return {"status": "success"}
