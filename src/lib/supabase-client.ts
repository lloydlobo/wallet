import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';

// dotenv.config();
const SUPABASE_PROJECT_URL = "https://tcezhwokkqosvmjkqoda.supabase.co"
const SUPABASE_PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZXpod29ra3Fvc3Ztamtxb2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4MDM3NTYsImV4cCI6MTk5OTM3OTc1Nn0.IhG8R3PaHuYVEaX2TDxz7ezaNNhTLOEWQ_mamkCCw6U";
// const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL ?? '';
// const SUPABASE_PUBLIC_ANON_KEY = process.env.SUPABASE_PUBLIC_ANON_KEY ?? '';

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY);

