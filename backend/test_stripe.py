import os
from decouple import Config, RepositoryEnv
import stripe

try:
    config = Config(RepositoryEnv(r'C:\Users\Antor Chandra Das\POL_TRACKING_PLATFORM\backend\.env'))
    stripe.api_key = config('STRIPE_SECRET_KEY')
    print("Testing key:", stripe.api_key[:12] + "...")
    stripe.Customer.list(limit=1)
    print("Stripe API key is VALID!")
except Exception as e:
    print("Stripe Error:", str(e))
