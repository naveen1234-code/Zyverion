import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gydiqeomupsfiaayxpix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const logoutBtn = document.getElementById("logoutBtn");
const leadCount = document.getElementById("leadCount");
const leadTable = document.getElementById("leadTable");

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

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter.value !== "all") {
    query = query.eq("status", statusFilter.value);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    leadTable.innerHTML = `<tr><td colspan="6">Failed to load leads.</td></tr>`;
    return;
  }

let filteredData = data || [];

  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.trim().toLowerCase();

    filteredData = data.filter((lead) => {
      const name = (lead.name || "").toLowerCase();
      const email = (lead.email || "").toLowerCase();
      const service = (lead.service_type || "").toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        service.includes(term)
      );
    });
  }

  if (leadCount) {
    leadCount.textContent = filteredData.length;
  }

  leadTable.innerHTML = "";

  filteredData.forEach((lead) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${lead.name ?? ""}</td>
      <td>${lead.email ?? ""}</td>
      <td>${lead.service_type ?? ""}</td>
      <td>${lead.budget_range ?? ""}</td>
      <td>
        <span class="status-badge status-${(lead.status ?? "new").replace(/\s+/g, "-")}">
          ${lead.status ?? "new"}
        </span>
      </td>
      <td>${lead.created_at ? new Date(lead.created_at).toLocaleString() : ""}</td>
    `;

    row.style.cursor = "pointer";

    row.addEventListener("click", () => {
      window.location.href = "/admin/lead.html?id=" + lead.id;
    });

    leadTable.appendChild(row);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginStatus.textContent = "Signing in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      loginStatus.textContent = error.message;
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