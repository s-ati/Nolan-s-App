-- ============================================================================
-- AgentLevel – Seed Data: Achievements
-- ============================================================================

INSERT INTO public.achievements (key, title, description, category, xp_reward, icon, rule_type, rule_config) VALUES
  ('first_call', 'First Logged Call', 'Log your very first call in the CRM.', 'Prospecting', 50, 'phone', 'activity_count', '{"type": "activity_count", "activity_type": "Call", "count": 1}'),
  ('ten_calls_day', '10 Calls in One Day', 'Make 10 calls in a single day.', 'Prospecting', 150, 'phone-outgoing', 'daily_activity_count', '{"type": "daily_activity_count", "activity_type": "Call", "count": 10}'),
  ('seven_day_prospect', '7-Day Prospecting Streak', 'Prospect every day for 7 days straight.', 'Consistency', 200, 'flame', 'streak', '{"type": "streak", "streak_type": "prospecting", "count": 7}'),
  ('thirty_followups', '30 Follow-ups Completed', 'Complete 30 follow-up activities.', 'Follow-up', 200, 'check-circle', 'activity_count', '{"type": "activity_count", "activity_type": "Follow-up Completed", "count": 30}'),
  ('first_active_client', 'First Active Client', 'Move your first deal to Active Client stage.', 'Deals', 150, 'user-check', 'deal_stage', '{"type": "deal_stage", "stage": "Active Client", "count": 1}'),
  ('first_under_contract', 'First Under Contract', 'Get your first deal under contract.', 'Deals', 300, 'file-text', 'deal_stage', '{"type": "deal_stage", "stage": "Under Contract", "count": 1}'),
  ('first_closed_deal', 'First Closed Deal', 'Close your very first deal!', 'Deals', 500, 'award', 'deal_stage', '{"type": "deal_stage", "stage": "Closed", "count": 1}'),
  ('xp_1000', '1,000 XP Earned', 'Earn a total of 1,000 XP.', 'Milestones', 100, 'star', 'total_xp', '{"type": "total_xp", "count": 1000}'),
  ('planner_streak_5', '5-Day Planner Streak', 'Use the daily planner for 5 consecutive days.', 'Discipline', 200, 'calendar', 'streak', '{"type": "streak", "streak_type": "planner", "count": 5}'),
  ('crm_clean_week', 'CRM Clean Week', 'Keep your CRM fully up-to-date for an entire week.', 'Discipline', 150, 'sparkles', 'weekly_crm_clean', '{"type": "weekly_crm_clean"}'),
  ('hundred_activities', '100 Activities Logged', 'Log 100 total activities in the CRM.', 'Milestones', 250, 'activity', 'total_activities', '{"type": "total_activities", "count": 100}'),
  ('first_meeting', 'First Meeting Logged', 'Log your first meeting.', 'Prospecting', 75, 'users', 'activity_count', '{"type": "activity_count", "activity_type": "Meeting", "count": 1}'),
  ('five_deals', '5 Active Deals', 'Have 5 deals in an active stage at the same time.', 'Deals', 200, 'briefcase', 'active_deals', '{"type": "active_deals", "count": 5}'),
  ('xp_5000', '5,000 XP Earned', 'Earn a total of 5,000 XP.', 'Milestones', 250, 'zap', 'total_xp', '{"type": "total_xp", "count": 5000}'),
  ('first_showing', 'First Showing', 'Log your first property showing.', 'Prospecting', 75, 'home', 'activity_count', '{"type": "activity_count", "activity_type": "Showing", "count": 1}');
