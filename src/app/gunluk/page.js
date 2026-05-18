'use client'

import { useState, useEffect } from 'react'

export default function GunlukPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [sale, setSale] = useState({ customerId: '', quantity: '', unitPrice: '85', total: '' })
  const [expense, setExpense] = useState({ description: '', amount: '', category: 'other' })
  const [payment, setPayment] = useState({ customerId: '', amount: '', note: '' })

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(d => { setCustomers(d); setLoading(false) })
  }, [])

  const updateSaleTotal = (qty, price) => {
    const total = (parseInt(qty) || 0) * (parseFloat(price) || 0)
    setSale(prev => ({ ...prev, quantity: qty, unitPrice: price, total: total.toString() }))
  }

  const submitSale = async (e) => {
    e.preventDefault()
    if (!sale.customerId || !sale.quantity) return
    const res = await fetch('/api/sales', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    })
    if (res.ok) {
      setMessage('Satış kaydedildi!')
      setSale({ customerId: '', quantity: '', unitPrice: '85', total: '' })
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const submitExpense = async (e) => {
    e.preventDefault()
    if (!expense.description || !expense.amount) return
    const res = await fetch('/api/expenses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
    if (res.ok) {
      setMessage('Gider kaydedildi!')
      setExpense({ description: '', amount: '', category: 'other' })
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const submitPayment = async (e) => {
    e.preventDefault()
    if (!payment.customerId || !payment.amount) return
    const res = await fetch('/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    })
    if (res.ok) {
      setMessage('Tahsilat kaydedildi!')
      setPayment({ customerId: '', amount: '', note: '' })
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Günlük Giriş</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-bold mb-4 text-green-700">Satış Ekle</h2>
          <form onSubmit={submitSale} className="space-y-3">
            <select value={sale.customerId} onChange={e => setSale({...sale, customerId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
              <option value="">Müşteri Seç</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Adet" value={sale.quantity}
              onChange={e => updateSaleTotal(e.target.value, sale.unitPrice)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            <input type="number" step="0.01" placeholder="Birim Fiyat (TL)" value={sale.unitPrice}
              onChange={e => updateSaleTotal(sale.quantity, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            <input type="text" placeholder="Toplam TL" value={sale.total} readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2" />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition">
              Satışı Kaydet
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-bold mb-4 text-blue-700">Tahsilat Ekle</h2>
          <form onSubmit={submitPayment} className="space-y-3">
            <select value={payment.customerId} onChange={e => setPayment({...payment, customerId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
              <option value="">Müşteri Seç</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Tutar (TL)" value={payment.amount}
              onChange={e => setPayment({...payment, amount: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            <input type="text" placeholder="Not (zorunlu değil)" value={payment.note}
              onChange={e => setPayment({...payment, note: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
              Tahsilatı Kaydet
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-bold mb-4 text-red-700">Gider Ekle</h2>
          <form onSubmit={submitExpense} className="space-y-3">
            <input type="text" placeholder="Gider açıklaması" value={expense.description}
              onChange={e => setExpense({...expense, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            <input type="number" step="0.01" placeholder="Tutar (TL)" value={expense.amount}
              onChange={e => setExpense({...expense, amount: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            <select value={expense.category} onChange={e => setExpense({...expense, category: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="other">Genel</option>
              <option value="fuel">Yakıt</option>
              <option value="food">Yemek</option>
              <option value="maintenance">Araç Bakım</option>
              <option value="rent">Kira</option>
            </select>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition">
              Gideri Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
