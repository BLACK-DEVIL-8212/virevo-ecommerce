import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, Search, Filter, Download, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  Pending: { icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
  Processing: { icon: Package, color: '#2563eb', bg: '#dbeafe' },
  Shipped: { icon: Truck, color: '#8b5cf6', bg: '#ede9fe' },
  Delivered: { icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
  Cancelled: { icon: XCircle, color: '#ef4444', bg: '#fee2e2' }
};

function generateSampleOrders() {
  const existing = JSON.parse(localStorage.getItem('orders') || '[]');
  if (existing.length > 0) return existing;

  const sampleOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-12-01',
      status: 'Delivered',
      total: 249.97,
      items: [
        { id: 1, name: 'Classic Leather Jacket', price: 199.99, quantity: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100' },
        { id: 5, name: 'Cotton Casual T-Shirt', price: 29.99, quantity: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100' },
        { id: 6, name: 'Smartphone Case', price: 24.99, quantity: 1, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100' }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-12-05',
      status: 'Shipped',
      total: 149.99,
      items: [
        { id: 2, name: 'Wireless Noise-Canceling Headphones', price: 149.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-12-08',
      status: 'Processing',
      total: 89.99,
      items: [
        { id: 3, name: 'Minimalist Watch', price: 89.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' }
      ]
    },
    {
      id: 'ORD-2024-004',
      date: '2024-12-10',
      status: 'Pending',
      total: 169.98,
      items: [
        { id: 4, name: 'Running Shoes', price: 129.99, quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
        { id: 8, name: 'Yoga Mat', price: 39.99, quantity: 1, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100' }
      ]
    }
  ];

  localStorage.setItem('orders', JSON.stringify(sampleOrders));
  return sampleOrders;
}

export default function OrderHistorypage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const sampleOrders = generateSampleOrders();
    setOrders(sampleOrders);
  }, [isAuthenticated, loading, navigate]);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });
  }, [orders, searchTerm, statusFilter, sortBy]);

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredAndSortedOrders, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-[80vh] py-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-[2rem] font-bold text-gray-800 mb-2">Order History</h1>
            <p className="text-slate-500 text-sm">Track and manage your orders</p>
          </div>
          {orders.length > 0 && (
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-primary-dark" onClick={handleExport}>
              <Download size={18} />
              Export
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <Package size={64} strokeWidth={1.5} className="mb-5 opacity-50" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="mb-6">Start shopping to see your orders here</p>
            <Link to="/shop" className="inline-flex items-center px-7 py-3 bg-primary text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-primary-dark">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by Order ID or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 outline-none focus:border-primary transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-500" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 cursor-pointer outline-none focus:border-primary transition-all duration-200">
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 cursor-pointer outline-none focus:border-primary transition-all duration-200">
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="total-desc">Highest Total</option>
                  <option value="total-asc">Lowest Total</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredAndSortedOrders.map(order => {
                const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
                const isExpanded = expandedOrder === order.id;
                const statusColor = STATUS_CONFIG[order.status]?.color || '#64748b';
                const statusBg = STATUS_CONFIG[order.status]?.bg || '#f1f5f9';

                return (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center p-5 cursor-pointer transition-all duration-200 hover:bg-gray-50" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5">
                          <Package size={20} className="text-primary" />
                          <span className="font-semibold text-gray-800">{order.id}</span>
                        </div>
                        <span className="text-slate-500 text-sm">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <span className="font-bold text-gray-800 text-lg">${order.total.toFixed(2)}</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide" style={{ color: statusColor, backgroundColor: statusBg }}>
                          <StatusIcon size={14} />
                          {order.status}
                        </span>
                        <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-slate-500 transition-all duration-200 hover:bg-primary hover:text-white" aria-label="Expand order">
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-5 border-t border-gray-200">
                        <div className="py-5">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-b-0">
                              <img src={item.image} alt={item.name} className="w-[60px] h-[60px] object-cover rounded-lg" />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-800 mb-0.5">{item.name}</h4>
                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                              </div>
                              <span className="font-semibold text-sm text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between py-2 text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm text-slate-500">
                            <span>Shipping</span>
                            <span>Free</span>
                          </div>
                          <div className="flex justify-between py-3 border-t border-gray-200 mt-1 font-bold text-gray-800 text-base">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
