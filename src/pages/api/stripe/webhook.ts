import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { handleWebhook } from '@/lib/stripe'
import { getUsers, updateUser } from '@/lib/db'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  if (!sig || Array.isArray(sig)) {
    return res.status(400).json({ error: 'Missing signature' })
  }

  const result = await handleWebhook(buf.toString(), sig as string)

  if ('error' in result) {
    console.error('Webhook error:', result.error)
    return res.status(400).json({ error: result.error })
  }

  const event = result.event

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.metadata?.customerId

      if (customerId) {
        // Upgrade user to pro
        updateUser(customerId, {
          plan: 'pro',
          stripeCustomerId: session.customer as string,
        })
        console.log(`User ${customerId} upgraded to Pro`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const stripeCustomerId = subscription.customer as string

      // Find user by Stripe customer ID and downgrade
      const users = getUsers()
      const user = users.find(u => u.stripeCustomerId === stripeCustomerId)
      if (user) {
        updateUser(user.id, { plan: 'free' })
        console.log(`User ${user.id} downgraded to Free`)
      }
      break
    }
  }

  return res.status(200).json({ received: true })
}
