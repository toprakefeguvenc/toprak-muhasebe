'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, Users, BarChart3, Menu, X,
  Wallet, TrendingUp, Receipt, Settings
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: LayoutDashboard },
  { href: '/gunluk', label: 'Günlük Giriş', icon: ClipboardList },
  { href: '/musteriler', label: 'Müşteriler', icon: Users },
  { href: '/raporlar', label: 'Raporlar', icon: BarChart3 },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 glass-card p-3 !rounded-xl"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.aside
            initial={isMobile ? { x: -300, opacity: 0 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0, opacity: 1 } : { width: 240, opacity: 1 }}
            exit={isMobile ? { x: -300, opacity: 0 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`
              ${isMobile
                ? 'fixed left-0 top-0 bottom-0 z-40 w-64'
                : 'sticky top-0 h-screen'
              }
              glass overflow-hidden flex flex-col shrink-0
            `}
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="p-6 border-b border-white/5">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm tracking-tight">Toprak</div>
                  <div className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase">Muhasebe</div>
                </div>
              </Link>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300
                        ${isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {item.label}
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-white/5">
              <div className="glass rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Bu Ay</div>
                <div className="text-lg font-bold text-gradient-emerald">₺0</div>
                <div className="text-[11px] text-white/40">Net Kâr</div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
