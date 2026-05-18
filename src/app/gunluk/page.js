'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import PageTransition from '@/components/PageTransition'
import { useToast } from '@/components/Toast'
import { Package, Wallet, Receipt, Send, Plus, TrendingUp } from 'lucide-react'

export default function GunlukPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sale')
  const addToast = useToast()

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
    if (!sale.customerId || !sale.quantity) return addToast('Lütfen tüm alanları doldurun', 'error')
    const res = await fetch('/api/sales', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    })
    if (res.ok) {
      addToast('Satış başarıyla kaydedildi', 'success')
      setSale({ customerId: '', quantity: '', unitPrice: '85', total: '' })
    }
  }

  const submitExpense = async (e) => {
    e.preventDefault()
    if (!expense.description || !expense.amount) return addToast('Lütfen tüm alanları doldurun', 'error')
    const res = await fetch('/api/expenses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
    if (res.ok) {
      addToast('Gider başarıyla kaydedildi', 'success')
      setExpense({ description: '', amount: '', category: 'other' })
    }
  }

  const submitPayment = async (e) => {
    e.preventDefault()
    if (!payment.customerId || !payment.amount) return addToast('Lütfen tüm alanları doldurun', 'error')
    const res = await fetch('/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    })
    if (res.ok) {
      addToast('Tahsilat başarıyla kaydedildi', 'success')
      setPayment({ customerId: '', amount: '', note: '' })
    }
  }

  const tabs = [
    { id: 'sale', label: 'Satış', icon: Package, color: 'emerald' },
    { id: 'payment', label: 'Tahsilat', icon: Wallet, color: 'blue' },
    { id: 'expense', label: 'Gider', icon: Receipt, color: 'red' },
  ]

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-emerald-400/60 font-medium">Günlük İşlemler</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Günlük Giriş</h1>
          <p className="text-sm text-white/40 mt-2">Hızlı ve pratik veri girişi</p>
        </motion.div>

        <GlassCard className="mb-6 p-2">
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? `bg-${tab.color}-500/10 text-${tab.color}-400 border border-${tab.color}-500/20`
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </GlassCard>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'sale' && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Package size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Yeni Satış</h2>
                  <p className="text-xs text-white/40">Damacana satışı kaydet</p>
                </div>
              </div>
              <form onSubmit={submitSale} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Müşteri</label>
                  <select value={sale.customerId} onChange={e => setSale({...sale, customerId: e.target.value})} className="glass-select" required>
                    <option value="">Müşteri Seçin</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 mb-2 block">Adet</label>
                    <input type="number" placeholder="0" value={sale.quantity}
                      onChange={e => updateSaleTotal(e.target.value, sale.unitPrice)}
                      className="glass-input" required />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-2 block">Birim Fiyat (₺)</label>
                    <input type="number" step="0.01" value={sale.unitPrice}
                      onChange={e => updateSaleTotal(sale.quantity, e.target.value)}
                      className="glass-input" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Toplam Tutar</label>
                  <div className="glass-input !bg-emerald-500/5 !border-emerald-500/20 flex items-center justify-between">
                    <span className="text-white/60">₺</span>
                    <span className="text-lg font-bold text-emerald-400">{sale.total || '0'}</span>
                  </div>
                </div>
                <button type="submit" className="glass-btn w-full flex items-center justify-center gap-2">
                  <Send size={16} />
                  Satışı Kaydet
                </button>
              </form>
            </GlassCard>
          )}

          {activeTab === 'payment' && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Wallet size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Yeni Tahsilat</h2>
                  <p className="text-xs text-white/40">Müşteriden ödeme al</p>
                </div>
              </div>
              <form onSubmit={submitPayment} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Müşteri</label>
                  <select value={payment.customerId} onChange={e => setPayment({...payment, customerId: e.target.value})} className="glass-select" required>
                    <option value="">Müşteri Seçin</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Tutar (₺)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={payment.amount}
                    onChange={e => setPayment({...payment, amount: e.target.value})}
                    className="glass-input" required />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Not (İsteğe bağlı)</label>
                  <input type="text" placeholder="Açıklama ekleyin..." value={payment.note}
                    onChange={e => setPayment({...payment, note: e.target.value})}
                    className="glass-input" />
                </div>
                <button type="submit" className="glass-btn glass-btn-blue w-full flex items-center justify-center gap-2">
                  <Plus size={16} />
                  Tahsilatı Kaydet
                </button>
              </form>
            </GlassCard>
          )}

          {activeTab === 'expense' && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Receipt size={20} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Yeni Gider</h2>
                  <p className="text-xs text-white/40">Masraf ve harcama kaydet</p>
                </div>
              </div>
              <form onSubmit={submitExpense} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Açıklama</label>
                  <input type="text" placeholder="Gider açıklaması..." value={expense.description}
                    onChange={e => setExpense({...expense, description: e.target.value})}
                    className="glass-input" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 mb-2 block">Tutar (₺)</label>
                    <input type="number" step="0.01" placeholder="0.00" value={expense.amount}
                      onChange={e => setExpense({...expense, amount: e.target.value})}
                      className="glass-input" required />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-2 block">Kategori</label>
                    <select value={expense.category} onChange={e => setExpense({...expense, category: e.target.value})} className="glass-select">
                      <option value="other">Genel</option>
                      <option value="fuel">Yakıt</option>
                      <option value="food">Yemek</option>
                      <option value="maintenance">Araç Bakım</option>
                      <option value="rent">Kira</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="glass-btn glass-btn-red w-full flex items-center justify-center gap-2">
                  <Send size={16} />
                  Gideri Kaydet
                </button>
              </form>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}
