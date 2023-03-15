export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      models: {
        Row: {
          amp_name: string | null
          created_at: string | null
          description: string | null
          filename: string | null
          id: string
          model_path: string
          profile_id: string
          title: string
        }
        Insert: {
          amp_name?: string | null
          created_at?: string | null
          description?: string | null
          filename?: string | null
          id?: string
          model_path: string
          profile_id: string
          title: string
        }
        Update: {
          amp_name?: string | null
          created_at?: string | null
          description?: string | null
          filename?: string | null
          id?: string
          model_path?: string
          profile_id?: string
          title?: string
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          username?: string
        }
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
