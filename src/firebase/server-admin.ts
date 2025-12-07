
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let app: App;
const appName = 'firebase-admin';

if (!getApps().length) {
    app = initializeApp({
        credential: cert(serviceAccount),
    }, appName);
} else {
    app = getApp(appName);
}

const firestore = getFirestore(app);

export { firestore, FieldValue };
