import { calculateProjectEstimate } from "./pricing-engine.js";

const form = document.getElementById("estimatorForm");
const estimateBtn = document.getElementById("estimateBtn");
const estimateStatus = document.getElementById("estimateStatus");
const estimateResult = document.getElementById("estimateResult");

const startProjectBtn = document.getElementById("startProjectBtn");
const leadPopup = document.getElementById("leadMagnetPopup");
const closeLeadPopup = document.getElementById("closeLeadPopup");
const leadMagnetForm = document.getElementById("leadMagnetForm");
const leadNameInput = document.getElementById("leadName");
const leadEmailInput = document.getElementById("leadEmail");

const FUNCTION_URL =
  "https://gydiqeomupsfiaayxpix.supabase.co/functions/v1/ai-estimator";

const SUPABASE_LEGACY_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

let latestEstimateData = {
  location: "",
  websiteType: "",
  pages: "",
  features: [],
  aiLevel: "",
  timeline: "",
  notes: "",
  min: 0,
  max: 0,
  currency: "LKR",
  summary: "",
  recommendedStack: "",
  confidence: "",
  aiNotes: ""
};

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

function prettifyProjectType(value) {
  const map = {
    landing: "Landing Page",
    business: "Business Website",
    ecommerce: "E-commerce Website",
    booking: "Booking Website / System",
    custom_system: "Custom Web System"
  };
  return map[value] || value || "-";
}

function prettifyLocation(value) {
  const map = {
    sri_lanka: "Sri Lanka",
    international: "International"
  };
  return map[value] || value || "-";
}

function prettifyAiLevel(value) {
  const map = {
    chatbot: "Smart Chatbot",
    assistant: "Business AI Assistant",
    custom_ai: "Custom AI System"
  };
  return map[value] || "No AI feature";
}

function prettifyTimeline(value) {
  const map = {
    normal: "Normal",
    fast: "Fast",
    urgent: "Urgent"
  };
  return map[value] || value || "-";
}

function prettifyFeature(value) {
  const map = {
    contact: "Contact System",
    booking_system: "Booking System",
    payment_gateway: "Payment Gateway",
    admin_dashboard: "Admin Dashboard",
    seo_setup: "SEO Setup",
    analytics: "Analytics"
  };
  return map[value] || value;
}

function openLeadPopup() {
  if (!leadPopup) return;
  leadPopup.style.display = "flex";
}

function closeLeadPopupUI() {
  if (!leadPopup) return;
  leadPopup.style.display = "none";
}

