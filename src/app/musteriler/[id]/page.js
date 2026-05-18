'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'

export default function MusteriDetayPage({ params }) {
  const { id } = use(params)
  const [customer, setCustomer] = useState(null)
  const [sales, setSales] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(r => r.json()),
      fetch(`/api/sales?customerId=${id}`).then(r => r.json()),
      fetch(`/api/payments?customerId=${id}`).then(r => r.json()),
    ]).then(([customers, salesData, paymentsData]) => {
      const c = customers.find(x => x.id === parseInt(id))
      setCustomer(c)
      setSales(salesData)
      setPayments(paymentsData)
      setLoading(false)
    })
  }, [id])

  const formatTL = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)
  const formatDate = (d) => new Date(d).toLocaleDateString('tr-TR')

  if (loading) return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>
  if (!customer) return <div className="text-center py-20 text-gray-500">Müşteri bulunamadı.</div>

  const totalSales = sales.reduce((s, x) => s + x.total, 0)
  const totalPayments = payments.reduce((s, x) => s + x.amount, 0)
  const balance = totalSales - totalPayments

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{customer.name}</h1>
      <p className="text-gray-500 mb-6">{customer.phone && `📞 ${customer.phone}`} {customer.address && `📍 ${customer.address}`}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Toplam Satış</div>
          <div className="text-xl font-bold text-green-600">{formatTL(totalSales)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Toplam Tahsilat</div>
          <div className="text-xl font-bold text-blue-600">{formatTL(totalPayments)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Bakiye</div>
          <div className={`text-xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {balance > 0 ? `${formatTL(balance)} (Borçlu)` : formatTL(balance)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-bold mb-4">Satış Geçmişi</h2>
          {sales.length === 0 ? (
            <p className="text-gray-400">Henüz satış yok.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="text-left py-2">Tarih</th>
                  <th className="text-right py-2">Adet</th>
                  <th className="text-right py-2">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-2 text-sm">{formatDate(s.date)}</td>
                    <td className="py-2 text-sm text-right">{s.quantity}</td>
                    <td className="py-2 text-sm text-right">{formatTL(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-bold mb-4">Tahsilat Geçmişi</h2>
          {payments.length === 0 ? (
            <p className="text-gray-400">Henüz tahsilat yok.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="text-left py-2">Tarih</th>
                  <th className="text-right py-2">Tutar</th>
                  <th className="text-left py-2">Not</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-2 text-sm">{formatDate(p.date)}</td>
                    <td className="py-2 text-sm text-right">{formatTL(p.amount)}</td>
                    <td className="py-2 text-sm text-gray-500">{p.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
