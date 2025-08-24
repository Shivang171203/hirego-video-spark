const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


// Supabase configuration - hardcoded for reliability
const SUPABASE_URL = 'https://pjskxvmvnfycfqtjoupe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2t4dm12bmZ5Y2ZxdGpvdXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjk5OTUsImV4cCI6MjA2NDAwNTk5NX0.sTGjpgyTr5LIQdUMBJWymrhb-f06anwbLrfgszD2TEw';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

module.exports = supabase; 