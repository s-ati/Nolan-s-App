"use client"

import { useState, useMemo } from 'react'
import { isBefore, startOfDay } from 'date-fns'
import {
  LayoutGrid,
  Users,
  Briefcase,
  Activity,
  UserPlus,
  PlusCircle,
  Zap,
  DollarSign,
  CalendarClock,
  ClipboardList,
} from 'lucide-react'
import { useDemoStore } from '@/stores/demo-data'
import { PipelineBoard } from '@/components/pipeline/pipeline-board'
import { ContactsTable } from '@/components/pipeline/contacts-table'
import { DealsTable } from '@/components/pipeline/deals-table'
import { ActivityTimeline } from '@/components/pipeline/activity-timeline'
import { ContactDetailDrawer } from '@/components/pipeline/contact-detail-drawer'
import { DealDetailDrawer } from '@/components/pipeline/deal-detail-drawer'
import { AddContactModal } from '@/components/pipeline/add-contact-modal'
import { AddDealModal } from '@/components/pipeline/add-deal-modal'
import { LogActivityModal } from '@/components/pipeline/log-activity-modal'
import { cn } from '@/lib/utils'

type Tab = 'board' | 'contacts' | 'deals' | 'activity'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'board', label: 'Board', icon: LayoutGrid },
  { key: 'contacts', label: 'Contacts', icon: Users },
  { key: 'deals', label: 'Deals', icon: Briefcase },
  { key: 'activity', label: 'Activity', icon: Activity },
]

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(n)
}

export default function PipelinePage() {
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)
  const activities = useDemoStore((s) => s.activities)

  const [tab, setTab] = useState<Tab>('board')

  // Drawers
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)

  // Modals
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [showLogActivity, setShowLogActivity] = useState(false)
  const [logActivityPrefill, setLogActivityPrefill] = useState<{
    contactId?: string | null
    dealId?: string | null
    type?: string | null
  }>({})

  // Summary stats
  const totalContacts = contacts.length
  const activeDeals = useMemo(
    () => deals.filter((d) => !['Closed', 'Dead'].includes(d.stage)),
    [deals]
  )
  const pipelineValue = useMemo(
    () => activeDeals.reduce((sum, d) => sum + d.estimatedCommission, 0),
    [activeDeals]
  )
  const dueFollowUps = useMemo(
    () =>
      contacts.filter(
        (c) =>
          c.nextFollowUpDate &&
          isBefore(new Date(c.nextFollowUpDate), startOfDay(new Date()))
      ).length,
    [contacts]
  )

  const allActivitiesSorted = useMemo(
    () =>
      [...activities].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [activities]
  )

  function openLogActivityFrom(contactId: string | null, dealId?: string, type?: string) {
    setLogActivityPrefill({
      contactId: contactId || null,
      dealId: dealId || null,
      type: type || null,
    })
    setShowLogActivity(true)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Pipeline</h1>
        <p className="text-sm text-zinc-500">Manage your contacts, deals, and activities</p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-zinc-500">Contacts</span>
          </div>
          <p className="text-xl font-bold text-zinc-100">{totalContacts}</p>
        </div>
        <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium text-zinc-500">Active Deals</span>
          </div>
          <p className="text-xl font-bold text-zinc-100">{activeDeals.length}</p>
        </div>
        <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-xs font-medium text-zinc-500">Pipeline Value</span>
          </div>
          <p className="text-xl font-bold text-zinc-100">{formatCurrency(pipelineValue)}</p>
        </div>
        <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-4 w-4 text-red-400" />
            <span className="text-xs font-medium text-zinc-500">Overdue Follow-ups</span>
          </div>
          <p className={cn('text-xl font-bold', dueFollowUps > 0 ? 'text-red-400' : 'text-zinc-100')}>
            {dueFollowUps}
          </p>
        </div>
      </div>

      {/* Tabs + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                tab === key
                  ? 'text-blue-400 bg-blue-400/10 border-b-2 border-blue-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" /> Contact
          </button>
          <button
            onClick={() => setShowAddDeal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Deal
          </button>
          <button
            onClick={() => {
              setLogActivityPrefill({})
              setShowLogActivity(true)
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
          >
            <Zap className="h-3.5 w-3.5" /> Log Activity
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {tab === 'board' && (
          <PipelineBoard onSelectContact={(id) => setSelectedContactId(id)} />
        )}
        {tab === 'contacts' && (
          <ContactsTable
            onSelectContact={(id) => setSelectedContactId(id)}
            onAddContact={() => setShowAddContact(true)}
          />
        )}
        {tab === 'deals' && (
          <DealsTable
            onSelectDeal={(id) => setSelectedDealId(id)}
            onAddDeal={() => setShowAddDeal(true)}
          />
        )}
        {tab === 'activity' && (
          <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-300">All Activity</h3>
              <span className="text-xs text-zinc-600">({allActivitiesSorted.length} total)</span>
            </div>
            <ActivityTimeline activities={allActivitiesSorted} />
          </div>
        )}
      </div>

      {/* Contact Detail Drawer */}
      {selectedContactId && (
        <ContactDetailDrawer
          contactId={selectedContactId}
          onClose={() => setSelectedContactId(null)}
          onLogActivity={(contactId, type) => openLogActivityFrom(contactId, undefined, type)}
        />
      )}

      {/* Deal Detail Drawer */}
      {selectedDealId && (
        <DealDetailDrawer
          dealId={selectedDealId}
          onClose={() => setSelectedDealId(null)}
          onLogActivity={(contactId, dealId) => openLogActivityFrom(contactId, dealId)}
        />
      )}

      {/* Modals */}
      <AddContactModal
        open={showAddContact}
        onClose={() => setShowAddContact(false)}
      />
      <AddDealModal
        open={showAddDeal}
        onClose={() => setShowAddDeal(false)}
      />
      <LogActivityModal
        open={showLogActivity}
        onClose={() => setShowLogActivity(false)}
        prefillContactId={logActivityPrefill.contactId}
        prefillDealId={logActivityPrefill.dealId}
        prefillType={logActivityPrefill.type}
      />
    </div>
  )
}
