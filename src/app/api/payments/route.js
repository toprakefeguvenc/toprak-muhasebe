import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const where = {}
  if (startDate && endDate) {
    where.date = { gte: new Date(startDate), lte: new Date(endDate + 'T23:59:59.999Z') }
  }

  const payments = await prisma.payment.findMany({
    where,
    include: { customer: true },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(payments)
}

export async function POST(request) {
  const body = await request.json()
  const payment = await prisma.payment.create({
    data: {
      customerId: parseInt(body.customerId),
      amount: parseFloat(body.amount),
      note: body.note || null,
      date: body.date ? new Date(body.date) : new Date(),
    },
    include: { customer: true },
  })
  return NextResponse.json(payment)
}
