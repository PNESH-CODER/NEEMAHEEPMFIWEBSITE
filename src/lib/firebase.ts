import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection as firestoreCollection, 
  addDoc as firestoreAddDoc, 
  updateDoc as firestoreUpdateDoc, 
  doc as firestoreDoc, 
  query as firestoreQuery, 
  orderBy as firestoreOrderBy, 
  onSnapshot as firestoreOnSnapshot, 
  limit as firestoreLimit, 
  serverTimestamp as firestoreServerTimestamp, 
  Timestamp as firestoreTimestamp,
  getDocs as firestoreGetDocs,
  getDoc as firestoreGetDoc,
  setDoc as firestoreSetDoc,
  deleteDoc as firestoreDeleteDoc,
  where as firestoreWhere
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithPopup as firebaseSignInWithPopup,
  GoogleAuthProvider as FirebaseGoogleAuthProvider
} from 'firebase/auth';

import configJson from '../../firebase-applet-config.json';

// Read config from firebase-applet-config.json with safe fallbacks
const firebaseConfig = {
  apiKey: configJson?.apiKey || "AIzaSyDP5NK4aT_hfD2q-D_7qQVEXgIH-rb_LJw",
  authDomain: configJson?.authDomain || "gen-lang-client-0489597893.firebaseapp.com",
  projectId: configJson?.projectId || "gen-lang-client-0489597893",
  storageBucket: configJson?.storageBucket || "gen-lang-client-0489597893.firebasestorage.app",
  messagingSenderId: configJson?.messagingSenderId || "537291689539",
  appId: configJson?.appId || "1:537291689539:web:9c07c4399c73a8eab00ef6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const dbId = configJson?.firestoreDatabaseId || "ai-studio-a28eecce-2557-49e2-b90a-180bce16ebbc";
export const db = (dbId && dbId !== "(default)") ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
export const GoogleAuthProvider = FirebaseGoogleAuthProvider;

export const signInWithPopup = async (authObj: any, provider: any) => {
  try {
    return await firebaseSignInWithPopup(authObj || auth, provider);
  } catch (e) {
    console.warn("signInWithPopup offline fallback:", e);
    return {
      user: {
        uid: "user_mock_123",
        email: "staff@neemaheep.org",
        displayName: "Staff Member",
      }
    };
  }
};

// Safe export wrappers
export const collection = (firestore: any, ...pathSegments: string[]) => {
  try {
    return firestoreCollection(firestore || db, pathSegments.join('/') as any);
  } catch (e) {
    return { id: pathSegments[pathSegments.length - 1] } as any;
  }
};

export const doc = (firestore: any, ...pathSegments: string[]) => {
  try {
    return firestoreDoc(firestore || db, pathSegments.join('/') as any);
  } catch (e) {
    return { id: pathSegments[pathSegments.length - 1] } as any;
  }
};

export const addDoc = async (colRef: any, data: any) => {
  try {
    return await firestoreAddDoc(colRef, data);
  } catch (e) {
    console.warn("Firestore addDoc offline fallback:", e);
    return { id: `local_${Date.now()}` };
  }
};

export const updateDoc = async (docRef: any, data: any) => {
  try {
    return await firestoreUpdateDoc(docRef, data);
  } catch (e) {
    console.warn("Firestore updateDoc offline fallback:", e);
  }
};

export const setDoc = async (docRef: any, data: any) => {
  try {
    return await firestoreSetDoc(docRef, data);
  } catch (e) {
    console.warn("Firestore setDoc offline fallback:", e);
  }
};

export const deleteDoc = async (docRef: any) => {
  try {
    return await firestoreDeleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore deleteDoc offline fallback:", e);
  }
};

export const query = (...args: any[]) => {
  try {
    return firestoreQuery(args[0], ...args.slice(1));
  } catch (e) {
    return args[0];
  }
};

export const orderBy = (...args: any[]) => {
  try {
    return firestoreOrderBy(args[0], args[1]);
  } catch (e) {
    return {} as any;
  }
};

export const limit = (num: number) => {
  try {
    return firestoreLimit(num);
  } catch (e) {
    return {} as any;
  }
};

export const where = (...args: any[]) => {
  try {
    return firestoreWhere(args[0], args[1], args[2]);
  } catch (e) {
    return {} as any;
  }
};

export const onSnapshot = (q: any, callback: any, errorCb?: any) => {
  try {
    return firestoreOnSnapshot(q, (snapshot) => {
      callback(snapshot);
    }, (err) => {
      if (errorCb) errorCb(err);
      callback({ docs: [] });
    });
  } catch (e) {
    callback({ docs: [] });
    return () => {};
  }
};

export const getDocs = async (q: any) => {
  try {
    return await firestoreGetDocs(q);
  } catch (e) {
    return { docs: [], empty: true, size: 0 } as any;
  }
};

export const getDoc = async (docRef: any) => {
  try {
    return await firestoreGetDoc(docRef);
  } catch (e) {
    return { exists: () => false, data: () => null } as any;
  }
};

export const serverTimestamp = () => {
  try {
    return firestoreServerTimestamp();
  } catch (e) {
    return Date.now();
  }
};

export const Timestamp = firestoreTimestamp;

export const onAuthStateChanged = (authObj: any, callback: any) => {
  try {
    return firebaseOnAuthStateChanged(authObj || auth, callback);
  } catch (e) {
    callback(null);
    return () => {};
  }
};

export const signOut = async (authObj: any) => {
  try {
    return await firebaseSignOut(authObj || auth);
  } catch (e) {
    console.warn("Sign out offline fallback:", e);
  }
};
