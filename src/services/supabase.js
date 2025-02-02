import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://siahckyrokudqpnuipha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpYWhja3lyb2t1ZHFwbnVpcGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjYzNDAsImV4cCI6MjA1MTE0MjM0MH0.LhD2ARj6ZuPGAcoEpiVMp0q_vlyBhmDUsuhTc3Nn644";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
