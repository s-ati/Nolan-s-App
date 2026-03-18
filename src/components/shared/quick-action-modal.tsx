'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/stores/app-store'
import { useDemoStore } from '@/stores/demo-data'
import { getXpForActivity } from '@/lib/game/xp-engine'
import { cn } from '@/lib/utils'
import {
  Phone, MessageSquare, Mail, Users, Home, Plus,
  Swords, Calendar, X, FileText, Building2, UserPlus,
  ClipboardList
} from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'

const QUICK_ACTIONS = [
  { id: 'log-call', label: 'Log Call', icon: Phone, type: 'Call', color: 'text-blue-400' },
  { id: 'log-text', label: 'Log Text', icon: MessageSquare, type: 'Text', color: 'text-green-400' },
  { id: 'log-email', label: 'Log Email', icon: Mail, type: 'Email', color: 'text-purple-400' },
  { id: 'log-meeting', label: 'Log Meeting', icon: Users, type: 'Meeting', color: 'text-amber-400' },
  { id: 'log-showing', label: 'Log Showing', icon: Home, type: 'Showing', color: 'text-cyan-400' },
  { id: 'add-contact', label: 'Add Contact', icon: UserPlus, type: null, color: 'text-emerald-400' },
  { id: 'add-deal', label: 'Add Deal', icon: Building2, type: null, color: 'text-orange-400' },
  { id: 'add-quest', label: 'Add Quest', icon: Swords, type: null, color: 'text-rose-400' },
  { id: 'add-block', label: 'Plan Block', icon: Calendar, type: null, color: 'text-indigo-400' },
  { id: 'log-note', label: 'Add Note', icon: FileText, type: 'Note Added', color: 'text-zinc-400' },
  { id: 'log-followup', label: 'Log Follow-up', icon: ClipboardList, type: 'Follow-up Completed', color: 'text-teal-400' },
  { id: 'log-contract', label: 'Contract Update', icon: FileText, type: 'Contract Update', color: 'text-violet-400' },
]

type ModalView = 'grid' | 'log-activity' | 'add-contact' | 'add-deal' | 'add-quest' | 'add-block'

