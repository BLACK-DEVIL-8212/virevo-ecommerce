import { ref, set, get, update, remove, onValue, off } from 'firebase/database';
import { db, DB_PATHS, USER_ROLES } from '../utils/constants';

export const userService = {
  async getUser(uid: string) {
    const userRef = ref(db, `${DB_PATHS.USERS}/${uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) return null;
    return { uid, ...snapshot.val() };
  },

  async updateUser(uid: string, updates: any) {
    const userRef = ref(db, `${DB_PATHS.USERS}/${uid}`);
    await update(userRef, {
      ...updates,
      updatedAt: Date.now()
    });
    return this.getUser(uid);
  },

  async setUserRole(uid: string, role: string) {
    const userRef = ref(db, `${DB_PATHS.USERS}/${uid}/role`);
    await set(userRef, role);
    return true;
  },

  async getAllUsers() {
    const usersRef = ref(db, DB_PATHS.USERS);
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([uid, user]: [string, any]) => ({
      uid,
      ...user
    }));
  },

  subscribeToUser(uid: string, callback: (user: any) => void) {
    const userRef = ref(db, `${DB_PATHS.USERS}/${uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ uid, ...snapshot.val() });
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }
};
