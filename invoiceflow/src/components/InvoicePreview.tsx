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

interface InvoicePreviewProps {
  invoice: Invoice
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto" id="invoice-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-600 mt-1">{invoice.invoiceNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[invoice.status]}`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </div>

      {/* From / To */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">From</h3>
          <p className="font-semibold text-gray-900">{invoice.from.name}</p>
          <p className="text-gray-600">{invoice.from.email}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.from.address}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Bill To</h3>
          <p className="font-semibold text-gray-900">{invoice.to.name}</p>
          <p className="text-gray-600">{invoice.to.email}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.to.address}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Invoice Date</h3>
          <p className="text-gray-900">{formatDate(invoice.createdAt)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Due Date</h3>
          <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Description</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Qty</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Rate</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 text-gray-900">{item.description}</td>
                <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                <td className="py-4 text-right text-gray-900 font-medium">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.tax > 0 && (
            <div className="flex justify-between py-2 text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t-2 border-gray-900 text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
