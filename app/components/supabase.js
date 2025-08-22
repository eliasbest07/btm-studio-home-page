import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';

const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

export default supabase;