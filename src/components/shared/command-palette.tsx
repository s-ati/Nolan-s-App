'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppStore } from '@/stores/app-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Swords, Users, CalendarDays, BarChart3, Trophy, Settings,
  Phone, MessageSquare, Mail, UserPlus, Building2, Search, X
} from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  icon: React.ElementType
  category: string
  action: () => void
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, openQuickAction } = useAppStore()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: CommandItem[] = useMemo(() => [
    { id: 'nav-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation', action: () => { router.push('/dashboard'); setCommandPaletteOpen(false) } },
    { id: 'nav-quests', label: 'Go to Quests', icon: Swords, category: 'Navigation', action: () => { router.push('/quests'); setCommandPaletteOpen(false) } },
    { id: 'nav-pipeline', label: 'Go to Pipeline', icon: Users, category: 'Navigation', action: () => { router.push('/pipeline'); setCommandPaletteOpen(false) } },
    { id: 'nav-planner', label: 'Go to Planner', icon: CalendarDays, category: 'Navigation', action: () => { router.push('/planner'); setCommandPaletteOpen(false) } },
    { id: 'nav-stats', label: 'Go to Stats', icon: BarChart3, category: 'Navigation', action: () => { router.push('/stats'); setCommandPaletteOpen(false) } },
    { id: 'nav-achievements', label: 'Go to Achievements', icon: Trophy, category: 'Navigation', action: () => { router.push('/achievements'); setCommandPaletteOpen(false) } },
    { id: 'nav-settings', label: 'Go to Settings', icon: Settings, category: 'Navigation', action: () => { router.push('/settings'); setCommandPaletteOpen(false) } },
    { id: 'action-call', label: 'Log a Call', icon: Phone, category: 'Quick Actions', action: () => { openQuickAction('log-call'); setCommandPaletteOpen(false) } },
    { id: 'action-text', label: 'Log a Text', icon: MessageSquare, category: 'Quick Actions', action: () => { openQuickAction('log-text'); setCommandPaletteOpen(false) } },
    { id: 'action-email', label: 'Log an Email', icon: Mail, category: 'Quick Actions', action: () => { openQuickAction('log-email'); setCommandPaletteOpen(false) } },
    { id: 'action-contact', label: 'Add Contact', icon: UserPlus, category: 'Quick Actions', action: () => { openQuickAction('add-contact'); setCommandPaletteOpen(false) } },
    { id: 'action-deal', label: 'Add Deal', icon: Building2, category: 'Quick Actions', action: () => { openQuickAction('add-deal'); setCommandPaletteOpen(false) } },
    { id: 'action-quest', label: 'Add Quest', icon: Swords, category: 'Quick Actions', action: () => { openQuickAction('add-quest'); setCommandPaletteOpen(false) } },
  ], [router, setCommandPaletteOpen, openQuickAction])

  const filtered = useMemo(() => {
    if (!query) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
  }, [query, commands])

  useEffect(() => setSelectedIndex(0), [query])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [commandPaletteOpen])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action()
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false)
    }
  }

  if (!commandPaletteOpen) return null

  const categories = [...new Set(filtered.map((c) => c.category))]

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)} />
      <div className="relative w-full max-w-lg bg-[#161820] border border-[#1e2030] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2030]">
          <Search size={16} className="text-zinc-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="text-[10px] text-zinc-500 bg-[#1a1c28] px-1.5 py-0.5 rounded border border-[#1e2030]">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-zinc-500 text-center">No results found</p>
          )}
          {categories.map((cat) => (
            <div key={cat}>
              <p className="px-4 py-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{cat}</p>
              {filtered.filter((c) => c.category === cat).map((cmd) => {
                const globalIdx = filtered.indexOf(cmd)
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      globalIdx === selectedIndex ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-300 hover:bg-white/5'
                    )}
                  >
                    <cmd.icon size={16} />
                    <span>{cmd.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
