import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const customerId = searchParams.get('customerId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const where = {}
  if (date) where.date = { gte: new Date(date), lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
  if (customerId) where.customerId = parseInt(customerId)
  if (startDate && endDate) {
    where.date = { gte: new Date(startDate), lte: new Date(endDate + 'T23:59:59.999Z') }
  }

  const sales = await prisma.sale.findMany({
    where,
    include: { customer: true },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(sales)
}

export async function POST(request) {
  const body = await request.json()
  const sale = await prisma.sale.create({
    data: {
      customerId: parseInt(body.customerId),
      quantity: parseInt(body.quantity),
      unitPrice: parseFloat(body.unitPrice) || 0,
      total: parseFloat(body.total),
      date: body.date ? new Date(body.date) : new Date(),
    },
    include: { customer: true },
  })
  return NextResponse.json(sale)
}