function buildProjectReportPDF(clientName, clientEmail) {
  const jsPDFLib = window.jspdf;
  if (!jsPDFLib) {
    alert("PDF library not loaded.");
    return;
  }

  const { jsPDF } = jsPDFLib;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const colors = {
    bg: [8, 12, 24],
    panel: [15, 23, 42],
    panel2: [11, 18, 36],
    cyan: [6, 182, 212],
    purple: [124, 58, 237],
    white: [255, 255, 255],
    muted: [181, 191, 214],
    soft: [109, 122, 150],
    border: [42, 55, 82],
    green: [34, 197, 94]
  };

  const generatedAt = new Date().toLocaleString();
  const featureText = latestEstimateData.features.length
    ? latestEstimateData.features.map(prettifyFeature).join(", ")
    : "No extra features selected";

  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(20, 28, 50);
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setDrawColor(...colors.purple);
  doc.setLineWidth(0.8);
  doc.line(12, 19, pageWidth - 12, 19);

  doc.setDrawColor(...colors.cyan);
  doc.setLineWidth(0.4);
  doc.line(12, 21.5, pageWidth - 12, 21.5);

  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ZYVERION", 16, 16);

  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text("AI PROJECT REPORT", 16, 25);

  doc.setFillColor(...colors.green);
  doc.roundedRect(pageWidth - 56, 10, 40, 10, 3, 3, "F");
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ESTIMATE", pageWidth - 46, 16.5);

  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Project Estimate Report", 16, 42);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.setFontSize(10);
  const intro = doc.splitTextToSize(
    "This report was generated by the ZYVERION AI Estimator based on the selected project scope, features, delivery timeline, and system complexity.",
    176
  );
  doc.text(intro, 16, 50);

  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 68, pageWidth - 32, 24, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.soft);
  doc.setFontSize(9);
  doc.text("ESTIMATED INVESTMENT", 22, 77);

  doc.setTextColor(...colors.cyan);
  doc.setFontSize(20);
  doc.text(
    formatPriceRange(
      latestEstimateData.min,
      latestEstimateData.max,
      latestEstimateData.currency
    ),
    22,
    87
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.white);
  doc.text("Client Details", 16, 108);

  doc.setFillColor(...colors.panel2);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 113, pageWidth - 32, 50, 5, 5, "FD");

  function drawLabelValue(label, value, x, y, width = 72) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.soft);
    doc.text(label.toUpperCase(), x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...colors.white);
    const wrapped = doc.splitTextToSize(String(value || "-"), width);
    doc.text(wrapped, x, y + 7);
    return wrapped.length;
  }

  drawLabelValue("Client Name", clientName, 22, 124);
  drawLabelValue("Email", clientEmail, 22, 142);
  drawLabelValue("Generated", generatedAt, 112, 124);
  drawLabelValue("Location", prettifyLocation(latestEstimateData.location), 112, 142);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.white);
  doc.text("Project Scope", 16, 178);

  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 183, pageWidth - 32, 54, 5, 5, "FD");

  drawLabelValue("Project Type", prettifyProjectType(latestEstimateData.websiteType), 22, 194, 72);
  drawLabelValue("Pages", latestEstimateData.pages, 22, 212, 72);
  drawLabelValue("AI Level", prettifyAiLevel(latestEstimateData.aiLevel), 112, 194, 72);
  drawLabelValue("Timeline", prettifyTimeline(latestEstimateData.timeline), 112, 212, 72);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.white);
  doc.text("Features & Strategy", 16, 252);

  doc.setFillColor(...colors.panel2);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 257, pageWidth - 32, 28, 5, 5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.soft);
  doc.text("FEATURES", 22, 266);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.white);
  const wrappedFeatures = doc.splitTextToSize(featureText, 166);
  doc.text(wrappedFeatures, 22, 273);

  doc.addPage();

  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(20, 28, 50);
  doc.rect(0, 0, pageWidth, 24, "F");

  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Analysis", 16, 16);

  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 32, pageWidth - 32, 55, 5, 5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...colors.soft);
  doc.text("SUMMARY", 22, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.white);
  const summaryText = doc.splitTextToSize(
    latestEstimateData.summary || "A tailored estimate has been generated based on your selected project requirements.",
    166
  );
  doc.text(summaryText, 22, 49);

  doc.setFillColor(...colors.panel2);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 96, pageWidth - 32, 36, 5, 5, "FD");

  drawLabelValue("Timeline Guidance", latestEstimateData.timelineText || "Based on selected scope", 22, 108, 166);

  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 140, pageWidth - 32, 36, 5, 5, "FD");

  drawLabelValue("Recommended Stack", latestEstimateData.recommendedStack || "Modern web stack with optimized frontend and secure backend integration.", 22, 152, 166);

  doc.setFillColor(...colors.panel2);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 184, pageWidth - 32, 36, 5, 5, "FD");

  drawLabelValue("Confidence", latestEstimateData.confidence || "High", 22, 196, 166);

  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 228, pageWidth - 32, 46, 5, 5, "FD");

  drawLabelValue("Important Notes", latestEstimateData.aiNotes || "This is an estimate range for planning purposes. Final quotation may vary after consultation and full scope review.", 22, 240, 166);

  doc.setDrawColor(...colors.border);
  doc.line(16, 285, pageWidth - 16, 285);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.white);
  doc.setFontSize(10);
  doc.text("ZYVERION", 16, 291);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.muted);
  doc.text("Premium websites, smarter systems, and AI-ready digital experiences.", 42, 291);

  doc.save(`ZYVERION-Project-Report-${clientName.replace(/\s+/g, "-") || "Client"}.pdf`);
}

