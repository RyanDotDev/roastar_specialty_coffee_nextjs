import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const firebaseAmdinConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_TEST_PROJECT_ID,
    clientEmail: process.env.FIREBASE_TEST_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_TEST_PRIVATE_KEY,
  }),
  storageBucket: process.env.FIREBASE_TEST_STORAGE_BUCKET,
}

// This prevents re-initialisation during hot reload in development
if (!getApps().length) {
  initializeApp(firebaseAmdinConfig);
}

const db = getFirestore();
const storage = getStorage();

export { db, storage };