import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'monthly'
  const year = parseInt(searchParams.get('year')) || new Date().getFullYear()
  const month = parseInt(searchParams.get('month'))

  let groupBy, startDate, endDate

  if (period === 'yearly') {
    startDate = new Date(year, 0, 1)
    endDate = new Date(year, 11, 31)
  } else if (period === 'monthly' && month) {
    startDate = new Date(year, month - 1, 1)
    endDate = new Date(year, month, 0)
  } else {
    startDate = new Date(year, 0, 1)
    endDate = new Date(year, 11, 31)
  }
  endDate.setHours(23, 59, 59, 999)

  const sales = await prisma.sale.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    include: { customer: true },
    orderBy: { date: 'desc' },
  })

  const expenses = await prisma.expense.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    orderBy: { date: 'desc' },
  })

  const payments = await prisma.payment.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    include: { customer: true },
    orderBy: { date: 'desc' },
  })

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0)

  return NextResponse.json({
    period,
    year,
    month,
    sales,
    expenses,
    payments,
    summary: {
      totalSales,
      totalQuantity,
      totalExpenses,
      totalPayments,
      netProfit: totalSales - totalExpenses,
    },
  })
}
