const form = document.getElementById("estimatorForm");
const estimateBtn = document.getElementById("estimateBtn");
const estimateStatus = document.getElementById("estimateStatus");
const estimateResult = document.getElementById("estimateResult");

const FUNCTION_URL =
  "https://gydiqeomupsfiaayxpix.supabase.co/functions/v1/ai-estimator";

const SUPABASE_LEGACY_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    estimateStatus.textContent = "";
    estimateBtn.disabled = true;
    estimateBtn.textContent = "Estimating...";

    try {
      const formData = new FormData(form);

      const payload = {
        business_type: (formData.get("business_type") || "").toString().trim(),
        project_type: (formData.get("project_type") || "").toString().trim(),
        pages_needed: (formData.get("pages_needed") || "").toString().trim(),
        features_needed: (formData.get("features_needed") || "").toString().trim(),
        timeline: (formData.get("timeline") || "").toString().trim(),
        budget: (formData.get("budget") || "").toString().trim(),
        notes: (formData.get("notes") || "").toString().trim()
      };

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_LEGACY_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_LEGACY_ANON_KEY}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Estimator failed.");
      }

      document.getElementById("resultSummary").textContent = result.summary || "";
      document.getElementById("resultPrice").textContent =
        `LKR ${Number(result.price_min || 0).toLocaleString()} - LKR ${Number(result.price_max || 0).toLocaleString()}`;
      document.getElementById("resultTimeline").textContent = result.timeline || "";
      document.getElementById("resultStack").textContent = result.recommended_stack || "";
      document.getElementById("resultConfidence").textContent = result.confidence || "";
      document.getElementById("resultNotes").textContent = result.notes || "";

      estimateResult.style.display = "block";
      estimateStatus.textContent = "Estimate generated successfully.";
    } catch (error) {
      console.error(error);
      estimateStatus.textContent = error.message || "Something went wrong.";
    } finally {
      estimateBtn.disabled = false;
      estimateBtn.textContent = "Estimate Project";
    }
  });
}