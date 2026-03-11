import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://gydiqeomupsfiaayxpix.supabase.co";
const supabaseKey = "PASTE_YOUR_sb_publishable_KEY_HERE";

export const supabase = createClient(supabaseUrl, supabaseKey);