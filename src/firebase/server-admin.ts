
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const serviceAccount = {
  project_id: "studio-363001551-87a23",
  private_key: privateKey,
  client_email: "firebase-adminsdk-shec1@studio-363001551-87a23.iam.gserviceaccount.com",
};

let app: App;
const appName = 'firebase-admin';

if (!getApps().some(existingApp => existingApp.name === appName)) {
  if (privateKey) {
    app = initializeApp({
      credential: cert(serviceAccount),
    }, appName);
  } else {
    // If no private key, we can't initialize. 
    // We'll throw an error here to make it clear during development
    // that the environment is not set up correctly.
    console.error("Firebase Admin initialization failed: FIREBASE_PRIVATE_KEY is not set.");
    app = getApp(appName); // This will likely not exist, leading to a null firestore
  }
} else {
  app = getApp(appName);
}

const firestore = app ? getFirestore(app) : null;

export { firestore, FieldValue };
