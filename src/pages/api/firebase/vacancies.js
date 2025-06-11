import { db } from './firebase';

export default async function handler(req, res) {
  const { jobId } = req.method === 'GET' ? req.query : req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'Missing jobId parameter' });
  }

  try {
    const snapshot = await db
      .collection('vacancies')
      .where('jobId', '==', jobId)
      .limit(1)
      .get({ source: 'server' });

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (req.method === 'GET') {
      // Just return the vacancy info
      return res.status(200).json({
        isOpen: data.isOpen,
        role: data.role,
      });
    } 
    
    else if (req.method === 'POST') {
      // Toggle isOpen if client sends { isOpen: true/false } in body
      const { isOpen } = req.body;

      // If no explicit isOpen given, toggle current isOpen
      const newIsOpen = typeof isOpen === 'boolean' ? isOpen : !data.isOpen;

      await doc.ref.update({ isOpen: newIsOpen });

      return res.status(200).json({
        message: `Vacancy ${jobId} updated`,
        isOpen: newIsOpen,
        role: data.role,
      });
    }

    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API /vacancies error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
