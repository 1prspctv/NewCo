import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import InvoiceForm from '@/components/InvoiceForm'

interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
}

export default function NewInvoice() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) {
          router.push('/login')
          return
        }
        setUser(data.user)
        setLoading(false)
      })
  }, [router])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
          <p className="text-gray-600 mt-1">Fill in the details below to generate your invoice</p>
        </div>
        <InvoiceForm />
      </div>
    </Layout>
  )
}
