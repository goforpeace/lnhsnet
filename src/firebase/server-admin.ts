
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Note: This service account is for the Firebase Admin SDK.
// It is used for server-side operations and should not be exposed to the client.
const serviceAccount = {
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-363001551-87a23",
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-shec1@studio-363001551-87a23.iam.gserviceaccount.com",
};

let app: App;
const appName = 'firebase-admin';

function getAdminApp(): App {
    if (getApps().some(existingApp => existingApp.name === appName)) {
        return getApp(appName);
    }

    // Check if essential credentials are provided
    if (!serviceAccount.private_key || !serviceAccount.project_id || !serviceAccount.client_email) {
        console.error("Firebase Admin initialization failed: Missing 'private_key', 'project_id', or 'client_email' in service account credentials.");
        // This will prevent the app from crashing but Firestore operations will fail.
        // The error will be caught in the server actions.
        return null as unknown as App; 
    }
    
    return initializeApp({
        credential: cert(serviceAccount),
    }, appName);
}

app = getAdminApp();

const firestore = app ? getFirestore(app) : null;

export { firestore, FieldValue };
