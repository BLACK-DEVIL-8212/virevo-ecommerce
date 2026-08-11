import { ref, set, get, update, remove, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import { db, DB_PATHS, generateId, ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';

export const orderService = {
  async createOrder(uid: string, orderData: any) {
    const ordersRef = ref(db, DB_PATHS.ORDERS);
    const newOrderRef = push(ordersRef);
    const orderId = newOrderRef.key;
    if (!orderId) throw new Error('Failed to generate order ID');

    const order = {
      id: orderId,
      userId: uid,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PAID,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await set(newOrderRef, order);
    return order;
  },

  async getOrderById(id: string) {
    const orderRef = ref(db, `${DB_PATHS.ORDERS}/${id}`);
    const snapshot = await get(orderRef);
    if (!snapshot.exists()) return null;
    return { id, ...snapshot.val() };
  },

  async getUserOrders(uid: string) {
    const ordersRef = ref(db, DB_PATHS.ORDERS);
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(uid));
    const snapshot = await get(userOrdersQuery);
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([id, order]: [string, any]) => ({
      id,
      ...order
    }));
  },

  async getAllOrders() {
    const ordersRef = ref(db, DB_PATHS.ORDERS);
    const snapshot = await get(ordersRef);
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([id, order]: [string, any]) => ({
      id,
      ...order
    }));
  },

  async updateOrderStatus(id: string, status: string) {
    const orderRef = ref(db, `${DB_PATHS.ORDERS}/${id}`);
    await update(orderRef, {
      status,
      updatedAt: Date.now()
    });
    return this.getOrderById(id);
  },

  subscribeToUserOrders(uid: string, callback: (orders: any[]) => void) {
    const ordersRef = ref(db, DB_PATHS.ORDERS);
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(uid));
    const unsubscribe = onValue(userOrdersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.entries(data).map(([id, order]: [string, any]) => ({
          id,
          ...order
        }));
        callback(orders);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  },

  subscribeToAllOrders(callback: (orders: any[]) => void) {
    const ordersRef = ref(db, DB_PATHS.ORDERS);
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.entries(data).map(([id, order]: [string, any]) => ({
          id,
          ...order
        }));
        callback(orders);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }
};
