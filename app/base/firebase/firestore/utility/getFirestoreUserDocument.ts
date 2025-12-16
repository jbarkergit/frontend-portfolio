import isUserAuthorized from 'app/base/firebase/authentication/utility/isUserAuthorized';
import { database, firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import type { FirestoreUserDocument } from 'app/base/firebase/firestore/types/firestoreTypes';
import {
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

let cachedUserDocument: FirestoreUserDocument | undefined;

export const getFirestoreUserDocument = async (): Promise<FirestoreUserDocument | undefined> => {
  if (cachedUserDocument) return cachedUserDocument;

  try {
    const isAuth = await isUserAuthorized();
    if (!isAuth) throw new Error('User is not authorized.');

    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Failed to identify user.');

    const docRef: DocumentReference<DocumentData, DocumentData> = doc(database, 'users', user.uid);
    const docSnap: DocumentSnapshot<unknown, DocumentData> = await getDoc(docRef);

    if (!docSnap.exists()) {
      const newDocument: FirestoreUserDocument = {
        credentials: {
          isAnonymous: user.isAnonymous,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
        },
        metadata: {
          uid: user.uid,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        movies: {},
      };

      await setDoc(docRef, newDocument);
      cachedUserDocument = newDocument;
    } else {
      cachedUserDocument = docSnap.data() as FirestoreUserDocument;
    }
  } catch (error) {
    console.error(error);
  }

  return cachedUserDocument;
};
