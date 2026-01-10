import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setUser(data.user))
      .catch(() => {})
  }, [])

  return (
    <Layout user={user}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Professional Invoices<br />in Seconds
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              The simplest way to bill your clients. Free to start, affordable to scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                Start Free
              </Link>
              <Link
                href="#pricing"
                className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Get Paid
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy to Create</h3>
              <p className="text-gray-600">
                Fill in your details, add items, and generate a professional invoice in under a minute.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Download as PDF</h3>
              <p className="text-gray-600">
                Export your invoices as professional PDF documents ready to send to clients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and never shared. We take your privacy seriously.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 invoices per month
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PDF downloads
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic templates
                </li>
              </ul>
              <Link href="/register" className="block text-center btn-secondary w-full">
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="card border-2 border-primary-600 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $5<span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Unlimited</strong> invoices
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PDF downloads
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium templates
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <Link href="/register" className="block text-center btn-primary w-full">
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Paid Faster?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of freelancers and small businesses using InvoiceFlow.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Create Your First Invoice
          </Link>
        </div>
      </div>
    </Layout>
  )
}
