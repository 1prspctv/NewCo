# One-Click Deployment Guide

## YOU ONLY NEED TO DO THESE 3 THINGS:

### 1. Get a Stripe Account (2 minutes)
- Go to https://stripe.com
- Sign up (free)
- Go to Developers > API Keys
- Copy the "Secret key" (starts with sk_test_)

### 2. Deploy to Vercel (3 minutes)
- Go to https://vercel.com
- Sign up with GitHub
- Click "Add New" > "Project"
- Click "Import" next to this repository
- Click "Environment Variables" and add:

  | Name | Value |
  |------|-------|
  | JWT_SECRET | any-random-text-here-123 |
  | STRIPE_SECRET_KEY | sk_test_your_key_from_step_1 |

- Click "Deploy"
- Wait 1-2 minutes

### 3. Done!
Your invoice SaaS is live at the URL Vercel gives you (something like invoiceflow-xxx.vercel.app)

---

## To Start Making Money:

1. Share your link on:
   - Reddit (r/freelance, r/smallbusiness)
   - Twitter/X
   - Facebook groups
   - LinkedIn

2. When users sign up for Pro ($5/month), Stripe handles everything automatically.

3. Check your Stripe dashboard to see payments!

---

## Optional: Enable Subscriptions (5 more minutes)

For the $5/month Pro plan to work:

1. In Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter: https://YOUR-APP.vercel.app/api/stripe/webhook
4. Select events: checkout.session.completed, customer.subscription.deleted
5. Copy the signing secret
6. In Vercel > Your Project > Settings > Environment Variables
7. Add: STRIPE_WEBHOOK_SECRET = whsec_your_secret
8. Redeploy (Vercel > Deployments > ... > Redeploy)

That's it! Now subscriptions work automatically.
