import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = productService.subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const unsubscribe = productService.subscribeToProduct(id, (data) => {
      setProduct(data);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [id]);

  return { product, loading, error };
}

export function useFeaturedProducts(limit: number = 8) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productService.getFeatured(limit).then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to fetch featured products:', err);
      setError('Failed to fetch featured products');
      setLoading(false);
    });
  }, [limit]);

  return { products, loading, error };
}

export function useProductsByCategory(category: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category === 'All') {
      productService.getAll().then((data) => {
        setProducts(data);
        setLoading(false);
      }).catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      });
    } else {
      productService.getByCategory(category).then((data) => {
        setProducts(data);
        setLoading(false);
      }).catch((err) => {
        console.error('Failed to fetch products by category:', err);
        setError('Failed to fetch products');
        setLoading(false);
      });
    }
  }, [category]);

  return { products, loading, error };
}
