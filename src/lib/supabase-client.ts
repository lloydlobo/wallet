import { createClient } from '@supabase/supabase-js'

// See https://vitejs.dev/guide/env-and-mode.html

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
