import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gydiqeomupsfiaayxpix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const logoutBtn = document.getElementById("logoutBtn");

const leadCount = document.getElementById("leadCount");
const potentialRevenue = document.getElementById("potentialRevenue");
const wonRevenue = document.getElementById("wonRevenue");

const leadTable = document.getElementById("leadTable");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");

function formatCurrency(value) {
  const number = Number(value) || 0;
  return number.toLocaleString();
}

function safeText(value) {
  return value ?? "";
}

function getStatusClass(status) {
  return `status-${String(status || "new").toLowerCase().replace(/\s+/g, "-")}`;
}

async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "/admin/login.html";
    return null;
  }

  return data.user;
}

async function loadLeads() {
  const user = await requireAuth();
  if (!user || !leadTable) return;

  let leadsQuery = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter.value !== "all") {
    leadsQuery = leadsQuery.eq("status", statusFilter.value);
  }

  const { data: leadsData, error: leadsError } = await leadsQuery;

  const { data: estimatorData, error: estimatorError } = await supabase
    .from("estimator_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (leadsError || estimatorError) {
    console.error("Load leads error:", leadsError || estimatorError);
    leadTable.innerHTML = `<tr><td colspan="7">Failed to load leads.</td></tr>`;

    if (leadCount) leadCount.textContent = "0";
    if (potentialRevenue) potentialRevenue.textContent = "0";
    if (wonRevenue) wonRevenue.textContent = "0";
    return;
  }

  const normalLeads = (leadsData || []).map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    source: "contact",
    service_type: lead.service_type,
    budget_range: lead.budget_range,
    status: lead.status || "new",
    created_at: lead.created_at,
    deal_value: lead.deal_value || 0,
    detail_url: `/admin/lead.html?id=${lead.id}&type=contact`
  }));

  const estimatorLeads = (estimatorData || []).map((lead) => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  source: "estimator",
  service_type: "AI Estimate Request",
  budget_range: "-",
  status: lead.status || "new",
  created_at: lead.created_at,
  deal_value: 0,
  detail_url: `/admin/lead.html?id=${lead.id}&type=estimator`
}));

  let mergedData = [...normalLeads, ...estimatorLeads].sort((a, b) => {
    const aDate = new Date(a.created_at || 0).getTime();
    const bDate = new Date(b.created_at || 0).getTime();
    return bDate - aDate;
  });

  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.trim().toLowerCase();

    mergedData = mergedData.filter((lead) => {
      const name = String(lead.name || "").toLowerCase();
      const email = String(lead.email || "").toLowerCase();
      const service = String(lead.service_type || "").toLowerCase();
      const source = String(lead.source || "").toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        service.includes(term) ||
        source.includes(term)
      );
    });
  }

  if (leadCount) {
    leadCount.textContent = String(mergedData.length);
  }

  const potential = normalLeads.reduce((sum, lead) => {
    return sum + (Number(lead.deal_value) || 0);
  }, 0);

  const won = normalLeads.reduce((sum, lead) => {
    if (String(lead.status || "").toLowerCase() === "won") {
      return sum + (Number(lead.deal_value) || 0);
    }
    return sum;
  }, 0);

  if (potentialRevenue) {
    potentialRevenue.textContent = formatCurrency(potential);
  }

  if (wonRevenue) {
    wonRevenue.textContent = formatCurrency(won);
  }

  leadTable.innerHTML = "";

  if (mergedData.length === 0) {
    leadTable.innerHTML = `<tr><td colspan="7">No leads found.</td></tr>`;
    return;
  }

  mergedData.forEach((lead) => {
    const row = document.createElement("tr");
    const status = lead.status || "new";

    row.innerHTML = `
      <td>${safeText(lead.name)}</td>
      <td>${safeText(lead.email)}</td>
      <td>${safeText(lead.source)}</td>
      <td>${safeText(lead.service_type)}</td>
      <td>${safeText(lead.budget_range)}</td>
      <td>
        <span class="status-badge ${getStatusClass(status)}">
          ${safeText(status)}
        </span>
      </td>
      <td>${lead.created_at ? new Date(lead.created_at).toLocaleString("en-LK", { timeZone: "Asia/Colombo" }) : ""}</td>
    `;

    row.style.cursor = "pointer";

    row.addEventListener("click", () => {
      window.location.href = lead.detail_url;
    });

    leadTable.appendChild(row);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    loadLeads();
  });
}

if (statusFilter) {
  statusFilter.addEventListener("change", () => {
    loadLeads();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (loginStatus) {
      loginStatus.textContent = "Signing in...";
    }

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (loginStatus) {
        loginStatus.textContent = error.message;
      }
      return;
    }

    window.location.href = "/admin/index.html";
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login.html";
  });
}

if (leadTable) {
  loadLeads();
}