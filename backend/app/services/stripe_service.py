import os
import stripe
from dotenv import load_dotenv
from datetime import datetime, timedelta
from ..core.logging import logger

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
PRO_PRICE_ID = os.getenv("STRIPE_PRO_PRICE_ID")

class StripeService:
    _tier_cache = {} # { "customer_id": {"tier": "pro", "expiry": datetime} }

    @staticmethod
    def create_checkout_session(customer_email: str, success_url: str, cancel_url: str):
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
            logger.error(f"Stripe Checkout Error: {str(e)}")
            return None

    @classmethod
    def get_subscription_tier(cls, customer_id: str) -> str:
        # Check cache (TTL 30 minutes)
        now = datetime.now()
        if customer_id in cls._tier_cache:
            cache_entry = cls._tier_cache[customer_id]
            if now < cache_entry["expiry"]:
                return cache_entry["tier"]

        try:
            logger.info(f"Fetching subscription tier for: {customer_id}")
            customer = stripe.Customer.retrieve(customer_id, expand=['subscriptions'])
            subscriptions = customer.get('subscriptions', {}).get('data', [])
            
            tier = "free"
            for sub in subscriptions:
                if sub.status == 'active':
                    tier = "pro"
                    break
            
            # Update cache
            cls._tier_cache[customer_id] = {
                "tier": tier,
                "expiry": now + timedelta(minutes=30)
            }
            return tier
        except Exception as e:
            logger.error(f"Stripe Retrieval Error: {str(e)}")
            return "free"

class UsageTracker:
    _usage = {}
    FREE_LIMIT = 5 # bumped from 3 for better UX

    @classmethod
    def can_generate(cls, user_id: str, tier: str) -> bool:
        if tier == "pro":
            return True
        
        user_usage = cls._usage.get(user_id, 0)
        return user_usage < cls.FREE_LIMIT

    @classmethod
    def get_remaining_uses(cls, user_id: str, tier: str) -> int:
        if tier == "pro":
            return 999
        return max(0, cls.FREE_LIMIT - cls._usage.get(user_id, 0))

    @classmethod
    def increment_usage(cls, user_id: str):
        cls._usage[user_id] = cls._usage.get(user_id, 0) + 1
        logger.info(f"Usage incremented for {user_id}. New count: {cls._usage[user_id]}")
