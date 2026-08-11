import { ref, set, get, update, remove, onValue, off, push } from 'firebase/database';
import { db } from '../firebase';
import { DB_PATHS } from '../utils/constants';

export const contactService = {
  async submitContactRequest(data: any) {
    const requestsRef = ref(db, DB_PATHS.CONTACT_REQUESTS);
    const newRequestRef = push(requestsRef);
    const requestId = newRequestRef.key;
    if (!requestId) throw new Error('Failed to generate request ID');

    const request = {
      ...data,
      id: requestId,
      status: 'new',
      createdAt: Date.now()
    };

    await set(newRequestRef, request);
    return { id: requestId, ...request };
  },

  async getAllRequests() {
    const requestsRef = ref(db, DB_PATHS.CONTACT_REQUESTS);
    const snapshot = await get(requestsRef);
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([id, request]: [string, any]) => ({
      id,
      ...request
    }));
  }
};
