const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const projectFilesInput = document.getElementById("projectFiles");
const formLoadedAtInput = document.getElementById("formLoadedAt");

const FUNCTION_URL =
  "https://gydiqeomupsfiaayxpix.supabase.co/functions/v1/submit-lead";

/*
  IMPORTANT:
  Use your LEGACY anon key here, not sb_publishable_...
*/
const SUPABASE_LEGACY_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGlxZW9tdXBzZmlhYXl4cGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg2NDgsImV4cCI6MjA4ODc5NDY0OH0.K5GA_Ib4ouUhJ_-kBv7DlP1cZGRfpmU1DwXc8KBBXJo";

// Popup elements
const successPopup = document.getElementById("successPopup");
const popupProjectCode = document.getElementById("popupProjectCode");
const copyProjectCodeBtn = document.getElementById("copyProjectCodeBtn");
const closePopupBtn = document.getElementById("closePopupBtn");
const downloadReceiptBtn = document.getElementById("downloadReceiptBtn");
const whatsappProjectBtn = document.getElementById("whatsappProjectBtn");
const popupConfettiCanvas = document.getElementById("popupConfettiCanvas");

const receiptClientName = document.getElementById("receiptClientName");
const receiptClientEmail = document.getElementById("receiptClientEmail");
const receiptService = document.getElementById("receiptService");

// Latest submitted values
let latestProjectCode = "";
let latestLeadName = "";
let latestLeadEmail = "";
let latestLeadService = "";

function setFormLoadedTime() {
  if (formLoadedAtInput) {
    formLoadedAtInput.value = String(Date.now());
  }
}

function openSuccessPopup() {
  if (!successPopup) return;
  successPopup.style.display = "flex";
  launchPopupConfetti();
}

function closeSuccessPopup() {
  if (!successPopup) return;
  successPopup.style.display = "none";
}

function downloadReceiptFile() {
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
    green: [34, 197, 94],
    white: [255, 255, 255],
    muted: [180, 190, 210],
    soft: [90, 105, 135],
    border: [42, 55, 82]
  };

  const issueDate = new Date().toLocaleString();

  // Background
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Soft top glow bands
  doc.setFillColor(22, 32, 58);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setDrawColor(...colors.purple);
  doc.setLineWidth(0.8);
  doc.line(12, 18, pageWidth - 12, 18);

  doc.setDrawColor(...colors.cyan);
  doc.setLineWidth(0.4);
  doc.line(12, 20.5, pageWidth - 12, 20.5);

  // Header brand
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ZYVERION", 16, 15);

  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text("PROJECT RECEIPT / INQUIRY CONFIRMATION", 16, 24);

  // Status pill
  doc.setFillColor(...colors.green);
  doc.roundedRect(pageWidth - 58, 10, 42, 10, 3, 3, "F");
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("RECEIVED", pageWidth - 48, 16.5);

  // Main title
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Inquiry Receipt", 16, 42);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.setFontSize(10);
  const subtitle = doc.splitTextToSize(
    "This document confirms that your project inquiry was successfully submitted to ZYVERION. Keep this receipt for your records and use the reference code for future communication.",
    175
  );
  doc.text(subtitle, 16, 50);

  // Reference code card
  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 68, pageWidth - 32, 24, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...colors.soft);
  doc.text("PROJECT REFERENCE CODE", 22, 77);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...colors.cyan);
  doc.text(latestProjectCode || "ZYV-UNKNOWN", 22, 87);

  // Details section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.white);
  doc.text("Client Details", 16, 108);

  // Details panel
  doc.setFillColor(...colors.panel2);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 113, pageWidth - 32, 58, 5, 5, "FD");

  const leftX = 22;
  const rightX = 110;
  let y1 = 124;
  let y2 = 124;

  function drawLabelValue(label, value, x, y) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.soft);
    doc.text(label.toUpperCase(), x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...colors.white);
    const wrapped = doc.splitTextToSize(String(value || "-"), 72);
    doc.text(wrapped, x, y + 7);
    return wrapped.length;
  }

  const linesA = drawLabelValue("Client Name", latestLeadName || "-", leftX, y1);
  y1 += 14 + (linesA - 1) * 5;

  const linesB = drawLabelValue("Email", latestLeadEmail || "-", leftX, y1);
  y1 += 14 + (linesB - 1) * 5;

  const linesC = drawLabelValue("Service", latestLeadService || "-", rightX, y2);
  y2 += 14 + (linesC - 1) * 5;

  const linesD = drawLabelValue("Issue Date", issueDate, rightX, y2);

  // Receipt status card
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.white);
  doc.text("Submission Status", 16, 186);

  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 191, pageWidth - 32, 26, 5, 5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...colors.green);
  doc.text("Inquiry Received Successfully", 22, 203);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.muted);
  doc.text("Your request has entered the ZYVERION system and is ready for review.", 22, 211);

  // Notes section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.white);
  doc.text("Important Notes", 16, 232);

  doc.setFillColor(...colors.panel2);
  doc.setDrawColor(...colors.border);
  doc.roundedRect(16, 237, pageWidth - 32, 34, 5, 5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.muted);
  const notes = [
    "• Save your project reference code for your contract, quotation, invoice, and future updates.",
    "• You may contact ZYVERION on WhatsApp and mention this code for faster support.",
    "• This receipt confirms inquiry submission only and is not a final quotation or agreement."
  ];

  let noteY = 247;
  notes.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 170);
    doc.text(wrapped, 22, noteY);
    noteY += wrapped.length * 5.2;
  });

  // Footer
  doc.setDrawColor(...colors.border);
  doc.line(16, 279, pageWidth - 16, 279);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.white);
  doc.text("ZYVERION", 16, 286);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.muted);
  doc.text("Premium websites, smarter systems, and AI-ready digital experiences.", 16, 291);

  doc.text("Email: zyverion2025@gmail.com", pageWidth - 74, 286);
  doc.text("WhatsApp: +94 77 587 7952", pageWidth - 74, 291);

  doc.save(`${latestProjectCode || "ZYVERION-RECEIPT"}.pdf`);
}

