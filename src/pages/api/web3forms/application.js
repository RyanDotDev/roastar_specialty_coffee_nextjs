import { createReadStream } from "fs";
import formidable from "formidable";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Form parsing error" });
    }

    const resume = files.resume?.[0];

    if (!resume) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const formData = new FormData();

    formData.append("access_key", process.env.WEB3FORMS_ACCESS_KEY);

    // Ensure all fields are treated as strings
    const getField = (field) => Array.isArray(field) ? field[0] : field || "";

    formData.append("from_name", `${getField(fields.firstName)} ${getField(fields.lastName)}`);
    formData.append("email", getField(fields.email));
    formData.append("subject", `New job application: ${getField(fields.job)}`);
    formData.append("firstName", getField(fields.firstName));
    formData.append("lastName", getField(fields.lastName));
    formData.append("phoneNumber", getField(fields.phoneNumber));
    formData.append("job", getField(fields.job));
    formData.append("rightToWork", getField(fields.rightToWork));

    formData.append("resume", createReadStream(resume.filepath), {
      filename: resume.originalFilename,
      contentType: resume.mimetype,
    });

    function submitForm(formData) {
      return new Promise((resolve, reject) => {
        formData.submit("https://api.web3forms.com/submit", (err, response) => {
          if (err) return reject(err);
      
          let data = "";
          response.on("data", chunk => data += chunk);
          response.on("end", () => {
            try {
              const result = JSON.parse(data);
              resolve(result);
            } catch (parseErr) {
              reject(parseErr);
            }
          });
        });
      });
    }

    try {
      const result = await submitForm(formData);
      
      if (result.success) {
        return res.status(200).json({ success: true, message: "Application submitted" });
      } else {
        console.error("Web3Forms error:", result);
        return res.status(400).json({ success: false, message: result.message || "Unknown error" });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}

