import { ref, set, get, update, remove, query, orderByChild, equalTo, onValue, off, limitToLast } from 'firebase/database';
import { db, DB_PATHS } from '../utils/constants';

export const productService = {
  async getAll() {
    const productsRef = ref(db, DB_PATHS.PRODUCTS);
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data).map(([id, product]: [string, any]) => ({
      id,
      ...product
    }));
  },

  async getById(id: string) {
    const productRef = ref(db, `${DB_PATHS.PRODUCTS}/${id}`);
    const snapshot = await get(productRef);
    if (!snapshot.exists()) return null;
    return { id, ...snapshot.val() };
  },

  async getByCategory(category: string) {
    const productsRef = ref(db, DB_PATHS.PRODUCTS);
    const categoryQuery = query(productsRef, orderByChild('category'), equalTo(category));
    const snapshot = await get(categoryQuery);
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([id, product]: [string, any]) => ({
      id,
      ...product
    }));
  },

  async getFeatured(limitCount: number = 8) {
    const productsRef = ref(db, DB_PATHS.PRODUCTS);
    const featuredQuery = query(productsRef, orderByChild('featured'), limitToLast(limitCount));
    const snapshot = await get(featuredQuery);
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([id, product]: [string, any]) => ({
      id,
      ...product
    }));
  },

  async create(productData: any) {
    const productsRef = ref(db, DB_PATHS.PRODUCTS);
    const newProductRef = push(productsRef);
    const productId = newProductRef.key;
    if (!productId) throw new Error('Failed to generate product ID');

    const product = {
      ...productData,
      id: productId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rating: 0,
      reviews: 0
    };

    await set(newProductRef, product);
    return { id: productId, ...product };
  },

  async update(id: string, updates: any) {
    const productRef = ref(db, `${DB_PATHS.PRODUCTS}/${id}`);
    await update(productRef, {
      ...updates,
      updatedAt: Date.now()
    });
    return this.getById(id);
  },

  async delete(id: string) {
    const productRef = ref(db, `${DB_PATHS.PRODUCTS}/${id}`);
    await remove(productRef);
    return true;
  },

  subscribeToProducts(callback: (products: any[]) => void) {
    const productsRef = ref(db, DB_PATHS.PRODUCTS);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const products = Object.entries(data).map(([id, product]: [string, any]) => ({
          id,
          ...product
        }));
        callback(products);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  },

  subscribeToProduct(id: string, callback: (product: any) => void) {
    const productRef = ref(db, `${DB_PATHS.PRODUCTS}/${id}`);
    const unsubscribe = onValue(productRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id, ...snapshot.val() });
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }
};
