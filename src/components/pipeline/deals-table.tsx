"use client"

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ChevronUp, ChevronDown, PlusCircle, Briefcase } from 'lucide-react'
import { useDemoStore, type Deal } from '@/stores/demo-data'
import { cn } from '@/lib/utils'

const STAGE_COLORS: Record<Deal['stage'], string> = {
  Lead: 'bg-zinc-500/20 text-zinc-300',
  'Active Client': 'bg-blue-500/20 text-blue-300',
  'Offer Stage': 'bg-amber-500/20 text-amber-300',
  'Under Contract': 'bg-purple-500/20 text-purple-300',
  Closed: 'bg-green-500/20 text-green-300',
  Dead: 'bg-red-500/20 text-red-300',
}

const PRIORITY_DOT: Record<Deal['priority'], string> = {
  low: 'bg-zinc-500',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  urgent: 'bg-red-500',
}

const STAGES: Deal['stage'][] = [
  'Lead', 'Active Client', 'Offer Stage', 'Under Contract', 'Closed', 'Dead',
]

type SortKey = 'title' | 'contact' | 'stage' | 'estimatedCommission' | 'estimatedCloseDate' | 'priority'
type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
const STAGE_ORDER: Record<string, number> = {
  Lead: 0, 'Active Client': 1, 'Offer Stage': 2, 'Under Contract': 3, Closed: 4, Dead: 5,
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

interface DealsTableProps {
  onSelectDeal: (id: string) => void
  onAddDeal: () => void
}

export function DealsTable({ onSelectDeal, onAddDeal }: DealsTableProps) {
  const deals = useDemoStore((s) => s.deals)
  const contacts = useDemoStore((s) => s.contacts)
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const contactMap = useMemo(() => {
    const map = new Map<string, string>()
    contacts.forEach((c) => map.set(c.id, c.fullName))
    return map
  }, [contacts])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let result = [...deals]

    if (stageFilter !== 'all') {
      result = result.filter((d) => d.stage === stageFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'title':
          cmp = a.title.localeCompare(b.title)
          break
        case 'contact':
          cmp = (contactMap.get(a.contactId || '') || '').localeCompare(contactMap.get(b.contactId || '') || '')
          break
        case 'stage':
          cmp = (STAGE_ORDER[a.stage] ?? 9) - (STAGE_ORDER[b.stage] ?? 9)
          break
        case 'estimatedCommission':
          cmp = a.estimatedCommission - b.estimatedCommission
          break
        case 'estimatedCloseDate':
          cmp = (a.estimatedCloseDate || '9999').localeCompare(b.estimatedCloseDate || '9999')
          break
        case 'priority':
          cmp = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [deals, stageFilter, sortKey, sortDir, contactMap])

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="h-3 w-3 text-zinc-700" />
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3 w-3 text-blue-400" />
    ) : (
      <ChevronDown className="h-3 w-3 text-blue-400" />
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={onAddDeal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Add Deal
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Briefcase className="h-10 w-10 mb-3 text-zinc-600" />
          <p className="text-sm font-medium">No deals found</p>
          <p className="text-xs mt-1">
            {stageFilter !== 'all' ? 'Try a different stage filter' : 'Add your first deal to get started'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#1e2030]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#12141a]">
                {([
                  ['title', 'Title'],
                  ['contact', 'Contact'],
                  ['stage', 'Stage'],
                  ['estimatedCommission', 'Commission'],
                  ['estimatedCloseDate', 'Close Date'],
                  ['priority', 'Priority'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => onSelectDeal(deal.id)}
                  className="cursor-pointer border-b border-[#1e2030] hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-zinc-200">{deal.title}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {deal.contactId ? contactMap.get(deal.contactId) || '--' : '--'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STAGE_COLORS[deal.stage])}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 font-medium">
                    {formatCurrency(deal.estimatedCommission)}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {deal.estimatedCloseDate
                      ? format(new Date(deal.estimatedCloseDate), 'MMM d, yyyy')
                      : '--'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', PRIORITY_DOT[deal.priority])} />
                      <span className="text-zinc-400 capitalize">{deal.priority}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
