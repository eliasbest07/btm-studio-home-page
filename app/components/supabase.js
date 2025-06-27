import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjoerijzxievtswvnmyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqb2VyaWp6eGlldnRzd3ZubXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUyNjQ2NjAsImV4cCI6MjAyMDg0MDY2MH0.gtrXr1dlzv45Y3eieM8VpUm8yYBY5obBc5b8Jm_jjfw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;