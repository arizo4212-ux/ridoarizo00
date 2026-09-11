import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfigJson = {
  projectId: "adept-hallway-pcvp7",
  appId: "1:814367013869:web:c485b374aca776572e05e4",
  apiKey: "AIzaSyBzch2HlpiN9mBUagUIisBtUFRuscc0Jz8",
  authDomain: "adept-hallway-pcvp7.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-simpelkapalsiste-fb119f10-440e-4eba-a769-bf4b28d8394b",
  storageBucket: "adept-hallway-pcvp7.firebasestorage.app",
  messagingSenderId: "814367013869"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfigJson) : getApp();
export const firestore: Firestore = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);
