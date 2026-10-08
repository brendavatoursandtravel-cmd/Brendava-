import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// ────────────────────────────────────────────────
// REPLACE THESE WITH YOUR FIREBASE PROJECT VALUES
// Get them from: Firebase Console → Project Settings → Your apps
// ────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── Auth helpers ───────────────────────────────
export const registerUser = async (
  email: string,
  password: string,
  profile: Omit<import('../types').UserProfile, 'uid' | 'createdAt' | 'updatedAt' | 'isVerified'>
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: profile.fullName });

  const userProfile = {
    ...profile,
    uid: user.uid,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: profile.role === 'client', // Operators may need manual verification
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);
  return userProfile;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = () => signOut(auth);

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as import('../types').UserProfile;
};

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// ─── Itinerary helpers ──────────────────────────
export const createItinerary = async (
  data: Omit<import('../types').Itinerary, 'id' | 'createdAt' | 'updatedAt' | 'bookingCount'>
) => {
  const docRef = await addDoc(collection(db, 'itineraries'), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookingCount: 0,
  });
  return docRef.id;
};

export const updateItinerary = async (id: string, data: Partial<import('../types').Itinerary>) => {
  await updateDoc(doc(db, 'itineraries', id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteItinerary = async (id: string) => {
  await deleteDoc(doc(db, 'itineraries', id));
};

export const getActiveItineraries = async () => {
  const q = query(
    collection(db, 'itineraries'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import('../types').Itinerary));
};

export const getOperatorItineraries = async (operatorId: string) => {
  const q = query(
    collection(db, 'itineraries'),
    where('operatorId', '==', operatorId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import('../types').Itinerary));
};

export const getItineraryById = async (id: string) => {
  const snap = await getDoc(doc(db, 'itineraries', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as import('../types').Itinerary;
};

// ─── Booking helpers ────────────────────────────
export const createBooking = async (
  data: Omit<import('../types').Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
) => {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  // Increment booking count on itinerary
  const itinRef = doc(db, 'itineraries', data.itineraryId);
  const itinSnap = await getDoc(itinRef);
  if (itinSnap.exists()) {
    const current = itinSnap.data().bookingCount || 0;
    await updateDoc(itinRef, { bookingCount: current + 1 });
  }
  return docRef.id;
};

export const getClientBookings = async (clientId: string) => {
  const q = query(
    collection(db, 'bookings'),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import('../types').Booking));
};

export const getOperatorBookings = async (operatorId: string) => {
  const q = query(
    collection(db, 'bookings'),
    where('operatorId', '==', operatorId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as import('../types').Booking));
};

export const updateBookingStatus = async (
  bookingId: string,
  status: import('../types').Booking['status']
) => {
  await updateDoc(doc(db, 'bookings', bookingId), {
    status,
    updatedAt: new Date().toISOString(),
  });
};
