import { ref, set, get, update, remove, onValue, off, push } from 'firebase/database';
import { db, DB_PATHS } from '../utils/constants';

export const reviewService = {
  async getProductReviews(productId: string) {
    const reviewsRef = ref(db, `${DB_PATHS.REVIEWS}/${productId}`);
    const snapshot = await get(reviewsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data).map(([id, review]: [string, any]) => ({
      id,
      ...review
    }));
  },

  async createReview(productId: string, userId: string, userName: string, rating: number, comment: string) {
    const reviewsRef = ref(db, `${DB_PATHS.REVIEWS}/${productId}`);
    const newReviewRef = push(reviewsRef);
    const reviewId = newReviewRef.key;
    if (!reviewId) throw new Error('Failed to generate review ID');

    const review = {
      userId,
      userName,
      rating,
      comment,
      createdAt: Date.now()
    };

    await set(newReviewRef, review);
    return { id: reviewId, ...review };
  },

  async deleteReview(productId: string, reviewId: string) {
    const reviewRef = ref(db, `${DB_PATHS.REVIEWS}/${productId}/${reviewId}`);
    await remove(reviewRef);
    return true;
  },

  subscribeToReviews(productId: string, callback: (reviews: any[]) => void) {
    const reviewsRef = ref(db, `${DB_PATHS.REVIEWS}/${productId}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reviews = Object.entries(data).map(([id, review]: [string, any]) => ({
          id,
          ...review
        }));
        callback(reviews);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  }
};
