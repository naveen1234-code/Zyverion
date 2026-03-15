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
  const receiptContent = `
ZYVERION PROJECT RECEIPT
------------------------
Project Reference Code: ${latestProjectCode}
Client Name: ${latestLeadName}
Client Email: ${latestLeadEmail}
Service Requested: ${latestLeadService || "-"}
Status: Inquiry Received
Date: ${new Date().toLocaleString()}

This confirms that ZYVERION has received your inquiry successfully.
Please keep this reference code for your agreement and future communication.
  `.trim();

  const blob = new Blob([receiptContent], {
    type: "text/plain;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${latestProjectCode || "ZYVERION-RECEIPT"}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
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