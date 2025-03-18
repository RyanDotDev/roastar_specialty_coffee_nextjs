export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

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
        "html": `
    <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="10" style="background: white; max-width: 600px; margin: auto; border-radius: 8px;">
        <tr>
          <td style="background: #007bff; color: white; text-align: center; font-size: 20px; font-weight: bold; padding: 15px; border-radius: 8px 8px 0 0;">
            New Contact Form Submission
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; color: #333;">
            <p style="font-size: 18px;">Hello,</p>
            <p>You have received a new message from <strong style="color: #007bff;">{name}</strong>.</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-style: italic;">{message}</p>
            <p>Best regards,<br><strong>Your Company Name</strong></p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; background: #007bff; color: white; padding: 10px; border-radius: 0 0 8px 8px;">
            &copy; 2025 Your Company. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `
      }),
    });

    const result = await response.json();

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