export function QuickActionModal() {
  const { quickAction, closeQuickAction, showXpToast } = useAppStore()
  const { contacts, deals, logActivity, addContact, addDeal, addQuest, dailyPlans, addDailyPlan, addPlanBlock } = useDemoStore()
  const [view, setView] = useState<ModalView>('grid')
  const [activityType, setActivityType] = useState('')

  // Form states
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [contactId, setContactId] = useState('')
  const [dealId, setDealId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [leadSource, setLeadSource] = useState('')
  const [status, setStatus] = useState('Prospect')
  const [priority, setPriority] = useState('medium')
  const [dealTitle, setDealTitle] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [stage, setStage] = useState('Lead')
  const [commission, setCommission] = useState('')
  const [questTitle, setQuestTitle] = useState('')
  const [questCategory, setQuestCategory] = useState('Prospecting')
  const [questDifficulty, setQuestDifficulty] = useState('normal')
  const [questPeriod, setQuestPeriod] = useState('daily')
  const [blockTitle, setBlockTitle] = useState('')
  const [blockCategory, setBlockCategory] = useState('Admin')
  const [blockStart, setBlockStart] = useState('09:00')
  const [blockEnd, setBlockEnd] = useState('10:00')

  const resetForms = useCallback(() => {
    setTitle('')
    setNotes('')
    setContactId('')
    setDealId('')
    setName('')
    setPhone('')
    setEmail('')
    setLeadSource('')
    setStatus('Prospect')
    setPriority('medium')
    setDealTitle('')
    setPropertyAddress('')
    setStage('Lead')
    setCommission('')
    setQuestTitle('')
    setQuestCategory('Prospecting')
    setQuestDifficulty('normal')
    setQuestPeriod('daily')
    setBlockTitle('')
    setBlockCategory('Admin')
    setBlockStart('09:00')
    setBlockEnd('10:00')
    setView('grid')
    setActivityType('')
  }, [])

  useEffect(() => {
    if (!quickAction.isOpen) {
      resetForms()
      return
    }
    if (quickAction.activeModal) {
      const action = QUICK_ACTIONS.find((a) => a.id === quickAction.activeModal)
      if (action?.type) {
        setActivityType(action.type)
        setTitle(`Logged ${action.type}`)
        setView('log-activity')
      } else if (quickAction.activeModal === 'add-contact') {
        setView('add-contact')
      } else if (quickAction.activeModal === 'add-deal') {
        setView('add-deal')
      } else if (quickAction.activeModal === 'add-quest') {
        setView('add-quest')
      } else if (quickAction.activeModal === 'add-block') {
        setView('add-block')
      }
    }
  }, [quickAction.isOpen, quickAction.activeModal, resetForms])

  // ESC to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeQuickAction()
    }
    if (quickAction.isOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [quickAction.isOpen, closeQuickAction])

  if (!quickAction.isOpen) return null

  function handleQuickAction(action: typeof QUICK_ACTIONS[0]) {
    if (action.type) {
      setActivityType(action.type)
      setTitle(`Logged ${action.type}`)
      setView('log-activity')
    } else if (action.id === 'add-contact') {
      setView('add-contact')
    } else if (action.id === 'add-deal') {
      setView('add-deal')
    } else if (action.id === 'add-quest') {
      setView('add-quest')
    } else if (action.id === 'add-block') {
      setView('add-block')
    }
  }

  function submitActivity() {
    if (!activityType || !title.trim()) return
    const activity = logActivity({
      contactId: contactId || null,
      dealId: dealId || null,
      type: activityType,
      title: title.trim(),
      notes: notes.trim(),
    })
    showXpToast(activity.xpAwarded, activityType)
    closeQuickAction()
  }

  function submitContact() {
    if (!name.trim()) return
    addContact({
      fullName: name.trim(),
      phone,
      email,
      leadSource,
      status: status as 'Prospect' | 'Warm Lead' | 'Active Buyer' | 'Active Seller' | 'Nurture' | 'Under Contract' | 'Closed' | 'Lost',
      nextFollowUpDate: null,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      notes: '',
      tags: [],
    })
    closeQuickAction()
  }

  function submitDeal() {
    if (!dealTitle.trim()) return
    addDeal({
      contactId: contactId || null,
      title: dealTitle.trim(),
      propertyAddress,
      stage: stage as 'Lead' | 'Active Client' | 'Offer Stage' | 'Under Contract' | 'Closed' | 'Dead',
      estimatedCommission: parseFloat(commission) || 0,
      estimatedCloseDate: null,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      notes: '',
    })
    closeQuickAction()
  }

  function submitQuest() {
    if (!questTitle.trim()) return
    const diffXp: Record<string, number> = { easy: 25, normal: 50, hard: 100, epic: 200 }
    addQuest({
      title: questTitle.trim(),
      description: '',
      category: questCategory,
      difficulty: questDifficulty as 'easy' | 'normal' | 'hard' | 'epic',
      xpReward: diffXp[questDifficulty] || 50,
      sourceType: 'manual',
      linkedContactId: null,
      linkedDealId: null,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'active',
      period: questPeriod as 'daily' | 'weekly' | 'monthly' | 'pipeline',
    })
    closeQuickAction()
  }

  function submitBlock() {
    if (!blockTitle.trim()) return
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    let plan = dailyPlans.find((p) => p.planDate === todayStr)
    if (!plan) {
      plan = addDailyPlan({ planDate: todayStr, notes: '', completionScore: 0 })
    }
    addPlanBlock(plan.id, {
      title: blockTitle.trim(),
      category: blockCategory,
      startTime: blockStart,
      endTime: blockEnd,
      status: 'planned',
      notes: '',
      linkedQuestId: null,
    })
    closeQuickAction()
  }

  const inputClass = 'w-full bg-[#1a1c28] border border-[#1e2030] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-500'
  const labelClass = 'block text-xs font-medium text-zinc-400 mb-1'
  const selectClass = 'w-full bg-[#1a1c28] border border-[#1e2030] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeQuickAction} />
      <div className="relative w-full max-w-lg bg-[#161820] border border-[#1e2030] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2030]">
          <h2 className="text-base font-semibold text-white">
            {view === 'grid' && 'Quick Actions'}
            {view === 'log-activity' && `Log ${activityType}`}
            {view === 'add-contact' && 'Add Contact'}
            {view === 'add-deal' && 'Add Deal'}
            {view === 'add-quest' && 'Add Quest'}
            {view === 'add-block' && 'Add Plan Block'}
          </h2>
          <button onClick={closeQuickAction} className="text-zinc-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {view === 'grid' && (
            <div className="grid grid-cols-3 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1a1c28] border border-[#1e2030] hover:border-blue-500/30 hover:bg-[#1e2030] transition-all group"
                >
                  <action.icon size={22} className={cn(action.color, 'group-hover:scale-110 transition-transform')} />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200 text-center leading-tight">{action.label}</span>
                  {action.type && (
                    <span className="text-[10px] text-blue-400/60">+{getXpForActivity(action.type)} XP</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {view === 'log-activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-sm text-blue-400">XP Reward</span>
                <span className="text-sm font-bold text-blue-400">+{getXpForActivity(activityType)} XP</span>
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What did you do?" />
              </div>
              <div>
                <label className={labelClass}>Contact (optional)</label>
                <select className={selectClass} value={contactId} onChange={(e) => setContactId(e.target.value)}>
                  <option value="">No contact</option>
                  {contacts.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Deal (optional)</label>
                <select className={selectClass} value={dealId} onChange={(e) => setDealId(e.target.value)}>
                  <option value="">No deal</option>
                  {deals.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea className={cn(inputClass, 'h-20 resize-none')} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any notes..." />
              </div>
              <button onClick={submitActivity} disabled={!title.trim()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors">
                Log {activityType} (+{getXpForActivity(activityType)} XP)
              </button>
            </div>
          )}

          {view === 'add-contact' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Lead Source</label>
                  <input className={inputClass} value={leadSource} onChange={(e) => setLeadSource(e.target.value)} placeholder="Referral, Open House..." />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                    {['Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller', 'Nurture'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
                  {['low', 'medium', 'high', 'urgent'].map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button onClick={submitContact} disabled={!name.trim()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors">
                Add Contact
              </button>
            </div>
          )}

          {view === 'add-deal' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Deal Title *</label>
                <input className={inputClass} value={dealTitle} onChange={(e) => setDealTitle(e.target.value)} placeholder="Smith - 123 Main St" />
              </div>
              <div>
                <label className={labelClass}>Property Address</label>
                <input className={inputClass} value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="123 Main Street" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Contact</label>
                  <select className={selectClass} value={contactId} onChange={(e) => setContactId(e.target.value)}>
                    <option value="">None</option>
                    {contacts.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Stage</label>
                  <select className={selectClass} value={stage} onChange={(e) => setStage(e.target.value)}>
                    {['Lead', 'Active Client', 'Offer Stage', 'Under Contract'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Est. Commission</label>
                  <input className={inputClass} type="number" value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="12000" />
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {['low', 'medium', 'high', 'urgent'].map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={submitDeal} disabled={!dealTitle.trim()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors">
                Add Deal
              </button>
            </div>
          )}

          {view === 'add-quest' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Quest Title *</label>
                <input className={inputClass} value={questTitle} onChange={(e) => setQuestTitle(e.target.value)} placeholder="Make 5 prospecting calls" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Category</label>
                  <select className={selectClass} value={questCategory} onChange={(e) => setQuestCategory(e.target.value)}>
                    {['Prospecting', 'Follow-up', 'CRM Hygiene', 'Knowledge', 'Marketing', 'Pipeline Progress', 'Discipline'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select className={selectClass} value={questDifficulty} onChange={(e) => setQuestDifficulty(e.target.value)}>
                    <option value="easy">Easy (25 XP)</option>
                    <option value="normal">Normal (50 XP)</option>
                    <option value="hard">Hard (100 XP)</option>
                    <option value="epic">Epic (200 XP)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Period</label>
                <select className={selectClass} value={questPeriod} onChange={(e) => setQuestPeriod(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="pipeline">Pipeline</option>
                </select>
              </div>
              <button onClick={submitQuest} disabled={!questTitle.trim()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors">
                Add Quest
              </button>
            </div>
          )}

          {view === 'add-block' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Block Title *</label>
                <input className={inputClass} value={blockTitle} onChange={(e) => setBlockTitle(e.target.value)} placeholder="Morning Prospecting" />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select className={selectClass} value={blockCategory} onChange={(e) => setBlockCategory(e.target.value)}>
                  {['Prospecting', 'Follow-ups', 'Client Meetings', 'Showings', 'Marketing', 'Admin', 'Learning', 'Pipeline Review'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start Time</label>
                  <input className={inputClass} type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>End Time</label>
                  <input className={inputClass} type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
                </div>
              </div>
              <button onClick={submitBlock} disabled={!blockTitle.trim()} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg text-sm font-medium transition-colors">
                Add Block
              </button>
            </div>
          )}
        </div>

        {/* Back button for sub-views */}
        {view !== 'grid' && (
          <div className="px-5 pb-4">
            <button onClick={() => setView('grid')} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              ← Back to actions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

