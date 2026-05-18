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

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(expenses)
}

export async function POST(request) {
  const body = await request.json()
  const expense = await prisma.expense.create({
    data: {
      description: body.description,
      amount: parseFloat(body.amount),
      category: body.category || 'other',
      date: body.date ? new Date(body.date) : new Date(),
    },
  })
  return NextResponse.json(expense)
}
