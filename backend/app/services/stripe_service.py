import os
import stripe
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
PRO_PRICE_ID = os.getenv("STRIPE_PRO_PRICE_ID")

class StripeService:
    @staticmethod
    def create_checkout_session(customer_email: str, success_url: str, cancel_url: str):
        """Create a Stripe Checkout session for a subscription."""
        try:
            session = stripe.checkout.Session.create(
                customer_email=customer_email,
                payment_method_types=['card'],
                line_items=[{
                    'price': PRO_PRICE_ID,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=success_url,
                cancel_url=cancel_url,
            )
            return session.url
        except Exception as e:
            print(f"Stripe Error: {e}")
            return None

    @staticmethod
    def get_subscription_tier(customer_id: str) -> str:
        """Fetch customer subscription status from Stripe."""
        if not customer_id:
            return "free"
            
        try:
            customer = stripe.Customer.retrieve(
                customer_id, 
                expand=['subscriptions']
            )
            subscriptions = customer.get('subscriptions', {}).get('data', [])
            
            for sub in subscriptions:
                if sub.status == 'active':
                    return "pro"
            return "free"
        except Exception:
            return "free"

# Mock Usage tracker (Replace with Redis or DB in production)
class UsageTracker:
    _usage = {} # { "user_id": { "count": 0, "date": "2024-01-27" } }
    FREE_LIMIT = 3

    @classmethod
    def can_generate(cls, user_id: str, tier: str) -> bool:
        if tier == "pro":
            return True
        
        count = cls._usage.get(user_id, 0)
        return count < cls.FREE_LIMIT

    @classmethod
    def increment_usage(cls, user_id: str):
        cls._usage[user_id] = cls._usage.get(user_id, 0) + 1
