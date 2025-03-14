import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { method, query, body } = req;

  if (method === "GET") {
    const { jobId } = query;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    try {
      console.log("Fetching vacancy for jobId:", jobId);
      const docRef = doc(db, "vacancies", jobId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error(`Vacancy for jobId ${jobId} not found.`);
        return res.status(404).json({ isOpen: false, message: "No vacancies available" });
      }

      const data = docSnap.data();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching vacancy:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (method === "POST") {
    const { jobId, isOpen } = body;

    if (!jobId || typeof isOpen !== "boolean") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const jobRef = doc(db, "vacancies", jobId);
      await updateDoc(jobRef, { isOpen });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating vacancy:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}