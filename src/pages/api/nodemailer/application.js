import nodemailer from 'nodemailer';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    // console.log('Parsed files:', files);

    const { firstName, lastName, email, phoneNumber, job, rightToWork } = fields;
    const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;

    // Setup nodemailer with Gmail SMTP + App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_TEST_USER,
        pass: process.env.GMAIL_TEST_APP_PASSWORD,
      },
    });

    // Sends notification email TO the client
    const clientMailOptions = {
      from: process.env.GMAIL_TEST_USER,
      to: process.env.GMAIL_TEST_USER, 
      replyTo: email,
      subject: `New Application from ${`${firstName} ${lastName}` || 'Applicant'}`,
      html: `
        <p>You received a new application.</p>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong><br/>${phoneNumber}</p>
        <p><strong>Job:</strong><br/>${job}</p>
        <p><strong>Right To Work:</strong><br/>${rightToWork}</p>
      `,
      attachments: resumeFile?.filepath
      ? [
          {
            filename: resumeFile.originalFilename || 'resume.pdf',
            contentType: resumeFile.mimetype || 'application/pdf',
            content: fs.createReadStream(resumeFile.filepath),
          },
        ]
      : []
    };

    await transporter.sendMail(clientMailOptions);

    // Sends confirmation email TO the applicant
    const applicantMailOptions = {
      from: `Roastar Coffee Careers <${process.env.GMAIL_TEST_USER}>`,
      to: email,
      subject: 'Thank you for your application!',
      html: `
        <p>Hi ${firstName || 'there'},</p>
        <p>
          Thank you for applying for the ${job} role. We have received your application and we will 
          get back to you as soon as possible.
        </p>
        <br>/<br>
        If you have not heard from us within 10 - 14 days, then please assume that your application was unsuccessful.
        <p>Best regards,<br/>Roastar Coffee</p>
        <br></br>
      `,
    };

    await transporter.sendMail(applicantMailOptions);

    return res.status(200).json({ message: 'Application received and confirmation sent.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error while submitting application' });
  }
}