// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cjigvcwjfmpopyefpqgz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqaWd2Y3dqZm1wb3B5ZWZwcWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Nzg4MjMsImV4cCI6MjA1ODA1NDgyM30.ASFMgM4KO4Og5hPblalySRA7xm-hiSpg5fX69t2OCtk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);