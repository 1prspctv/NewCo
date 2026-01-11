import Stripe from 'stripe'

// Initialize Stripe only when API key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null

export const PRICE_ID = process.env.STRIPE_PRICE_ID || ''

export const PRO_PLAN_PRICE = 500 // $5.00 in cents

export async function createCheckoutSession(
  customerId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> {
  if (!stripe) {
    console.error('Stripe not configured')
    return null
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'InvoiceThis Pro',
              description: 'Unlimited invoices, premium templates, priority support',
            },
            unit_amount: PRO_PLAN_PRICE,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customerId,
      },
    })

    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!stripe) return null

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session.url
  } catch (error) {
    console.error('Error creating portal session:', error)
    return null
  }
}

export async function handleWebhook(
  body: string,
  signature: string
): Promise<{ event: Stripe.Event } | { error: string }> {
  if (!stripe) {
    return { error: 'Stripe not configured' }
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return { error: 'Webhook secret not configured' }
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    return { event }
  } catch (err) {
    return { error: `Webhook signature verification failed` }
  }
}
