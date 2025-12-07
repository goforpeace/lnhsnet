
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Directly use the service account credentials to ensure server-side initialization.
const serviceAccount = {
  project_id: "studio-363001551-87a23",
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: "firebase-adminsdk-shec1@studio-363001551-87a23.iam.gserviceaccount.com",
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
