import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohviyawkiwacafwodbbr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odml5YXdraXdhY2Fmd29kYmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDUyMDksImV4cCI6MjEwMDEyMTIwOX0.tO0VYOYK3WNw4MiA_6oYfER8sLd7c9owsmTtz0qQUW8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
