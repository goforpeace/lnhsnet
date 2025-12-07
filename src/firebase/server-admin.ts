import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const appName = 'firebase-admin';
const apps = getApps();
const app = apps.find((app) => app.name === appName);

let firestore: ReturnType<typeof getFirestore>;

if (app) {
  firestore = getFirestore(app);
} else {
  // To use the Firebase Admin SDK in a serverless environment,
  // we need to use a service account.
  const adminApp = initializeApp({
    credential: cert(serviceAccount),
  }, appName);
  firestore = getFirestore(adminApp);
}

export { firestore };
