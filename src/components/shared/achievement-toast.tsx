'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Zap } from 'lucide-react'

export function AchievementToast() {
  const { notifications, clearAchievementToast } = useAppStore()
  const toast = notifications.achievementToast

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearAchievementToast, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, clearAchievementToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-20 right-4 z-[100]"
        >
          <div className="flex items-center gap-3 px-5 py-4 bg-[#161820] border border-amber-500/30 rounded-xl shadow-lg shadow-amber-500/10 max-w-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-400 font-medium">Achievement Unlocked!</p>
              <p className="text-sm text-white font-semibold truncate">{toast.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap size={12} className="text-blue-400" />
                <span className="text-xs text-blue-400">+{toast.xpReward} XP</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
