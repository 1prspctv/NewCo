import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'cookie'
import { getUserById, User } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'invoicethis-secret-key-change-in-production'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const cookies = req.headers.cookie
  if (!cookies) return null

  const parsed = parse(cookies)
  return parsed.token || null
}

export function getCurrentUser(req: NextApiRequest): User | null {
  const token = getTokenFromRequest(req)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = getUserById(payload.userId)
  return user || null
}

export function requireAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    return handler(req, res, user)
  }
}

// Check if user can create more invoices (free plan limit)
export function canCreateInvoice(user: User): { allowed: boolean; reason?: string } {
  if (user.plan === 'pro') {
    return { allowed: true }
  }

  // Free plan: 3 invoices per month
  const FREE_LIMIT = 3
  if (user.invoiceCount >= FREE_LIMIT) {
    return {
      allowed: false,
      reason: `Free plan limit reached (${FREE_LIMIT} invoices). Upgrade to Pro for unlimited invoices.`
    }
  }

  return { allowed: true }
}
