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

function setFormLoadedTime() {
  if (formLoadedAtInput) {
    formLoadedAtInput.value = String(Date.now());
  }
}

setFormLoadedTime();

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

      // Make sure the timing field is present and fresh
      if (!formData.get("formLoadedAt")) {
        formData.set("formLoadedAt", String(Date.now()));
      }

      // IMPORTANT:
      // Backend expects "projectFiles", not "files"
      // Remove any auto-added empty file field first, then append real files
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

      if (formStatus) {
  formStatus.textContent =
    `Your inquiry has been sent successfully. Reference Code: ${result.project_code}`;
}

      form.reset();
      setFormLoadedTime();
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