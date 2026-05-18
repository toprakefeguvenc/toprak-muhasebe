'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import PageTransition from '@/components/PageTransition'
import { useToast } from '@/components/Toast'
import Link from 'next/link'
import { Users, Plus, Phone, MapPin, ChevronRight, Search } from 'lucide-react'

export default function MusterilerPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [search, setSearch] = useState('')
  const addToast = useToast()

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
    setName(''); setPhone(''); setAddress(''); setShowForm(false)
    addToast('Müşteri başarıyla eklendi', 'success')
    loadCustomers()
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  )

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-blue-400/60 font-medium">Müşteri Yönetimi</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">Müşteriler</h1>
              <p className="text-sm text-white/40 mt-2">{customers.length} müşteri kayıtlı</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="glass-btn flex items-center gap-2">
              <Plus size={16} />
              <span className="hidden sm:inline">Yeni Müşteri</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ height: showForm ? 'auto' : 0, opacity: showForm ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden mb-6"
        >
          <GlassCard>
            <form onSubmit={addCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Müşteri Adı</label>
                  <input type="text" placeholder="Ad Soyad" value={name}
                    onChange={e => setName(e.target.value)} className="glass-input" required />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Telefon</label>
                  <input type="text" placeholder="05XX XXX XX XX" value={phone}
                    onChange={e => setPhone(e.target.value)} className="glass-input" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block">Adres</label>
                  <input type="text" placeholder="Adres girin..." value={address}
                    onChange={e => setAddress(e.target.value)} className="glass-input" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white/70 transition-colors">İptal</button>
                <button type="submit" className="glass-btn flex items-center gap-2">
                  <Plus size={16} />
                  Müşteri Ekle
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" placeholder="Müşteri ara..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-11" />
        </div>

        <GlassCard className="overflow-hidden !p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl animate-shimmer" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/30 text-sm">Henüz müşteri bulunamadı</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link href={`/musteriler/${c.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-all duration-200 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white/80 group-hover:text-white transition-colors">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/30">
                        {c.phone && <span className="flex items-center gap-1"><Phone size={11} />{c.phone}</span>}
                        {c.address && <span className="flex items-center gap-1 truncate"><MapPin size={11} />{c.address}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-white/30">{c._count?.sales || 0} satış</span>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  )
}
