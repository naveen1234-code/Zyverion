import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gydiqeomupsfiaayxpix.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new URLSearchParams(window.location.search);
const leadId = params.get("id");

async function loadLead() {

const { data, error } = await supabase
.from("leads")
.select("*")
.eq("id", leadId)
.single();

if(error){

console.error(error);
return;

}

document.getElementById("leadName").textContent=data.name;
document.getElementById("leadEmail").textContent=data.email;
document.getElementById("leadPhone").textContent=data.phone;
document.getElementById("leadService").textContent=data.service_type;
document.getElementById("leadBudget").textContent=data.budget_range;
document.getElementById("leadTimeline").textContent=data.timeline;
document.getElementById("leadMessage").textContent=data.message;

}

loadLead();