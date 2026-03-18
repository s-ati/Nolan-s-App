'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

export function XpToast() {
  const { notifications, clearXpToast } = useAppStore()
  const toast = notifications.xpToast

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearXpToast, 2500)
      return () => clearTimeout(timer)
    }
  }, [toast, clearXpToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-600/90 backdrop-blur-md rounded-full border border-blue-400/30 shadow-lg shadow-blue-500/20">
            <Zap size={18} className="text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-bold text-white">+{toast.amount} XP</span>
            <span className="text-sm text-blue-100">{toast.activity}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
