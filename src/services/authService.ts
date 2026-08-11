import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';
import { auth } from '../firebase';
import { ref, set, get, update, onValue, off } from 'firebase/database';
import { db, DB_PATHS, USER_ROLES } from '../utils/constants';

export const authService = {
  async signup(name: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name,
        role: USER_ROLES.USER,
        phone: '',
        address: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(ref(db, `${DB_PATHS.USERS}/${userCredential.user.uid}`), userData);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let message = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      }
      return { success: false, message };
    }
  },

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let message = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }
      return { success: false, message };
    }
  },

  async logout() {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Logout failed' };
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let message = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      return { success: false, message };
    }
  },

  onAuthStateChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `${DB_PATHS.USERS}/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val() || {};
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || userData.name || firebaseUser.email?.split('@')[0] || 'User',
          role: userData.role || USER_ROLES.USER,
          phone: userData.phone || '',
          address: userData.address || ''
        });
      } else {
        callback(null);
      }
    });
  },

  async getUserRole(uid: string): Promise<string> {
    const userRef = ref(db, `${DB_PATHS.USERS}/${uid}/role`);
    const snapshot = await get(userRef);
    return snapshot.val() || USER_ROLES.USER;
  }
};
