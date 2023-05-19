import { z } from 'zod';

export const rowExpenseSchema = z.object({
  amount: z.number(),
  created_at: z.string().nullable(), // TODO: Migrate this to be known, only if we don't overwrite it.
  description: z.string().nullable(),
  id: z.number(),
  is_cash: z.boolean(),
  name: z.string(),
  owner: z.string(),
  transaction_date: z.string().nullable(),
  updated_at: z.string(),
});

export const insertExpenseSchema = z.object({
  amount: z.number(),
  created_at: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  id: z.number().optional(),
  is_cash: z.boolean(),
  name: z.string(),
  owner: z.string(),
  transaction_date: z.string().nullable().optional(),
  updated_at: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  amount: z.number().optional(),
  created_at: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  id: z.number().optional(),
  is_cash: z.boolean().optional(),
  name: z.string().optional(),
  owner: z.string().optional(),
  transaction_date: z.string().nullable().optional(),
  updated_at: z.string().optional(),
});

export type TRowExpense = z.infer<typeof rowExpenseSchema>;
export type TInsertExpense = z.infer<typeof insertExpenseSchema>;
export type TUpdateExpense = z.infer<typeof updateExpenseSchema>;

interface Tables {
  expenses: {
    Row: TRowExpense;
    Insert: TInsertExpense;
    Update: TUpdateExpense;
  };
}

export type TDatabaseExpense = Database['public']['Tables']['expenses']['Row'];

// NOTE: Generate types with Supabase CLI or download from dashboard in API>(Generating types)
// @source https://supabase.com/docs/guides/api/rest/generating-types

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          amount: number;
          created_at: string | null;
          description: string | null;
          id: number;
          is_cash: boolean;
          name: string;
          owner: string;
          transaction_date: string | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          is_cash: boolean;
          name: string;
          owner: string;
          transaction_date?: string | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          is_cash?: boolean;
          name?: string;
          owner?: string;
          transaction_date?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
