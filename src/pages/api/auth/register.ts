import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { serialize } from 'cookie'
import { createUser, getUserByEmail } from '@/lib/db'
import { hashPassword, createToken } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Create user
    let hashedPassword
    try {
      hashedPassword = await hashPassword(password)
    } catch (hashError) {
      console.error('Password hashing error:', hashError)
      return res.status(500).json({ error: 'Failed to hash password' })
    }

    let user
    try {
      user = createUser({
        id: uuidv4(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        createdAt: new Date().toISOString(),
        plan: 'free',
        invoiceCount: 0,
      })
    } catch (createError) {
      console.error('User creation error:', createError)
      return res.status(500).json({ error: 'Failed to create user' })
    }

    // Create token and set cookie
    let token
    try {
      token = createToken(user.id)
    } catch (tokenError) {
      console.error('Token creation error:', tokenError)
      return res.status(500).json({ error: 'Failed to create token' })
    }

    try {
      res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      }))
    } catch (cookieError) {
      console.error('Cookie error:', cookieError)
      return res.status(500).json({ error: 'Failed to set cookie' })
    }

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error', details: String(error) })
  }
}
