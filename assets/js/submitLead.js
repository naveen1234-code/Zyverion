const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const projectFilesInput = document.getElementById("projectFiles");

const FUNCTION_URL =
  "https://gydiqeomupsfiaayxpix.supabase.co/functions/v1/submit-lead";

const SUPABASE_KEY = "sb_publishable_GrvrURzXo72ECksExlKHpw_aVBmZnBD";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

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

      const lead = {
        name: (formData.get("name") || "").toString().trim(),
        business_name: (formData.get("business") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        service_type: (formData.get("service") || "").toString().trim(),
        budget_range: (formData.get("budget_range") || "").toString(),
        timeline: (formData.get("timeline") || "").toString(),
        message: (formData.get("message") || "").toString().trim()
      };

      if (!lead.name || !lead.email || !lead.message) {
        throw new Error("Please fill in all required fields.");
      }

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify(lead)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || JSON.stringify(result) || "Submission failed.");
      }

      formStatus.textContent =
        "Your inquiry has been sent successfully. ZYVERION will review it and get back to you.";
      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
      formStatus.textContent =
        error.message || "Something went wrong while sending your inquiry.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Inquiry";
    }
  });
}