
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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
    // Only initialize if the private key is available
    if (serviceAccount.private_key) {
        app = initializeApp({
            credential: cert(serviceAccount),
        }, appName);
    }
}

// Get firestore instance only if app was initialized
const firestore = app ? getFirestore(app) : null;

// Export firestore, but also FieldValue for server timestamps
export { firestore, FieldValue };
