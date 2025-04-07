// src/features/common/services/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://pielohbjqlcpehhebleg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZWxvaGJqcWxjcGVoaGVibGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTYyOTgsImV4cCI6MjA1OTYzMjI5OH0.t1KIKd_Ma9Tk7vugy5nrObbuzYwCKFNw4PJ8afYx23w';

export const supabase = createClient(supabaseUrl, supabaseKey);