import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gydiqeomupsfiaayxpix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const params = new URLSearchParams(window.location.search);
const leadId = params.get("id");

const statusSelect = document.getElementById("statusSelect");
const saveStatusBtn = document.getElementById("saveStatusBtn");
const statusMessage = document.getElementById("statusMessage");

async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "/admin/login.html";
    return null;
  }

  return data.user;
}

async function loadLead() {
  const user = await requireAuth();
  if (!user || !leadId) return;

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadError) {
    console.error(leadError);
    return;
  }

  document.getElementById("leadName").textContent = lead.name ?? "";
  document.getElementById("leadEmail").textContent = lead.email ?? "";
  document.getElementById("leadPhone").textContent = lead.phone ?? "";
  document.getElementById("leadService").textContent = lead.service_type ?? "";
  document.getElementById("leadBudget").textContent = lead.budget_range ?? "";
  document.getElementById("leadTimeline").textContent = lead.timeline ?? "";
  document.getElementById("leadCreated").textContent = lead.created_at
    ? new Date(lead.created_at).toLocaleString()
    : "";
  document.getElementById("leadMessage").textContent = lead.message ?? "";

  if (statusSelect) {
    statusSelect.value = lead.status ?? "new";
  }

  const { data: files, error: filesError } = await supabase
    .from("lead_files")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  const leadFiles = document.getElementById("leadFiles");

  if (filesError) {
    console.error(filesError);
    leadFiles.textContent = "Failed to load files.";
    return;
  }

  if (!files || files.length === 0) {
    leadFiles.textContent = "No files uploaded.";
    return;
  }

  leadFiles.innerHTML = "";

  files.forEach((file) => {
    const row = document.createElement("div");
    row.style.padding = "12px 0";
    row.style.borderBottom = "1px solid #334155";

    const link = document.createElement("a");
    link.href = `${SUPABASE_URL}/storage/v1/object/public/lead-uploads/${file.file_path}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = file.file_name;
    link.style.color = "#a78bfa";
    link.style.textDecoration = "none";

    const meta = document.createElement("div");
    meta.style.color = "#94a3b8";
    meta.style.fontSize = "14px";
    meta.style.marginTop = "4px";
    meta.textContent = `${file.file_type || "unknown"} • ${file.file_size || 0} bytes`;

    row.appendChild(link);
    row.appendChild(meta);
    leadFiles.appendChild(row);
  });
}

if (saveStatusBtn) {
  saveStatusBtn.addEventListener("click", async () => {
    statusMessage.textContent = "Saving...";

    const { error } = await supabase
      .from("leads")
      .update({ status: statusSelect.value })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      statusMessage.textContent = "Failed to save status.";
      return;
    }

    statusMessage.textContent = "Status updated successfully.";
  });
}

loadLead();