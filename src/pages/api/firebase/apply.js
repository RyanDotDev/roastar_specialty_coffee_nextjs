import { admin } from './firebase';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const applicationData = JSON.parse(req.body);
      const db = getFirestore(admin.app());
      
      const applicationWithDate = {
        ...applicationData,
        dateOfApplication: serverTimestamp(),
      };

      await addDoc(collection(db, 'applications'), { ...req.body, applicationWithDate} );
      return res.status(200).json({ message: 'Application submitted successfully' })
    } catch (error) {
      console.error("Error saving application", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
