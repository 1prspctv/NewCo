import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
  user?: {
    name: string
    email: string
    plan: string
  } | null
}

export default function Layout({ children, user }: LayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">InvoiceThis</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link href="/invoices/new" className="btn-primary">
                    New Invoice
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{user.name}</span>
                    {user.plan === 'pro' && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">PRO</span>
                    )}
                  </div>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} InvoiceThis. Simple invoicing for everyone.
          </div>
        </div>
      </footer>
    </div>
  )
}
