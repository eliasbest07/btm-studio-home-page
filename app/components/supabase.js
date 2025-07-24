import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!,

const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

export default supabase;