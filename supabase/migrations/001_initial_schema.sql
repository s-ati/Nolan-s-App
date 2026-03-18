-- ============================================================================
-- AgentLevel – Initial Schema Migration
-- ============================================================================

-- --------------------------------------------------------------------------
-- user_profiles
-- --------------------------------------------------------------------------
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name text DEFAULT 'Agent',
  avatar_url text,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  rank_title text DEFAULT 'Rookie Agent',
  timezone text DEFAULT 'America/New_York',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

-- --------------------------------------------------------------------------
-- contacts
-- --------------------------------------------------------------------------
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  email text,
  lead_source text,
  status text DEFAULT 'Prospect' CHECK (status IN ('Prospect','Warm Lead','Active Buyer','Active Seller','Nurture','Under Contract','Closed','Lost')),
  next_follow_up_date date,
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  notes text,
  tags jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_next_follow_up_date ON public.contacts(next_follow_up_date);

-- --------------------------------------------------------------------------
-- deals
-- --------------------------------------------------------------------------
CREATE TABLE public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  title text NOT NULL,
  property_address text,
  stage text DEFAULT 'Lead' CHECK (stage IN ('Lead','Active Client','Offer Stage','Under Contract','Closed','Dead')),
  estimated_commission numeric(12,2) DEFAULT 0,
  estimated_close_date date,
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_deals_user_id ON public.deals(user_id);
CREATE INDEX idx_deals_stage ON public.deals(stage);

-- --------------------------------------------------------------------------
-- activities
-- --------------------------------------------------------------------------
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('Call','Text','Email','Meeting','Showing','Open House','Inspection Update','Contract Update','Note Added','Follow-up Completed','Deal Stage Changed')),
  title text NOT NULL,
  notes text,
  xp_awarded integer DEFAULT 0,
  stat_effects jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);

-- --------------------------------------------------------------------------
-- quests
-- --------------------------------------------------------------------------
CREATE TABLE public.quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'Prospecting' CHECK (category IN ('Prospecting','Follow-up','CRM Hygiene','Knowledge','Marketing','Pipeline Progress','Discipline')),
  difficulty text DEFAULT 'normal' CHECK (difficulty IN ('easy','normal','hard','epic')),
  xp_reward integer DEFAULT 50,
  source_type text DEFAULT 'manual' CHECK (source_type IN ('manual','system','pipeline')),
  linked_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  linked_deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  due_date date,
  status text DEFAULT 'active' CHECK (status IN ('active','completed','snoozed','expired')),
  period text DEFAULT 'daily' CHECK (period IN ('daily','weekly','monthly','pipeline')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_quests_user_id ON public.quests(user_id);
CREATE INDEX idx_quests_status_due_date ON public.quests(status, due_date);

-- --------------------------------------------------------------------------
-- achievements (global reference table)
-- --------------------------------------------------------------------------
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('Prospecting','Follow-up','Discipline','Deals','Learning','Consistency','Milestones')),
  xp_reward integer DEFAULT 100,
  icon text DEFAULT 'trophy',
  rule_type text NOT NULL,
  rule_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- --------------------------------------------------------------------------
-- user_achievements
-- --------------------------------------------------------------------------
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  progress_value integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- --------------------------------------------------------------------------
-- streaks
-- --------------------------------------------------------------------------
CREATE TABLE public.streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type text NOT NULL,
  current_count integer DEFAULT 0,
  best_count integer DEFAULT 0,
  last_completed_date date,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

CREATE INDEX idx_streaks_user_id ON public.streaks(user_id);

-- --------------------------------------------------------------------------
-- daily_plans
-- --------------------------------------------------------------------------
CREATE TABLE public.daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date date NOT NULL,
  notes text,
  completion_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

CREATE INDEX idx_daily_plans_user_id ON public.daily_plans(user_id);

