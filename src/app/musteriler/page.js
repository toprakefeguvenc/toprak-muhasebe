'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MusterilerPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const loadCustomers = () => {
    fetch('/api/customers').then(r => r.json()).then(d => { setCustomers(d); setLoading(false) })
  }

  useEffect(loadCustomers, [])

  const addCustomer = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await fetch('/api/customers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address }),
    })
    setName(''); setPhone(''); setAddress('')
    loadCustomers()
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Yükleniyor...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Müşteriler</h1>

      <form onSubmit={addCustomer} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-gray-500 block mb-1">Müşteri Adı</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-sm text-gray-500 block mb-1">Telefon</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-gray-500 block mb-1">Adres</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
          Ekle
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Müşteri</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Telefon</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Adres</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Satış Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/musteriler/${c.id}`} className="text-blue-600 hover:underline font-medium">{c.name}</Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.phone || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{c.address || '-'}</td>
                <td className="px-4 py-3 text-center text-gray-600">{c._count?.sales || 0}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="4" className="text-center py-8 text-gray-400">Henüz müşteri eklenmemiş.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
