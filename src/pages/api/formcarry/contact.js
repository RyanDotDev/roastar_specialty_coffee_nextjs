export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const FORM_ID = process.env.FORMCARRY_FORM_ID; // set in env
  const FORM_API = `https://formcarry.com/s/${FORM_ID}`;

  try {
    const response = await fetch(FORM_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ message: 'Formcarry error', error });
    }

    const data = await response.json();
    return res.status(200).json({ message: 'Form sent successfully', data });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}