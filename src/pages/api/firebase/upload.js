import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jobId, role, isOpen } = req.body;

  if (!jobId || !role || typeof isOpen !==  "boolean") {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const docRef = doc(db, "vacancies", jobId.toString());
    await setDoc(docRef, { role, isOpen });
    res.status(200).json({ message: "Invalid request data" });
  } catch (error) {
    console.error("Error uploading vacancy:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}