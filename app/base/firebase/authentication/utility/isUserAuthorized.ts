import { firebaseAuth } from 'app/base/firebase/config/firebaseConfig';

export default function isUserAuthorized(): Promise<boolean> {
  return new Promise((resolve) => {
    firebaseAuth.onAuthStateChanged((user) => {
      resolve(!!user);
    });
  });
}
