import { supabase } from "./supabaseClient.js";

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    const lead = {
      name: formData.get("name")?.trim() || "",
      business_name: formData.get("business")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      phone: formData.get("phone")?.trim() || "",
      service_type: formData.get("service")?.trim() || "",
      budget_range: formData.get("budget_range") || "",
      timeline: formData.get("timeline") || "",
      message: formData.get("message")?.trim() || ""
    };

    const { error } = await supabase
      .from("leads")
      .insert([lead]);

    if (error) {
      console.error("Supabase insert error:", error);
      formStatus.textContent = "Something went wrong while sending your inquiry. Please try again.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Inquiry";
      return;
    }

    formStatus.textContent = "Your inquiry has been sent successfully. ZYVERION will review it and get back to you.";
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Inquiry";
  });
}