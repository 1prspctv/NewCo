import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import InvoicePreview from '@/components/InvoicePreview'

interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
}

interface Invoice {
  id: string
  invoiceNumber: string
  createdAt: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid'
  from: {
    name: string
    email: string
    address: string
  }
  to: {
    name: string
    email: string
    address: string
  }
  items: Array<{
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  subtotal: number
  tax: number
  total: number
  notes: string
  currency: string
}

export default function ViewInvoice() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<User | null>(null)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return

    Promise.all([
      fetch('/api/auth/me').then(res => res.ok ? res.json() : null),
      fetch(`/api/invoices/${id}`).then(res => res.ok ? res.json() : null),
    ]).then(([userData, invoiceData]) => {
      if (!userData) {
        router.push('/login')
        return
      }
      setUser(userData.user)
      setInvoice(invoiceData?.invoice || null)
      setLoading(false)
    })
  }, [id, router])

  const updateStatus = async (status: 'draft' | 'sent' | 'paid') => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        const data = await response.json()
        setInvoice(data.invoice)
      }
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    const response = await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    if (response.ok) {
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  if (!invoice) {
    return (
      <Layout user={user}>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
          <p className="text-gray-600 mb-8">The invoice you're looking for doesn't exist.</p>
          <Link href="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user}>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-preview, #invoice-preview * {
            visibility: visible;
          }
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <select
              className="input-field py-2"
              value={invoice.status}
              onChange={(e) => updateStatus(e.target.value as any)}
              disabled={updating}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
            <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / PDF
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:text-red-700 px-4 py-2">
              Delete
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div ref={printRef}>
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </Layout>
  )
}
