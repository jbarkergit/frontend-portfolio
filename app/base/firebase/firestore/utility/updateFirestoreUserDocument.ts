import { database, firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import type { FirestoreUserDocument } from 'app/base/firebase/firestore/types/firestoreTypes';
import { getFirestoreUserDocument } from 'app/base/firebase/firestore/utility/getFirestoreUserDocument';
import { doc, updateDoc } from 'firebase/firestore';

export const updateFirestoreUserDocument = async (
  partialUpdate: Partial<FirestoreUserDocument>
): Promise<FirestoreUserDocument | undefined> => {
  const userDoc = await getFirestoreUserDocument();
  if (!userDoc) return undefined;

  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('No current user');

  const docRef = doc(database, 'users', user.uid);

  await updateDoc(docRef, partialUpdate);

  return { ...userDoc, ...partialUpdate };
};
