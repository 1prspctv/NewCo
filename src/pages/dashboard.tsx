import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'

interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
  invoiceCount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  createdAt: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid'
  to: { name: string }
  total: number
  currency: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(res => res.ok ? res.json() : null),
      fetch('/api/invoices').then(res => res.ok ? res.json() : null),
    ]).then(([userData, invoiceData]) => {
      if (!userData) {
        router.push('/login')
        return
      }
      setUser(userData.user)
      setInvoices(invoiceData?.invoices || [])
      setLoading(false)
    })
  }, [router])

  const handleUpgrade = async () => {
    const response = await fetch('/api/stripe/create-checkout', { method: 'POST' })
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
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

  const FREE_LIMIT = 3
  const remainingInvoices = user?.plan === 'pro' ? 'Unlimited' : Math.max(0, FREE_LIMIT - (user?.invoiceCount || 0))

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
            <p className="text-gray-600 mt-1">
              {user?.plan === 'pro' ? (
                <span className="text-primary-600">Pro Plan - Unlimited Invoices</span>
              ) : (
                <>Free Plan - {remainingInvoices} invoices remaining this month</>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            {user?.plan === 'free' && (
              <button onClick={handleUpgrade} className="btn-secondary">
                Upgrade to Pro
              </button>
            )}
            <Link href="/invoices/new" className="btn-primary">
              New Invoice
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-3xl font-bold text-green-600">
                  {invoices.filter(i => i.status === 'paid').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(
                    invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
                    'USD'
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-600 mb-6">Create your first invoice to get started</p>
              <Link href="/invoices/new" className="btn-primary">
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <Link href={`/invoices/${invoice.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{invoice.to.name}</td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(invoice.createdAt)}</td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(invoice.dueDate)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
