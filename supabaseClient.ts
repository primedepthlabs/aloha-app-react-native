import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = "https://qmyqmagfuebhbxcdrork.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteXFtYWdmdWViaGJ4Y2Ryb3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUwOTUsImV4cCI6MjA3NDc0MTA5NX0.Q_H4EQKXusQyqWflP8SFPFoN59IM8jlsDOLxvbv7KO8";

/**
 * Supabase client with AsyncStorage persistence for auth sessions.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
