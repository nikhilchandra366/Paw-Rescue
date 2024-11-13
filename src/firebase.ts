import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "animal-rescue-dev.firebaseapp.com",
  projectId: "animal-rescue-dev",
  storageBucket: "animal-rescue-dev.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c56adc0b8092eee7c36dd1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firestore indexes
const indexes = {
  cases: {
    fields: ['createdAt'],
    order: 'desc'
  }
};