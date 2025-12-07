
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Correctly format the service account credentials with snake_case properties
// These variables are server-side only and should NOT be prefixed with NEXT_PUBLIC_
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let app: App;
const appName = 'firebase-admin';

// Initialize the app only if it's not already initialized
if (!getApps().length) {
    // We only try to initialize if we have the necessary credentials
    if (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
        app = initializeApp({
            credential: cert(serviceAccount),
        }, appName);
    } else {
        console.error("Firebase Admin credentials are not available. Server-side Firebase features will not work.");
    }
} else {
    app = getApp(appName);
}

// Get the firestore instance only if the app was successfully initialized
const firestore = app ? getFirestore(app) : null;

export { firestore, FieldValue };
