import { supabase } from "./supabaseClient.js";

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const projectFilesInput = document.getElementById("projectFiles");

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
        name: formData.get("name")?.trim() || "",
        business_name: formData.get("business")?.trim() || "",
        email: formData.get("email")?.trim() || "",
        phone: formData.get("phone")?.trim() || "",
        service_type: formData.get("service")?.trim() || "",
        budget_range: formData.get("budget_range") || "",
        timeline: formData.get("timeline") || "",
        message: formData.get("message")?.trim() || ""
      };

      const { data: insertedLead, error: leadError } = await supabase
        .from("leads")
        .insert([lead])
        .select()
        .single();

      if (leadError) {
        throw new Error(`Lead insert failed: ${leadError.message}`);
      }

      const leadId = insertedLead.id;

      for (const file of files) {
        const safeName = file.name.replace(/\s+/g, "-");
        const filePath = `${leadId}/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("lead-uploads")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        const { error: fileRecordError } = await supabase
          .from("lead_files")
          .insert([
            {
              lead_id: leadId,
              file_name: file.name,
              file_path: filePath,
              file_type: file.type,
              file_size: file.size
            }
          ]);

        if (fileRecordError) {
          throw new Error(`File record insert failed: ${fileRecordError.message}`);
        }
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