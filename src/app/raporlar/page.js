'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import PageTransition from '@/components/PageTransition'
import { formatTL, formatDate } from '@/lib/utils'
import { BarChart3, TrendingUp, Receipt, Wallet, DollarSign, Calendar, Search, Download, Filter } from 'lucide-react'

export default function RaporlarPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState('monthly')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const catLabels = { fuel: 'Yakıt', food: 'Yemek', maintenance: 'Araç Bakım', rent: 'Kira', other: 'Genel' }

  const loadReport = async () => {
    setLoading(true)
    const params = new URLSearchParams({ period, year })
    if (period === 'monthly') params.set('month', month)
    const res = await fetch(`/api/reports?${params}`)
    const d = await res.json()
    setData(d)
    setLoading(false)
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-purple-400/60 font-medium">Analitik Raporlar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Raporlar</h1>
          <p className="text-sm text-white/40 mt-2">Detaylı finansal analiz ve görselleştirme</p>
        </motion.div>

        <GlassCard className="mb-8">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs text-white/40 mb-2 block flex items-center gap-1.5">
                <Filter size={12} /> Dönem
              </label>
              <select value={period} onChange={e => setPeriod(e.target.value)} className="glass-select">
                <option value="monthly">Aylık</option>
                <option value="yearly">Yıllık</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Yıl</label>
              <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))}
                className="glass-input w-24" />
            </div>
            {period === 'monthly' && (
              <div>
                <label className="text-xs text-white/40 mb-2 block">Ay</label>
                <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="glass-select">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}. Ay</option>
                  ))}
                </select>
              </div>
            )}
            <button onClick={loadReport} className="glass-btn flex items-center gap-2">
              <Search size={14} />
              Raporu Getir
            </button>
          </div>
        </GlassCard>

        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl animate-shimmer" />)}
            </div>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <GlassCard delay={0.1}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-[11px] text-white/40 font-medium uppercase tracking-widest">Toplam Satış</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-emerald-400">
                  <AnimatedCounter value={data.summary.totalSales} prefix="₺" />
                </div>
                <div className="text-xs text-white/30 mt-1">{data.summary.totalQuantity} adet</div>
              </GlassCard>

              <GlassCard delay={0.2}>
                <div className="flex items-center gap-2 mb-3">
                  <Receipt size={14} className="text-red-400" />
                  <span className="text-[11px] text-white/40 font-medium uppercase tracking-widest">Toplam Gider</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-red-400">
                  <AnimatedCounter value={data.summary.totalExpenses} prefix="₺" />
                </div>
              </GlassCard>

              <GlassCard delay={0.3}>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={14} className="text-blue-400" />
                  <span className="text-[11px] text-white/40 font-medium uppercase tracking-widest">Toplam Tahsilat</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-blue-400">
                  <AnimatedCounter value={data.summary.totalPayments} prefix="₺" />
                </div>
              </GlassCard>

              <GlassCard delay={0.4}>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={14} className={`${data.summary.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className="text-[11px] text-white/40 font-medium uppercase tracking-widest">Net Kâr</span>
                </div>
                <div className={`text-xl md:text-2xl font-bold ${data.summary.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <AnimatedCounter value={data.summary.netProfit} prefix="₺" />
                </div>
              </GlassCard>
            </div>

            {data.sales.length > 0 && (
              <GlassCard delay={0.5} className="mb-6 overflow-hidden !p-0">
                <div className="p-5 md:p-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <h2 className="text-base font-semibold text-white">Satış Listesi</h2>
                    <span className="text-xs text-white/30 ml-auto">{data.sales.length} kayıt</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Müşteri</th>
                        <th className="text-right">Adet</th>
                        <th className="text-right">Birim Fiyat</th>
                        <th className="text-right">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sales.map(s => (
                        <tr key={s.id}>
                          <td>{formatDate(s.date)}</td>
                          <td>{s.customer?.name || '-'}</td>
                          <td className="text-right">{s.quantity}</td>
                          <td className="text-right">{formatTL(s.unitPrice)}</td>
                          <td className="text-right font-medium text-emerald-400">{formatTL(s.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {data.expenses.length > 0 && (
              <GlassCard delay={0.6} className="mb-6 overflow-hidden !p-0">
                <div className="p-5 md:p-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Receipt size={16} className="text-red-400" />
                    <h2 className="text-base font-semibold text-white">Gider Listesi</h2>
                    <span className="text-xs text-white/30 ml-auto">{data.expenses.length} kayıt</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Açıklama</th>
                        <th>Kategori</th>
                        <th className="text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.expenses.map(e => (
                        <tr key={e.id}>
                          <td>{formatDate(e.date)}</td>
                          <td>{e.description}</td>
                          <td><span className="px-2 py-0.5 rounded-md bg-white/5 text-xs">{catLabels[e.category] || e.category}</span></td>
                          <td className="text-right font-medium text-red-400">{formatTL(e.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {data.payments.length > 0 && (
              <GlassCard delay={0.7} className="overflow-hidden !p-0">
                <div className="p-5 md:p-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-blue-400" />
                    <h2 className="text-base font-semibold text-white">Tahsilat Listesi</h2>
                    <span className="text-xs text-white/30 ml-auto">{data.payments.length} kayıt</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Müşteri</th>
                        <th className="text-right">Tutar</th>
                        <th>Not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payments.map(p => (
                        <tr key={p.id}>
                          <td>{formatDate(p.date)}</td>
                          <td>{p.customer?.name || '-'}</td>
                          <td className="text-right font-medium text-blue-400">{formatTL(p.amount)}</td>
                          <td className="text-white/40">{p.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </>
        )}

        {!data && !loading && (
          <div className="text-center py-24">
            <BarChart3 size={64} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 text-lg">Rapor görüntülemek için</p>
            <p className="text-white/20 text-sm mt-1">dönem seçip "Raporu Getir" butonuna tıklayın</p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
