'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import PageTransition from '@/components/PageTransition'
import { formatTL } from '@/lib/utils'
import { Wallet, TrendingUp, Receipt, Users, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-emerald-400/60 font-medium">Finansal Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            Genel Durum
          </h1>
          <p className="text-sm text-white/40 mt-2">Gerçek zamanlı finansal görünümünüz</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Bugün Satış', icon: TrendingUp, color: 'emerald', value: data?.today?.salesTotal, suffix: '', prefix: '₺', sub: `${data?.today?.salesCount || 0} adet`, delay: 0 },
            { label: 'Bugün Tahsilat', icon: Wallet, color: 'blue', value: data?.today?.paymentsTotal, suffix: '', prefix: '₺', sub: null, delay: 0.1 },
            { label: 'Bugün Gider', icon: Receipt, color: 'red', value: data?.today?.expensesTotal, suffix: '', prefix: '₺', sub: null, delay: 0.2 },
            { label: 'Toplam Müşteri', icon: Users, color: 'purple', value: data?.totalCustomers, suffix: '', prefix: '', sub: null, delay: 0.3 },
          ].map((item, i) => (
            <GlassCard key={i} delay={item.delay} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-${item.color}-500/5 blur-2xl`} />
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center`}>
                  <item.icon size={18} className={`text-${item.color}-400`} />
                </div>
                <ArrowUpRight size={14} className="text-white/20" />
              </div>
              <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-medium">{item.label}</div>
              {loading ? (
                <div className="h-8 w-24 rounded-lg animate-shimmer" />
              ) : (
                <div className={`text-2xl font-bold ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'blue' ? 'text-blue-400' : item.color === 'red' ? 'text-red-400' : 'text-purple-400'}`}>
                  <AnimatedCounter value={item.value || 0} prefix={item.prefix} suffix={item.suffix} decimals={item.value > 0 ? 0 : 0} />
                  {!item.prefix && !item.suffix && item.value}
                </div>
              )}
              {item.sub && <div className="text-xs text-white/30 mt-1">{item.sub}</div>}
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard delay={0.4} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1 font-medium">Bu Ay</div>
                <h2 className="text-xl font-bold text-white">Aylık Performans</h2>
              </div>
              <div className="flex gap-2">
                {['Satış', 'Gider', 'Net'].map((label, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : i === 1 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Toplam Satış', value: data?.month?.salesTotal, color: 'emerald', icon: TrendingUp },
                { label: 'Toplam Gider', value: data?.month?.expensesTotal, color: 'red', icon: Receipt },
                { label: 'Net Durum', value: (data?.month?.salesTotal || 0) - (data?.month?.expensesTotal || 0), color: 'blue', icon: DollarSign },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon size={14} className={`text-${item.color}-400`} />
                    <span className="text-xs text-white/40">{item.label}</span>
                  </div>
                  {loading ? (
                    <div className="h-7 w-20 rounded-lg animate-shimmer" />
                  ) : (
                    <div className={`text-xl font-bold text-${item.color}-400`}>{formatTL(item.value || 0)}</div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.5}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-[11px] uppercase tracking-widest text-white/40 font-medium">Hızlı İşlemler</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Günlük Giriş', href: '/gunluk', color: 'emerald' },
                { label: 'Müşteri Ekle', href: '/musteriler', color: 'blue' },
                { label: 'Raporlar', href: '/raporlar', color: 'purple' },
              ].map((item, i) => (
                <a key={i} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl bg-${item.color}-500/5 border border-${item.color}-500/10 hover:bg-${item.color}-500/10 transition-all duration-300`}
                  >
                    <span className="text-sm text-white/70">{item.label}</span>
                    <ArrowUpRight size={14} className={`text-${item.color}-400`} />
                  </motion.div>
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-xs text-white/30 mb-2">Bu Ay Satılan Damacana</div>
              {loading ? (
                <div className="h-10 w-full rounded-lg animate-shimmer" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    <AnimatedCounter value={data?.month?.salesCount || 0} />
                  </span>
                  <span className="text-xs text-white/30">adet</span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard delay={0.6}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1 font-medium">Tahsilat</div>
                <div className="text-lg font-bold text-blue-400">
                  {loading ? <div className="h-6 w-20 animate-shimmer rounded-lg" /> : formatTL(data?.month?.paymentsTotal || 0)}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Wallet size={22} className="text-blue-400" />
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '68%' }}
                transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
              />
            </div>
          </GlassCard>

          <GlassCard delay={0.7}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1 font-medium">Gider</div>
                <div className="text-lg font-bold text-red-400">
                  {loading ? <div className="h-6 w-20 animate-shimmer rounded-lg" /> : formatTL(data?.month?.expensesTotal || 0)}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Receipt size={22} className="text-red-400" />
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '32%' }}
                transition={{ duration: 1.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  )
}
