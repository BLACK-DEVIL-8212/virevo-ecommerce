import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp,
  DollarSign, BarChart3, Search
} from 'lucide-react';
import './Admin-Dashboard.scss';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Filter },
];

const STATUS_CONFIG = {
  Pending: { color: '#f59e0b', bg: '#fef3c7' },
  Processing: { color: '#2563eb', bg: '#dbeafe' },
  Shipped: { color: '#8b5cf6', bg: '#ede9fe' },
  Delivered: { color: '#10b981', bg: '#d1fae5' },
  Cancelled: { color: '#ef4444', bg: '#fee2e2' }
};

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { cartItems } = useCart();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (storedOrders.length === 0) {
      const sampleOrders = [
        { id: 'ORD-2024-001', date: '2024-12-01', customer: 'John Doe', email: 'john@example.com', status: 'Delivered', total: 249.97, items: 3 },
        { id: 'ORD-2024-002', date: '2024-12-05', customer: 'Jane Smith', email: 'jane@example.com', status: 'Shipped', total: 149.99, items: 1 },
        { id: 'ORD-2024-003', date: '2024-12-08', customer: 'Bob Wilson', email: 'bob@example.com', status: 'Processing', total: 89.99, items: 1 },
        { id: 'ORD-2024-004', date: '2024-12-10', customer: 'Alice Brown', email: 'alice@example.com', status: 'Pending', total: 169.98, items: 2 },
        { id: 'ORD-2024-005', date: '2024-12-11', customer: 'Charlie Davis', email: 'charlie@example.com', status: 'Delivered', total: 329.97, items: 3 },
      ];
      localStorage.setItem('orders', JSON.stringify(sampleOrders));
      setOrders(sampleOrders);
    } else {
      setOrders(storedOrders);
    }
  }, []);

  const stats = {
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    totalCustomers: new Set(orders.map(o => o.email)).size,
    totalProducts: products.length,
  };

  const monthlyData = [
    { month: 'Jul', sales: 4200 },
    { month: 'Aug', sales: 3800 },
    { month: 'Sep', sales: 5100 },
    { month: 'Oct', sales: 4700 },
    { month: 'Nov', sales: 6200 },
    { month: 'Dec', sales: 5800 },
  ];

  const maxSales = Math.max(...monthlyData.map(d => d.sales));

  const topProducts = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="denied-content">
          <h1>Access Denied</h1>
          <p>You don't have permission to access the admin dashboard.</p>
          <a href="/">Go Home</a>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Virevo Admin</h2>
          <span className="user-role">Admin</span>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon sales">
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <h3>${stats.totalSales.toFixed(2)}</h3>
                  <p>Total Sales</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon orders">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon customers">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalCustomers}</h3>
                  <p>Total Customers</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon products">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card sales-card">
                <div className="card-header">
                  <h3><BarChart3 size={20} /> Sales Overview</h3>
                </div>
                <div className="sales-chart">
                  {monthlyData.map(data => (
                    <div key={data.month} className="chart-bar">
                      <div className="bar-fill" style={{ height: `${(data.sales / maxSales) * 100}%` }}>
                        <span className="bar-value">${data.sales}</span>
                      </div>
                      <span className="bar-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card top-products-card">
                <div className="card-header">
                  <h3><TrendingUp size={20} /> Top Selling Products</h3>
                </div>
                <div className="top-products-list">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="top-product-item">
                      <span className="product-rank">#{index + 1}</span>
                      <img src={product.image} alt={product.name} />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.reviews} reviews</p>
                      </div>
                      <span className="product-price">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card orders-card">
              <div className="card-header">
                <h3><ShoppingBag size={20} /> Recent Orders</h3>
              </div>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 10).map(order => {
                      const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                      return (
                        <tr key={order.id}>
                          <td className="order-id-cell">{order.id}</td>
                          <td>
                            <div className="customer-info">
                              <span className="customer-name">{order.customer}</span>
                              <span className="customer-email">{order.email}</span>
                            </div>
                          </td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <span className="table-status-badge" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}>
                              {order.status}
                            </span>
                          </td>
                          <td className="total-cell">${order.total.toFixed(2)}</td>
                          <td>{order.items}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>Products Management</h3>
              </div>
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card-admin">
                    <img src={product.image} alt={product.name} />
                    <div className="product-details">
                      <h4>{product.name}</h4>
                      <p className="product-category">{product.category}</p>
                      <div className="product-meta">
                        <span className="product-price-admin">${product.price}</span>
                        <span className="product-rating">★ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>All Orders</h3>
              </div>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                      return (
                        <tr key={order.id}>
                          <td className="order-id-cell">{order.id}</td>
                          <td>
                            <div className="customer-info">
                              <span className="customer-name">{order.customer}</span>
                              <span className="customer-email">{order.email}</span>
                            </div>
                          </td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <span className="table-status-badge" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}>
                              {order.status}
                            </span>
                          </td>
                          <td className="total-cell">${order.total.toFixed(2)}</td>
                          <td>{order.items}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>Customers</h3>
              </div>
              <div className="customers-grid">
                {orders.map((order, idx) => (
                  <div key={idx} className="customer-card">
                    <div className="customer-avatar">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="customer-card-info">
                      <h4>{order.customer}</h4>
                      <p>{order.email}</p>
                      <span className="customer-orders-count">{order.items} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>Settings</h3>
              </div>
              <div className="settings-content">
                <div className="setting-item">
                  <div>
                    <h4>Store Information</h4>
                    <p>Manage your store details</p>
                  </div>
                  <button className="setting-btn">Edit</button>
                </div>
                <div className="setting-item">
                  <div>
                    <h4>Payment Methods</h4>
                    <p>Configure payment gateways</p>
                  </div>
                  <button className="setting-btn">Edit</button>
                </div>
                <div className="setting-item">
                  <div>
                    <h4>Shipping Settings</h4>
                    <p>Manage shipping zones and rates</p>
                  </div>
                  <button className="setting-btn">Edit</button>
                </div>
                <div className="setting-item">
                  <div>
                    <h4>Notifications</h4>
                    <p>Configure email and push notifications</p>
                  </div>
                  <button className="setting-btn">Edit</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
