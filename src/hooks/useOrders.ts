import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = orderService.subscribeToUserOrders(user.uid, (data) => {
      const sorted = data.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setOrders(sorted);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await orderService.getUserOrders(user.uid);
      const sorted = data.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setOrders(sorted);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToAllOrders((data) => {
      const sorted = data.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setOrders(sorted);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    await orderService.updateOrderStatus(orderId, status);
  };

  return { orders, loading, updateOrderStatus };
}
