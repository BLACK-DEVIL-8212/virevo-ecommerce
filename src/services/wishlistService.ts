import { ref, set, get, update, remove, onValue, off, push } from 'firebase/database';
import { db, DB_PATHS } from '../utils/constants';

export const wishlistService = {
  async getWishlist(uid: string) {
    const wishlistRef = ref(db, `${DB_PATHS.WISHLISTS}/${uid}`);
    const snapshot = await get(wishlistRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data).map(([key, item]: [string, any]) => ({
      key,
      ...item
    }));
  },

  async addToWishlist(uid: string, item: any) {
    const wishlistRef = ref(db, `${DB_PATHS.WISHLISTS}/${uid}`);
    const newItemRef = push(wishlistRef);
    const key = newItemRef.key;
    if (!key) throw new Error('Failed to generate wishlist item key');

    await set(newItemRef, {
      ...item,
      addedAt: Date.now()
    });
    return { key, ...item };
  },

  async removeFromWishlist(uid: string, itemKey: string) {
    const itemRef = ref(db, `${DB_PATHS.WISHLISTS}/${uid}/${itemKey}`);
    await remove(itemRef);
    return true;
  },

  async isInWishlist(uid: string, productId: string): Promise<boolean> {
    const wishlistRef = ref(db, `${DB_PATHS.WISHLISTS}/${uid}`);
    const snapshot = await get(wishlistRef);
    if (!snapshot.exists()) return false;
    const data = snapshot.val();
    return Object.values(data).some((item: any) => item.productId === productId);
  },

  subscribeToWishlist(uid: string, callback: (items: any[]) => void) {
    const wishlistRef = ref(db, `${DB_PATHS.WISHLISTS}/${uid}`);
    const unsubscribe = onValue(wishlistRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.entries(data).map(([key, item]: [string, any]) => ({
          key,
          ...item
        }));
        callback(items);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }
};
