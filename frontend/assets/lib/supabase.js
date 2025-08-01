import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://vkuzwenqldmtvbksolgo.supabase.co';
const supabaseAPIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdXp3ZW5xbGRtdHZia3NvbGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTIyMzYsImV4cCI6MjA2OTM2ODIzNn0.unf9o_MJRuWsKw5zvsHY2_82sXzxt49PYXsFcw67O0A'

export const supabase = createClient(supabaseURL, supabaseAPIKey);