import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://dmuuflbtzxoverwvzlak.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EL84MrbhdL66KKNp5jCz6A_IKop7zdD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
