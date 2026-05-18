'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-strong rounded-2xl px-5 py-4 flex items-center gap-3 pointer-events-auto min-w-[280px] shadow-xl"
            >
              {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <XCircle size={20} className="text-red-400 shrink-0" />}
              {toast.type === 'info' && <AlertCircle size={20} className="text-blue-400 shrink-0" />}
              <span className="text-sm text-white flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white/70 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
