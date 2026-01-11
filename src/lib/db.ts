// Simple file-based database for easy deployment (no external DB needed)
// In production, this uses Vercel KV or similar, but works locally with JSON files

import fs from 'fs'
import path from 'path'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  plan: 'free' | 'pro'
  stripeCustomerId?: string
  invoiceCount: number
}

interface Invoice {
  id: string
  userId: string
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

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o777 })
  }
  // Ensure directory is writable
  try {
    fs.accessSync(DATA_DIR, fs.constants.W_OK)
  } catch {
    try {
      fs.chmodSync(DATA_DIR, 0o777)
    } catch (error) {
      console.error(`Warning: Could not set write permissions on ${DATA_DIR}:`, error)
    }
  }
}

function readData<T>(filename: string): T[] {
  ensureDataDir()
  const filepath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filepath)) {
    return []
  }
  try {
    const data = fs.readFileSync(filepath, 'utf-8')
    if (!data || data.trim() === '') {
      return []
    }
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

function writeData<T>(filename: string, data: T[]) {
  try {
    ensureDataDir()
    const filepath = path.join(DATA_DIR, filename)
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error)
    throw error
  }
}

// User operations
export function getUsers(): User[] {
  return readData<User>('users.json')
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(user: User): User {
  const users = getUsers()
  users.push(user)
  writeData('users.json', users)
  return user
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers()
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return undefined
  users[index] = { ...users[index], ...updates }
  writeData('users.json', users)
  return users[index]
}

// Invoice operations
export function getInvoices(): Invoice[] {
  return readData<Invoice>('invoices.json')
}

export function getInvoicesByUserId(userId: string): Invoice[] {
  return getInvoices().filter(i => i.userId === userId)
}

export function getInvoiceById(id: string): Invoice | undefined {
  return getInvoices().find(i => i.id === id)
}

export function createInvoice(invoice: Invoice): Invoice {
  const invoices = getInvoices()
  invoices.push(invoice)
  writeData('invoices.json', invoices)

  // Increment user's invoice count
  const user = getUserById(invoice.userId)
  if (user) {
    updateUser(user.id, { invoiceCount: user.invoiceCount + 1 })
  }

  return invoice
}

export function updateInvoice(id: string, updates: Partial<Invoice>): Invoice | undefined {
  const invoices = getInvoices()
  const index = invoices.findIndex(i => i.id === id)
  if (index === -1) return undefined
  invoices[index] = { ...invoices[index], ...updates }
  writeData('invoices.json', invoices)
  return invoices[index]
}

export function deleteInvoice(id: string): boolean {
  const invoices = getInvoices()
  const index = invoices.findIndex(i => i.id === id)
  if (index === -1) return false
  invoices.splice(index, 1)
  writeData('invoices.json', invoices)
  return true
}

export function getNextInvoiceNumber(userId: string): string {
  const userInvoices = getInvoicesByUserId(userId)
  const nextNum = userInvoices.length + 1
  return `INV-${String(nextNum).padStart(4, '0')}`
}

export type { User, Invoice }
