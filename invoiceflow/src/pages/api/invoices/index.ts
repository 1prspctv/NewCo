import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentUser, canCreateInvoice } from '@/lib/auth'
import { getInvoicesByUserId, createInvoice, getNextInvoiceNumber } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    const invoices = getInvoicesByUserId(user.id)
    return res.status(200).json({ invoices })
  }

  if (req.method === 'POST') {
    // Check if user can create invoice
    const canCreate = canCreateInvoice(user)
    if (!canCreate.allowed) {
      return res.status(403).json({ error: canCreate.reason })
    }

    const { from, to, items, dueDate, notes, currency = 'USD', tax = 0 } = req.body

    if (!from || !to || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.rate)
    }, 0)

    const taxAmount = subtotal * (tax / 100)
    const total = subtotal + taxAmount

    const invoice = createInvoice({
      id: uuidv4(),
      userId: user.id,
      invoiceNumber: getNextInvoiceNumber(user.id),
      createdAt: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      from,
      to,
      items: items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
      })),
      subtotal,
      tax: taxAmount,
      total,
      notes: notes || '',
      currency,
    })

    return res.status(201).json({ invoice })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
