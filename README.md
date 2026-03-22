# Leveled

A premium gamified productivity and CRM platform for ambitious real estate agents. Built as a real working tool — every button works, every interaction has state, every module serves a purpose.

## Features

- **Dashboard** — Command center with XP/level progress, daily quests, due follow-ups, active deals, activity feed, streaks, stats, and planner preview
- **Pipeline CRM** — Full CRM with contacts, deals, activity logging, Kanban board view, detail drawers, and stage management
- **Quest System** — Daily, weekly, monthly, and pipeline quests with XP rewards, difficulty levels, and satisfying completion flows
- **Planner** — Daily time-block planner with categories, completion tracking, and strategic messaging
- **Stats** — Radar chart, stat progression, activity distribution, weekly charts, and key metrics
- **Achievements** — Unlockable achievements with progress tracking across Prospecting, Deals, Discipline, and more
- **Game Engine** — Full XP/level/rank system, 6 stat categories, streak tracking, and achievement checking
- **Quick Actions** — Global quick-action modal for logging calls, texts, emails, meetings, adding contacts/deals/quests
- **Command Palette** — Ctrl+K navigation and action palette

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management with localStorage persistence)
- Recharts (data visualization)
- Framer Motion (micro-interactions)
- Lucide Icons
- date-fns
- Supabase-ready schema (local-first demo mode included)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works immediately with demo data — no Supabase setup required.

### With Supabase (optional)

1. Create a Supabase project
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Run the seed: `supabase/seed.sql`
4. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials

## Project Structure

```
src/
├── app/(app)/          # App routes (dashboard, quests, pipeline, etc.)
├── components/
│   ├── dashboard/      # Dashboard page modules
│   ├── pipeline/       # CRM components (board, tables, drawers, modals)
│   ├── quests/         # Quest cards, lists, modals
│   ├── planner/        # Planner blocks, schedule, modals
│   ├── stats/          # Charts and metric displays
│   ├── achievements/   # Achievement cards and grid
│   ├── settings/       # Settings forms
│   ├── layout/         # App shell, sidebar, topbar, mobile nav
│   ├── shared/         # Quick actions, toasts, command palette
│   └── ui/             # Base UI components
├── lib/
│   ├── game/           # XP engine, level/rank calculations
│   └── supabase/       # Supabase client configuration
├── stores/             # Zustand stores (app state, demo data)
└── types/              # TypeScript types and database schema
```

## Game System

- **XP**: Earned from activities (calls, texts, meetings, showings) and quest completion
- **Levels**: 500 XP per level
- **Ranks**: Rookie Agent → Rising Agent → Pipeline Builder → Active Closer → Elite Operator → Top Producer
- **Stats**: Lead Generation, Networking, Marketing, Negotiation, Knowledge, Discipline
- **Streaks**: Daily activity, prospecting, planner completion
- **Achievements**: 15 unlockable achievements across 7 categories
