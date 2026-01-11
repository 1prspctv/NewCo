# InvoiceThis - Simple Invoice Generator SaaS

A complete, ready-to-deploy invoice generation SaaS that you can monetize. Built with Next.js, Tailwind CSS, and Stripe.

## Features

- Create professional invoices in seconds
- User authentication (signup/login)
- PDF printing/downloading
- Stripe payment integration
- Free tier (3 invoices/month) + Pro tier ($5/month unlimited)
- Clean, responsive UI

## Quick Deploy to Vercel (5 minutes)

### Step 1: Create a Stripe Account (Free)

1. Go to [stripe.com](https://stripe.com) and create a free account
2. Go to **Developers > API keys**
3. Copy your **Secret key** (starts with `sk_test_` for testing)

### Step 2: Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Add New Project"
3. Import this repository
4. Add these Environment Variables:
   - `JWT_SECRET`: Any random string (e.g., `my-super-secret-key-12345`)
   - `STRIPE_SECRET_KEY`: Your Stripe secret key from Step 1
5. Click "Deploy"

That's it! Your invoice SaaS is now live.

### Step 3 (Optional): Set Up Stripe Webhooks for Subscriptions

For Pro subscriptions to work:

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click "Add endpoint"
3. Enter URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Vercel Environment Variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Make $1000/Month

### Pricing Model
- Free: 3 invoices/month (attracts users)
- Pro: $5/month unlimited (converts serious users)

### To reach $1000/month you need:
- **200 Pro subscribers** at $5/month = $1,000/month

### Marketing Strategies (Free/Low Cost)

1. **Reddit/Forums**: Share in r/freelance, r/smallbusiness, r/entrepreneur
2. **Product Hunt**: Launch on Product Hunt for free exposure
3. **SEO**: The app is SEO-optimized, write blog posts about invoicing
4. **Twitter/X**: Share your journey building it
5. **Facebook Groups**: Share in freelancer and small business groups
6. **Affiliate**: Offer 20% referral commission

### Realistic Timeline
- Month 1-2: Get first 10-20 users, gather feedback
- Month 3-4: Reach 50-100 users through marketing
- Month 6+: Scale to 200+ Pro subscribers

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: File-based JSON (simple, no setup needed)
- **Payments**: Stripe
- **Hosting**: Vercel (free tier works great)

## File Structure

```
invoiceflow/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utilities (auth, db, stripe)
│   ├── pages/         # Next.js pages and API routes
│   └── styles/        # Global CSS
├── data/              # Local JSON database (gitignored)
├── package.json
└── README.md
```

## Customization Ideas

1. Add your logo and brand colors in `tailwind.config.js`
2. Change pricing in `src/lib/stripe.ts`
3. Add more invoice templates
4. Add email sending functionality
5. Add recurring invoice scheduling

## Support

This is a complete, working application. If you have issues:
1. Check the browser console for errors
2. Check Vercel deployment logs
3. Ensure environment variables are set correctly

## License

MIT - Use it however you want!
