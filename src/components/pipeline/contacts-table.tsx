"use client"

import { useState, useMemo } from 'react'
import { format, isBefore, startOfDay } from 'date-fns'
import { Search, ChevronUp, ChevronDown, UserPlus, Users } from 'lucide-react'
import { useDemoStore, type Contact } from '@/stores/demo-data'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<Contact['status'], string> = {
  Prospect: 'bg-zinc-500/20 text-zinc-300',
  'Warm Lead': 'bg-amber-500/20 text-amber-300',
  'Active Buyer': 'bg-blue-500/20 text-blue-300',
  'Active Seller': 'bg-cyan-500/20 text-cyan-300',
  Nurture: 'bg-purple-500/20 text-purple-300',
  'Under Contract': 'bg-indigo-500/20 text-indigo-300',
  Closed: 'bg-green-500/20 text-green-300',
  Lost: 'bg-red-500/20 text-red-300',
}

const PRIORITY_DOT: Record<Contact['priority'], string> = {
  low: 'bg-zinc-500',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  urgent: 'bg-red-500',
}

const STATUSES: Contact['status'][] = [
  'Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller',
  'Nurture', 'Under Contract', 'Closed', 'Lost',
]

type SortKey = 'fullName' | 'status' | 'priority' | 'nextFollowUpDate' | 'leadSource' | 'phone'
type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

interface ContactsTableProps {
  onSelectContact: (id: string) => void
  onAddContact: () => void
}

export function ContactsTable({ onSelectContact, onAddContact }: ContactsTableProps) {
  const contacts = useDemoStore((s) => s.contacts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('fullName')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let result = [...contacts]

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'fullName':
          cmp = a.fullName.localeCompare(b.fullName)
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
        case 'priority':
          cmp = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
          break
        case 'nextFollowUpDate':
          cmp = (a.nextFollowUpDate || '9999').localeCompare(b.nextFollowUpDate || '9999')
          break
        case 'leadSource':
          cmp = a.leadSource.localeCompare(b.leadSource)
          break
        case 'phone':
          cmp = a.phone.localeCompare(b.phone)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [contacts, search, statusFilter, sortKey, sortDir])

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
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onAddContact}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Users className="h-10 w-10 mb-3 text-zinc-600" />
          <p className="text-sm font-medium">No contacts found</p>
          <p className="text-xs mt-1">
            {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first contact to get started'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#1e2030]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#12141a]">
                {([
                  ['fullName', 'Name'],
                  ['status', 'Status'],
                  ['priority', 'Priority'],
                  ['nextFollowUpDate', 'Follow-up'],
                  ['leadSource', 'Source'],
                  ['phone', 'Phone'],
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
              {filtered.map((contact) => {
                const isOverdue =
                  contact.nextFollowUpDate &&
                  isBefore(new Date(contact.nextFollowUpDate), startOfDay(new Date()))

                return (
                  <tr
                    key={contact.id}
                    onClick={() => onSelectContact(contact.id)}
                    className="cursor-pointer border-b border-[#1e2030] hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-200">{contact.fullName}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_COLORS[contact.status])}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', PRIORITY_DOT[contact.priority])} />
                        <span className="text-zinc-400 capitalize">{contact.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {contact.nextFollowUpDate ? (
                        <span className={cn('text-xs', isOverdue ? 'text-red-400 font-medium' : 'text-zinc-400')}>
                          {format(new Date(contact.nextFollowUpDate), 'MMM d, yyyy')}
                          {isOverdue && ' (overdue)'}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{contact.leadSource || '--'}</td>
                    <td className="px-4 py-3 text-zinc-400">{contact.phone || '--'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
