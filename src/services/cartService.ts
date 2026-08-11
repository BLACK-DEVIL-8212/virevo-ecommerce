import { ref, set, get, update, remove, onValue, off } from 'firebase/database';
import { db, DB_PATHS } from '../utils/constants';

export const cartService = {
  async getCart(uid: string) {
    const cartRef = ref(db, `${DB_PATHS.CARTS}/${uid}`);
    const snapshot = await get(cartRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data).map(([key, item]: [string, any]) => ({
      key,
      ...item
    }));
  },

  async addToCart(uid: string, item: any) {
    const cartItemRef = ref(db, `${DB_PATHS.CARTS}/${uid}/${item.key}`);
    await set(cartItemRef, {
      ...item,
      addedAt: Date.now()
    });
    return item;
  },

  async updateQuantity(uid: string, itemKey: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(uid, itemKey);
    }
    const itemRef = ref(db, `${DB_PATHS.CARTS}/${uid}/${itemKey}`);
    await update(itemRef, { quantity });
    return true;
  },

  async removeFromCart(uid: string, itemKey: string) {
    const itemRef = ref(db, `${DB_PATHS.CARTS}/${uid}/${itemKey}`);
    await remove(itemRef);
    return true;
  },

  async clearCart(uid: string) {
    const cartRef = ref(db, `${DB_PATHS.CARTS}/${uid}`);
    await remove(cartRef);
    return true;
  },

  subscribeToCart(uid: string, callback: (items: any[]) => void) {
    const cartRef = ref(db, `${DB_PATHS.CARTS}/${uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
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
