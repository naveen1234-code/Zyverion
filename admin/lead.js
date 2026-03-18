import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gydiqeomupsfiaayxpix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const params = new URLSearchParams(window.location.search);
const leadId = params.get("id");
const leadType = params.get("type") || "contact";

const statusSelect = document.getElementById("statusSelect");
const saveStatusBtn = document.getElementById("saveStatusBtn");
const statusMessage = document.getElementById("statusMessage");

const leadNotes = document.getElementById("leadNotes");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const notesMessage = document.getElementById("notesMessage");

const dealValueInput = document.getElementById("dealValueInput");
const saveDealValueBtn = document.getElementById("saveDealValueBtn");
const dealValueMessage = document.getElementById("dealValueMessage");

const leadFiles = document.getElementById("leadFiles");
const leadTypeChip = document.getElementById("leadTypeChip");

const phoneCard = document.getElementById("phoneCard");
const serviceCard = document.getElementById("serviceCard");
const budgetCard = document.getElementById("budgetCard");
const timelineCard = document.getElementById("timelineCard");

const pipelinePanel = document.getElementById("pipelinePanel");
const messagePanel = document.getElementById("messagePanel");
const notesPanel = document.getElementById("notesPanel");
const filesPanel = document.getElementById("filesPanel");
const estimatorPanel = document.getElementById("estimatorPanel");

function setMessage(element, text, isError = false) {
  if (!element) return;
  element.textContent = text;
  element.style.color = isError ? "#fecdd3" : "#86efac";
}

function safeText(value) {
  return value ?? "";
}

function hideElement(element) {
  if (element) {
    element.style.display = "none";
  }
}

async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "/admin/login.html";
    return null;
  }

  return data.user;
}

function applyEstimatorLeadMode() {
  if (leadTypeChip) {
    leadTypeChip.textContent = "Estimator Lead";
  }

  hideElement(phoneCard);
  hideElement(serviceCard);
  hideElement(budgetCard);
  hideElement(timelineCard);
  hideElement(messagePanel);
  hideElement(filesPanel);

  if (estimatorPanel) {
    estimatorPanel.style.display = "block";
  }
}

