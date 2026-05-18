'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import PageTransition from '@/components/PageTransition'
import { formatTL, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, TrendingUp, Wallet, AlertCircle } from 'lucide-react'

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

  const totalSales = sales.reduce((s, x) => s + x.total, 0)
  const totalPayments = payments.reduce((s, x) => s + x.amount, 0)
  const balance = totalSales - totalPayments

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Link href="/musteriler" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors mb-4">
            <ArrowLeft size={14} />
            Müşterilere Dön
          </Link>

          {!loading && customer && (
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] uppercase tracking-[0.15em] text-emerald-400/60 font-medium">Müşteri Detayı</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gradient">{customer.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                  {customer.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{customer.phone}</span>}
                  {customer.address && <span className="flex items-center gap-1.5"><MapPin size={12} />{customer.address}</span>}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl animate-shimmer" />)}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <GlassCard delay={0.2}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp size={16} className="text-emerald-400" />
                  </div>
                  <span className="text-xs text-white/40">Toplam Satış</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  <AnimatedCounter value={totalSales} prefix="₺" />
                </div>
              </GlassCard>

              <GlassCard delay={0.3}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Wallet size={16} className="text-blue-400" />
                  </div>
                  <span className="text-xs text-white/40">Toplam Tahsilat</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  <AnimatedCounter value={totalPayments} prefix="₺" />
                </div>
              </GlassCard>

              <GlassCard delay={0.4}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${balance > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} flex items-center justify-center`}>
                    <AlertCircle size={16} className={balance > 0 ? 'text-red-400' : 'text-emerald-400'} />
                  </div>
                  <span className="text-xs text-white/40">Bakiye</span>
                </div>
                <div className={`text-2xl font-bold ${balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  <AnimatedCounter value={balance} prefix="₺" />
                </div>
                {balance > 0 && <div className="text-xs text-red-400/60 mt-1">Müşteri borçlu</div>}
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard delay={0.5}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1 font-medium">Satış Geçmişi</div>
                    <div className="text-sm text-white/60">{sales.length} işlem</div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp size={16} className="text-emerald-400" />
                  </div>
                </div>
                {sales.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/20 text-sm">Henüz satış kaydı yok</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sales.map(s => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div>
                          <div className="text-xs text-white/40">{formatDate(s.date)}</div>
                          <div className="text-sm text-white/70">{s.quantity} adet</div>
                        </div>
                        <div className="text-sm font-medium text-emerald-400">{formatTL(s.total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              <GlassCard delay={0.6}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1 font-medium">Tahsilat Geçmişi</div>
                    <div className="text-sm text-white/60">{payments.length} işlem</div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Wallet size={16} className="text-blue-400" />
                  </div>
                </div>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/20 text-sm">Henüz tahsilat kaydı yok</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.map(p => (
                      <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div>
                          <div className="text-xs text-white/40">{formatDate(p.date)}</div>
                          {p.note && <div className="text-xs text-white/20 mt-0.5">{p.note}</div>}
                        </div>
                        <div className="text-sm font-medium text-blue-400">{formatTL(p.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}
