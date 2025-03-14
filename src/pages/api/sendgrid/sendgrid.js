import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email.
 * @param {string} options.from - Sender email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text content.
 * @param {string} options.html - HTML content.
 * @returns {Promise<Object>} - Sendgrid response or error.
*/

export async function sendEmail({ to, from, subject, text, html }) {
  try {
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    
    const response = await sgMail.send(msg);
    return { success: true, response }
  } catch (error) {
    console.error('Sendgrid Error', error.response?.body || error);
    return { success: false, error: error.response?.body || error};
  }
}