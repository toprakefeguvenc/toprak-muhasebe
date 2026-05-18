'use client'

import Sidebar from '@/components/Sidebar'
import GlowBackground from '@/components/GlowBackground'
import { ToastProvider } from '@/components/Toast'

export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      <GlowBackground />
      <div className="flex min-h-screen relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
