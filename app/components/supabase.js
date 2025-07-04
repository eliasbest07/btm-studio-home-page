import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://efiarbtzeotqfykaqpjq.supabase.co';

const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

export default supabase;