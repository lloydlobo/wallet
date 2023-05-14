export type TDatabaseExpense = Database["public"]["Tables"]["expenses"]["Row"];

// NOTE: Generate types with Supabase CLI or download from dashboard in API>(Generating types) 
// @source https://supabase.com/docs/guides/api/rest/generating-types

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
      expenses: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: number
          is_cash: boolean
          name: string
          owner: string
          transaction_date: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: number
          is_cash: boolean
          name: string
          owner: string
          transaction_date?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: number
          is_cash?: boolean
          name?: string
          owner?: string
          transaction_date?: string | null
          updated_at?: string
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
