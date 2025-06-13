export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;
    console.log("Sending email to:", process.env.COMPANY_EMAIL);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        name,
        email,
        subject,
        message,
        replyTo: email,
        to: process.env.COMPANY_EMAIL,
      }),
    });

    const result = await response.json();
    console.log("Web3Forms response:", result);

    if (result.success) {
      return res.status(200).json({ success: true, message: "Email sent successfully" });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}