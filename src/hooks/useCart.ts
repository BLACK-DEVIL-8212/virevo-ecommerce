import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cartService';
import { CartItem } from '../context/CartContext';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = cartService.subscribeToCart(user.uid, (items) => {
      setCartItems(items);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const addToCart = async (product: any, quantity: number = 1, size: string | null = null, color: string | null = null) => {
    if (!user) return;
    const key = `${product.id}_${size || 'null'}_${color || 'null'}`;
    const existingItem = cartItems.find(item => item.key === key);

    if (existingItem) {
      await cartService.updateQuantity(user.uid, key, existingItem.quantity + quantity);
    } else {
      await cartService.addToCart(user.uid, {
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        size,
        color,
        category: product.category
      });
    }
  };

  const removeFromCart = async (itemKey: string) => {
    if (!user) return;
    await cartService.removeFromCart(user.uid, itemKey);
  };

  const updateQuantity = async (itemKey: string, quantity: number) => {
    if (!user) return;
    await cartService.updateQuantity(user.uid, itemKey, quantity);
  };

  const clearCart = async () => {
    if (!user) return;
    await cartService.clearCart(user.uid);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isLoading
  };
}
