import { db } from './firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID is required' })
  }

  try {
    const docRef = doc(db, 'vacancies', jobId.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json(docSnap.data());
    } else {
      res.status(404).json({ status: 'closed', message: 'Vacancy not found' });
    }
  } catch (error) {
    console.error('Error fetching vacancy:', error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}