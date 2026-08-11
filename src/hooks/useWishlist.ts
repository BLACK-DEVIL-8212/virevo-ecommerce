import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { wishlistService } from '../services/wishlistService';

export function useWishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const unsubscribe = wishlistService.subscribeToWishlist(user.uid, (data) => {
      setItems(data);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const addToWishlist = async (product: any) => {
    if (!user) return;
    await wishlistService.addToWishlist(user.uid, {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  const removeFromWishlist = async (itemKey: string) => {
    if (!user) return;
    await wishlistService.removeFromWishlist(user.uid, itemKey);
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const toggleWishlist = async (product: any) => {
    if (!user) return;
    const inWishlist = isInWishlist(product.id);
    if (inWishlist) {
      const item = items.find(i => i.productId === product.id);
      if (item) {
        await removeFromWishlist(item.key);
      }
    } else {
      await addToWishlist(product);
    }
  };

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    loading,
    wishlistCount: items.length
  };
}