if (startProjectBtn && leadPopup) {
  startProjectBtn.addEventListener("click", () => {
    openLeadPopup();
  });
}

if (closeLeadPopup && leadPopup) {
  closeLeadPopup.addEventListener("click", () => {
    closeLeadPopupUI();
  });
}

if (leadPopup) {
  leadPopup.addEventListener("click", (e) => {
    if (e.target === leadPopup) {
      closeLeadPopupUI();
    }
  });
}

if (leadMagnetForm) {
  leadMagnetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const clientName = (leadNameInput?.value || "").trim();
    const clientEmail = (leadEmailInput?.value || "").trim();
    const downloadReportBtn = document.getElementById("downloadReportBtn");

    if (!clientName || !clientEmail) {
      return;
    }

    try {
      if (downloadReportBtn) {
        downloadReportBtn.textContent = "Preparing...";
        downloadReportBtn.disabled = true;
      }

      const response = await fetch(
        "https://gydiqeomupsfiaayxpix.supabase.co/functions/v1/save-estimator-lead",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: clientName,
            email: clientEmail
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save lead.");
      }

      buildProjectReportPDF(clientName, clientEmail);
      closeLeadPopupUI();
      leadMagnetForm.reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving your details.");
    } finally {
      if (downloadReportBtn) {
        downloadReportBtn.textContent = "Download Full Report";
        downloadReportBtn.disabled = false;
      }
    }
  });
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

        latestEstimateData = {
          location,
          websiteType,
          pages,
          features,
          aiLevel,
          timeline,
          notes,
          min: 0,
          max: 0,
          currency: location === "international" ? "USD" : "LKR",
          summary:
            "This project falls under a custom system request. Custom systems require consultation before pricing because scope, integrations, and workflow complexity can vary significantly.",
          recommendedStack: "To be recommended after consultation",
          confidence: "High",
          aiNotes:
            "Submit your inquiry and ZYVERION will prepare a tailored quote based on your exact requirements.",
          timelineText: "Depends on final scope"
        };

        estimateResult.style.display = "block";
        estimateResult.scrollIntoView({ behavior: "smooth", block: "start" });
        estimateStatus.textContent = "Custom system request requires consultation.";
        return;
      }

      const estimate = calculateProjectEstimate({
        location,
        websiteType,
        pages,
        features,
        aiLevel,
        timeline
      });

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

      const summary =
        result.summary || "A tailored project estimate has been generated based on your selected requirements.";
      const timelineText =
        result.timeline || "Based on selected scope";
      const recommendedStack =
        result.recommended_stack || "Recommended after scope review";
      const confidence =
        result.confidence || "Medium";
      const aiNotes =
        result.notes || "This is an estimate range and final quotation may vary after discussion.";

      document.getElementById("resultSummary").textContent = summary;
      document.getElementById("resultPrice").textContent =
        formatPriceRange(estimate.min, estimate.max, estimate.currency);
      document.getElementById("resultTimeline").textContent = timelineText;
      document.getElementById("resultStack").textContent = recommendedStack;
      document.getElementById("resultConfidence").textContent = confidence;
      document.getElementById("resultNotes").textContent = aiNotes;

      latestEstimateData = {
        location,
        websiteType,
        pages,
        features,
        aiLevel,
        timeline,
        notes,
        min: estimate.min,
        max: estimate.max,
        currency: estimate.currency,
        summary,
        recommendedStack,
        confidence,
        aiNotes,
        timelineText
      };

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