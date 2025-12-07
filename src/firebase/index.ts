
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// This is the configuration for your Firebase project.
// It is safe to expose this on the client-side.
export const firebaseConfig = {
  "projectId": "studio-363001551-87a23",
  "appId": "1:32971444792:web:b7b93efab67b28842e8ccd",
  "apiKey": "AIzaSyADX9r7Aoxa--ea8EoDxaM2Jqnkhlm11m0",
  "authDomain": "studio-363001551-87a23.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "32971444792"
};


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const appName = "default";
  const apps = getApps();
  const app = apps.find((app) => app.name === appName);
  if (app) {
    return getSdks(app);
  }

  const firebaseApp = initializeApp(firebaseConfig, appName);
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