function launchPopupConfetti() {
  if (!popupConfettiCanvas) return;

  const canvas = popupConfettiCanvas;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pieces = [];
  const colors = ["#7c3aed", "#06b6d4", "#22c55e", "#ffffff", "#60a5fa"];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: rect.width / 2,
      y: rect.height * 0.18,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -6 - 2,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.14,
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, rect.width, rect.height);

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.012;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    frame += 1;

    if (frame < 120) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
  }

  animate();
}

// Set initial load time
setFormLoadedTime();

// Popup close
if (closePopupBtn) {
  closePopupBtn.addEventListener("click", () => {
    closeSuccessPopup();
  });
}

// Click outside popup to close
if (successPopup) {
  successPopup.addEventListener("click", (e) => {
    if (e.target === successPopup) {
      closeSuccessPopup();
    }
  });
}

// Copy project code
if (copyProjectCodeBtn && popupProjectCode) {
  copyProjectCodeBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(popupProjectCode.textContent || "");
      copyProjectCodeBtn.textContent = "Copied!";
      copyProjectCodeBtn.classList.add("copied");

      setTimeout(() => {
        copyProjectCodeBtn.textContent = "Copy";
        copyProjectCodeBtn.classList.remove("copied");
      }, 2000);
    } catch (err) {
      copyProjectCodeBtn.textContent = "Failed";

      setTimeout(() => {
        copyProjectCodeBtn.textContent = "Copy";
      }, 2000);
    }
  });
}

// Download receipt
if (downloadReceiptBtn) {
  downloadReceiptBtn.addEventListener("click", () => {
    downloadReceiptFile();
  });
}

// WhatsApp project
if (whatsappProjectBtn) {
  whatsappProjectBtn.addEventListener("click", () => {
    const message = `Hello ZYVERION,

I submitted a project inquiry.

Project Code: ${latestProjectCode}

Name: ${latestLeadName}
Service: ${latestLeadService || "-"}
`;

    const url = `https://wa.me/94775877952?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (formStatus) {
      formStatus.textContent = "";
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const files = Array.from(projectFilesInput?.files || []);

      if (files.length > 3) {
        throw new Error("Please upload a maximum of 3 files.");
      }

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/pdf"
      ];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Only PNG, JPG, WEBP, and PDF files are allowed.");
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Each file must be smaller than 5 MB.");
        }
      }

      const formData = new FormData(form);

      // Make sure timing field exists
      if (!formData.get("formLoadedAt")) {
        formData.set("formLoadedAt", String(Date.now()));
      }

      // Backend expects "projectFiles"
      formData.delete("projectFiles");
      for (const file of files) {
        formData.append("projectFiles", file);
      }

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          apikey: SUPABASE_LEGACY_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_LEGACY_ANON_KEY}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      // Save latest values
      latestProjectCode = result.project_code || "";
      latestLeadName = formData.get("name")?.toString() || "";
      latestLeadEmail = formData.get("email")?.toString() || "";
      latestLeadService = formData.get("service")?.toString() || "";

      // Fill popup
      if (popupProjectCode) {
        popupProjectCode.textContent = latestProjectCode;
      }

      if (receiptClientName) {
        receiptClientName.textContent = latestLeadName;
      }

      if (receiptClientEmail) {
        receiptClientEmail.textContent = latestLeadEmail;
      }

      if (receiptService) {
        receiptService.textContent = latestLeadService || "-";
      }

      if (copyProjectCodeBtn) {
        copyProjectCodeBtn.textContent = "Copy";
        copyProjectCodeBtn.classList.remove("copied");
      }

      if (formStatus) {
        formStatus.textContent = "";
      }

      form.reset();
      setFormLoadedTime();
      openSuccessPopup();
    } catch (error) {
      console.error("Submit error:", error);

      if (formStatus) {
        formStatus.textContent =
          error instanceof Error
            ? error.message
            : "Something went wrong while sending your inquiry.";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Inquiry";
      }
    }
  });
}