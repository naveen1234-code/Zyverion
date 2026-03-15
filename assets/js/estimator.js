import { calculateProjectEstimate } from "./pricing-engine.js";

const form = document.getElementById("estimatorForm");
const estimateBtn = document.getElementById("estimateBtn");
const estimateStatus = document.getElementById("estimateStatus");
const estimateResult = document.getElementById("estimateResult");

const FUNCTION_URL =
  "https://gydiqeomupsfiaayxpix.supabase.co/functions/v1/ai-estimator";

const SUPABASE_LEGACY_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

function getSelectedFeatures(formEl) {
  return Array.from(
    formEl.querySelectorAll('input[name="features"]:checked')
  ).map((input) => input.value);
}

function formatPriceRange(min, max, currency) {
  if (currency === "USD") {
    return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
  }

  return `LKR ${Number(min).toLocaleString()} - LKR ${Number(max).toLocaleString()}`;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    estimateStatus.textContent = "";
    estimateBtn.disabled = true;
    estimateBtn.textContent = "Estimating...";
    document.body.classList.add("ai-estimating");

    try {
      const formData = new FormData(form);

      const location = (formData.get("location") || "").toString().trim();
      const websiteType = (formData.get("websiteType") || "").toString().trim();
      const pages = (formData.get("pages") || "").toString().trim();
      const aiLevel = (formData.get("aiLevel") || "").toString().trim();
      const timeline = (formData.get("timeline") || "").toString().trim();
      const notes = (formData.get("notes") || "").toString().trim();

      const features = getSelectedFeatures(form);

      if (!location || !websiteType || !pages || !timeline) {
        throw new Error("Please fill all required estimator fields.");
      }

      // Custom systems should not auto-price
      if (websiteType === "custom_system") {
        document.getElementById("resultSummary").textContent =
          "This project falls under a custom system request. Custom systems require consultation before pricing because scope, integrations, and workflow complexity can vary significantly.";

        document.getElementById("resultPrice").textContent =
          "Consultation Required";

        document.getElementById("resultTimeline").textContent =
          "Depends on final scope";

        document.getElementById("resultStack").textContent =
          "To be recommended after consultation";

        document.getElementById("resultConfidence").textContent =
          "High";

        document.getElementById("resultNotes").textContent =
          "Submit your inquiry and ZYVERION will prepare a tailored quote based on your exact requirements.";

        estimateResult.style.display = "block";
        estimateResult.scrollIntoView({ behavior: "smooth", block: "start" });
        estimateStatus.textContent = "Custom system request requires consultation.";
        return;
      }

      // Local pricing engine
      const estimate = calculateProjectEstimate({
        location,
        websiteType,
        pages,
        features,
        aiLevel,
        timeline
      });

      // Send structured payload to AI for explanation only
      const payload = {
        location,
        website_type: websiteType,
        pages,
        features,
        ai_level: aiLevel,
        timeline,
        notes,
        price_min: estimate.min,
        price_max: estimate.max,
        currency: estimate.currency
      };

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_LEGACY_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_LEGACY_ANON_KEY}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Estimator failed.");
      }

      document.getElementById("resultSummary").textContent =
        result.summary || "A tailored project estimate has been generated based on your selected requirements.";

      document.getElementById("resultPrice").textContent =
        formatPriceRange(estimate.min, estimate.max, estimate.currency);

      document.getElementById("resultTimeline").textContent =
        result.timeline || "Based on selected scope";

      document.getElementById("resultStack").textContent =
        result.recommended_stack || "Recommended after scope review";

      document.getElementById("resultConfidence").textContent =
        result.confidence || "Medium";

      document.getElementById("resultNotes").textContent =
        result.notes || "This is an estimate range and final quotation may vary after discussion.";

      estimateResult.style.display = "block";
      estimateResult.scrollIntoView({ behavior: "smooth", block: "start" });
      estimateStatus.textContent = "Estimate generated successfully.";
    } catch (error) {
      console.error(error);
      estimateStatus.textContent =
        error instanceof Error ? error.message : "Something went wrong.";
    } finally {
      document.body.classList.remove("ai-estimating");
      estimateBtn.disabled = false;
      estimateBtn.textContent = "Run AI Estimation";
    }
  });
}