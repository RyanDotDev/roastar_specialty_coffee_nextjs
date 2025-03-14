import { sendEmail } from "./sendgrid";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong>${name}</p>
    <p><strong>Email:</strong>${email}</p>
    <p><strong>Subject:</strong>${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const response = await sendEmail({
    to: 'ryanlhdev@gmail.com',
    from: process.env.SENDGRID_SENDER_EMAIL,
    replyTo: email,
    subject: `New Contact Form Message: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    html: emailContent,
  });

  if (response.success) {
    return res.status(200).json({ message: 'Email sent successfully' });
  } else {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}