'use client'

import { useState } from 'react'

export default function RaporlarPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState('monthly')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const loadReport = async () => {
    setLoading(true)
    const params = new URLSearchParams({ period, year })
    if (period === 'monthly') params.set('month', month)
    const res = await fetch(`/api/reports?${params}`)
    const d = await res.json()
    setData(d)
    setLoading(false)
  }

  const formatTL = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)
  const formatDate = (d) => new Date(d).toLocaleDateString('tr-TR')

  const catLabels = { fuel: 'Yakıt', food: 'Yemek', maintenance: 'Araç Bakım', rent: 'Kira', other: 'Genel' }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Raporlar</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm text-gray-500 block mb-1">Dönem</label>
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="monthly">Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Yıl</label>
          <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 w-24" />
        </div>
        {period === 'monthly' && (
          <div>
            <label className="text-sm text-gray-500 block mb-1">Ay</label>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>
              ))}
            </select>
          </div>
        )}
        <button onClick={loadReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
          Raporu Göster
        </button>
      </div>

      {loading && <div className="text-center py-10 text-gray-500">Yükleniyor...</div>}

      {data && !loading && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Toplam Satış</div>
              <div className="text-xl font-bold text-green-600">{formatTL(data.summary.totalSales)}</div>
              <div className="text-sm text-gray-500">{data.summary.totalQuantity} adet</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Toplam Gider</div>
              <div className="text-xl font-bold text-red-600">{formatTL(data.summary.totalExpenses)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Toplam Tahsilat</div>
              <div className="text-xl font-bold text-blue-600">{formatTL(data.summary.totalPayments)}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500 mb-1">Net Kâr</div>
              <div className={`text-xl font-bold ${data.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatTL(data.summary.netProfit)}
              </div>
            </div>
          </div>

          {data.sales.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h2 className="text-lg font-bold mb-4">Satış Listesi</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th className="text-left py-2">Tarih</th>
                      <th className="text-left py-2">Müşteri</th>
                      <th className="text-right py-2">Adet</th>
                      <th className="text-right py-2">Birim Fiyat</th>
                      <th className="text-right py-2">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sales.map(s => (
                      <tr key={s.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm">{formatDate(s.date)}</td>
                        <td className="py-2 text-sm">{s.customer?.name || '-'}</td>
                        <td className="py-2 text-sm text-right">{s.quantity}</td>
                        <td className="py-2 text-sm text-right">{formatTL(s.unitPrice)}</td>
                        <td className="py-2 text-sm text-right">{formatTL(s.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.expenses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h2 className="text-lg font-bold mb-4">Gider Listesi</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th className="text-left py-2">Tarih</th>
                      <th className="text-left py-2">Açıklama</th>
                      <th className="text-left py-2">Kategori</th>
                      <th className="text-right py-2">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.expenses.map(e => (
                      <tr key={e.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm">{formatDate(e.date)}</td>
                        <td className="py-2 text-sm">{e.description}</td>
                        <td className="py-2 text-sm">{catLabels[e.category] || e.category}</td>
                        <td className="py-2 text-sm text-right">{formatTL(e.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.payments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h2 className="text-lg font-bold mb-4">Tahsilat Listesi</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th className="text-left py-2">Tarih</th>
                      <th className="text-left py-2">Müşteri</th>
                      <th className="text-right py-2">Tutar</th>
                      <th className="text-left py-2">Not</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map(p => (
                      <tr key={p.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm">{formatDate(p.date)}</td>
                        <td className="py-2 text-sm">{p.customer?.name || '-'}</td>
                        <td className="py-2 text-sm text-right">{formatTL(p.amount)}</td>
                        <td className="py-2 text-sm text-gray-500">{p.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
