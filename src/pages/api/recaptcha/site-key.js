export default function handler(req, res) {
  const siteKey = process.env.RECAPTCHA_TEST_SITE_KEY;

  if (!siteKey) {
    console.error("RECAPTCHA_SITE_KEY is missing!");
    return res.status(500).json({ error: 'Missing reCAPTCHA site key' });
  }

  res.status(200).json({ siteKey });
}