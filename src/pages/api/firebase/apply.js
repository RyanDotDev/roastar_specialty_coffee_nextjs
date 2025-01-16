import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { applicantName, email, jobId, applicationDetails } = req.body;

  if (!applicantName || !email || !phoneNumber || !jobId || !applicationDetails ) {
    return res.status(400).json({ message: 'Invalid application data' })
  }

  try {
    const applicationRef = collection(db, 'applications');
    await addDoc(applicationRef, {
      firstName,
      lastName,
      email,
      phoneNumber,
      jobId: jobId.toString(),
      applicationDetails,
      submittedAt: new Date(),
    });
    res.status(200).json({ message: 'Application submitted successfully'})
  } catch (error) {
    console.error("Error submitting application", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}
