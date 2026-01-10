import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`

  const checkoutUrl = await createCheckoutSession(
    user.id,
    user.email,
    `${baseUrl}/dashboard?upgraded=true`,
    `${baseUrl}/pricing`
  )

  if (!checkoutUrl) {
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }

  return res.status(200).json({ url: checkoutUrl })
}
