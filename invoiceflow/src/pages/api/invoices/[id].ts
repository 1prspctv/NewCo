import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { getInvoiceById, updateInvoice, deleteInvoice } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid invoice ID' })
  }

  const invoice = getInvoiceById(id)

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' })
  }

  if (invoice.userId !== user.id) {
    return res.status(403).json({ error: 'Access denied' })
  }

  if (req.method === 'GET') {
    return res.status(200).json({ invoice })
  }

  if (req.method === 'PUT') {
    const updates = req.body

    // Recalculate totals if items changed
    if (updates.items) {
      const subtotal = updates.items.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.rate)
      }, 0)

      const taxPercent = updates.taxPercent ?? 0
      const taxAmount = subtotal * (taxPercent / 100)

      updates.subtotal = subtotal
      updates.tax = taxAmount
      updates.total = subtotal + taxAmount
      updates.items = updates.items.map((item: any) => ({
        ...item,
        amount: item.quantity * item.rate,
      }))
    }

    const updatedInvoice = updateInvoice(id, updates)
    return res.status(200).json({ invoice: updatedInvoice })
  }

  if (req.method === 'DELETE') {
    deleteInvoice(id)
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
