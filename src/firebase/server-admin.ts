
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// The private key must have its newline characters correctly formatted.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const serviceAccount = {
  project_id: "studio-363001551-87a23",
  private_key: privateKey,
  client_email: "firebase-adminsdk-shec1@studio-363001551-87a23.iam.gserviceaccount.com",
};

const appName = 'firebase-admin';
const apps = getApps();
let app = apps.find((app) => app?.name === appName);

if (!app) {
    app = initializeApp({
        // The cert function handles the case where properties might be undefined.
        credential: cert(serviceAccount),
    }, appName);
}

const firestore = getFirestore(app);

export { firestore };
