export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          total_xp: number
          current_level: number
          rank_title: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          total_xp?: number
          current_level?: number
          rank_title?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          total_xp?: number
          current_level?: number
          rank_title?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_profiles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string | null
          email: string | null
          lead_source: string | null
          status: string
          next_follow_up_date: string | null
          priority: string
          notes: string | null
          tags: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone?: string | null
          email?: string | null
          lead_source?: string | null
          status?: string
          next_follow_up_date?: string | null
          priority?: string
          notes?: string | null
          tags?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string | null
          email?: string | null
          lead_source?: string | null
          status?: string
          next_follow_up_date?: string | null
          priority?: string
          notes?: string | null
          tags?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contacts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      deals: {
        Row: {
          id: string
          user_id: string
          contact_id: string | null
          title: string
          property_address: string | null
          stage: string
          estimated_commission: number
          estimated_close_date: string | null
          priority: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id?: string | null
          title: string
          property_address?: string | null
          stage?: string
          estimated_commission?: number
          estimated_close_date?: string | null
          priority?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string | null
          title?: string
          property_address?: string | null
          stage?: string
          estimated_commission?: number
          estimated_close_date?: string | null
          priority?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'deals_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deals_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          }
        ]
      }
      activities: {
        Row: {
          id: string
          user_id: string
          contact_id: string | null
          deal_id: string | null
          type: string
          title: string
          notes: string | null
          xp_awarded: number
          stat_effects: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id?: string | null
          deal_id?: string | null
          type: string
          title: string
          notes?: string | null
          xp_awarded?: number
          stat_effects?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string | null
          deal_id?: string | null
          type?: string
          title?: string
          notes?: string | null
          xp_awarded?: number
          stat_effects?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_deal_id_fkey'
            columns: ['deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          }
        ]
      }
      quests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          difficulty: string
          xp_reward: number
          source_type: string
          linked_contact_id: string | null
          linked_deal_id: string | null
          due_date: string | null
          status: string
          period: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string
          difficulty?: string
          xp_reward?: number
          source_type?: string
          linked_contact_id?: string | null
          linked_deal_id?: string | null
          due_date?: string | null
          status?: string
          period?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string
          difficulty?: string
          xp_reward?: number
          source_type?: string
          linked_contact_id?: string | null
          linked_deal_id?: string | null
          due_date?: string | null
          status?: string
          period?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quests_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quests_linked_contact_id_fkey'
            columns: ['linked_contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quests_linked_deal_id_fkey'
            columns: ['linked_deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          }
        ]
      }
      achievements: {
        Row: {
          id: string
          key: string
          title: string
          description: string | null
          category: string
          xp_reward: number
          icon: string
          rule_type: string
          rule_config: Json
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          title: string
          description?: string | null
          category: string
          xp_reward?: number
          icon?: string
          rule_type: string
          rule_config?: Json
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          title?: string
          description?: string | null
          category?: string
          xp_reward?: number
          icon?: string
          rule_type?: string
          rule_config?: Json
          created_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          progress_value: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          progress_value?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          progress_value?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_achievements_achievement_id_fkey'
            columns: ['achievement_id']
            isOneToOne: false
            referencedRelation: 'achievements'
            referencedColumns: ['id']
          }
        ]
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          streak_type: string
          current_count: number
          best_count: number
          last_completed_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_type: string
          current_count?: number
          best_count?: number
          last_completed_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_type?: string
          current_count?: number
          best_count?: number
          last_completed_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'streaks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      daily_plans: {
        Row: {
          id: string
          user_id: string
          plan_date: string
          notes: string | null
          completion_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_date: string
          notes?: string | null
          completion_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_date?: string
          notes?: string | null
          completion_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'daily_plans_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      daily_plan_blocks: {
        Row: {
          id: string
          daily_plan_id: string
          title: string
          category: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          linked_quest_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          daily_plan_id: string
          title: string
          category?: string
          start_time: string
          end_time: string
          status?: string
          notes?: string | null
          linked_quest_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          daily_plan_id?: string
          title?: string
          category?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          linked_quest_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'daily_plan_blocks_daily_plan_id_fkey'
            columns: ['daily_plan_id']
            isOneToOne: false
            referencedRelation: 'daily_plans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'daily_plan_blocks_linked_quest_id_fkey'
            columns: ['linked_quest_id']
            isOneToOne: false
            referencedRelation: 'quests'
            referencedColumns: ['id']
          }
        ]
      }
      stat_progress: {
        Row: {
          id: string
          user_id: string
          stat_name: string
          stat_value: number
          level: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stat_name: string
          stat_value?: number
          level?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stat_name?: string
          stat_value?: number
          level?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'stat_progress_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string | null
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
