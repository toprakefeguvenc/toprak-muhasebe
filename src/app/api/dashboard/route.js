import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const todaySales = await prisma.sale.aggregate({
    where: { date: { gte: today, lt: tomorrow } },
    _sum: { total: true, quantity: true },
  })

  const todayExpenses = await prisma.expense.aggregate({
    where: { date: { gte: today, lt: tomorrow } },
    _sum: { amount: true },
  })

  const todayPayments = await prisma.payment.aggregate({
    where: { date: { gte: today, lt: tomorrow } },
    _sum: { amount: true },
  })

  const monthSales = await prisma.sale.aggregate({
    where: { date: { gte: startOfMonth } },
    _sum: { total: true, quantity: true },
  })

  const monthExpenses = await prisma.expense.aggregate({
    where: { date: { gte: startOfMonth } },
    _sum: { amount: true },
  })

  const monthPayments = await prisma.payment.aggregate({
    where: { date: { gte: startOfMonth } },
    _sum: { amount: true },
  })

  const totalCustomers = await prisma.customer.count()

  return NextResponse.json({
    today: {
      salesTotal: todaySales._sum.total || 0,
      salesCount: todaySales._sum.quantity || 0,
      expensesTotal: todayExpenses._sum.amount || 0,
      paymentsTotal: todayPayments._sum.amount || 0,
    },
    month: {
      salesTotal: monthSales._sum.total || 0,
      salesCount: monthSales._sum.quantity || 0,
      expensesTotal: monthExpenses._sum.amount || 0,
      paymentsTotal: monthPayments._sum.amount || 0,
    },
    totalCustomers,
  })
}
