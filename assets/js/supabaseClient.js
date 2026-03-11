import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://gydiqeomupsfiaayxpix.supabase.co";
const supabaseKey = "sb_publishable_GrvrURzXo72ECksExlKHpw_aVBmZnBD";

export const supabase = createClient(supabaseUrl, supabaseKey);