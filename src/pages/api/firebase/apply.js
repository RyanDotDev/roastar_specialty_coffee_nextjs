import { db } from "./firebase";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, phoneNumber, job, rightToWork, resumeUrl } = req.body;

      if (!firstName || !lastName || !email || !phoneNumber || !job || !rightToWork || !resumeUrl) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const applicationsCollection = db.collection('applications');
      const applicationData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        job,
        rightToWork,
        resumeUrl,
        submittedAt: new Date().toISOString(),
      };

      await applicationsCollection.add(applicationData);

      res.status(201).json({ message: 'Application submitted successfully' });
    } catch(error) {
      console.error('Error saving application:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
  }
}
