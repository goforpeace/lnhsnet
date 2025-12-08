
import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let app: App;
const appName = 'firebase-admin';

// Initialize the app only if it's not already initialized
if (!getApps().length) {
  // Initialize without explicit credentials.
  // It will use default credentials from the environment.
  app = initializeApp({}, appName);
} else {
  app = getApp(appName);
}

// Get the firestore instance only if the app was successfully initialized
const firestore = app ? getFirestore(app) : null;

export { firestore, FieldValue };