-- --------------------------------------------------------------------------
-- daily_plan_blocks
-- --------------------------------------------------------------------------
CREATE TABLE public.daily_plan_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_plan_id uuid NOT NULL REFERENCES public.daily_plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text DEFAULT 'Admin',
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'planned' CHECK (status IN ('planned','in_progress','completed','skipped')),
  notes text,
  linked_quest_id uuid REFERENCES public.quests(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_daily_plan_blocks_daily_plan_id ON public.daily_plan_blocks(daily_plan_id);

-- --------------------------------------------------------------------------
-- stat_progress
-- --------------------------------------------------------------------------
CREATE TABLE public.stat_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stat_name text NOT NULL CHECK (stat_name IN ('Lead Generation','Networking','Marketing','Negotiation','Knowledge','Discipline')),
  stat_value integer DEFAULT 0,
  level integer DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, stat_name)
);

CREATE INDEX idx_stat_progress_user_id ON public.stat_progress(user_id);

-- --------------------------------------------------------------------------
-- notifications
-- --------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Enable RLS on every table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plan_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stat_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE USING (auth.uid() = user_id);

-- contacts
CREATE POLICY "Users can view their own contacts"
  ON public.contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contacts"
  ON public.contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contacts"
  ON public.contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contacts"
  ON public.contacts FOR DELETE USING (auth.uid() = user_id);

-- deals
CREATE POLICY "Users can view their own deals"
  ON public.deals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own deals"
  ON public.deals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own deals"
  ON public.deals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own deals"
  ON public.deals FOR DELETE USING (auth.uid() = user_id);

-- activities
CREATE POLICY "Users can view their own activities"
  ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities"
  ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activities"
  ON public.activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activities"
  ON public.activities FOR DELETE USING (auth.uid() = user_id);

-- quests
CREATE POLICY "Users can view their own quests"
  ON public.quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quests"
  ON public.quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quests"
  ON public.quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quests"
  ON public.quests FOR DELETE USING (auth.uid() = user_id);

-- achievements (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view achievements"
  ON public.achievements FOR SELECT USING (auth.role() = 'authenticated');

-- user_achievements
CREATE POLICY "Users can view their own user_achievements"
  ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own user_achievements"
  ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own user_achievements"
  ON public.user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own user_achievements"
  ON public.user_achievements FOR DELETE USING (auth.uid() = user_id);

-- streaks
CREATE POLICY "Users can view their own streaks"
  ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streaks"
  ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks"
  ON public.streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own streaks"
  ON public.streaks FOR DELETE USING (auth.uid() = user_id);

-- daily_plans
CREATE POLICY "Users can view their own daily_plans"
  ON public.daily_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own daily_plans"
  ON public.daily_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily_plans"
  ON public.daily_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own daily_plans"
  ON public.daily_plans FOR DELETE USING (auth.uid() = user_id);

-- daily_plan_blocks (access via daily_plan ownership)
CREATE POLICY "Users can view their own daily_plan_blocks"
  ON public.daily_plan_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.daily_plans dp
    WHERE dp.id = daily_plan_blocks.daily_plan_id AND dp.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert their own daily_plan_blocks"
  ON public.daily_plan_blocks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.daily_plans dp
    WHERE dp.id = daily_plan_blocks.daily_plan_id AND dp.user_id = auth.uid()
  ));
CREATE POLICY "Users can update their own daily_plan_blocks"
  ON public.daily_plan_blocks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.daily_plans dp
    WHERE dp.id = daily_plan_blocks.daily_plan_id AND dp.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete their own daily_plan_blocks"
  ON public.daily_plan_blocks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.daily_plans dp
    WHERE dp.id = daily_plan_blocks.daily_plan_id AND dp.user_id = auth.uid()
  ));

-- stat_progress
CREATE POLICY "Users can view their own stat_progress"
  ON public.stat_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stat_progress"
  ON public.stat_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stat_progress"
  ON public.stat_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stat_progress"
  ON public.stat_progress FOR DELETE USING (auth.uid() = user_id);

-- notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notifications"
  ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE USING (auth.uid() = user_id);
