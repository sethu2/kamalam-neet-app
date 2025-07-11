// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vjfxuxvrdcxwvnlhppts.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnh1eHZyZGN4d3ZubGhwcHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjg5OTksImV4cCI6MjA2Nzc0NDk5OX0.9X6PzZ5LbDF7GNsjMIwty0NV8GIFTUxC2s0ym9Nxzvg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