async function loadContactLead() {
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadError) {
    console.error("Lead load error:", leadError);
    const nameEl = document.getElementById("leadName");
    if (nameEl) {
      nameEl.textContent = "Failed to load lead.";
    }
    return;
  }

  if (leadTypeChip) {
    leadTypeChip.textContent = "Client Lead Record";
  }

  document.getElementById("leadName").textContent = safeText(lead.name);
  document.getElementById("leadEmail").textContent = safeText(lead.email);
  document.getElementById("leadPhone").textContent = safeText(lead.phone);
  document.getElementById("leadService").textContent = safeText(lead.service_type);
  document.getElementById("leadBudget").textContent = safeText(lead.budget_range);
  document.getElementById("leadTimeline").textContent = safeText(lead.timeline);
  document.getElementById("leadSource").textContent = "contact";
  document.getElementById("leadCreated").textContent = lead.created_at
  ? new Date(lead.created_at).toLocaleString("en-LK", { timeZone: "Asia/Colombo" })
  : "";
  document.getElementById("leadMessage").textContent = safeText(lead.message);

  if (dealValueInput) {
    dealValueInput.value = lead.deal_value ?? "";
  }

  if (statusSelect) {
    statusSelect.value = lead.status ?? "new";
  }

  if (leadNotes) {
    leadNotes.value = lead.notes ?? "";
  }

  const { data: files, error: filesError } = await supabase
    .from("lead_files")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (!leadFiles) return;

  if (filesError) {
    console.error("Files load error:", filesError);
    leadFiles.textContent = "Failed to load files.";
    return;
  }

  if (!files || files.length === 0) {
    leadFiles.textContent = "No files uploaded.";
    return;
  }

  leadFiles.innerHTML = "";

  files.forEach((file) => {
    const fileRow = document.createElement("div");
    fileRow.className = "admin-file-row";

    const link = document.createElement("a");
    link.href = `${SUPABASE_URL}/storage/v1/object/public/lead-uploads/${file.file_path}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = file.file_name;
    link.className = "admin-file-link";

    const meta = document.createElement("div");
    meta.className = "admin-file-meta";
    meta.textContent = `${file.file_type || "unknown"} • ${file.file_size || 0} bytes`;

    fileRow.appendChild(link);
    fileRow.appendChild(meta);
    leadFiles.appendChild(fileRow);
  });
}

async function loadEstimatorLead() {
  applyEstimatorLeadMode();

  const { data: lead, error } = await supabase
    .from("estimator_leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error) {
    console.error("Estimator lead load error:", error);
    const nameEl = document.getElementById("leadName");
    if (nameEl) {
      nameEl.textContent = "Failed to load estimator lead.";
    }
    return;
  }

  document.getElementById("leadName").textContent = safeText(lead.name);
  document.getElementById("leadEmail").textContent = safeText(lead.email);
  document.getElementById("leadSource").textContent = "estimator";
  document.getElementById("leadCreated").textContent = lead.created_at
  ? new Date(lead.created_at).toLocaleString("en-LK", { timeZone: "Asia/Colombo" })
  : "";

  document.getElementById("estimatorProjectType").textContent = safeText(lead.project_type);
  document.getElementById("estimatorPages").textContent = safeText(lead.pages);
  document.getElementById("estimatorAiLevel").textContent = safeText(lead.ai_level);
  document.getElementById("estimatorTimeline").textContent = safeText(lead.timeline);
  document.getElementById("estimatorFeatures").textContent = safeText(lead.features);
  document.getElementById("estimatorPriceMin").textContent =
    lead.price_min ? `${lead.currency || "LKR"} ${Number(lead.price_min).toLocaleString()}` : "-";
  document.getElementById("estimatorPriceMax").textContent =
    lead.price_max ? `${lead.currency || "LKR"} ${Number(lead.price_max).toLocaleString()}` : "-";
  document.getElementById("estimatorNotes").textContent = safeText(lead.notes);
  if (statusSelect) {
  statusSelect.value = lead.status || "new";
}

if (leadNotes) {
  leadNotes.value = lead.internal_notes || "";
}

if (dealValueInput) {
  dealValueInput.value = "";
}
}

async function loadLead() {
  const user = await requireAuth();
  if (!user || !leadId) return;

  if (leadType === "estimator") {
    await loadEstimatorLead();
    return;
  }

  await loadContactLead();
}

if (saveStatusBtn) {
  saveStatusBtn.addEventListener("click", async () => {
    setMessage(statusMessage, "Saving...", false);

    const tableName = leadType === "estimator" ? "estimator_leads" : "leads";

    const { error } = await supabase
      .from(tableName)
      .update({ status: statusSelect.value })
      .eq("id", leadId);

    if (error) {
      console.error("Status save error:", error);
      setMessage(statusMessage, "Failed to save status.", true);
      return;
    }

    setMessage(statusMessage, "Status updated successfully.");
  });
}

if (saveDealValueBtn) {
  saveDealValueBtn.addEventListener("click", async () => {
    if (leadType !== "contact") return;

    setMessage(dealValueMessage, "Saving...", false);

    const rawValue = dealValueInput.value.trim();
    const value = rawValue === "" ? null : Number(rawValue);

    if (rawValue !== "" && Number.isNaN(value)) {
      setMessage(dealValueMessage, "Enter a valid number.", true);
      return;
    }

    const { error } = await supabase
      .from("leads")
      .update({ deal_value: value })
      .eq("id", leadId);

    if (error) {
      console.error("Deal value save error:", error);
      setMessage(dealValueMessage, "Failed to save deal value.", true);
      return;
    }

    setMessage(dealValueMessage, "Deal value saved.");
  });
}

if (saveNotesBtn) {
  saveNotesBtn.addEventListener("click", async () => {
    setMessage(notesMessage, "Saving...", false);

    const tableName = leadType === "estimator" ? "estimator_leads" : "leads";
    const updateData =
      leadType === "estimator"
        ? { internal_notes: leadNotes.value }
        : { notes: leadNotes.value };

    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", leadId);

    if (error) {
      console.error("Notes save error:", error);
      setMessage(notesMessage, "Failed to save notes.", true);
      return;
    }

    setMessage(notesMessage, "Notes updated successfully.");
  });
}

loadLead();