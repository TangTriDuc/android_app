// // Import the functions you need from the SDKs you need
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeApp } from 'firebase/app';
// import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// import { getFirestore } from "firebase/firestore";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'xxxxxxxxxxxxxx',
//   authDomain: 'xxxxxxxxxx.firebaseapp.com',
//   projectId: 'xxxxxxxxxxx',
//   storageBucket: 'xxxxxxxxxx.firebasestorage.app',
//   messagingSenderId: 'xxxxxxxxxx',
//   appId: '1:xxxxxxxx:web:xxxxxxxxxxx',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // export const auth = getAuth(app);

// // Add in 23/4/26
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// export const db = getFirestore(app);

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
} from 'firebase/firestore';

import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'xxxxxxxxxxxxx',
  authDomain: 'xxxxxx.firebaseapp.com',
  projectId: 'xxxxxx',
  storageBucket: 'xxxxx.firebasestorage.app',
  messagingSenderId: 'xxxxxxxx',
  appId: '1:xxxxxxxxx:web:xxxxxxxxxx',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const functions = getFunctions(app, 'us-central1');

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

let db;

try {
  db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalForceLongPolling: true,
  });
} catch (error) {
  db = getFirestore(app);
}

export { auth, db, functions };
