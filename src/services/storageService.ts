import { ref, set, get, update, onValue, off } from 'firebase/database';
import { db, DB_PATHS } from '../utils/constants';

export const storageService = {
  async uploadImage(path: string, file: File): Promise<string> {
    throw new Error('Storage upload requires Firebase Storage SDK - implement in production');
  },

  async deleteImage(path: string): Promise<void> {
    throw new Error('Storage delete requires Firebase Storage SDK - implement in production');
  }
};
