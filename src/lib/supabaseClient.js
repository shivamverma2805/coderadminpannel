import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oglydbjdljmgbwqifkke.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbHlkYmpkbGptZ2J3cWlma2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTMyMTUsImV4cCI6MjA2NDE2OTIxNX0.b2W_P45p-_ZyuHPysWw2Wq44hFeKP2wTRIbDww9_MZ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);