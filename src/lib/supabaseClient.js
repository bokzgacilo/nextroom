import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://igryzljnbnnxavrvhxkn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlncnl6bGpuYm5ueGF2cnZoeGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMxMTM1MzUsImV4cCI6MTk5ODY4OTUzNX0.N0WTfzR8Fm5TYPxHBkIlvBbYxB1ILBXBYsPJcZGDYqk')