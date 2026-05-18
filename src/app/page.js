'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>

  const formatTL = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Genel Durum</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Bugün Satış</div>
          <div className="text-2xl font-bold text-green-600">{data.today.salesCount} adet</div>
          <div className="text-lg text-green-500">{formatTL(data.today.salesTotal)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Bugün Tahsilat</div>
          <div className="text-2xl font-bold text-blue-600">{formatTL(data.today.paymentsTotal)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Bugün Gider</div>
          <div className="text-2xl font-bold text-red-600">{formatTL(data.today.expensesTotal)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Toplam Müşteri</div>
          <div className="text-2xl font-bold text-purple-600">{data.totalCustomers}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Bu Ay</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Toplam Satış</div>
          <div className="text-xl font-bold">{data.month.salesCount} adet</div>
          <div className="text-lg">{formatTL(data.month.salesTotal)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Toplam Tahsilat</div>
          <div className="text-xl font-bold text-blue-600">{formatTL(data.month.paymentsTotal)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Toplam Gider</div>
          <div className="text-xl font-bold text-red-600">{formatTL(data.month.expensesTotal)}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/gunluk" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
          Günlük Giriş Yap
        </Link>
        <Link href="/raporlar" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition">
          Raporları Görüntüle
        </Link>
      </div>
    </div>
  )
}
