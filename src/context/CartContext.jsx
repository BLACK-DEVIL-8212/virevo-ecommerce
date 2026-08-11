import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const CartContext = createContext({
  cartItems: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  cartCount: 0,
  cartTotal: 0,
  isLoading: false
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const unsubscribe = cartService.subscribeToCart(user.uid, (items) => {
      setCartItems(items);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    if (!user) return;

    setIsLoading(true);
    try {
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
      setIsCartOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemKey) => {
    if (!user) return;
    await cartService.removeFromCart(user.uid, itemKey);
  };

  const updateQuantity = async (itemKey, quantity) => {
    if (!user) return;
    await cartService.updateQuantity(user.uid, itemKey, quantity);
  };

  const clearCart = async () => {
    if (!user) return;
    await cartService.clearCart(user.uid);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartCount,
      cartTotal,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
