import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_TEST_USER,
        pass: process.env.GMAIL_TEST_APP_PASSWORD,
      },
    });

    const clientMailOptions = {
      from: `New Message <${process.env.GMAIL_TEST_USER}>`,
      to: process.env.GMAIL_TEST_USER,
      subject: `${subject}`,
      html: `
        <p>You have a new contact form submission:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
      replyTo: email,
    };

    await transporter.sendMail(clientMailOptions);

    // Sends confirmation email TO the sender
    const senderMailOptions = {
      from: `Roastar Coffee <${process.env.GMAIL_TEST_USER}>`,
      to: email,
      subject: `Your subject: ${subject}`,
      html: `
        <p>Hi ${name || 'there'},</p>
        <p>
          Thank you for contacting Roastar Coffee. We appreciate all of our customers time and visit to our
          shop and we will get in touch with you as soon as possible.
        </p>
        <br></br>
        <p>In the meantime, please visit our website at <a>roastarcoffee.co.uk</a> for our online services.</p>
        <p>Best regards,<br></br>Roastar Coffee</p>
        <br></br>
      `,
    };

    await transporter.sendMail(senderMailOptions);

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in contact API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}