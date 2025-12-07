
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Correctly format the service account credentials with snake_case properties
const serviceAccount = {
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let app: App;
const appName = 'firebase-admin';

// Initialize the app only if it's not already initialized
if (!getApps().length) {
    app = initializeApp({
        // The cert function handles the case where properties might be undefined.
        credential: cert(serviceAccount),
    }, appName);
} else {
    app = getApp(appName);
}

const firestore = getFirestore(app);

export { firestore, FieldValue };
