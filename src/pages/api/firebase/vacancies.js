import { db } from './firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID is required' });
  }

  try {
    console.log('Fetching vacancy for jobId:', jobId);
    const docRef = db.collection('vacancies').doc(jobId.toString());
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.error(`Vacancy for jobId ${jobId} not found.`)
      return res.status(404).json({ status: 'closed', message: 'Vacancy not found' });
    }

    const data = docSnap.data(); // Correctly retrieve data from Firestore document

    if (!data || typeof data !== 'object') {
      console.error('Invalid data received for jobId:', jobId, data);
      return res.status(500).json({ message: 'Invalid data format' });
    }

    console.log('Vacancy data:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching vacancy:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}