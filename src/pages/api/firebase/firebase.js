import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ 
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
     }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} 

const db = admin.firestore(); // Use the initialized app
const storage = admin.storage().bucket();

export { db, storage };